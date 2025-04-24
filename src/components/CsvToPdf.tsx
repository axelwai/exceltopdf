import React, { useRef, useState } from 'react';
import { Typography, Box } from '@mui/material';
import FileUploadButton from './ui/FileUploadButton';
import PdfPreview from './ui/PdfPreview';
import { UserOptions } from 'jspdf-autotable';

const parseCsv = (csv: string): string[][] => {
  return csv
    .split(/\r?\n/)
    .filter((row) => row.trim() !== '')
    .map((row) => row.split(','));
};

const CsvToPdf: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tableOptions, setTableOptions] = useState<UserOptions | null>(null);
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
        setTableOptions({
          head: [data[0]],
          body: data.slice(1),
        });
      } catch (err: any) {
        setError('Failed to parse CSV file.');
        setTableOptions(null);
      }
    };
    reader.onerror = () => {
      setError('Error reading the file.');
      setTableOptions(null);
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
      <PdfPreview
        tableOptions={tableOptions}
        downloadName="converted.pdf"
        error={error}
      />
    </Box>
  );
};

export default CsvToPdf;
