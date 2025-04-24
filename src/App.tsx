import React, { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import ExcelToPdf from './ExcelToPdf';
import CsvToPdf from './CsvToPdf';
import TableToPdf from './TableToPdf';

function App() {
  const [tab, setTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Excel/CSV/Table to PDF Converter
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Upload your file or paste a table and convert it to a PDF effortlessly.
        </Typography>
      </Box>
      <Tabs value={tab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
        <Tab label="Excel" />
        <Tab label="CSV" />
        <Tab label="Table" />
      </Tabs>
      {tab === 0 && <ExcelToPdf />}
      {tab === 1 && <CsvToPdf />}
      {tab === 2 && <TableToPdf />}
    </Container>
  );
}

export default App;
