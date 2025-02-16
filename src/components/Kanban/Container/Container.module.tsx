import { Box, styled } from '@mui/material';

export const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gridAutoRows: 'max-content',
  overflow: 'hidden',
  boxSizing: 'border-box',
  appearance: 'none',
  outline: 'none',
  minWidth: 350,
  margin: '10px',
  borderRadius: '5px',
  minHeight: 200,
  transition: 'background-color 350ms ease',
  backgroundColor: theme.palette.background.paper, // Use theme background
  border: `1px solid ${theme.palette.divider}`, // Use theme divider color
  fontSize: '1em',

  '& ul': {
    display: 'grid',
    gridGap: '10px',
    gridTemplateColumns: 'repeat(var(--columns, 1), 1fr)', // Use CSS variable
    listStyle: 'none',
    margin: 0,
  },

  '&.scrollable ul': {
    overflowY: 'auto',
  },

  '&.placeholder': {
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    color: theme.palette.text.secondary, // Use theme secondary text color
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    borderColor: 'rgba(0, 0, 0, 0.08)', // Or use theme divider with lower opacity
    position: 'absolute',
    '&:hover': {
      borderColor: 'rgba(0, 0, 0, 0.15)', // Or use theme divider with higher opacity
    },
  },

  '&.hover': {
    backgroundColor: 'rgb(235, 235, 235)', // Or a theme-aware light color
  },

  '&.unstyled': {
    overflow: 'visible',
    border: 'none !important',
  },

  '&.horizontal': {
    width: '100%',

    '& ul': {
      gridAutoFlow: 'column',
    },
  },

  '&.shadow': {
    boxShadow: '0 1px 10px 0 rgba(34, 33, 81, 0.1)', // Or a theme-aware shadow
  },

  '&:focus-visible': {
    borderColor: 'transparent',
    boxShadow: `0 0 0 2px rgba(255, 255, 255, 0), 0 0px 0px 2px #4c9ffe`, // Or a theme-aware focus color
  },
}));

export const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
  paddingLeft: '15px',
  borderBottom: `1px solid ${theme.palette.divider}`,

  '&:hover .Actions > *': {
    opacity: '1 !important',
  },
}));

export const Actions = styled(Box)(({  }) => ({
  display: 'flex',

  '& > *:first-child:not(:last-child)': {
    opacity: 0,

    '&:focus-visible': {
      opacity: 1,
    },
  },
}));