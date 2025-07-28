// import { useEffect, useRef, useState } from 'react';


// // Speech-to-text custom hook
// function useSpeechToText() {
//   const [transcript, setTranscript] = useState('');
//   const recognitionRef = useRef<any>(null);

//   useEffect(() => {
//     if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
//       const recognition = new (window as any).webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;

//       recognition.onresult = (event: any) => {
//         const speechResult = event.results[0][0].transcript;
//         setTranscript((prev) => prev + ' ' + speechResult);
//       };

//       recognition.onerror = (e: any) => {
//         console.error('Speech recognition error:', e);
//       };

//       recognitionRef.current = recognition;
//     }
//   }, []);

//   const start = () => {
//     setTranscript('');
//     recognitionRef.current?.start?.();
//   };

//   return { transcript, start };
// }

// export default useSpeechToText;