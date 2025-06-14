// components/ui/SignaturePadCanvas.tsx
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import SignatureCanvas from "react-signature-canvas";

export type SignaturePadHandle = {
  clear: () => void;
  undo: () => void;
  toDataURL: () => string;
};
type SignaturePadCanvasProps = {
  penColor?: string;
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
  onEnd?: () => void;

};


const SignaturePadCanvas = forwardRef<SignaturePadHandle, SignaturePadCanvasProps>(({ onEnd, ...props }, ref) => {
  const sigRef = useRef<SignatureCanvas>(null);
  

  useImperativeHandle(ref, () => ({
    clear: () => sigRef.current?.clear(),
    toDataURL: () => sigRef.current?.toDataURL() || "",
    undo: () => {
      const data = sigRef.current?.toData();
      if (data && data.length > 0) {
        data.pop(); // remove last stroke
        sigRef.current?.fromData(data);
      }
    },
  }));

  return (
    <SignatureCanvas
      ref={sigRef}
      penColor="black"
      canvasProps={{
        width: 300,
        height: 120,
        className: "bg-white border border-gray-300 w-full h-full",
      }}
      onEnd={onEnd} // ✅ notify drawing is complete
    />
  );
});

SignaturePadCanvas.displayName = "SignaturePadCanvas";
export default SignaturePadCanvas;
