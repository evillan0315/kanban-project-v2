// pages/404.tsx
import { NextPage } from 'next';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import Link from 'next/link';

const NotFoundPage: NextPage = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)', // Adjust 64px for your header height if needed
          textAlign: 'center',
          padding: theme.spacing(4),
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" paragraph>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Link href="/" passHref legacyBehavior>
          <Button variant="contained" color="primary">
            Go Home
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
