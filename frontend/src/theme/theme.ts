import { createTheme } from '@mui/material/styles';

// Penta Financial Dashboard — Dark Theme
// Colors extracted from the Figma screenshot (approximated)
export const COLORS = {
  // Backgrounds
  bgDeep: '#0E1117',
  bgSurface: '#161B26',
  bgCard: '#1A2035',
  bgElevated: '#1E2A3A',
  bgHover: '#243044',

  // Borders
  border: '#2A3548',
  borderLight: '#334060',

  // Accents
  green: '#00C48C',
  greenDark: '#00A876',
  greenLight: '#22D68F',
  greenBg: 'rgba(0, 196, 140, 0.12)',

  yellow: '#F5B800',
  yellowBg: 'rgba(245, 184, 0, 0.12)',

  red: '#FF5B5B',
  redBg: 'rgba(255, 91, 91, 0.12)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#8A92A6',
  textMuted: '#5A6070',

  // Chart colors
  chartRevenue: '#00C48C',
  chartExpense: '#F5B800',
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: COLORS.green,
      dark: COLORS.greenDark,
      light: COLORS.greenLight,
      contrastText: '#000000',
    },
    secondary: {
      main: COLORS.yellow,
      contrastText: '#000000',
    },
    error: {
      main: COLORS.red,
    },
    background: {
      default: COLORS.bgDeep,
      paper: COLORS.bgCard,
    },
    text: {
      primary: COLORS.textPrimary,
      secondary: COLORS.textSecondary,
      disabled: COLORS.textMuted,
    },
    divider: COLORS.border,
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500, color: COLORS.textSecondary },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.8125rem', color: COLORS.textSecondary },
    caption: { fontSize: '0.75rem', color: COLORS.textMuted },
    button: { fontWeight: 600, textTransform: 'none' as const },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: COLORS.bgDeep,
          color: COLORS.textPrimary,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { background: COLORS.bgSurface },
          '&::-webkit-scrollbar-thumb': {
            background: COLORS.border,
            borderRadius: '3px',
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.bgCard,
          backgroundImage: 'none',
          border: `1px solid ${COLORS.border}`,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
          fontWeight: 600,
        },
        contained: {
          backgroundColor: COLORS.green,
          color: '#000',
          '&:hover': { backgroundColor: COLORS.greenDark },
        },
        outlined: {
          borderColor: COLORS.border,
          color: COLORS.textPrimary,
          '&:hover': {
            borderColor: COLORS.green,
            backgroundColor: COLORS.greenBg,
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: COLORS.bgSurface,
            borderRadius: 10,
            '& fieldset': { borderColor: COLORS.border },
            '&:hover fieldset': { borderColor: COLORS.borderLight },
            '&.Mui-focused fieldset': { borderColor: COLORS.green },
          },
          '& .MuiInputLabel-root': { color: COLORS.textSecondary },
          '& .MuiInputLabel-root.Mui-focused': { color: COLORS.green },
          '& input': { color: COLORS.textPrimary },
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.MuiOutlinedInput-root': {
            backgroundColor: COLORS.bgSurface,
          },
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
        },
      },
    },

    MuiTable: {
      styleOverrides: {
        root: { backgroundColor: 'transparent' },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: COLORS.bgSurface,
            color: COLORS.textSecondary,
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: `1px solid ${COLORS.border}`,
            padding: '12px 16px',
          },
        },
      },
    },

    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            '&:hover': { backgroundColor: COLORS.bgHover },
            transition: 'background-color 0.15s ease',
          },
          '& .MuiTableCell-root': {
            borderBottom: `1px solid ${COLORS.border}`,
            padding: '14px 16px',
            color: COLORS.textPrimary,
          },
        },
      },
    },

    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: COLORS.textSecondary,
          borderTop: `1px solid ${COLORS.border}`,
        },
        selectIcon: { color: COLORS.textSecondary },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: COLORS.border },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: COLORS.greenBg,
            '&:hover': { backgroundColor: COLORS.greenBg },
          },
          '&:hover': { backgroundColor: COLORS.bgHover },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.border },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.borderLight },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.green },
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: COLORS.bgHover },
          '&.Mui-selected': {
            backgroundColor: COLORS.greenBg,
            '&:hover': { backgroundColor: COLORS.greenBg },
          },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: COLORS.bgElevated,
          border: `1px solid ${COLORS.border}`,
          color: COLORS.textPrimary,
          fontSize: '0.75rem',
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },

    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.bgElevated,
        },
      },
    },
  },
});

export default theme;
