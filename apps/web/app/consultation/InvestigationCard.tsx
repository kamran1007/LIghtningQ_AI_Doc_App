// Improved InvestigationCard with better speech recognition handling

"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CreatableSelect from "react-select/creatable";
import { StylesConfig } from "react-select";

import {
  PlusCircle,
  Microscope,
  MicOff,
  Mic,
  Trash2,
  MessageCirclePlus,
} from "lucide-react";
import { AddUpdateInvestigation, FetchInvestigation } from "@/lib/consultation";
import { getProfile } from "@/lib/action";
import Select from "react-select";
import { useFieldSpeechRecognition } from "./useFieldSpeechRecognition";
import chroma from "chroma-js";

const InvestigationCard = ({
  disabled,
  investigationCategories,
  setInvestigationCategories,
  customCategory,
  setCustomCategory,
  InvestigationSubTypename,
  setCustomInvestigation,
  form,
  setForm,
  customStyles = {},
}: any) => {
  const [investigationOptions, setInvestigationOptions] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userprofiledata, setUserprofiledata] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");
  const [activeField, setActiveField] = useState<string | null>(null);

  // Speech recognition with proper field handling
  const {
    transcript,
    interimTranscript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
    lastTranscriptRef,
  } = useFieldSpeechRecognition({
    fieldKey: activeField || "default",
    onTranscript: (fieldKey, text) => {
      if (fieldKey && fieldKey !== "default") {
        const prevTranscript = lastTranscriptRef.current[fieldKey] || "";
        const newPart = text.replace(prevTranscript, "").trim();

        if (newPart) {
          setForm((prev: any) => ({
            ...prev,
            investigationRemarks: {
              ...prev.investigationRemarks,
              [fieldKey]:
                (prev.investigationRemarks?.[fieldKey] || "") + " " + newPart,
            },
          }));
          lastTranscriptRef.current[fieldKey] = text; // update cache
        }
      }
    },
  });

  useEffect(() => {
    fetchOptions();
  }, []);

  // Debug effect to monitor transcript changes
  useEffect(() => {
    if (transcript && activeField) {
      console.log("Transcript changed:", transcript, "for field:", activeField);
      console.log(
        "Current form state:",
        form.investigationRemarks?.[activeField]
      );
    }
  }, [transcript, activeField, form.investigationRemarks]);

  const fetchOptions = async () => {
    try {
      const resp = await getProfile();
      setUserprofiledata(resp);
      const res = await FetchInvestigation();

      const categories =
        res?.data?.investigationTypeData?.map((cat: any) => ({
          label: cat.InvestigationType,
          value: cat.InvestigationTypeId,
        })) || [];

      const groupedOptions =
        res?.data?.consultationInvestigation?.map((group: any) => ({
          label: group.InvestigationType,
          options: (group.options || []).map((opt: any) => ({
            label: opt.subInveatigationType,
            value: opt.value,
            color: opt.color,
            InvestigationSubTypeId: opt.InvestigationSubTypeId,
            InvestigationTypeId: group.InvestigationTypeId,
            InvestigationType: group.InvestigationType,
          })),
        })) || [];

      setInvestigationOptions(groupedOptions);
      setInvestigationCategories(categories);
    } catch (error) {
      console.error("Error fetching investigations:", error);
    }
  };

  const handleAddCustom = async () => {
    if (!InvestigationSubTypename?.trim()) return;
    try {
      await AddUpdateInvestigation({
        InvestigationSubTypename: InvestigationSubTypename.trim(),
        InvestigationTypeId: parseInt(customCategory, 10),
      });
      await fetchOptions();
      setCustomInvestigation("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to add investigation subtype:", error);
    }
  };

  const handleMicClick = (invValue: string) => {
    if (listening && activeField === invValue) {
      // Stop current recording
      stopListening();
      setActiveField(null);
    } else {
      // Start recording for this field
      if (listening) {
        // Stop any current recording first
        stopListening();
      }
      setActiveField(invValue);
      resetTranscript(); // Small delay to ensure previous recording is stopped
      setTimeout(() => {
        startListening();
      }, 150);
    }
  };

  const handleAddRemark = (id: string) => {
    setForm((prev: any) => ({
      ...prev,
      investigationRemarks: {
        ...prev.investigationRemarks,
        [id]: "", // only now we create remark field
      },
    }));
  };

  const customsStyles: StylesConfig<any, true> = {
    control: (base) => ({
      ...base,
      minHeight: 44,
      fontSize: 14,
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "4px 6px",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#E0F2FE",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#0369A1",
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: 14,
    }),
  };

  return (
    <Card className="p-4 rounded-xl shadow-sm border bg-white w-full hover:shadow-xl hover:border-pink-300">
      <div className="flex items-center gap-2 mb-2 font-semibold text-gray-800">
        <Microscope size={18} className="text-pink-600" /> Investigations
      </div>

      <div className="space-y-2">
        <Label className="text-sm block mb-1">Select Investigations</Label>
        <Select
          isMulti
          isDisabled={disabled}
          options={investigationOptions}
          value={form.investigations}
          onChange={(selectedOptions) => {
            setForm((prev: any) => ({
              ...prev,
              investigations: selectedOptions,
              // ❌ don't auto-add remark here
              investigationRemarks: { ...prev.investigationRemarks },
            }));
          }}
          onInputChange={(value) => setInputValue(value)}
          placeholder="Select or search investigations..."
          className="text-sm w-full border border-pink-200 focus:border-pink-300 focus:ring-pink-200"
          classNamePrefix="react-select"
          styles={{
            ...customStyles,
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            menu: (base) => ({ ...base, zIndex: 9999, position: "absolute" }),
            menuList: (base, state) => ({
              ...base,
              maxHeight: "200px",
              overflowY: "auto",
              borderColor: state.isFocused ? "#f9a8d4" : "#fbcfe8", // pink-300 on focus, pink-200 default
              boxShadow: state.isFocused ? "0 0 0 1px #f9a8d4" : "none",
              "&:hover": {
                borderColor: "#f9a8d4", // keep pink on hover
              },
            }),
          }}
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : null
          }
          noOptionsMessage={() =>
            inputValue && !showCreateForm ? (
              <div className="flex justify-between items-center text-sm px-2 py-1">
                <span className="text-gray-600">Not found?</span>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setShowCreateForm(true);
                  }}
                  className="text-pink-400 hover:underline ml-2"
                >
                  ➕ Add New
                </button>
              </div>
            ) : null
          }
        />
      </div>

      {showCreateForm && (
        <div className="mt-3 flex items-center gap-2">
          <CreatableSelect
            options={investigationCategories}
            isDisabled={disabled}
            value={investigationCategories.find(
              (c) => c.value === customCategory
            )}
            onChange={(selectedOption) =>
              setCustomCategory(selectedOption?.value || "")
            }
            classNamePrefix="react-select"
            className="text-sm w-[220px]"
            isSearchable={false}
            placeholder="Select category"
            menuPortalTarget={
              typeof window !== "undefined" ? document.body : null
            }
            menuPosition="fixed"
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              menu: (base) => ({ ...base, zIndex: 9999, position: "absolute" }),
              menuList: (base) => ({
                ...base,
                maxHeight: "200px",
                overflowY: "auto",
              }),
            }}
          />

          <Input
            placeholder="Add custom investigation..."
            value={InvestigationSubTypename}
            onChange={(e) => setCustomInvestigation(e.target.value)}
            className="text-sm"
          />
          <Button type="button" onClick={handleAddCustom} size="icon">
            <PlusCircle className="w-5 h-5" />
          </Button>
        </div>
      )}

      {form.investigations?.map((inv: any, index: number) => {
        const hasRemark = form.investigationRemarks?.[inv.value] !== undefined;
        const remarkValue = form.investigationRemarks?.[inv.value] || "";
        const isActiveField = activeField === inv.value;

        return (
          <div
            key={inv.value}
            className={`mt-2 ${index > 0 ? "border-t border-pink-200 pt-2" : ""}`}
          >
            {" "}
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">
                {inv.label}
              </label>
            </div>
            {/* If no remark yet → show Add Remark button */}
            {!hasRemark && (
              <button
                type="button"
                onClick={() => handleAddRemark(inv.value)}
                className="mt-2 text-xs text-pink-400 hover:underline flex items-center gap-1"
              >
                <MessageCirclePlus className="w-4 h-4" />
                <span>Add {inv.label} Remark</span>
              </button>
            )}
            {/* If remark exists → show textarea + controls */}
            {hasRemark && (
              <div className="w-full">
                <div className="relative">
                  <Textarea
                  disabled={disabled}
                    className="mt-1 pr-10 resize-none rounded-2xl border-2 border-pink-200 hover:border-pink-300 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 no-scrollbar bg-gradient-to-br from-pink-50/50 to-rose-50/30 placeholder:text-gray-400 placeholder:font-light text-gray-700 leading-relaxed tracking-wide shadow-sm hover:shadow-md focus:shadow-lg backdrop-blur-sm min-h-[100px] p-4"
                    placeholder={`Enter remark for ${inv.label}...`}
                    value={remarkValue}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        investigationRemarks: {
                          ...prev.investigationRemarks,
                          [inv.value]: e.target.value,
                        },
                      }));
                    }}
                    style={{
                      fontFamily:
                        '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: "14px",
                      lineHeight: "1.6",
                      letterSpacing: "0.025em",
                    }}
                  />

                  {/* Show interim transcript as overlay when listening */}
                  {listening && isActiveField && interimTranscript && (
                    <div className="absolute inset-0 mt-1 px-3 py-2 pointer-events-none">
                      <span className="text-gray-400 italic">
                        {remarkValue}
                        {remarkValue && " "}
                        {/* {interimTranscript} */}
                      </span>
                    </div>
                  )}

                  {/* Mic button */}
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => handleMicClick(inv.value)}
                    className={`absolute bottom-2 right-2 p-1 rounded-full transition ${
                      listening && isActiveField
                        ? "bg-red-100 hover:bg-red-200"
                        : "bg-white shadow hover:bg-gray-50"
                    }`}
                  >
                    {listening && isActiveField ? (
                      <MicOff className="w-4 h-4 text-red-600 animate-pulse" />
                    ) : (
                      <Mic className="w-4 h-4 text-pink-400" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {listening && isActiveField
                    ? `Listening... ${interimTranscript ? `(Processing: "${interimTranscript}")` : "Speak now"}`
                    : "Click mic to dictate"}
                </p>

                <div className="flex gap-2 mt-1">
                  {/* Clear remark text */}
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      if (listening && isActiveField) {
                        stopListening();
                        setActiveField(null);
                      }
                      setForm((prev: any) => ({
                        ...prev,
                        investigationRemarks: {
                          ...prev.investigationRemarks,
                          [inv.value]: "",
                        },
                      }));
                    }}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Clear
                  </button>

                  {/* Remove remark field */}
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      if (listening && isActiveField) {
                        stopListening();
                        setActiveField(null);
                      }
                      const updatedRemarks = { ...form.investigationRemarks };
                      delete updatedRemarks[inv.value];
                      setForm((prev: any) => ({
                        ...prev,
                        investigationRemarks: updatedRemarks,
                      }));
                    }}
                    className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </Card>
  );
};

export default InvestigationCard;
