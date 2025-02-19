import React from 'react';
import {RenderComponent} from '@/components/Layout/RenderComponent';
import layoutSchema from '@/components/Layout/JSON_Schema/layoutSchema.json'; // Import your JSON schema

const HomePage: React.FC = () => {
  return (
    <div>
      <RenderComponent component={layoutSchema.layout} />
    </div>
  );
};

export default HomePage;