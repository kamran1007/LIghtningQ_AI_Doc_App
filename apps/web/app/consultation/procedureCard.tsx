"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Microscope, Trash2 } from "lucide-react";
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
  procedures: Procedure[];
  setProcedures: (val: Procedure[]) => void;
  inputValue: string;
  setInputValue: (val: string) => void;
  procedureremarkMap: { [key: string]: string };
  setProcedureremarkMap: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

export default function ProcedureInputCard({
  procedures,
  setProcedures,
  inputValue,
  setInputValue,
  procedureremarkMap,
  setProcedureremarkMap,
}: ProcedureInputCardProps) {
  const [options, setOptions] = useState<Option[]>([]);
  const [userprofiledata, setUserprofiledata] = useState<any>(null);
  const [activeMicProcedure, setActiveMicProcedure] = useState<string | null>(null);
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
                console.log("procedure", res)

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
      createdBy: userprofiledata?.user?.UserId
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
        className="mb-3"
      />

      {procedures.length > 0 && (
        <ul className="space-y-2">
          {procedures.map((item, index) => {
            const key = item.ProcedureId || item.label;
            return (
              <li
                key={key}
                className="border-blue-300 bg-gray-50 p-2 rounded text-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">
                    {item.label}
                  </span>
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

                <div className="relative mt-1">
                  <Textarea
                    value={procedureremarkMap?.[key] ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setProcedureremarkMap((prev) => ({
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
                    className="absolute right-2 top-2 text-gray-500 hover:text-blue-600"
                  >
                    {listening && activeMicProcedure === key ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {listening && activeMicProcedure === key
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
