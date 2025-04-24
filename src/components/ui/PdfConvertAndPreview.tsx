import React, { useState } from 'react';
import { Button, CircularProgress, Box, Typography } from '@mui/material';

interface PdfConvertAndPreviewProps {
  onConvert: () => Promise<string> | string;
  disabled?: boolean;
  downloadName?: string;
  buttonText?: string;
}

const PdfConvertAndPreview: React.FC<PdfConvertAndPreviewProps> = ({
  onConvert,
  disabled,
  downloadName = 'converted.pdf',
  buttonText = 'Convert to PDF',
}) => {
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = await onConvert();
      if (url) {
        setPdfUrl(url);
      } else {
        setPdfUrl(null);
        setError('No PDF generated.');
      }
    } catch (err) {
      setError('Failed to convert to PDF.');
      setPdfUrl(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mb={2}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        disabled={disabled || loading}
        style={{ marginBottom: '16px' }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : buttonText}
      </Button>
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
