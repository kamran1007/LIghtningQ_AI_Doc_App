import React, { useRef, useState, useEffect } from "react";
import { CalendarCheck, Mic, MicOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FollowUpPlanProps = {
  form: {
    followUp: string;
    followUpDuration: string;
    followUpUnit: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      followUp: string;
      followUpDuration: string;
      followUpUnit: string;
    }>
  >;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFollowUpShortcut: (val: string) => void;
};

export default function FollowUpPlanCard({
  form,
  setForm,
  handleChange,
  handleFollowUpShortcut,
}: FollowUpPlanProps) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Setup Speech Recognition
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-IN";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.continuous = false;

    // On result
    recognitionRef.current.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setForm((prev) => ({
        ...prev,
        followUp: prev.followUp
          ? prev.followUp + " " + speechResult
          : speechResult,
      }));
    };

    // On end auto stop
    recognitionRef.current.onend = () => {
      setListening(false);
    };
  }, []);

  const handleFollowUpMicClick = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <Card className="p-4 rounded-xl shadow-sm border bg-white md:col-span-2 hover:shadow-xl hover:border-red-300">
      <div className="flex items-center gap-2 mb-2 font-semibold text-gray-800">
        <CalendarCheck size={18} className="text-red-500" />
        Follow-up Plan
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Textarea with mic */}
        <div className="relative">
          <Textarea
            placeholder="e.g. Review in 7 days, next appointment date..."
            value={form.followUp}
            name="followUp"
            onChange={handleChange}
            className="text-sm pr-10"
          />
          <button
            type="button"
            onClick={handleFollowUpMicClick}
            className={`absolute top-2 right-2 text-gray-500 hover:text-red-500 ${
              listening ? "animate-pulse" : ""
            }`}
          >
            {listening ? (
              <MicOff className="text-red-500" size={18} />
            ) : (
              <Mic className="text-blue-500" size={18} />
            )}
          </button>
           <p className="text-xs text-gray-500 mt-1">
          {listening ? "Listening..." : "Click mic to dictate"}
        </p>
        </div>
       

        {/* Duration Picker */}
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="0"
            value={form.followUpDuration}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                followUpDuration: e.target.value,
              }))
            }
            className="w-1/2"
          />

          <Select
            value={form.followUpUnit}
            onValueChange={(val) =>
              setForm((prev) => ({
                ...prev,
                followUpUnit: val,
              }))
            }
          >
            <SelectTrigger className="w-1/2">
              <SelectValue placeholder="Day(s)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Days">Day(s)</SelectItem>
              <SelectItem value="Weeks">Week(s)</SelectItem>
              <SelectItem value="Months">Month(s)</SelectItem>
              <SelectItem value="Years">Year(s)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Shortcut Presets */}
        <div className="md:col-span-2 flex flex-wrap gap-2 mt-2">
          {[
            "1D",
            "2D",
            "3D",
            "4D",
            "5D",
            "1W",
            "2W",
            "3W",
            "6W",
            "1M",
            "2M",
            "3M",
            "6M",
            "1Y",
          ].map((item) => (
            <button
              key={item}
              onClick={() => handleFollowUpShortcut(item)}
              className="text-xs px-3 py-1 rounded-md bg-yellow-100 hover:bg-yellow-200"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
