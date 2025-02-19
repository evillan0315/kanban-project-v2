// components/ErrorComponent.tsx
import React from 'react';
import { Alert, AlertTitle, Button } from '@mui/material';

interface ErrorComponentProps {
  message: string;
  onRetry: () => void;
  title?: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ message, onRetry, title = 'Something went wrong' }) => {
  return (
    <Alert severity="error" sx={{ margin: '16px 0' }}>
      <AlertTitle>{title}</AlertTitle>
      {message}
      <Button variant="outlined" color="primary" onClick={onRetry} sx={{ marginTop: '8px' }}>
        Retry
      </Button>
    </Alert>
  );
};

export default ErrorComponent;
