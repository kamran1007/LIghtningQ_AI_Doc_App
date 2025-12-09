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
import { createOrUpdateBillingItem, GetBillingItem } from "@/lib/billing";

interface Option {
  BillingItemChargeId: number;
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
  UserHospitalData: any;
}

export default function ProcedureInputCard({
  disabled,
  procedures,
  setProcedures,
  inputValue,
  setInputValue,
  procedureremarkMap,
  setProcedureremarkMap,
  UserHospitalData,
}: ProcedureInputCardProps) {
  const [options, setOptions] = useState<Option[]>([]);
  const [userprofiledata, setUserprofiledata] = useState<any>(null);
  const [activeMicProcedure, setActiveMicProcedure] = useState<string | null>(
    null
  );
  const [prevTranscript, setPrevTranscript] = useState("");
  const [procedureInputValue, setProcedureInputValue] = useState("");
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [loadingProcedures, setLoadingProcedures] = useState(true);

  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const activeKey = activeMicProcedure;

  // ✅ Fetch procedure options
  // const fetchProcedures = async () => {
  //   try {
  //     const profile = await getProfile();
  //     setUserprofiledata(profile);

  //     const res = await FetchProcedure();
  //     const allOptions =
  //       res.return?.map((item: any) => ({
  //         label: item.ProcedureName,
  //         value: item.ProcedureName,
  //         ProcedureId: item.ProcedureId,
  //       })) || [];

  //     const unique = allOptions.filter(
  //       (opt: any, i: number, arr: Option[]) =>
  //         i === arr.findIndex((t) => t.ProcedureId === opt.ProcedureId)
  //     );

  //     setOptions(unique);
  //   } catch (err) {
  //     console.error("❌ Failed to fetch procedures:", err);
  //   }
  // };
  const fetchProcedures = async () => {
    try {
      setLoadingProcedures(true); // ⬅️ START LOADING

      const profile = await getProfile();
      setUserprofiledata(profile);

      const resp = await GetBillingItem({
        chargeType: "PROCEDURE",
        limit: 200,
      });

      const items = resp?.data || [];

      const allOptions = items.map((item: any) => ({
        label: item.BillingItemName?.trim(),
        value: String(item.BillingItemChargeId),
        BillingItemChargeId: item.BillingItemChargeId,
      }));

      const unique = allOptions.filter(
        (opt: any, i: number, arr: any[]) =>
          i ===
          arr.findIndex(
            (t) => t.BillingItemChargeId === opt.BillingItemChargeId
          )
      );

      setOptions(unique);
      return unique;
    } catch (err) {
      console.error("❌ Failed to fetch procedures:", err);
      return [];
    } finally {
      setLoadingProcedures(false); // ⬅️ STOP LOADING
    }
  };

  // fetchProcedures();

  useEffect(() => {
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
  // const handleCreateOption = async (inputValue: string) => {
  // const newTag = {
  //   ProcedureName: inputValue,
  //   specializationId: userprofiledata?.user?.SpecializationId || 0,
  //   ProcedureCode: "",
  //   createdBy: userprofiledata?.user?.UserId,
  // };

  //   try {
  //     const result = await addupdateProcedure(newTag);
  //     const newOption: Option = {
  //       label: result?.data?.ProcedureName || inputValue,
  //       value: result?.data?.ProcedureName || inputValue,
  //       ProcedureId: result?.data?.ProcedureId || 0,
  //     };

  //     setOptions((prev) => [...prev, newOption]);
  //     setProcedures((prev) => [...prev, newOption]);
  //   } catch (error) {
  //     console.error("Error creating procedure:", error);
  //   }
  // };

  // const selectedOptions: Option[] = procedures.map((proc: any) => ({
  //   label: proc.label,
  //   value: proc.label,
  //   ProcedureId: proc.ProcedureId ?? 0,
  // }));
  const handleCreateOption = async (inputValue: string) => {
    const name = inputValue.trim();
    if (!name) return;

    const newTag = {
      specializationId: userprofiledata?.user?.SpecializationId ?? undefined,
      hospitalId:
        UserHospitalData.hospitalSelection?.selectedHospital.hospital
          .HospitalId ?? undefined,
      BillingItemName: name,
      doctorId: userprofiledata?.user?.UserId,
      code: "",
      price: 0,
      maxDiscountPercent: 0,
      maxDiscountInr: 0,
      description: "",
      chargeTypeId: 2,
      createdBy: userprofiledata?.user?.UserId,
    };

    try {
      const saveResp = await createOrUpdateBillingItem(newTag);
      const newId = saveResp?.BillingItemChargeId;
      if (!newId) return;

      // ✅ 1) Add to dropdown immediately
      const newOption = {
        label: name,
        value: String(newId),
        BillingItemChargeId: newId,
      };

      setOptions((prev) => [...prev, newOption]);

      // ✅ 2) Select immediately
      setProcedures((prev) => [...prev, { label: name, ProcedureId: newId }]);

      // ✅ 3) Refresh silently (will not break UI)
      fetchProcedures();
    } catch (error) {
      console.error("❌ Error creating procedure:", error);
    }
  };

  const selectedOptions: Option[] = procedures.map((proc: any) => ({
    label: proc.label,
    value: proc.ProcedureId,
    BillingItemChargeId: proc.ProcedureId, // match options list
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
  useEffect(() => {
    const selectedIds = new Set(
      procedures.map((p: any) => String(p.ProcedureId))
    );

    const remaining = options.filter(
      (opt: any) => !selectedIds.has(String(opt.BillingItemChargeId))
    );

    setFilteredOptions(remaining);
  }, [options, procedures]);

  return (
    <Card className="p-6 rounded-2xl shadow-md border border-blue-100 bg-gradient-to-br from-white via-blue-50/30 to-white relative hover:shadow-xl hover:border-blue-300 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 font-semibold text-gray-800">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Microscope size={20} className="text-blue-600" />
        </div>
        <span className="text-lg">Procedures</span>
      </div>

      {/* Select Procedures */}
      <div className="mb-4 space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Select Procedures
        </label>
        <CreatableSelect
          isMulti
          isDisabled={disabled}
          options={filteredOptions}
          isLoading={loadingProcedures} // ⬅️ turn on spinner
          loadingMessage={() => (
            <div className="flex items-center gap-2 px-2 py-1 text-sm text-blue-600">
              <span className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></span>
              Loading procedures...
            </div>
          )}
          value={selectedOptions}
          onChange={(selected) => {
            setProcedures(
              (selected || []).map((opt) => ({
                label: opt.label,
                ProcedureId: Number(opt.BillingItemChargeId) || 0,
              }))
            );
          }}
          inputValue={procedureInputValue}
          onInputChange={(val) => setProcedureInputValue(val)}
          onCreateOption={handleCreateOption}
          placeholder="Type or search procedures..."
          classNamePrefix="react-select"
          isClearable={true}
          closeMenuOnSelect={false}
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : null
          }
          styles={{
            control: (provided, state) => ({
              ...provided,
              minHeight: "44px",
              borderColor: state.isFocused ? "#60a5fa" : "#bfdbfe",
              backgroundColor: state.isDisabled ? "#f3f4f6" : "white",
              boxShadow: state.isFocused ? "0 0 0 2px #dbeafe" : "none",
              transition: "all 0.2s ease",
              borderRadius: "0.875rem",
              "&:hover": {
                borderColor: state.isDisabled ? "#bfdbfe" : "#60a5fa",
              },
              cursor: state.isDisabled ? "not-allowed" : "pointer",
            }),
            valueContainer: (provided) => ({
              ...provided,
              padding: "6px 8px",
              overflow: "visible",
              zIndex: 1,
              gap: "4px",
            }),
            input: (provided) => ({
              ...provided,
              color: "#111827",
              zIndex: 1,
              cursor: "text",
            }),
            placeholder: (provided) => ({
              ...provided,
              color: "#9ca3af",
              fontSize: "14px",
            }),
            multiValue: (provided) => ({
              ...provided,
              backgroundColor: "#dbeafe",
              borderRadius: "6px",
              padding: "2px 6px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }),
            multiValueLabel: (provided) => ({
              ...provided,
              color: "#0369a1",
              fontSize: "13px",
              fontWeight: "500",
              padding: "0 4px",
            }),
            multiValueRemove: (provided) => ({
              ...provided,
              color: "#0369a1",
              cursor: "pointer",
              transition: "all 0.15s ease",
              padding: "0 2px",
              "&:hover": {
                backgroundColor: "#fca5a5",
                color: "#dc2626",
              },
            }),
            indicatorsContainer: (provided) => ({
              ...provided,
              zIndex: 10,
              position: "relative",
              display: "flex",
              gap: "0",
              padding: "0",
              alignItems: "center",
              pointerEvents: "auto",
            }),
            clearIndicator: (provided, state) => ({
              ...provided,
              zIndex: 10,
              position: "relative",
              visibility: state.hasValue ? "visible" : "hidden",
              opacity: state.hasValue ? 1 : 0,
              pointerEvents: state.hasValue ? "auto" : "none",
              padding: "8px",
              cursor: state.hasValue ? "pointer" : "default",
              color: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              "&:hover": {
                color: "#1d4ed8",
              },
            }),
            dropdownIndicator: (provided, state) => ({
              ...provided,
              zIndex: 10,
              position: "relative",
              padding: "8px",
              cursor: "pointer",
              color: state.isDisabled ? "#d1d5db" : "#9ca3af",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              transform: state.isFocused ? "rotate(180deg)" : "rotate(0deg)",
              "&:hover": {
                color: state.isDisabled ? "#d1d5db" : "#6b7280",
              },
            }),
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
              position: "absolute",
              backgroundColor: "white",
              border: "1px solid #bfdbfe",
              borderRadius: "12px",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              overflow: "hidden",
            }),
            menuList: (provided) => ({
              ...provided,
              zIndex: 9999,
              maxHeight: "200px",
              overflowY: "auto",
              padding: "8px 0",
              backgroundColor: "white",
              border: "none",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f5f9",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#cbd5e1",
                borderRadius: "4px",
                "&:hover": {
                  background: "#94a3b8",
                },
              },
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected
                ? "#dbeafe"
                : state.isFocused
                  ? "#eff6ff"
                  : "white",
              color: state.isSelected ? "#0369a1" : "#374151",
              cursor: "pointer",
              padding: "10px 16px",
              fontSize: "14px",
              fontWeight: state.isSelected ? "600" : "400",
              transition: "all 0.15s ease",
              "&:hover": {
                backgroundColor: state.isSelected ? "#dbeafe" : "#eff6ff",
                color: "#0369a1",
              },
            }),
            menuPortal: (provided) => ({
              ...provided,
              zIndex: 9999,
            }),
          }}
        />
      </div>

      {/* Procedures List */}
      {procedures.length > 0 ? (
        <div className="space-y-3">
          {procedures.map((item: any, index) => {
            const key = String(item.ProcedureId || item.label);
            const remarkValue = procedureremarkMap?.[key] ?? "";
            const expanded = expandedMap[key] ?? false;
            const isActiveField = activeKey === key;

            return (
              <div
                key={key}
                className={`p-4 bg-gradient-to-br from-blue-50/50 to-white rounded-lg border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 ${
                  expanded ? "ring-2 ring-blue-200" : ""
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <label className="font-semibold text-gray-800 text-sm">
                    {item.label}
                  </label>
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
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Add Remark Button */}
                {!expanded ? (
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedMap((prev) => ({ ...prev, [key]: true }));
                      requestAnimationFrame(() => {
                        setProcedureremarkMap((prev) => ({
                          ...prev,
                          [key]: prev[key] || "",
                        }));
                        setTimeout(() => {
                          const textarea = document.getElementById(
                            `remark-${key}`
                          );
                          if (textarea) textarea.focus();
                        }, 50);
                      });
                    }}
                    className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1.5 transition-all duration-200 hover:gap-2"
                  >
                    <MessageCirclePlus className="w-4 h-4" />
                    <span>Add Remark</span>
                  </button>
                ) : (
                  <div className="space-y-2 animate-fadeIn transition-all duration-300">
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
                        className="text-sm pr-12 rounded-xl no-scrollbar border-2 border-blue-200 hover:border-blue-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gradient-to-br from-blue-50/50 to-sky-50/30 placeholder:text-gray-400 text-gray-700 shadow-sm hover:shadow-md focus:shadow-lg min-h-[100px] p-4"
                      />

                      {/* Mic Button */}
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => handleMicClick(key)}
                        className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-200 ${
                          listening && isActiveField
                            ? "bg-red-100 hover:bg-red-200 shadow-md"
                            : "bg-white shadow-md hover:shadow-lg hover:bg-blue-50"
                        }`}
                      >
                        {listening && isActiveField ? (
                          <MicOff className="w-4 h-4 text-red-600 animate-pulse" />
                        ) : (
                          <Mic className="w-4 h-4 text-blue-500" />
                        )}
                      </button>
                    </div>

                    {/* Status Text */}
                    <p className="text-xs text-gray-500 font-medium">
                      {listening && isActiveField
                        ? "🎤 Listening... Speak now"
                        : "🎙️ Click mic to dictate"}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          const updated = { ...procedureremarkMap };
                          delete updated[key];
                          setProcedureremarkMap(updated);
                          toggleExpanded(key, false);
                        }}
                        className="flex-1 px-3 py-2 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                      >
                        Clear
                      </button>

                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          const updated = { ...procedureremarkMap };
                          delete updated[key];
                          setProcedureremarkMap(updated);
                          setProcedures((prev) =>
                            prev.filter(
                              (p) => p.ProcedureId !== item.ProcedureId
                            )
                          );
                          toggleExpanded(key, false);
                        }}
                        className="flex-1 px-3 py-2 text-xs font-medium bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">
          <Microscope className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No procedures selected</p>
          <p className="text-xs mt-1">
            Select procedures from the dropdown above
          </p>
        </div>
      )}
    </Card>
  );
}
