import { useEffect, useRef, useState } from "react";
import { useVoiceStatus } from "../context/VoiceContext";
import { speak } from "../utils/speech";
import { getAIResponse } from "../utils/aiResponder";

// const handlePrompt = (text) => {
//   // basic command matching (can upgrade later)
//   const response = getAIResponse(text).then(() => {
//     setStatus("speaking");
//     speak(response, () => {
//       setStatus("listening");
//     });
//   }); // custom function (we'll create next)

//   console.log(response);
// };

const useVoice = (onPromptCaptured) => {
  const recognitionRef = useRef(null);
  const isActive = useRef(false);
  const restartTimeout = useRef(null);
  const [transcript, setTranscript] = useState("");
  const { setStatus } = useVoiceStatus();
  const [aiResult, setAiResult] = useState("");

  useEffect(() => {
    setStatus("speaking");
    speak(aiResult, () => {
      setStatus("listening");
    });
  }, [aiResult]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported in this browser.");
      return;
    }

    const init = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        console.error("Microphone access denied:", err.message);
        alert("Please allow microphone access to use this feature.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = false;

      const safeStart = () => {
        if (!isActive.current) {
          try {
            recognition.start();
            isActive.current = true;
          } catch (e) {
            console.warn("🎙️ Safe start failed:", e.message);
          }
        }
      };

      recognition.onstart = () => {
        console.log("🎤 Listening started");
        isActive.current = true;
        setStatus("listening");
      };

      //   recognition.onresult = (event) => {
      //     const result = event.results[event.results.length - 1];
      //     if (result.isFinal) {
      //       const spokenText = result[0].transcript.trim();
      //       setTranscript(spokenText);
      //       setStatus("thinking");

      //       const response = getAIResponse(spokenText);
      //       //   setStatus("speaking");

      //       onPromptCaptured(spokenText);
      //       setTimeout(() => {
      //         setStatus("speaking");
      //         speak(response, () => {
      //           setStatus("listening");
      //         });
      //       }, 500);
      //     }
      //     // if (result.isFinal) {

      //     //     // setStatus("thinking");

      //     //     // const response = getAIResponse(finalTranscript);

      //     //     // setTimeout(() => {
      //     //     //   setStatus("speaking");
      //     //     //   speak(response, () => {
      //     //     //     setStatus("listening");
      //     //     //   });
      //     //     // }, 500);
      //     //   }
      //   };

      recognition.onresult = async (event) => {
        const result = event.results[event.results.length - 1];
        if (result.isFinal) {
          const spokenText = result[0].transcript.trim();

          setTranscript(spokenText);
          setStatus("thinking");

          const response = await getAIResponse(spokenText);
          setAiResult(response); 

          onPromptCaptured(spokenText);

          // if(aiResult){
          //   setStatus("speaking");
          //   speak(response, () => {
          //     setStatus("listening");
          //   });
          // }
        }
      };

      recognition.onerror = (event) => {
        console.warn("Recognition error:", event.error);
        setStatus("idle");

        // Delay restart only for safe recoverable errors
        if (
          ["network", "aborted", "no-speech", "audio-capture"].includes(
            event.error
          )
        ) {
          if (restartTimeout.current) clearTimeout(restartTimeout.current);

          restartTimeout.current = setTimeout(() => {
            isActive.current = false;
            safeStart();
          }, 1500);
        }
      };

      recognition.onend = () => {
        console.log("🛑 Recognition ended");
        isActive.current = false;
        setStatus("idle");

        if (restartTimeout.current) clearTimeout(restartTimeout.current);
        restartTimeout.current = setTimeout(() => {
          safeStart();
        }, 1200);
      };

      recognitionRef.current = recognition;

      // Initial start after a short delay
      setTimeout(() => {
        safeStart();
      }, 1000);
    };

    init();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      isActive.current = false;
      if (restartTimeout.current) clearTimeout(restartTimeout.current);
    };
  }, []);

  return { transcript };
};

export default useVoice;
