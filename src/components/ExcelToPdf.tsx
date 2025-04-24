import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MenuItem, Select, Typography, Box, SelectChangeEvent } from '@mui/material';
import ConvertToPdfButton from './ui/ConvertToPdfButton';
import FileUploadButton from './ui/FileUploadButton';
import PdfUrlPreview from './ui/PdfUrlPreview';

const readExcelFile = (file: File): Promise<{ sheetNames: string[]; workbook: XLSX.WorkBook }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        resolve({ sheetNames: workbook.SheetNames, workbook });
      } catch (err) {
        reject('Failed to read the file. Please upload a valid Excel file.');
      }
    };
    reader.onerror = () => reject('Error reading the file.');
    reader.readAsArrayBuffer(file);
  });
};

const generatePdfFromSheet = (sheet: XLSX.WorkSheet): string => {
  const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const doc = new jsPDF();
  autoTable(doc, {
    head: [jsonData[0]],
    body: jsonData.slice(1),
  });
  const pdfBlob = doc.output('blob');
  return URL.createObjectURL(pdfBlob);
};

const processSheetToPdfUrl = (workbook: XLSX.WorkBook, sheetName: string): string => {
  const sheet = workbook.Sheets[sheetName];
  return generatePdfFromSheet(sheet);
};

const ExcelToPdf: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { sheetNames, workbook } = await readExcelFile(file);
      setSheetNames(sheetNames);

      if (sheetNames.length === 1) {
        const singleSheet = sheetNames[0];
        setSelectedSheet(singleSheet);
        const pdfUrl = processSheetToPdfUrl(workbook, singleSheet);
        setPdfUrl(pdfUrl);
      } else {
        setSelectedSheet(null);
      }

      setError(null);
    } catch (err) {
      setError(err as string);
    }
  };

  const handleSheetChange = (e: SelectChangeEvent<string>) => {
    setSelectedSheet(e.target.value);
  };

  const handleConvertToPdf = async (): Promise<string> => {
    if (!selectedSheet) return '';
    try {
      const file = fileInputRef.current?.files?.[0];
      if (!file) return '';
      const { workbook } = await readExcelFile(file);
      const pdfUrl = processSheetToPdfUrl(workbook, selectedSheet);
      setPdfUrl(pdfUrl);
      setError(null);
      return pdfUrl;
    } catch (err) {
      setError('Failed to convert the sheet to PDF.');
      return '';
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Excel to PDF Converter
      </Typography>
      <Box mb={2}>
        <FileUploadButton
          accept=".csv, .xlsx"
          onFileChange={handleFileUpload}
          inputRef={fileInputRef}
          buttonText="Upload File"
        />
      </Box>
      {sheetNames.length > 0 && (
        <Box mb={2}>
          <Typography variant="subtitle1">Select Sheet:</Typography>
          <Select
            value={selectedSheet || ''}
            onChange={handleSheetChange}
            fullWidth
          >
            {sheetNames.map((sheetName) => (
              <MenuItem key={sheetName} value={sheetName}>
                {sheetName}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
      <ConvertToPdfButton
        onConvert={handleConvertToPdf}
        disabled={!selectedSheet}
      />
      {error && <Typography color="error">{error}</Typography>}
      <PdfUrlPreview pdfUrl={pdfUrl} downloadName="converted.pdf" />
    </Box>
  );
};

export default ExcelToPdf;
