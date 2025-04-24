import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { MenuItem, Select, Typography, Box, SelectChangeEvent } from '@mui/material';
import FileUploadButton from './ui/FileUploadButton';
import ConvertToPdfButton from './ui/ConvertToPdfButton';
import { UserOptions } from 'jspdf-autotable';
import PdfPreview from './ui/PdfPreview';

const ExcelToPdf: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [tableOptions, setTableOptions] = useState<UserOptions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = new Uint8Array(await file.arrayBuffer());
      const workbook = XLSX.read(data, { type: 'array' });
      setSheetNames(workbook.SheetNames);
      if (workbook.SheetNames.length === 1) {
        const singleSheet = workbook.SheetNames[0];
        setSelectedSheet(singleSheet);
        const sheet = workbook.Sheets[singleSheet];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setTableOptions({ head: [jsonData[0]], body: jsonData.slice(1) });
        setShowPreview(true);
        setError(null);
      } else {
        setSelectedSheet(null);
        setTableOptions(null);
        setShowPreview(false);
      }
    } catch (err) {
      setError('Failed to read the file. Please upload a valid Excel file.');
      setSheetNames([]);
      setSelectedSheet(null);
      setTableOptions(null);
      setShowPreview(false);
    }
  };

  const handleSheetChange = (e: SelectChangeEvent<string>) => {
    setSelectedSheet(e.target.value);
    setTableOptions(null);
    setShowPreview(false);
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    file.arrayBuffer().then(buffer => {
      const data = new Uint8Array(buffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[e.target.value];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setTableOptions({ head: [jsonData[0]], body: jsonData.slice(1) });
    });
  };

  const handleConvertClick = () => {
    setShowPreview(true);
  };

  const isDisabled = sheetNames.length > 1 ? !selectedSheet || !tableOptions : !tableOptions;

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
      {sheetNames.length > 0 && sheetNames.length > 1 && (
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
          <ConvertToPdfButton
            onClick={handleConvertClick}
            disabled={isDisabled}
            style={{ marginTop: 16 }}
          >
            Convert to PDF
          </ConvertToPdfButton>
        </Box>
      )}
      {showPreview && (
        <PdfPreview
          tableOptions={tableOptions}
          downloadName="converted.pdf"
          error={error}
        />
      )}
    </Box>
  );
};

export default ExcelToPdf;
