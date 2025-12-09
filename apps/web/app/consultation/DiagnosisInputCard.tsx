"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
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
  DiagnosisId: number;
  label: string;
  value: string;
}

interface Diagnosis {
  label: string;
  DiagnosisId: number;
}

interface DiagnosisInputCardProps {
  disabled: boolean;
  diagnoses: Diagnosis[];
  setDiagnoses: React.Dispatch<React.SetStateAction<Diagnosis[]>>;
  inputValue: string;
  setInputValue: (val: string) => void;
  remarkMap: Record<string, string>;
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
  const [diagnosisInputValue, setDiagnosisInputValue] = useState("");
  const [expandedRemarks, setExpandedRemarks] = useState<
    Record<string, boolean>
  >({});
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(true);

  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const activeKey = activeMicDiagnosis;

  // 🧠 Fetch all diagnosis options + profile
  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        setLoadingDiagnosis(true);

        const resp = await getProfile();
        setUserprofiledata(resp);

        const res = await FetchDiagnosis();

        const allOptions = res.return
          .map((item: any) => ({
            label: item.DiagnosisName,
            value: item.DiagnosisName,
            DiagnosisId: item.DiagnosisId,
          }))
          .filter(
            (opt: any, idx: number, arr: any) =>
              idx ===
              arr.findIndex((t: any) => t.DiagnosisId === opt.DiagnosisId)
          );

