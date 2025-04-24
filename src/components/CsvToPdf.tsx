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
        handleConvertToPdf();
      } catch {
        console.error('Failed to parse CSV file.');
      }
    };
    reader.onerror = () => console.error('Error reading the file.');
    reader.readAsText(file);
  };

  const handleConvertToPdf = (): string => {
    if (!csvData) return '';
    try {
      return generatePdfFromCsv(csvData);
    } catch {
      console.error('Failed to convert CSV to PDF.');
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
      <PdfConvertAndPreview
        onConvert={handleConvertToPdf}
        disabled={!csvData}
        downloadName="converted.pdf"
      />
    </Box>
  );
};

export default CsvToPdf;
