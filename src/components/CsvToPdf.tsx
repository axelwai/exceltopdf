import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Typography, Box } from '@mui/material';
import FileUploadButton from './ui/FileUploadButton';
import PdfConvertAndPreview from './ui/PdfConvertAndPreview';

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const data = parseCsv(text);
        if (data.length === 0) throw new Error('CSV is empty or invalid.');
        setError(null);
        // Auto-generate PDF when CSV is loaded
        const url = generatePdfFromCsv(data);
        setPdfUrl(url);
      } catch (err: any) {
        setError('Failed to parse CSV file.');
        setPdfUrl(null);
      }
    };
    reader.onerror = () => {
      setError('Error reading the file.');
      setPdfUrl(null);
    };
    reader.readAsText(file);
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
      {pdfUrl && (
        <PdfConvertAndPreview
          pdfUrl={pdfUrl}
          label="CSV Data"
          disabled={false}
          downloadName="converted.pdf"
          error={error}
        />
      )}
    </Box>
  );
};

export default CsvToPdf;
