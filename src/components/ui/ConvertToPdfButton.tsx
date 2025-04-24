import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';

interface ConvertToPdfButtonProps {
  onConvert: () => Promise<string> | string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const ConvertToPdfButton: React.FC<ConvertToPdfButtonProps> = ({ onConvert, disabled, children }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onConvert();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      disabled={disabled || loading}
      style={{ marginBottom: '16px' }}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : children || 'Convert to PDF'}
    </Button>
  );
};

export default ConvertToPdfButton;
