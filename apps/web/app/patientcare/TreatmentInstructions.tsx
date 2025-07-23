import { Mic, MicOff, ClipboardList, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const TreatmentInstructionsCard = ({
  form,
  setForm,
  handleTreatmentMicClick,
  isListening,
}: {
  form: any;
  setForm: (value: any) => void;
  handleTreatmentMicClick: () => void;
  isListening: boolean;
}) => {
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const insertSnippet = (text: string) => {
    setForm({
      ...form,
      treatment: form.treatment + (form.treatment ? "\n" : "") + text,
    });
  };

  const quickSnippets = [
    "Take plenty of rest and fluids.",
    "Take Paracetamol 500mg if fever >99°F.",
    "Avoid cold food. Follow up in 5 days.",
  ];

  return (
    <Card className="p-4 rounded-xl shadow-sm border bg-white hover:shadow-xl hover:border-yellow-300">
      <div className="flex items-center gap-2 mb-2 font-semibold text-gray-800">
        <ClipboardList size={18} className="text-yellow-600" />
        Treatment & Instructions
      </div>

      <div className="relative">
        <Textarea
          placeholder="Enter treatment plan or advice to patient..."
          value={form.treatment}
          name="treatment"
          onChange={handleChange}
          className="text-sm pr-10"
        />
        <button
          type="button"
          onClick={handleTreatmentMicClick}
          className={`absolute right-2 top-2 p-2 rounded-full transition ${
            isListening ? "bg-red-100 hover:bg-red-200" : "bg-blue-100 hover:bg-blue-200"
          }`}
        >
          {isListening ? (
            <MicOff className="w-4 h-4 text-red-600 animate-pulse" />
          ) : (
            <Mic className="w-4 h-4 text-blue-600" />
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-1 mb-2">
        {isListening ? "Listening..." : "Click the mic to dictate"}
      </p>

      <div className="flex flex-wrap gap-2 mt-2">
        {quickSnippets.map((text, idx) => (
          <button
            key={idx}
            onClick={() => insertSnippet(text)}
            className="text-xs px-2 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-yellow-50 transition"
          >
            {text}
          </button>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500 flex items-center gap-1">
        <Sparkles className="w-4 h-4 text-purple-400" />
        AI Suggestions coming soon...
      </div>
    </Card>
  );
};

export default TreatmentInstructionsCard;
