import React from 'react';
import { Button, ButtonProps } from '@mui/material';

const ConvertToPdfButton: React.FC<ButtonProps> = (props) => (
  <Button variant="contained" color="primary" {...props} />
);

export default ConvertToPdfButton;
