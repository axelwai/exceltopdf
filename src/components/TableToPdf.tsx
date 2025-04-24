import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button, Typography, Box, TextField } from '@mui/material';

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
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleHtmlChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHtml(e.target.value);
    setError(null);
    setPdfUrl(null);
  };

  const handleConvertToPdf = () => {
    if (!html.trim()) {
      setError('Please paste a valid HTML table.');
      return;
    }
    try {
      // Render the HTML into a hidden div to extract the table
      const container = document.createElement('div');
      container.innerHTML = html;
      const table = container.querySelector('table');
      if (!table) {
        setError('No <table> element found in the provided HTML.');
        return;
      }
      const doc = new jsPDF();
      autoTable(doc, { html: table });
      const pdfBlob = doc.output('blob');
      setPdfUrl(URL.createObjectURL(pdfBlob));
      setError(null);
    } catch (err) {
      setError('Failed to convert table to PDF.');
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
      <Button
        variant="contained"
        color="primary"
        onClick={handleConvertToPdf}
        style={{ marginBottom: '16px' }}
      >
        Convert to PDF
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {html && (
        <Box mb={2}>
          <Typography variant="subtitle1">Table Preview:</Typography>
          <div ref={tableRef} dangerouslySetInnerHTML={{ __html: html }} style={{ overflowX: 'auto', border: '1px solid #ccc', padding: 8, marginTop: 8 }} />
        </Box>
      )}
      {pdfUrl && (
        <Box>
          <Button
            variant="outlined"
            color="primary"
            href={pdfUrl}
            download="table.pdf"
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

export default TableToPdf;
