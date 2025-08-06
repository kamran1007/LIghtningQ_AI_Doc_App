// useFieldSpeechRecognition.ts
import { useEffect, useState, useRef } from "react";

const useFieldSpeechRecognition = (fieldKey: string) => {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.error("Speech recognition not supported.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-IN";

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      const lastResult = event.results[event.results.length - 1];
      if (lastResult && lastResult.isFinal) {
        setTranscript((prev) => prev + " " + lastResult[0].transcript.trim());
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error:", event);
      stopListening();
    };

    recognitionRef.current.onend = () => {
      setListening(false);
    };

    return () => {
      recognitionRef.current?.stop();
    };
  }, [fieldKey]);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      setTranscript("");
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const resetTranscript = () => {
    setTranscript("");
  };

  return {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export { useFieldSpeechRecognition };
