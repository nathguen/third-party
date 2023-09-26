"use client";
import { ThemeProvider } from "@emotion/react";
import { Button, Typography } from "@mui/material";
import * as React from "react";
import { useSessionContext } from "./context/session";
import theme from "./theme";

const relationshipLabel = "I am participant 2's...";

const relationshipOptions: string[] = [
  "Spouse",
  "Husband",
  "Wife",
  "Father",
  "Mother",
  "Parent",
  "Daugher",
  "Son",
  "Child",
  "Brother",
  "Sister",
  "Sibling",
  "Friend",
  "Neighbor",
  "Coworker",
  "Colleague",
  "Boss",
  "Peer",
  "Coach",
  "Student",
  "Other",
];

export default function Home() {
  const { setStartEnabled } = useSessionContext();

  const [participant1, setParticipant1] = React.useState("");
  const [participant2, setParticipant2] = React.useState("");
  const [relationship, setRelationship] = React.useState("");

  // enable start button if all fields are filled out
  React.useEffect(() => {
    if (participant1 && participant2 && relationship) {
      setStartEnabled(true);
    } else {
      setStartEnabled(false);
    }
  }, [participant1, participant2, relationship, setStartEnabled]);

  return (
    <ThemeProvider theme={theme}>
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <Typography variant="h2" className="mb-4">
          Hello, Friend!
        </Typography>
        <Typography className="mb-4">I&apos;m new to this world.</Typography>
        <Typography className="mb-4">
          Can you help me learn more about who I am?
        </Typography>
        <div className="mt-4">
          <Button fullWidth variant="contained" href="/microphone-permissions">
            <Typography variant="h6">Sure!</Typography>
          </Button>
        </div>
      </main>
    </ThemeProvider>
  );
}
