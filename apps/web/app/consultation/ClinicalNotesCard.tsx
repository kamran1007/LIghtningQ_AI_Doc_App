// ClinicalNotesCard.tsx
import React, { useState } from "react";
import { MessageCirclePlus, Mic, MicOff, StickyNote } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ClinicalNotesCardProps {
  disabled: boolean;

  clinicalnotesText: string;
  setClinicalnotesText: (text: string) => void;
  handleClinicalNoteMicClick: () => void;
  listening: boolean;
}

const ClinicalNotesCard: React.FC<ClinicalNotesCardProps> = ({
  disabled,
  clinicalnotesText,
  setClinicalnotesText,
  handleClinicalNoteMicClick,
  listening,
}) => {
  const [showClinicalNotes, setShowClinicalNotes] =
    useState(!!clinicalnotesText);

  return (
    <Card className="p-4 rounded-xl shadow-sm border bg-white relative hover:shadow-xl hover:border-purple-300">
      {/* Header */}
      <div className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
        <StickyNote size={18} className="text-purple-500" />
        Clinical Notes
      </div>

      {/* Add Remark Toggle */}
      {!showClinicalNotes ? (
        <button
          type="button"
          onClick={() => setShowClinicalNotes(true)}
          className="mt-2 text-xs text-purple-400 hover:underline flex items-center gap-1"
        >
          <MessageCirclePlus className="w-4 h-4" />
          <span>Add Clinical Note Remark</span>
        </button>
      ) : (
        <div className="relative w-full">
          {/* Textarea with space for mic */}
          <div className="relative">
            <textarea
              value={clinicalnotesText}
              disabled={disabled}
              onChange={(e) => setClinicalnotesText(e.target.value)}
              placeholder="Enter or speak your clinical notes..."
              rows={3}
              className="text-sm px-4 py-3 w-full rounded-2xl border-2 border-purple-200 hover:border-purple-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 no-scrollbar bg-gradient-to-br from-purple-50/50 to-violet-50/30 placeholder:text-gray-400 placeholder:font-light text-gray-700 leading-relaxed tracking-wide shadow-sm hover:shadow-md focus:shadow-lg backdrop-blur-sm resize-none pr-12 focus:outline-none"
              style={{
                fontFamily:
                  '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: "14px",
                lineHeight: "1.6",
                letterSpacing: "0.025em",
                minHeight: "90px",
              }}
            />

            {/* Mic Button (inside textarea) */}
            <button
              type="button"
              disabled={disabled}
              onClick={handleClinicalNoteMicClick}
              className={`absolute bottom-2 right-3 p-1.5 rounded-full transition ${
                listening
                  ? "bg-red-100 hover:bg-red-200"
                  : "bg-purple-100 hover:bg-purple-200"
              }`}
            >
              {listening ? (
                <MicOff className="w-4 h-4 text-red-600 animate-pulse" />
              ) : (
                <Mic className="w-4 h-4 text-purple-500" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {listening ? "Listening..." : "Click the mic to speak"}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => setClinicalnotesText("")}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Clear
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                setClinicalnotesText("");
                setShowClinicalNotes(false);
              }}
              className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
            >
              Remove
            </button>
          </div>

          {/* Status Message */}
        </div>
      )}
    </Card>
  );
};

export default ClinicalNotesCard;
