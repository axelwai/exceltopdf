import React from 'react';
import { Button, Input } from '@mui/material';

interface FileUploadButtonProps {
  accept: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  buttonText?: string;
  inputRef: React.RefObject<HTMLInputElement|null>;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  accept,
  onFileChange,
  buttonText = 'Upload File',
  inputRef,
}) => (
  <>
    <Button
      variant="contained"
      color="primary"
      onClick={() => inputRef.current?.click()}
      style={{ marginBottom: '16px' }}
    >
      {buttonText}
    </Button>
    <Input
      type="file"
      inputRef={inputRef}
      onChange={onFileChange}
      inputProps={{ accept }}
      style={{ display: 'none' }}
    />
  </>
);

export default FileUploadButton;
