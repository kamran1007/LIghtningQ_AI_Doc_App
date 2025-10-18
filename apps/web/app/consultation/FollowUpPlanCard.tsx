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
import { ConsultationFormValues } from "@/types/consultation";

type FollowUpPlanProps = {
  disabled: boolean; // you were also missing this in the type!
  form: ConsultationFormValues;
  setForm: React.Dispatch<React.SetStateAction<ConsultationFormValues>>;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFollowUpShortcut: (val: string) => void;
};


export default function FollowUpPlanCard({
  disabled,
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
          {/* Wrapper around textarea to position mic inside */}
          <div className="relative w-full">
            <Textarea
              placeholder="e.g. Review in 7 days, next appointment date..."
              disabled={disabled}
              value={form.followUp}
              name="followUp"
              onChange={handleChange}
              className="text-sm pr-12 rounded-2xl border-2 border-indigo-200 hover:border-indigo-300 
                 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 
                 no-scrollbar bg-gradient-to-br from-indigo-50/50 to-blue-50/30 
                 placeholder:text-gray-400 placeholder:font-light text-gray-700 
                 leading-relaxed tracking-wide shadow-sm hover:shadow-md focus:shadow-lg 
                 backdrop-blur-sm resize-none min-h-[100px] p-4"
              style={{
                fontFamily:
                  '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: "14px",
                lineHeight: "1.6",
                letterSpacing: "0.025em",
              }}
            />

            {/* Mic overlay INSIDE textarea border */}
            <button
              type="button"
              disabled={disabled}
              onClick={handleFollowUpMicClick}
              className={`absolute bottom-2 right-3 p-1 rounded-full transition-colors shadow-sm 
        ${
          listening
            ? "bg-red-100 hover:bg-red-200"
            : "bg-white hover:bg-gray-50 border border-gray-200"
        }`}
            >
              {listening ? (
                <MicOff className="text-red-600 animate-pulse" size={18} />
              ) : (
                <Mic className="text-indigo-500" size={18} />
              )}
            </button>
          </div>

          {/* Status text */}
          <p className="text-xs text-gray-500 mt-2 px-1">
            {listening
              ? "🎤 Listening... Speak now"
              : "Click mic to dictate follow-up instructions"}
          </p>
        </div>

        {/* Duration Picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Follow-up Duration
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              disabled={disabled}
              placeholder="0"
              value={form.followUpDuration}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  followUpDuration: e.target.value,
                }))
              }
              className="w-1/2 text-sm rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
            />

            <Select
              value={form.followUpUnit}
              disabled={disabled}
              onValueChange={(val) =>
                setForm((prev) => ({
                  ...prev,
                  followUpUnit: val,
                }))
              }
            >
              <SelectTrigger className="w-1/2 text-sm rounded-xl border-2 border-gray-300 hover:border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Days">Day(s)</SelectItem>
                <SelectItem value="Weeks">Week(s)</SelectItem>
                <SelectItem value="Months">Month(s)</SelectItem>
                <SelectItem value="Years">Year(s)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Shortcut Presets */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Quick Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "1D", desc: "1 Day" },
              { label: "2D", desc: "2 Days" },
              { label: "3D", desc: "3 Days" },
              { label: "4D", desc: "4 Days" },
              { label: "5D", desc: "5 Days" },
              { label: "1W", desc: "1 Week" },
              { label: "2W", desc: "2 Weeks" },
              { label: "3W", desc: "3 Weeks" },
              { label: "6W", desc: "6 Weeks" },
              { label: "1M", desc: "1 Month" },
              { label: "2M", desc: "2 Months" },
              { label: "3M", desc: "3 Months" },
              { label: "6M", desc: "6 Months" },
              { label: "1Y", desc: "1 Year" },
            ].map((item) => (
              <button
                key={item.label}
                disabled={disabled}
                onClick={() => handleFollowUpShortcut(item.label)}
                className="group relative text-sm px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-100 to-amber-100 hover:from-yellow-200 hover:to-amber-200 text-amber-800 font-medium transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
                title={item.desc}
              >
                {item.label}
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {item.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
