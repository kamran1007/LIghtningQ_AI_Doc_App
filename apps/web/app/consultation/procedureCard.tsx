"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface Option {
  ProcedureId: any;
  label: string;
  value: string;
}

interface Procedure {
  label: string;
  ProcedureId?: string;
}

interface ProcedureInputCardProps {
  disabled: boolean,
  procedures: Procedure[];
  setProcedures: (val: Procedure[]) => void;
  inputValue: string;
  setInputValue: (val: string) => void;
  procedureremarkMap: { [key: string]: string };
  setProcedureremarkMap: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
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

  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const activeKey = activeMicProcedure;

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const profile = await getProfile();
        setUserprofiledata(profile);
        const res = await FetchProcedure();
        console.log("procedure", res);

        const frequent = res.return.slice(0, 10);
        const remaining = res.return.slice(10);

        const allOptions = [...frequent, ...remaining].map((item: any) => ({
          label: item.ProcedureName,
          value: item.ProcedureName,
          ProcedureId: item.ProcedureId,
        }));

        setOptions(allOptions);
      } catch (err) {
        console.error("❌ Failed to fetch procedures:", err);
      }
    };

    fetchProcedures();
  }, []);

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

  const handleCreateOption = async (inputValue: string) => {
    const newTag = {
      ProcedureName: inputValue,
      specializationId: userprofiledata?.user?.SpecializationId || 0,
      ProcedureCode: "",
      createdBy: userprofiledata?.user?.UserId,
    };

    try {
      const result = await addupdateProcedure(newTag);
      const newOption = {
        label: result?.ProcedureName || inputValue,
        value: result?.ProcedureName || inputValue,
        ProcedureId: result?.ProcedureId || 0,
      };
      setOptions((prev) => [...prev, newOption]);
      setProcedures((prev) => [...prev, newOption]);
    } catch (error) {
      console.error("Error creating procedure:", error);
    }
  };

  const selectedOptions: Option[] = procedures.map((proc) => ({
    label: proc.label,
    value: proc.label,
    ProcedureId: proc.ProcedureId,
  }));

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
          const values = (selected || []) as Option[];
          setProcedures(
            values.map((opt) => ({
              label: opt.label,
              ProcedureId: opt.ProcedureId?.toString() || "",
            }))
          );
        }}
        inputValue={inputValue}
        onInputChange={(val) => setInputValue(val)}
        onCreateOption={handleCreateOption}
        placeholder="Type or select procedure..."
        classNamePrefix="react-select"
        className="mb-3 border border-blue-200 focus:border-blue-300 focus:ring-blue-200"
        styles={{
          control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? "#93C5FD" : "#93C5FD", // Tailwind blue-300 hex
            boxShadow: state.isFocused ? "0 0 0 1px #93C5FD" : "none",
            "&:hover": {
              borderColor: "#93C5FD",
            },
            borderRadius: "0.75rem", // rounded-xl look (optional)
            minHeight: "42px",
          }),
        }}
      />

      {procedures.length > 0 && (
        <ul className="space-y-2">
          {procedures.map((item, index) => {
            const key = item.ProcedureId || item.label;
            const hasRemark = procedureremarkMap?.[key] !== undefined;
            const remarkValue = procedureremarkMap?.[key] ?? "";

            return (
              <li
                key={key}
                className={`mt-2 ${
                  index > 0 ? "border-t border-green-200 pt-2" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">
                    {item.label}
                  </span>
                  {/* ❌ Remove procedure itself */}
                  <button
                    type="button"
                    onClick={() => {
                      setProcedureremarkMap((prev) => {
                        const newMap = { ...prev };
                        delete newMap[key];
                        return newMap;
                      });
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* If no remark yet → show Add Remark button */}
                {!hasRemark && (
                  <button
                    type="button"
                    onClick={() =>
                      setProcedureremarkMap((prev) => ({
                        ...prev,
                        [key]: "", // create remark field
                      }))
                    }
                    className="mt-2 text-xs text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <MessageCirclePlus className="w-4 h-4" />
                    <span>Add {item.label} Remark</span>
                  </button>
                )}

                {/* If remark exists → show textarea + controls */}
                {hasRemark && (
                  <div className="mt-2">
                    <div className="relative">
                      <Textarea
                        value={remarkValue}
                        disabled={disabled}
                        onChange={(e) =>
                          setProcedureremarkMap((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        placeholder={`Enter remark for ${item.label}...`}
                        className="text-sm pr-10 rounded-2xl border-2 border-blue-200 hover:border-blue-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 no-scrollbar bg-gradient-to-br from-blue-50/50 to-sky-50/30 placeholder:text-gray-400 placeholder:font-light text-gray-700 leading-relaxed tracking-wide shadow-sm hover:shadow-md focus:shadow-lg backdrop-blur-sm resize-none min-h-[100px] p-4"
                        style={{
                          fontFamily:
                            '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          fontSize: "14px",
                          lineHeight: "1.6",
                          letterSpacing: "0.025em",
                        }}
                      />
                      {/* Mic button inside textarea */}
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => handleMicClick(key)}
                        className="absolute bottom-2 right-2 p-1 rounded-full transition bg-white shadow hover:bg-gray-50"
                      >
                        {listening && activeMicProcedure === key ? (
                          <MicOff className="w-4 h-4 text-red-600 animate-pulse" />
                        ) : (
                          <Mic className="w-4 h-4 text-blue-500" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {listening && activeMicProcedure === key
                        ? "Listening..."
                        : "Click mic to dictate"}
                    </p>

                    {/* Clear + Remove buttons below textarea */}
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() =>
                          setProcedureremarkMap((prev) => ({
                            ...prev,
                            [key]: "",
                          }))
                        }
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          setProcedureremarkMap((prev) => {
                            const newMap = { ...prev };
                            delete newMap[key];
                            return newMap;
                          });
                        }}
                        className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                      >
                        Remove
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
