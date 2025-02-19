'client'
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { Container } from '@mui/material';
const componentMap: { [key: string]: React.ElementType } = {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Container,

  // Add other MUI components as needed
};
interface ComponentProps {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: { [key: string]: any };
  children?: ComponentProps[];
}

export const RenderComponent: React.FC<{ component: ComponentProps }> = ({ component }) => {
  const { type, props, children } = component;
  const Component = componentMap[type];

  if (!Component) {
    console.warn(`Component type "${type}" is not recognized.`);
    return null;
  }

  // Recursively render children
  const childrenElements = children?.map((child, index) => (
    <>
   
    {console.log(child)}
    <RenderComponent key={index} component={child} />
    </>
  ));

  return <Component {...props}>{childrenElements}</Component>;
};
