"use client";
import { Autocomplete, FormControl, TextField } from "@mui/material";
import * as React from "react";

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
  const [relationship, setRelationship] = React.useState("");

  return (
    <main className="flex flex-1 flex-col items-center pt-4">
      {/* name of participant text field */}
      <FormControl fullWidth className="px-2 mb-4">
        <TextField
          fullWidth
          id="outlined-basic"
          label="Name of Participant 1"
          variant="outlined"
        />
      </FormControl>

      {/* name of participant text field */}
      <FormControl fullWidth className="px-2 mb-4">
        <TextField
          fullWidth
          id="outlined-basic"
          label="Name of Participant 2"
          variant="outlined"
        />
      </FormControl>

      <FormControl fullWidth className="px-2">
        <Autocomplete
          disablePortal
          id="relationship-selecgt"
          options={relationshipOptions}
          renderInput={(params) => (
            <TextField {...params} label={relationshipLabel} />
          )}
        />
      </FormControl>
    </main>
  );
}
