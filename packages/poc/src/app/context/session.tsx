"use client";

import React from "react";

export const SessionContext = React.createContext<{
  startEnabled: boolean;
  setStartEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  startEnabled: false,
  setStartEnabled: () => {},
});

export const useSessionContext = () => React.useContext(SessionContext);

interface SessionContextProps {
  children: React.ReactNode;
}

export const SessionContextProvider = ({ children }: SessionContextProps) => {
  const [startEnabled, setStartEnabled] = React.useState<boolean>(false);

  return (
    <SessionContext.Provider value={{ startEnabled, setStartEnabled }}>
      {children}
    </SessionContext.Provider>
  );
};
