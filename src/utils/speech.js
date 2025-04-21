export const speak = async (text, onEnd = () => {}) => {
    if (!window.speechSynthesis) {
      console.error("Speech synthesis not supported.");
      return;
    }
  
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => {
    //   console.log("🗣️ Speaking:", text);
    };
  
    utterance.onend = () => {
      console.log("✅ Done speaking");
      onEnd();
    };
  
    window.speechSynthesis.cancel(); // Clear any queued speech
    window.speechSynthesis.speak(utterance);
  };
  