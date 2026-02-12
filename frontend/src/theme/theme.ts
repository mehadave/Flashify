import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    // Mint primary
    primary: {
      main: "#39B68B",
      contrastText: "#FFFFFF",
    },

    // Lavender accent
    secondary: {
      main: "#7C74D8",
    },

    success: {
      main: "#39B68B",
    },

    background: {
      default: "#EAF7F1", // soft mint background
      paper: "#FFFFFF",
    },

    text: {
      primary: "#2D2A4A",
      secondary: "#5B5875",
    },
  },

  // Rounded, modern feel
  shape: {
    borderRadius: 16,
  },

  typography: {
    fontFamily: `"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial`,
    h5: {
      fontWeight: 800,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          height: 44,
          paddingInline: 16,
        },
        containedPrimary: {
          boxShadow: "none",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
      },
    },
  },
});

export default theme;
