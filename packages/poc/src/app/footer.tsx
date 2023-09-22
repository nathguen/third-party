"use client";

import { classNames } from "@/utils/styles";
import { IconButton, ThemeProvider } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";
import { useSessionContext } from "./context/session";
import "./globals.css";
import theme from "./theme";

export default function Footer() {
  const router = useRouter();

  const { startEnabled } = useSessionContext();

  console.log({ startEnabled });

  const handleStartNewSession = () => {
    // redirect to /session/new
    router.push("/session/new");
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="fixed bottom-0 left-0 right-0">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <div className="absolute left-0 right-0 bottom-0 flex items-center justify-center">
                <div
                  className={classNames(
                    // startEnabled ? "border-primary-700" : "border-gray-300",
                    startEnabled ? "bg-primary-700" : "bg-gray-300",
                    "mb-2 shadow-lg rounded-full w-[100px] h-[100px] flex justify-center items-center"
                  )}
                >
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    className="w-full h-full pl-8"
                    onClick={handleStartNewSession}
                    disabled={!startEnabled}
                  >
                    <FaPlay size={60} />
                  </IconButton>
                </div>
              </div>
            </Toolbar>
          </AppBar>
        </Box>
      </div>
    </ThemeProvider>
  );
}
