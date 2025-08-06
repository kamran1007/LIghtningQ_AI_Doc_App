// ClinicalNotesCard.tsx
import React from "react";
import { Mic, MicOff, StickyNote } from "lucide-react";
import { Card } from '@/components/ui/card';

interface ClinicalNotesCardProps {
  clinicalnotesText: string;
  setClinicalnotesText: (text: string) => void;
  handleClinicalNoteMicClick: () => void;
  listening: boolean;
}

const ClinicalNotesCard: React.FC<ClinicalNotesCardProps> = ({
  clinicalnotesText,
  setClinicalnotesText,
  handleClinicalNoteMicClick,
  listening,
}) => {
  return (
    <Card className="p-4 rounded-xl shadow-sm border bg-white relative hover:shadow-xl hover:border-purple-300">
      {/* Header */}
      <div className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
        <StickyNote size={18} className="text-purple-500" />
        Clinical Notes
      </div>

      {/* Textarea with Mic */}
      <div className="relative w-full">
        <textarea
          value={clinicalnotesText}
          onChange={(e) => setClinicalnotesText(e.target.value)}
          placeholder="Enter or speak your clinical notes..."
          rows={8}
          className="text-sm px-3 py-2 w-full rounded-md border border-gray-300 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <button
          type="button"
          onClick={handleClinicalNoteMicClick}
          className={`absolute right-2 bottom-4 p-2 rounded-full transition ${
            listening
              ? "bg-red-100 hover:bg-red-200"
              : "bg-blue-100 hover:bg-blue-200"
          }`}
        >
          {listening ? (
            <MicOff className="w-5 h-5 text-red-600 animate-pulse" />
          ) : (
            <Mic className="w-5 h-5 text-[#22E0D4]" />
          )}
        </button>
      </div>

      {/* Status Message */}
      <p className="text-xs text-gray-500 mt-1">
        {listening ? "Listening..." : "Click the mic to speak"}
      </p>
    </Card>
  );
};

export default ClinicalNotesCard;
