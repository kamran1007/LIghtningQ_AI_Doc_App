"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageCirclePlus,
  Mic,
  MicOff,
  TestTubeDiagonal,
  Trash2,
} from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { Textarea } from "@/components/ui/textarea";
import { AddUpdateDiagnosis, FetchDiagnosis } from "@/lib/consultation";
import { getProfile } from "@/lib/action";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface Option {
  DiagnosisId: any;
  label: string;
  value: string;
}
interface Diagnosis {
  label: string;
  DiagnosisId: number; // ✅ must match parent
}
interface DiagnosisInputCardProps {
  disabled: boolean;
  diagnoses: Diagnosis[];
  setDiagnoses: React.Dispatch<React.SetStateAction<Diagnosis[]>>;
  inputValue: string;
  setInputValue: (val: string) => void;
  remarkMap: Record<string, string>; // ✅ all keys coerced to string
  setRemarkMap: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default function DiagnosisInputCard({
  disabled,
  diagnoses,
  setDiagnoses,
  inputValue,
  setInputValue,
  remarkMap,
  setRemarkMap,
}: DiagnosisInputCardProps) {
  const [options, setOptions] = useState<Option[]>([]);
  const [userprofiledata, setUserprofiledata] = useState<any>(null);
  const [activeMicDiagnosis, setActiveMicDiagnosis] = useState<string | null>(
    null
  );
  const [prevTranscript, setPrevTranscript] = useState("");

  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // 🧠 Identify currently active mic key (DiagnosisId or label)
  const activeKey = activeMicDiagnosis;

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const resp = await getProfile();
        setUserprofiledata(resp);
        const res = await FetchDiagnosis();

        const frequent = res.return.slice(0, 10);
        const remaining = res.return.slice(10);

        const allOptions = [...frequent, ...remaining].map((item: any) => ({
          label: item.DiagnosisName,
          value: item.DiagnosisName,
          DiagnosisId: item.DiagnosisId,
        }));

        setOptions(allOptions);
      } catch (err) {
        console.error("❌ Failed to fetch diagnosis:", err);
      }
    };

    fetchDiagnosis();
  }, []);

  useEffect(() => {
    if (!listening && transcript && activeKey) {
      const key = Number(activeKey); // ✅ cast string → number

      const newContent = transcript.replace(prevTranscript, "").trim();

      if (newContent) {
        setRemarkMap((prev) => ({
          ...prev,
          [key]: prev[key] ? `${prev[key]} ${newContent}`.trim() : newContent,
        }));
      }

      resetTranscript();
      setActiveMicDiagnosis(null);
    }
  }, [listening]);

  const handleMicClick = (key: string) => {
    if (listening && activeKey === key) {
      SpeechRecognition.stopListening();
    } else {
      setActiveMicDiagnosis(key);
      setPrevTranscript(transcript); // Store current transcript
      resetTranscript(); // Clear global transcript before starting
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    }
  };

  const handleCreateOption = async (inputValue: string) => {
    const newTag = {
      DiagnosisName: inputValue,
      specializationId: userprofiledata?.user?.SpecializationId || 0,
      icdCode: "",
    };

    try {
      const result = await AddUpdateDiagnosis(newTag);
      const newOption = {
        label: result?.DiagnosisName || inputValue,
        value: result?.DiagnosisName || inputValue,
        DiagnosisId: result?.DiagnosisId || 0,
      };
      setOptions((prev) => [...prev, newOption]);
      setDiagnoses((prev) => [...prev, newOption]);
    } catch (error) {
      console.error("Error creating diagnosis:", error);
    }
  };

  const selectedOptions: Option[] = diagnoses.map((diag) => ({
    label: diag.label,
    value: diag.label,
    DiagnosisId: diag.DiagnosisId,
  }));

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  return (
    <Card className="p-4 rounded-xl shadow-sm border bg-white relative hover:shadow-xl hover:border-green-300">
      <div className="flex items-center gap-2 mb-3 font-semibold text-gray-800">
        <TestTubeDiagonal size={18} className="text-green-600" /> Diagnosis
      </div>

      <CreatableSelect
        isMulti
        isDisabled={disabled}
        options={options}
        value={selectedOptions}
        onChange={(selected) => {
          const values = (selected || []) as Option[];
          setDiagnoses(
            values.map((opt) => ({
              label: opt.label,
              DiagnosisId: Number(opt.DiagnosisId) || 0, // ✅ enforce number
            }))
          );
        }}
        inputValue={inputValue}
        onInputChange={(val) => setInputValue(val)}
        onCreateOption={handleCreateOption}
        placeholder="Type or select diagnosis..."
        classNamePrefix="react-select"
        className="mb-3 border border-green-200 focus:border-green-300 focus:ring-green-200"
      />

      {diagnoses.length > 0 && (
        <ul className="space-y-2">
          {diagnoses.map((item, index: number) => {
            const key = String(item.DiagnosisId || item.label); // always string
            const remarkValue = remarkMap[key] ?? "";

            return (
              <li
                key={key}
                className={`mt-2 ${index > 0 ? "border-t border-green-200 pt-2" : ""}`}
              >
                {/* Header row */}
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">
                    {item.label}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setDiagnoses((prev) =>
                        prev.filter((d) => d.label !== item.label)
                      );
                      setRemarkMap((prev) => {
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

                {/* Show "Add Remark" button OR textarea */}
                {remarkMap[key] === undefined ? (
                  <button
                    type="button"
                    onClick={() =>
                      setRemarkMap((prev) => ({
                        ...prev,
                        [key]: "", // initialize empty textarea
                      }))
                    }
                    className="mt-2 text-xs text-green-400 hover:underline flex items-center gap-1"
                  >
                    <MessageCirclePlus className="w-4 h-4" />
                    <span>Add {item.label} Remark</span>{" "}
                  </button>
                ) : (
                  <div className="w-full mt-2">
                    {/* relative wrapper */}
                    <div className="relative">
                      <Textarea
                        disabled={disabled}
                        className="mt-1 pr-10 resize-none rounded-2xl border-2 border-green-200 hover:border-green-300 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 no-scrollbar bg-gradient-to-br from-green-50/50 to-emerald-50/30 placeholder:text-gray-400 placeholder:font-light text-gray-700 leading-relaxed tracking-wide shadow-sm hover:shadow-md focus:shadow-lg backdrop-blur-sm min-h-[100px] p-4"
                        placeholder={`Enter remark for ${item.label}...`}
                        value={remarkValue}
                        onChange={(e) =>
                          setRemarkMap((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        style={{
                          fontFamily:
                            '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          fontSize: "14px",
                          lineHeight: "1.6",
                          letterSpacing: "0.025em",
                        }}
                      />

                      {/* mic button inside textarea at bottom-right */}
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => handleMicClick(key)}
                        className={`absolute bottom-2 right-2 p-1 rounded-full transition ${
                          listening && activeMicDiagnosis === key
                            ? "bg-red-100 hover:bg-red-200"
                            : "bg-white shadow hover:bg-gray-50"
                        }`}
                      >
                        {listening && activeMicDiagnosis === key ? (
                          <MicOff className="w-4 h-4 text-red-600 animate-pulse" />
                        ) : (
                          <Mic className="w-5 h-5 text-green-400 shadow-xl hover:shadow-2xl" />
                        )}
                      </button>
                    </div>

                    {/* Status text */}
                    <p className="text-xs text-gray-500 mt-1">
                      {listening && activeMicDiagnosis === key
                        ? "Listening..."
                        : "Click mic to dictate"}
                    </p>

                    {/* Buttons below textarea */}
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() =>
                          setRemarkMap((prev) => ({
                            ...prev,
                            [key]: "",
                          }))
                        }
                        className="px-2 py-1 text-xs mouse-pointer bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        Clear
                      </button>

                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          setRemarkMap((prev) => {
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
