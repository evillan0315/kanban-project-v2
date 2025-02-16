'use client';

import localFont from "next/font/local";
import { createTheme } from "@mui/material/styles";




export const Montserrat = localFont({
  src: [
    {
      path: "../public/fonts/Montserrat/static/Montserrat-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Montserrat/static/Montserrat-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Montserrat/static/Montserrat-ExtraLight.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Montserrat/static/Montserrat-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Montserrat/static/Montserrat-ExtraBold.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/Montserrat/Montserrat-VariableFont_wght.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/Montserrat/static/Montserrat-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Montserrat/static/Montserrat-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],

  preload: true, // Preload for optimized performance
  display: "swap", // Use the font with "swap" display strategy
  variable: "--font-montserrat", // Optional CSS variable for the font
});

export const Roboto = localFont({
  src: [
    {
      path: "../public/fonts/Roboto/static/Roboto-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Roboto/static/Roboto-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Roboto/static/Roboto-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Roboto/static/Roboto-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],

  preload: true, // Preload for optimized performance
  display: "swap", // Use the font with "swap" display strategy
  variable: "--font-roboto", // Optional CSS variable for the font
});

export const DM_Sans = localFont({
  src: [
    {
      path: "../public/fonts/DM_Sans/DMSans-Italic-VariableFont_opsz,wght.ttf",
      style: "italic",
    },
    {
      path: "../public/fonts/DM_Sans/DMSans-VariableFont_opsz,wght.ttf",
      weight: "700",
      style: "normal",
    },
  ],

  preload: true, // Preload for optimized performance
  display: "swap", // Use the font with "swap" display strategy
  variable: "--font-dmsans", // Optional CSS variable for the font
});
export const Caveat = localFont({
  src: [
    {
      path: "../public/fonts/Caveat/Caveat-VariableFont_wght.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Caveat/Caveat-VariableFont_wght.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  preload: true, // Preload for optimized performance
  display: "swap", // Use the font with "swap" display strategy
  variable: "--font-caveat", // Optional CSS variable for the font
});
const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: true,
    dark: true,
  }
});

export default theme;