import React, { useRef, useState } from 'react';
import { Typography, Box, TextField } from '@mui/material';
import PdfPreview from './ui/PdfPreview';

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
  const tableRef = useRef<HTMLDivElement>(null);

  let tableOptions = null;
  try {
    if (html.trim()) {
      const container = document.createElement('div');
      container.innerHTML = html;
      const table = container.querySelector('table');
      if (!table) throw new Error('No table found in HTML.');
      tableOptions = { html: table };
    }
  } catch (err: any) {
    setError('Failed to parse HTML table.');
    tableOptions = null;
  }

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
          onChange={e => setHtml(e.target.value)}
          fullWidth
          variant="outlined"
          placeholder="&lt;table&gt;...&lt;/table&gt;"
        />
      </Box>
      <PdfPreview
        tableOptions={tableOptions}
        downloadName="table.pdf"
        error={error}
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
