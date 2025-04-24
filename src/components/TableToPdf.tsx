import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Typography, Box, TextField } from '@mui/material';
import PdfConvertAndPreview from './ui/PdfConvertAndPreview';

const TableToPdf: React.FC = () => {
  const [html, setHtml] = useState<string>(
    `<table border="1" cellpadding="4" cellspacing="0">
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Alice</td>
          <td>30</td>
          <td>USA</td>
        </tr>
        <tr>
          <td>Bob</td>
          <td>25</td>
          <td>Canada</td>
        </tr>
        <tr>
          <td>Charlie</td>
          <td>35</td>
          <td>UK</td>
        </tr>
      </tbody>
    </table>`
  );
  const tableRef = useRef<HTMLDivElement>(null);

  const handleHtmlChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHtml(e.target.value);
  };

  const handleConvertToPdf = (): string => {
    if (!html.trim()) {
      return '';
    }
    try {
      const container = document.createElement('div');
      container.innerHTML = html;
      const table = container.querySelector('table');
      if (!table) {
        return '';
      }
      const doc = new jsPDF();
      autoTable(doc, { html: table });
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      return url;
    } catch (err) {
      return '';
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Table to PDF Converter
      </Typography>
      <Box mb={2}>
        <TextField
          label="Paste HTML Table Here"
          multiline
          minRows={6}
          maxRows={16}
          value={html}
          onChange={handleHtmlChange}
          fullWidth
          variant="outlined"
          placeholder="&lt;table&gt;...&lt;/table&gt;"
        />
      </Box>
      <PdfConvertAndPreview
        onConvert={handleConvertToPdf}
        disabled={!html.trim()}
        downloadName="table.pdf"
      />
      {html && (
        <Box mb={2}>
          <Typography variant="subtitle1">Table Preview:</Typography>
          <div ref={tableRef} dangerouslySetInnerHTML={{ __html: html }} style={{ overflowX: 'auto', border: '1px solid #ccc', padding: 8, marginTop: 8 }} />
        </Box>
      )}
    </Box>
  );
};

export default TableToPdf;
