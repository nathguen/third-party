"use client";
import { Button, ThemeProvider, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import theme from "../theme";

export default function MicrophoneSetupPage() {
  const [microphonePermissionGranted, setMicrophonePermissionGranted] =
    useState<boolean | null>(null);

  const getMicrophonePermissions = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => setMicrophonePermissionGranted(true))
      .catch(() => setMicrophonePermissionGranted(false));
  };

  useEffect(() => {
    if (microphonePermissionGranted === false) {
      alert("Uh oh! I won't be able to hear you!");
    }
  }, [microphonePermissionGranted]);

  const primaryButtonText = useMemo(() => {
    if (microphonePermissionGranted === null) {
      return "Ok!";
    }

    if (microphonePermissionGranted === true) {
      return "Continue";
    }

    return "Try again";
  }, [microphonePermissionGranted]);

  return (
    <ThemeProvider theme={theme}>
      <main className="flex flex-1 flex-col items-center justify-center p-4 gap-4">
        <Typography variant="h2">Setup</Typography>
        <Typography variant="body1" align="center">
          Before we begin, let&apos;s make sure I can hear you, and you can hear
          me!
        </Typography>

        <Typography variant="body1" align="center">
          I&apos;ll need permission to use your microphone.
        </Typography>

        {microphonePermissionGranted === false && (
          <Typography variant="h6" align="center">
            Uh oh! I won&apos;t be able to hear you unless you turn your
            microphone on. Please refresh the page and try again.
          </Typography>
        )}

        {microphonePermissionGranted === true && (
          <Typography variant="h6" align="center">
            Great! I&apos;ll be abe to hear you now!
          </Typography>
        )}

        {(microphonePermissionGranted === null ||
          microphonePermissionGranted === false) && (
          <Button variant="contained" onClick={getMicrophonePermissions}>
            <Typography variant="h6">{primaryButtonText}</Typography>
          </Button>
        )}

        {microphonePermissionGranted === true && (
          <Button variant="contained" href="/microphone-volume-check">
            <Typography variant="h6">{primaryButtonText}</Typography>
          </Button>
        )}

        <Button>
          <Typography variant="h6">No, thank you :(</Typography>
        </Button>
      </main>
    </ThemeProvider>
  );
}
