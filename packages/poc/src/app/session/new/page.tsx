"use client";

import { Button } from "@mui/material";
import Runtime, { RuntimeContextProvider, useRuntimeContext } from "./runtime";

function NewSession() {
  const { onStart, onPause, onReset, isRunning } = useRuntimeContext();

  return (
    <div>
      <Runtime />

      <Button disabled={isRunning} onClick={onStart}>
        Start
      </Button>
      <Button disabled={!isRunning} onClick={onPause}>
        Pause
      </Button>
      <Button onClick={onReset}>Reset</Button>
    </div>
  );
}

export default function NewSessionPage() {
  return (
    <RuntimeContextProvider>
      <NewSession />
    </RuntimeContextProvider>
  );
}
