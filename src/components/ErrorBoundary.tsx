// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, JSX, ReactNode } from 'react';
import { Alert, AlertTitle, Box, Container, Typography } from '@mui/material';

interface Props {
  children?: ReactNode;
  fallbackRender?: (error: Error, errorInfo: ErrorInfo) => JSX.Element; // Custom fallback
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error:", error, errorInfo);
    this.setState({ errorInfo }); // Store error info
  }

  render() {
    

    if (this.state.hasError) {
      // You can render any custom fallback UI
       if (this.props.fallbackRender) {
        return this.props.fallbackRender(this.state.error!, this.state.errorInfo!);
       }

      return (
        <Container maxWidth="md">
          <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 'calc(100vh - 64px)', // Adjust 64px for your header height if needed
              textAlign: 'center',

            }}>
            <Alert severity="error">
              <AlertTitle>Something went wrong!</AlertTitle>
              <Typography variant="body1" paragraph>
                {this.state.error?.message || "An unexpected error has occurred."}
              </Typography>
              {/* Optional: Show more details in development */}
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
          </Alert>
        </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;