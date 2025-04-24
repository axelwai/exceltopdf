import React from 'react';
import { Button, Box, Typography } from '@mui/material';

interface PdfConvertAndPreviewProps {
  pdfUrl: string | null;
  label?: string;
  downloadName?: string;
  buttonText?: string;
  onConvertClick?: () => void;
  disabled?: boolean;
  error?: string | null;
}

const PdfConvertAndPreview: React.FC<PdfConvertAndPreviewProps> = ({
  pdfUrl,
  label,
  downloadName = 'converted.pdf',
  buttonText,
  onConvertClick,
  disabled,
  error,
}) => {
  return (
    <Box mb={2}>
      {label && (
        <Typography variant="subtitle1" gutterBottom>{label}</Typography>
      )}
      {onConvertClick && buttonText && (
        <Button
          variant="contained"
          color="primary"
          onClick={onConvertClick}
          disabled={disabled}
          style={{ marginBottom: '16px' }}
        >
          {buttonText}
        </Button>
      )}
      {error && <Typography color="error">{error}</Typography>}
      {pdfUrl && (
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
      )}
    </Box>
  );
};

export default PdfConvertAndPreview;
