/* eslint-disable @typescript-eslint/no-explicit-any */
// components/PropertyPanel.tsx
import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

interface PropertyPanelProps {
  selectedComponent: any;
  onUpdate: (updatedComponent: any) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ selectedComponent, onUpdate }) => {
  const [content, setContent] = useState(selectedComponent?.content || '');

  const handleUpdate = () => {
    onUpdate({ ...selectedComponent, content });
  };

  return (
    <div>
      <TextField
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
      />
      <Button onClick={handleUpdate} fullWidth>
        Update
      </Button>
    </div>
  );
};

export default PropertyPanel;
