import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ExcelToPdf from './ExcelToPdf';

function App() {
  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Excel to PDF Converter
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Upload your Excel file and convert it to a PDF effortlessly.
        </Typography>
      </Box>
      <ExcelToPdf />
    </Container>
  );
}

export default App;
