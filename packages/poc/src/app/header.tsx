"use client";

import { ThemeProvider } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import "./globals.css";
import theme from "./theme";

export default function Header() {
  return (
    <ThemeProvider theme={theme}>
      <div className="fixed top-0 left-0 right-0">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Third Party
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
      </div>
    </ThemeProvider>
  );
}
