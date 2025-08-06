"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Trash2 } from "lucide-react";
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
  DiagnosisId?: string;
}
interface DiagnosisInputCardProps {
  diagnoses: Diagnosis[];
  setDiagnoses: (val: Diagnosis[]) => void;
  inputValue: string;
  setInputValue: (val: string) => void;
  remarkMap: { [key: string]: string };
  setRemarkMap: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

export default function DiagnosisInputCard({
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
      const newContent = transcript.replace(prevTranscript, "").trim(); // ✨ Only new part

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
        Diagnosis
      </div>

      <CreatableSelect
        isMulti
        options={options}
        value={selectedOptions}
        onChange={(selected) => {
          const values = (selected || []) as Option[];
          setDiagnoses(
            values.map((opt) => ({
              label: opt.label,
              DiagnosisId: opt.DiagnosisId?.toString() || "",
            }))
          );
        }}
        inputValue={inputValue}
        onInputChange={(val) => setInputValue(val)}
        onCreateOption={handleCreateOption}
        placeholder="Type or select diagnosis..."
        classNamePrefix="react-select"
        className="mb-3"
      />

      {diagnoses.length > 0 && (
        <ul className="space-y-2">
          {diagnoses.map((item, index) => {
            const key = item.DiagnosisId || item.label;
            return (
              <li
                key={key}
                className="border-amber-300 bg-gray-50 p-2 rounded text-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">
                    {item.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
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

                <div className="relative mt-1">
                  <Textarea
                    value={remarkMap?.[key] ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRemarkMap((prev) => ({
                        ...prev,
                        [key]: value,
                      }));
                    }}
                    placeholder={`Enter remark for ${item.label}...`}
                    className="text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => handleMicClick(key)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-purple-600"
                  >
                    {listening && activeMicDiagnosis === key ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {listening && activeMicDiagnosis === key
                    ? "Listening..."
                    : "Click mic to dictate"}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
