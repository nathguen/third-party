"use client";
import { Autocomplete, FormControl, TextField } from "@mui/material";
import * as React from "react";
import { useSessionContext } from "./context/session";

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
    <main className="flex flex-1 flex-col items-center pt-4">
      {/* name of participant text field */}
      <FormControl fullWidth className="mb-4">
        <TextField
          fullWidth
          id="outlined-basic"
          label="Name of Participant 1"
          variant="outlined"
          onChange={(e) => setParticipant1(e.target.value)}
        />
      </FormControl>

      {/* name of participant text field */}
      <FormControl fullWidth className="mb-4">
        <TextField
          fullWidth
          id="outlined-basic"
          label="Name of Participant 2"
          variant="outlined"
          onChange={(e) => setParticipant2(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth>
        <Autocomplete
          disablePortal
          id="relationship-selecgt"
          options={relationshipOptions}
          onChange={(e, value) => setRelationship(value || "")}
          renderInput={(params) => (
            <TextField {...params} label={relationshipLabel} />
          )}
        />
      </FormControl>
    </main>
  );
}
