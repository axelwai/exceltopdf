import React from 'react';
import { Button, Box } from '@mui/material';

interface PdfUrlPreviewProps {
  pdfUrl: string | null;
  downloadName?: string;
}

const PdfUrlPreview: React.FC<PdfUrlPreviewProps> = ({ pdfUrl, downloadName = 'converted.pdf' }) => {
  if (!pdfUrl) return null;
  return (
    <Box>
      <Button
        variant="outlined"
        color="primary"
        href={pdfUrl}
        download={downloadName}
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
  );
};

export default PdfUrlPreview;
