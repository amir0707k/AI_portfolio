import React from "react";
import { VoiceProvider, useVoiceStatus } from "./context/VoiceContext";
import useVoice from "./hooks/useVoice";
import StatusOrb from "./components/common/StatusOrb";

const InnerApp = () => {
  const { setStatus } = useVoiceStatus();

  const handleVoicePrompt = (prompt) => {
    console.log("🧠 Prompt:", prompt);
    // Later: call AI & speak back
    setStatus("speaking");
  };

  useVoice(handleVoicePrompt);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <StatusOrb />
      <p className="mt-4 text-sm text-gray-400">Listening for your voice...</p>
    </div>
  );
};

const App = () => (
  <VoiceProvider>
    <InnerApp />
  </VoiceProvider>
);

export default App;
