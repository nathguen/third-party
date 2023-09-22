import { cyan, teal } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: cyan[800],
      contrastText: "#fff",
    },
    secondary: {
      main: teal[800],
    },
  },
  typography: {
    body1: {
      fontSize: 14,
    },
  },
});

export default theme;
