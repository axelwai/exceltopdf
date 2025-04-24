import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button, Input, MenuItem, Select, Typography, Box, SelectChangeEvent } from '@mui/material';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleConvertToPdf = async () => {
    if (!selectedSheet) return;

    try {
      const file = fileInputRef.current?.files?.[0];
      if (!file) return;

      const { workbook } = await readExcelFile(file);
      const pdfUrl = processSheetToPdfUrl(workbook, selectedSheet);
      setPdfUrl(pdfUrl);
      setError(null);
    } catch (err) {
      setError('Failed to convert the sheet to PDF.');
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Excel to PDF Converter
      </Typography>
      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => fileInputRef.current?.click()}
          style={{ marginBottom: '16px' }}
        >
          Upload File
        </Button>
        <Input
          type="file"
          inputRef={fileInputRef}
          onChange={handleFileUpload}
          inputProps={{ accept: '.csv, .xlsx' }}
          style={{ display: 'none' }}
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
      <Button
        variant="contained"
        color="primary"
        onClick={handleConvertToPdf}
        style={{ marginBottom: '16px' }}
      >
        Convert to PDF
      </Button>
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

export default ExcelToPdf;
