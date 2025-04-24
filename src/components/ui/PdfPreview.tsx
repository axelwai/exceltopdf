import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';

/**
 * PDFPreview component renders a preview and download for a PDF generated from autoTable.UserOptions.
 * @param tableOptions - The options for autoTable to generate the PDF. If null, disables preview.
 * @param downloadName - The filename for the downloaded PDF.
 * @param error - Error message to display.
 */
interface PdfPreviewProps {
  tableOptions: UserOptions | null;
  downloadName?: string;
  error?: string | null;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({
  tableOptions,
  downloadName = 'converted.pdf',
  error,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  React.useEffect(() => {
    if (!tableOptions) {
      setPdfUrl(null);
      return;
    }
    try {
      const doc = new jsPDF();
      autoTable(doc, tableOptions);
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    } catch {
      setPdfUrl(null);
    }
  }, [tableOptions]);

  return (
    <Box mb={2}>
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

export default PdfPreview;
