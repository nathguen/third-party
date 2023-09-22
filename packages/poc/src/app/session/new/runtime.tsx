import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

export const RuntimeContext = React.createContext<{
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  currentTime: number;
  isRunning: boolean;
}>({
  onStart: () => {},
  onPause: () => {},
  onReset: () => {},
  currentTime: 0,
  isRunning: false,
});

export const useRuntimeContext = () => React.useContext(RuntimeContext);

interface RuntimeContextProps {
  children: React.ReactNode;
}

interface RuntimeState {
  startTime: number | null;
  elapsedTime: number;
  isRunning: boolean;
}

export const RuntimeContextProvider = ({ children }: RuntimeContextProps) => {
  const [state, setState] = useState<RuntimeState>({
    startTime: null,
    elapsedTime: 0,
    isRunning: false,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (state.isRunning) {
      timer = setInterval(() => {
        const currentTime = new Date().getTime();
        setState((prevState) => ({
          ...prevState,
          elapsedTime: (currentTime - prevState.startTime!) / 1000, // Calculate elapsed time in seconds
        }));
      }, 200);
    } else {
      if (timer) clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.isRunning, state.startTime]);

  const handleStart = () => {
    if (!state.isRunning) {
      const currentTime = new Date().getTime();
      setState((prevState) => ({
        ...prevState,
        startTime: currentTime - state.elapsedTime * 1000, // Adjust start time based on elapsed time
        isRunning: true,
      }));
    }
  };

  const handlePause = () => {
    setState((prevState) => ({
      ...prevState,
      isRunning: false,
    }));
  };

  const handleStop = () => {
    setState((prevState) => ({
      ...prevState,
      isRunning: false,
    }));
  };

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
      isRunning: false,
      elapsedTime: 0,
    }));
  };

  return (
    <RuntimeContext.Provider
      value={{
        onStart: handleStart,
        onPause: handlePause,
        onReset: handleReset,
        currentTime: state.elapsedTime,
        isRunning: state.isRunning,
      }}
    >
      {children}
    </RuntimeContext.Provider>
  );
};

export default function Runtime() {
  const { currentTime } = useRuntimeContext();

  const displayedTime = new Date(currentTime * 1000)
    .toISOString()
    .substring(14, 19)
    .replace(".", ":");

  return (
    <Typography variant="h3" align="center" fontWeight="light">
      {displayedTime}
    </Typography>
  );
}