        setOptions(allOptions);
      } catch (err) {
        console.error("❌ Failed to fetch diagnosis:", err);
      } finally {
        setLoadingDiagnosis(false);
      }
    };

    fetchDiagnosis();
  }, []);

  // 🧩 Expand remarks for already existing ones (loaded from DB) - ONLY on initial load
  // 🧩 Expand remarks for already existing ones (loaded from DB) - ONLY on initial load

  useEffect(() => {
    if (diagnoses.length > 0 && !initialLoadDone) {
      const updated: Record<string, boolean> = {};
      diagnoses.forEach((item) => {
        const key = String(item.DiagnosisId || item.label);
        const remark = remarkMap[key] ?? "";
        // Only expand if there's actually content
        if (remark.trim() !== "") {
          updated[key] = true;
        }
      });
      setExpandedRemarks(updated);
      setInitialLoadDone(true);
    }
  }, [diagnoses, remarkMap, initialLoadDone]);

  // 🎙️ Handle mic input for remarks
  useEffect(() => {
    if (!listening && transcript && activeKey) {
      const newContent = transcript.replace(prevTranscript, "").trim();
      if (newContent) {
        setRemarkMap((prev) => ({
          ...prev,
          [activeKey]: prev[activeKey]
            ? `${prev[activeKey]} ${newContent}`.trim()
            : newContent,
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
      setPrevTranscript(transcript);
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    }
  };

  // ✨ Create new diagnosis
  const handleCreateOption = async (inputValue: string) => {
    const newTag = {
      DiagnosisName: inputValue,
      specializationId: userprofiledata?.user?.SpecializationId || 0,
      icdCode: "",
    };

    try {
      const result = await AddUpdateDiagnosis(newTag);
      const newOption = {
        label: result?.data?.DiagnosisName || inputValue,
        value: result?.data?.DiagnosisName || inputValue,
        DiagnosisId: result?.data?.DiagnosisId || 0,
      };

      setOptions((prev) => {
        const exists = prev.some(
          (opt) => opt.DiagnosisId === newOption.DiagnosisId
        );
        return exists ? prev : [...prev, newOption];
      });

      setDiagnoses((prev) => {
        const exists = prev.some(
          (d) => d.DiagnosisId === newOption.DiagnosisId
        );
        return exists ? prev : [...prev, newOption];
      });
    } catch (error) {
      console.error("Error creating diagnosis:", error);
    }
  };

  // Handle change
  const handleDiagnosisChange = (selected: readonly Option[] | null) => {
    const values = selected || [];
    const uniqueValues = Array.from(
      new Map(values.map((v) => [v.DiagnosisId || v.label, v])).values()
    );

    setDiagnoses(
      uniqueValues.map((opt) => ({
        label: opt.label,
        DiagnosisId: Number(opt.DiagnosisId) || 0,
      }))
    );
  };

  const filteredOptions = options.map((opt) => ({
    ...opt,
    isDisabled: diagnoses.some((d) => d.DiagnosisId === opt.DiagnosisId),
  }));

  const selectedOptions: Option[] = diagnoses.map((diag) => ({
    label: diag.label,
    value: diag.label,
    DiagnosisId: diag.DiagnosisId,
  }));

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }
  const diagnosisSelectStyles = {
    control: (base: any, state: { isFocused: any; isDisabled: any }) => ({
      ...base,
      minHeight: "44px",
      borderColor: state.isFocused ? "#86efac" : "#bbf7d0",
      backgroundColor: state.isDisabled ? "#f3f4f6" : "white",
      boxShadow: state.isFocused ? "0 0 0 2px #dcfce7" : "none",
      borderRadius: "12px",
      paddingLeft: "4px",
      transition: "all 0.2s ease",
      "&:hover": {
        borderColor: "#86efac",
      },
      fontSize: "14px",
      fontWeight: 500,
      color: "#065f46",
    }),

    placeholder: (base: any) => ({
      ...base,
      color: "#6b7280",
      fontSize: "14px",
      fontWeight: 400,
    }),

    input: (base: any) => ({
      ...base,
      color: "#065f46",
      fontWeight: 500,
    }),

    multiValue: (base: any) => ({
      ...base,
      backgroundColor: "#d1fae5",
      borderRadius: "8px",
      padding: "2px 6px",
    }),

    multiValueLabel: (base: any) => ({
      ...base,
      color: "#047857",
      fontWeight: 600,
      fontSize: "13px",
    }),

    multiValueRemove: (base: any) => ({
      ...base,
      color: "#047857",
      "&:hover": {
        backgroundColor: "#fecaca",
        color: "#b91c1c",
      },
    }),

    menu: (base: any) => ({
      ...base,
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid #bbf7d0",
      paddingTop: "6px",
      paddingBottom: "6px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05), 0 4px 10px rgba(0,0,0,0.03)",
    }),

    menuList: (base: any) => ({
      ...base,
      maxHeight: "220px",
      padding: "0",
      scrollbarWidth: "none", // Firefox
      msOverflowStyle: "none", // Internet Explorer
      "&::-webkit-scrollbar": {
        width: "0 !important", // Chrome/Safari
        height: "0 !important",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "transparent !important",
      },
      "&::-webkit-scrollbar-track": {
        background: "transparent !important",
      },
    }),

    option: (base: any, state: { isFocused: any }) => ({
      ...base,
      padding: "10px 14px",
      fontSize: "14px",
      fontWeight: 500,
      borderRadius: "6px",
      margin: "2px 8px",
      transition: "all 0.15s ease",
      backgroundColor: state.isFocused
        ? "#ecfdf5" // 💚 Light Green hover
        : "white",
      color: "#065f46",
      "&:hover": {
        backgroundColor: "#ecfdf5",
        color: "#065f46",
      },
    }),
  };

  return (
    <Card className="p-4 rounded-xl shadow-sm border bg-white relative hover:shadow-xl hover:border-green-300">
      <div className="flex items-center gap-2 mb-3 font-semibold text-gray-800">
        <TestTubeDiagonal size={18} className="text-green-600" /> Diagnosis
      </div>

      <CreatableSelect
        isMulti
        isDisabled={disabled}
        options={filteredOptions}
        value={selectedOptions}
        onChange={handleDiagnosisChange}
        onInputChange={(v) => setDiagnosisInputValue(v)}
        onCreateOption={handleCreateOption}
        placeholder="Type or select diagnosis..."
        classNamePrefix="react-select"
        isLoading={loadingDiagnosis}
        styles={diagnosisSelectStyles}
        loadingMessage={() => (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <span className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full"></span>
            Loading diagnosis...
          </div>
        )}
      />

      {diagnoses.length > 0 && (
        <ul className="space-y-2">
          {diagnoses.map((item, index) => {
            const key = String(item.DiagnosisId || item.label);
            const remarkValue = remarkMap[key] ?? "";
            const isExpanded = expandedRemarks[key] || false;

            return (
              <li
                key={key}
                className={`mt-2 ${index > 0 ? "border-t border-green-200 pt-2" : ""}`}
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">
                    {item.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setDiagnoses((prev) =>
                        prev.filter((d) => d.DiagnosisId !== item.DiagnosisId)
                      );
                      setRemarkMap((prev) => {
                        const map = { ...prev };
                        delete map[key];
                        return map;
                      });
                      setExpandedRemarks((prev) => {
                        const map = { ...prev };
                        delete map[key];
                        return map;
                      });
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Expand/Collapse */}
                {!isExpanded ? (
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedRemarks((prev) => ({
                        ...prev,
                        [key]: true,
                      }));
                    }}
                    className="mt-2 text-xs text-green-500 hover:underline flex items-center gap-1 transition-colors"
                  >
                    <MessageCirclePlus className="w-4 h-4" />
                    <span>Add {item.label} Remark</span>
                  </button>
                ) : (
                  <div className="w-full mt-2">
                    <div className="relative">
                      <Textarea
                        id={`remark-${key}`}
                        disabled={disabled}
                        className="mt-1 pr-10 resize-none  rounded-2xl border-2 border-green-200 hover:border-green-300 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 no-scrollbar bg-gradient-to-br from-green-50/50 to-emerald-50/30 placeholder:text-gray-400 text-gray-700 min-h-[100px] p-4"
                        placeholder={`Enter remark for ${item.label}...`}
                        value={remarkValue}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRemarkMap((prev) => ({
                            ...prev,
                            [key]: val,
                          }));
                        }}
                      />

                      {/* 🎙 Mic */}
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

                    <p className="text-xs text-gray-500 mt-1">
                      {listening && activeMicDiagnosis === key
                        ? "Listening..."
                        : "Click mic to dictate"}
                    </p>

                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setExpandedRemarks((prev) => ({
                            ...prev,
                            [key]: true,
                          }));
                        }}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
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
