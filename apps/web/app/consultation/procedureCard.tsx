"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import {
  MessageCirclePlus,
  Mic,
  MicOff,
  Microscope,
  Trash2,
} from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { Textarea } from "@/components/ui/textarea";
import { addupdateProcedure, FetchProcedure } from "@/lib/consultation";
import { getProfile } from "@/lib/action";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Procedure } from "@/types/consultation";

interface Option {
  ProcedureId: number;
  label: string;
  value: string;
}

interface ProcedureInputCardProps {
  disabled: boolean;
  procedures: Procedure[];
  setProcedures: React.Dispatch<React.SetStateAction<Procedure[]>>;
  inputValue: string;
  setInputValue: (val: string) => void;
  procedureremarkMap: Record<string, string>;
  setProcedureremarkMap: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}

export default function ProcedureInputCard({
  disabled,
  procedures,
  setProcedures,
  inputValue,
  setInputValue,
  procedureremarkMap,
  setProcedureremarkMap,
}: ProcedureInputCardProps) {
  const [options, setOptions] = useState<Option[]>([]);
  const [userprofiledata, setUserprofiledata] = useState<any>(null);
  const [activeMicProcedure, setActiveMicProcedure] = useState<string | null>(
    null
  );
  const [prevTranscript, setPrevTranscript] = useState("");
  const [procedureInputValue, setProcedureInputValue] = useState("");
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const activeKey = activeMicProcedure;

  // ✅ Fetch procedure options
  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const profile = await getProfile();
        setUserprofiledata(profile);

        const res = await FetchProcedure();
        const allOptions =
          res.return?.map((item: any) => ({
            label: item.ProcedureName,
            value: item.ProcedureName,
            ProcedureId: item.ProcedureId,
          })) || [];

        const unique = allOptions.filter(
          (opt: any, i: number, arr: Option[]) =>
            i === arr.findIndex((t) => t.ProcedureId === opt.ProcedureId)
        );

        setOptions(unique);
      } catch (err) {
        console.error("❌ Failed to fetch procedures:", err);
      }
    };

    fetchProcedures();
  }, []);

  // 🎙 Speech recognition handler
  useEffect(() => {
    if (!listening && transcript && activeKey) {
      const newContent = transcript.replace(prevTranscript, "").trim();

      if (newContent) {
        setProcedureremarkMap((prev) => ({
          ...prev,
          [activeKey]: prev[activeKey]
            ? `${prev[activeKey]} ${newContent}`.trim()
            : newContent,
        }));
      }

      resetTranscript();
      setActiveMicProcedure(null);
    }
  }, [listening]);

  const handleMicClick = (key: string) => {
    if (listening && activeKey === key) {
      SpeechRecognition.stopListening();
    } else {
      setActiveMicProcedure(key);
      setPrevTranscript(transcript);
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    }
  };

  // ➕ Create new procedure
  const handleCreateOption = async (inputValue: string) => {
    const newTag = {
      ProcedureName: inputValue,
      specializationId: userprofiledata?.user?.SpecializationId || 0,
      ProcedureCode: "",
      createdBy: userprofiledata?.user?.UserId,
    };

    try {
      const result = await addupdateProcedure(newTag);
      const newOption: Option = {
        label: result?.data?.ProcedureName || inputValue,
        value: result?.data?.ProcedureName || inputValue,
        ProcedureId: result?.data?.ProcedureId || 0,
      };

      setOptions((prev) => [...prev, newOption]);
      setProcedures((prev) => [...prev, newOption]);
    } catch (error) {
      console.error("Error creating procedure:", error);
    }
  };

  const selectedOptions: Option[] = procedures.map((proc: any) => ({
    label: proc.label,
    value: proc.label,
    ProcedureId: proc.ProcedureId ?? 0,
  }));

  // 🧠 Expand remark boxes for filled remarks
  useEffect(() => {
    setExpandedMap((prev) => {
      const updated = { ...prev };
      procedures.forEach((item: any) => {
        const key = String(item.ProcedureId || item.label);
        // Only add new keys; don’t reset existing expanded ones
        if (!(key in updated)) {
          updated[key] = !!procedureremarkMap?.[key]?.trim();
        }
      });
      return updated;
    });
  }, [procedures]);

  const toggleExpanded = useCallback((key: string, value: boolean) => {
    setExpandedMap((prev) => ({ ...prev, [key]: value }));
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  return (
    <Card className="p-4 rounded-xl shadow-sm border bg-white relative hover:shadow-xl hover:border-blue-300">
      <div className="flex items-center gap-2 mb-3 font-semibold text-gray-800">
        <Microscope size={18} className="text-blue-400" />
        Procedure
      </div>

      <CreatableSelect
        isMulti
        isDisabled={disabled}
        options={options}
        value={selectedOptions}
        onChange={(selected) => {
          setProcedures(
            (selected || []).map((opt) => ({
              label: opt.label,
              ProcedureId: Number(opt.ProcedureId) || 0,
            }))
          );
        }}
        inputValue={procedureInputValue}
        onInputChange={(val) => setProcedureInputValue(val)}
        onCreateOption={handleCreateOption}
        placeholder="Type or select procedure..."
        classNamePrefix="react-select"
        className="mb-3 border border-blue-200 focus:border-blue-300 focus:ring-blue-200"
        styles={{
          control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? "#93C5FD" : "#BFDBFE",
            boxShadow: state.isFocused ? "0 0 0 1px #93C5FD" : "none",
            "&:hover": { borderColor: "#93C5FD" },
            borderRadius: "0.75rem",
            minHeight: "42px",
          }),
        }}
      />

      {procedures.length > 0 && (
        <ul className="space-y-2">
          {procedures.map((item: any, index) => {
            const key = String(item.ProcedureId || item.label);
            const remarkValue = procedureremarkMap?.[key] ?? "";
            const expanded = expandedMap[key] ?? false;
            const isActiveField = activeKey === key;

            return (
              <li
                key={key}
                className={`mt-2 ${
                  index > 0 ? "border-t border-blue-200 pt-2" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">
                    {item.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...procedureremarkMap };
                      delete updated[key];
                      setProcedureremarkMap(updated);
                      setProcedures((prev) =>
                        prev.filter((p) => p.ProcedureId !== item.ProcedureId)
                      );
                      toggleExpanded(key, false);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {!expanded ? (
                  <button
                    type="button"
                    onClick={() => {
                      // Step 1️⃣: Mark as expanded first (forces render next frame)
                      setExpandedMap((prev) => ({ ...prev, [key]: true }));

                      // Step 2️⃣: After render tick, create remark entry and focus
                      requestAnimationFrame(() => {
                        setProcedureremarkMap((prev) => ({
                          ...prev,
                          [key]: prev[key] || "",
                        }));

                        // Step 3️⃣: Focus after it's mounted
                        setTimeout(() => {
                          const textarea = document.getElementById(
                            `remark-${key}`
                          );
                          if (textarea) textarea.focus();
                        }, 50);
                      });
                    }}
                    className="mt-2 text-xs text-blue-500 hover:underline flex items-center gap-1 transition-all duration-200"
                  >
                    <MessageCirclePlus className="w-4 h-4" />
                    <span>Add {item.label} Remark</span>
                  </button>
                ) : (
                  <div className="mt-2">
                    <div className="relative">
                      <Textarea
                        id={`remark-${key}`}
                        value={remarkValue}
                        disabled={disabled}
                        onChange={(e) => {
                          const newVal = e.target.value;
                          setProcedureremarkMap((prev) => ({
                            ...prev,
                            [key]: newVal,
                          }));
                        }}
                        placeholder={`Enter remark for ${item.label}...`}
                        className="text-sm pr-10 rounded-2xl no-scrollbar border-2 border-blue-200 hover:border-blue-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gradient-to-br from-blue-50/50 to-sky-50/30 placeholder:text-gray-400 text-gray-700 min-h-[100px] p-4"
                      />

                      {/* 🎙 Mic Button */}
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => handleMicClick(key)}
                        className={`absolute bottom-2 right-2 p-1 rounded-full transition ${
                          listening && isActiveField
                            ? "bg-red-100 hover:bg-red-200"
                            : "bg-white shadow hover:bg-gray-50"
                        }`}
                      >
                        {listening && isActiveField ? (
                          <MicOff className="w-4 h-4 text-red-600 animate-pulse" />
                        ) : (
                          <Mic className="w-4 h-4 text-blue-500" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      {listening && isActiveField
                        ? "Listening..."
                        : "Click mic to dictate"}
                    </p>

                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          const updated = { ...procedureremarkMap };
                          delete updated[key];
                          setProcedureremarkMap(updated);
                          setExpandedMap((prev) => ({ ...prev, [key]: false }));
                        }}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
