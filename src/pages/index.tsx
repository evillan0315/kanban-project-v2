import React from 'react';
import {RenderComponent} from '@/components/Layout/RenderComponent';
import layoutSchema from '@/components/Layout/JSON_Schema/portfolioSchema.json'; // Import your JSON schema
import PropertyPanel from '@/components/Customize/PropertyPanel';
import { MultipleContainers } from '@/components/Kanban/MultipleContainers';
import { Paper } from '@mui/material';
//import {SerializedPaperProps} from '@/components/Customize/SerializeComponent';

const HomePage: React.FC = () => {
  const onUpdate = (updated: any) =>{
    console.log(updated.props);
  }
  return (
    <Paper>
        <MultipleContainers />
{/*       <RenderComponent component={layoutSchema.layout} />
     <PropertyPanel selectedComponent={<MultipleContainers />} onUpdate={onUpdate} /> */}
      

    </Paper>
  );
};

export default HomePage;