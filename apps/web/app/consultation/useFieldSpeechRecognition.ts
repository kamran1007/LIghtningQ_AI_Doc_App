import { useEffect, useState, useRef } from "react";

type UseFieldSpeechRecognitionProps = {
  fieldKey: string;
  onTranscript: (fieldKey: string, text: string) => void;
};

const useFieldSpeechRecognition = ({
  fieldKey,
  onTranscript,
}: UseFieldSpeechRecognitionProps) => {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState(""); // Added this line
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const lastTranscriptRef = useRef<{ [key: string]: string }>({});


  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      console.error("Speech recognition not supported.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimText = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      // Update interim results
      setInterimTranscript(interimText);

      // Update final results
      if (finalText.trim()) {
        const newTranscript = (transcript + " " + finalText.trim()).trim();
        setTranscript(newTranscript);
        onTranscript(fieldKey, newTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === "aborted") {
        console.log(
          "Speech recognition aborted — safe to ignore unless unexpected."
        );
        return;
      }
      console.error("Speech recognition error:", event.error);
      stopListening();
    };

    recognition.onend = () => {
      setListening(false);
      setInterimTranscript(""); // Clear interim when ended
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [fieldKey]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      console.log("Recognition already active, ignoring start()");
      return;
    }
    setTranscript("");
    setInterimTranscript(""); // Clear interim when starting
    setListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
      setInterimTranscript(""); // Clear interim when stopping
    }
  };

  const resetTranscript = () => {
    setTranscript("");
    setInterimTranscript(""); // Clear interim when resetting
    onTranscript(fieldKey, "");
  };

  return {
    transcript,
    interimTranscript, // Added this to return
    listening,
    startListening,
    stopListening,
    resetTranscript,
    lastTranscriptRef 

  };
};

export { useFieldSpeechRecognition };
