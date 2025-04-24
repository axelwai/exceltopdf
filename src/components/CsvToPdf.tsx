import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Typography, Box } from '@mui/material';
import ConvertToPdfButton from './ui/ConvertToPdfButton';
import FileUploadButton from './ui/FileUploadButton';
import PdfUrlPreview from './ui/PdfUrlPreview';

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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
        <FileUploadButton
          accept=".csv"
          onFileChange={handleFileUpload}
          inputRef={fileInputRef}
          buttonText="Upload CSV File"
        />
      </Box>
      <ConvertToPdfButton
        onConvert={handleConvertToPdf}
        disabled={!csvData}
      />
      {error && <Typography color="error">{error}</Typography>}
      <PdfUrlPreview pdfUrl={pdfUrl} downloadName="converted.pdf" />
    </Box>
  );
};

export default CsvToPdf;
