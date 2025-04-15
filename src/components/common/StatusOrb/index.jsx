// src/components/common/StatusOrb/index.jsx
import React from "react";
import { useVoiceStatus } from "../../../context/VoiceContext";

const StatusOrb = () => {
  const { status } = useVoiceStatus();

  const getColor = () => {
    switch (status) {
      case "listening":
        return "bg-blue-500 shadow-blue-400/50";
      case "speaking":
        return "bg-yellow-400 shadow-yellow-300/50";
      default:
        return "bg-gray-500 shadow-gray-400/30";
    }
  };

  return (
    <div
      className={`w-32 h-32 rounded-full shadow-2xl transition-all duration-300 ${getColor()}`}
    />
  );
};

export default StatusOrb;
