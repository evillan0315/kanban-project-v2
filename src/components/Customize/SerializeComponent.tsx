import React from 'react';
import { Button, TextField, Box, Paper, ButtonProps, TextFieldProps, BoxProps, PaperProps } from '@mui/material';

type ComponentProps = ButtonProps | TextFieldProps | BoxProps | PaperProps;

export default function SerializeComponentProps(component: React.ElementType, props: ComponentProps): string {
  // Create a new element to extract props
  const element = React.createElement(component, props);
  // Serialize the props to JSON

  console.log(element)
  return JSON.stringify(props);
}

// Example usage for Button component
const buttonProps: ButtonProps = {
  variant: 'contained',
  color: 'primary',
  onClick: () => console.log('Button clicked'),
};

export const serializedButtonProps = SerializeComponentProps(Button, buttonProps);
console.log('Serialized Button Props:', serializedButtonProps);

// Example usage for TextField component
const textFieldProps: TextFieldProps = {
  label: 'Username',
  variant: 'outlined',
  fullWidth: true,
};

export const serializedTextFieldProps = SerializeComponentProps(TextField, textFieldProps);
console.log('Serialized TextField Props:', serializedTextFieldProps);

// Example usage for Box component
const boxProps: BoxProps = {
  sx: { p: 2, border: '1px dashed grey' },
};

export const serializedBoxProps = SerializeComponentProps(Box, boxProps);
console.log('Serialized Box Props:', serializedBoxProps);

// Example usage for Paper component
const paperProps: PaperProps = {

};

export const SerializedPaperProps = SerializeComponentProps(Paper, paperProps);
console.log('Serialized Paper Props:', SerializedPaperProps);
