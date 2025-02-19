import React, { useEffect, useState } from 'react';
//import { Box, Grid, Card, CardContent, Typography, Stack } from '@mui/material';
import { RenderComponent } from './RenderComponent';


// Define the interface for your layout schema
interface ComponentProps {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: { [key: string]: any };
  children?: ComponentProps[];
}

const DynamicLayout: React.FC = () => {
  const [layout, setLayout] = useState<ComponentProps | null>(null);

  useEffect(() => {
    // Replace 'https://api.example.com/layout' with your API endpoint
    fetch('/api/layout')
      .then((response) => response.json())
      .then((data) => setLayout(data))
      .catch((error) => console.error('Error fetching layout:', error));
  }, []);

  if (!layout) {
    return <div>Loading...</div>;
  }

  return <RenderComponent component={layout} />;
};

export default DynamicLayout;
