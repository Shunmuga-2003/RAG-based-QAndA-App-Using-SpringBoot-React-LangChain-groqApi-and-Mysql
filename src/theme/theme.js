import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            background: { default: '#0C0C0C', paper: '#161616' },
            primary: { main: '#FFFFFF' },
            secondary: { main: '#888888' },
            divider: '#2A2A2A',
            text: { primary: '#F0F0F0', secondary: '#888888' },
          }
        : {
            background: { default: '#F8F8F8', paper: '#FFFFFF' },
            primary: { main: '#0C0C0C' },
            secondary: { main: '#888888' },
            divider: '#E0E0E0',
            text: { primary: '#0C0C0C', secondary: '#666666' },
          }),
    },
    typography: {
      fontFamily: '"Syne", "Helvetica Neue", sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-2px' },
      h2: { fontWeight: 800, letterSpacing: '-1px' },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
      body1: { fontFamily: '"Syne", sans-serif' },
      body2: { fontFamily: '"DM Mono", monospace', fontSize: '0.75rem' },
      caption: { fontFamily: '"DM Mono", monospace' },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 700,
            fontFamily: '"Syne", sans-serif',
            transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            },
            '&:active': { transform: 'translateY(0px)' },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
            '&:hover': { transform: 'translateY(-3px)' },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              fontFamily: '"Syne", sans-serif',
              transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
              '&:hover': { transform: 'translateY(-2px)' },
              '&.Mui-focused': { transform: 'translateY(-2px)' },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: '"DM Mono", monospace',
            fontSize: '0.7rem',
            transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
            '&:hover': { transform: 'translateY(-2px)' },
          },
        },
      },
    },
  });