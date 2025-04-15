import React, { createContext, useContext, useState } from "react";

const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {
  const [status, setStatus] = useState("idle");

  return (
    <VoiceContext.Provider value={{ status, setStatus }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoiceStatus = () => useContext(VoiceContext);
