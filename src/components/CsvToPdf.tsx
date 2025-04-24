import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button, Input, Typography, Box } from '@mui/material';
import ConvertToPdfButton from './ConvertToPdfButton';

const parseCsv = (csv: string): string[][] => {
  return csv
    .split(/\r?\n/)
    .filter((row) => row.trim() !== '')
    .map((row) => row.split(','));
};

const generatePdfFromCsv = (data: string[][]): string => {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [data[0]],
    body: data.slice(1),
  });
  const pdfBlob = doc.output('blob');
  return URL.createObjectURL(pdfBlob);
};

const CsvToPdf: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<string[][] | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const data = parseCsv(text);
        if (data.length === 0) throw new Error('CSV is empty or invalid.');
        setCsvData(data);
        setPdfUrl(generatePdfFromCsv(data));
        setError(null);
      } catch (err) {
        setError('Failed to parse CSV file.');
      }
    };
    reader.onerror = () => setError('Error reading the file.');
    reader.readAsText(file);
  };

  const handleConvertToPdf = (): string => {
    if (!csvData) return '';
    try {
      const url = generatePdfFromCsv(csvData);
      setPdfUrl(url);
      setError(null);
      return url;
    } catch {
      setError('Failed to convert CSV to PDF.');
      return '';
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        CSV to PDF Converter
      </Typography>
      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => fileInputRef.current?.click()}
          style={{ marginBottom: '16px' }}
        >
          Upload CSV File
        </Button>
        <Input
          type="file"
          inputRef={fileInputRef}
          onChange={handleFileUpload}
          inputProps={{ accept: '.csv' }}
          style={{ display: 'none' }}
        />
      </Box>
      <ConvertToPdfButton
        onConvert={handleConvertToPdf}
        disabled={!csvData}
      />
      {error && <Typography color="error">{error}</Typography>}
      {pdfUrl && (
        <Box>
          <Button
            variant="outlined"
            color="primary"
            href={pdfUrl}
            download="converted.pdf"
            style={{ marginBottom: '16px' }}
          >
            Download PDF
          </Button>
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            style={{ width: '100%', height: '500px', border: 'none' }}
          />
        </Box>
      )}
    </Box>
  );
};

export default CsvToPdf;
