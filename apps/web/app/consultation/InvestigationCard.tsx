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
  MessageCirclePlus,
} from "lucide-react";
import { AddUpdateInvestigation, FetchInvestigation } from "@/lib/consultation";
import { getProfile } from "@/lib/action";
import Select from "react-select";
import { useFieldSpeechRecognition } from "./useFieldSpeechRecognition";

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
  const [filteredInvestigationOptions, setFilteredInvestigationOptions] =
    useState<any[]>([]);

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

  // 🧠 Utility to normalize investigation options into a consistent shape
  useEffect(() => {
    if (
      !Array.isArray(investigationOptions) ||
      investigationOptions.length === 0
    )
      return;

    const selectedValues = new Set(
      (form.investigations || []).map((inv: any) => String(inv?.value))
    );

    const filtered = investigationOptions
      .map((group: any) => {
        const normalizedOptions = (group.options || []).map((opt: any) => ({
          label:
            opt.label ||
            opt.subInveatigationType ||
            opt.InvestigationSubType ||
            opt.InvestigationType ||
            "Unnamed",
          value: String(
            opt.value ||
              opt.InvestigationSubTypeId ||
              opt.InvestigationId ||
              opt.InvestigationTypeId
          ),
          InvestigationSubTypeId:
            opt.InvestigationSubTypeId || opt.InvestigationId || null,
          InvestigationTypeId: opt.InvestigationTypeId || null,
        }));

        const remaining = normalizedOptions.filter(
          (opt: any) => !selectedValues.has(String(opt.value))
        );

        if (remaining.length === 0) return null;
        return {
          label: group.label || group.InvestigationType || "Other",
          options: remaining,
        };
      })
      .filter(Boolean);

    setFilteredInvestigationOptions(filtered);
  }, [investigationOptions, form.investigations]);

  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  const toggleExpanded = (key: string, value: boolean) => {
    setExpandedMap((prev) => ({ ...prev, [key]: value }));
  };

  return (
  <Card className="p-4 rounded-xl shadow-sm border bg-white w-full hover:shadow-xl hover:border-pink-300">
    <div className="flex items-center gap-2 mb-2 font-semibold text-gray-800">
      <Microscope size={18} className="text-pink-600" /> Investigations
    </div>

    {/* Select Investigations */}
    <div className="space-y-2">
      <Label className="text-sm block mb-1">Select Investigations</Label>
      <Select
        isMulti
        isDisabled={disabled}
        options={filteredInvestigationOptions}
        value={(form.investigations || []).map((v: any) => ({
          ...v,
          value: String(v.value || v.InvestigationSubTypeId),
        }))}
        getOptionValue={(option) => String(option.value)}
        getOptionLabel={(option) => option.label}
        onChange={(selectedOptions) => {
          const optionsArray = Array.isArray(selectedOptions)
            ? [...selectedOptions]
            : [];

          const normalized = optionsArray.map((opt: any) => ({
            ...opt,
            value: String(
              opt.value || opt.InvestigationSubTypeId || opt.InvestigationId
            ),
            label:
              opt.label ||
              opt.subInveatigationType ||
              opt.InvestigationSubType ||
              "Unnamed",
          }));

          const seen = new Set<string>();
          const unique: {
            value: string;
            label: string;
            [key: string]: any;
          }[] = [];
          let duplicateDetected = false;

          for (const opt of normalized) {
            if (seen.has(opt.value)) {
              duplicateDetected = true;
              continue;
            }
            seen.add(opt.value);
            unique.push(opt);
          }

          if (duplicateDetected) {
            alert("⚠️ This investigation is already selected.");
          }

          // Keep old remarks if already present
          setForm((prev: any) => ({
            ...prev,
            investigations: unique,
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
          menuList: (base) => ({
            ...base,
            maxHeight: "200px",
            overflowY: "auto",
            borderColor: "#fbcfe8",
            "&:hover": { borderColor: "#f9a8d4" },
          }),
          control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? "#f9a8d4" : "#fbcfe8",
            boxShadow: state.isFocused ? "0 0 0 1px #f9a8d4" : "none",
            "&:hover": { borderColor: "#f9a8d4" },
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

    {/* Create New Investigation */}
    {showCreateForm && (
      <div className="mt-3 flex items-center gap-2">
        <CreatableSelect
          options={investigationCategories}
          isDisabled={disabled}
          value={investigationCategories.find(
            (c: any) => c.value === customCategory
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

    {/* Investigation List */}
    {form.investigations?.map((inv: any, index: number) => {
      const key = inv.value;
      const remarkValue = form.investigationRemarks?.[key] || "";
      const isActiveField = activeField === key;

      // Auto-expand if remark has value
      const expanded =
        expandedMap[key] ?? (!!remarkValue && remarkValue.trim() !== "");

      return (
        <div
          key={key}
          className="mt-2 border-t border-pink-100 pt-2 transition-all duration-300"
        >
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">
              {inv.label}
            </label>
          </div>

          {/* Add Remark */}
          {!expanded && (
            <button
              type="button"
              onClick={() => {
                toggleExpanded(key, true);
                setForm((prev: any) => ({
                  ...prev,
                  investigationRemarks: {
                    ...prev.investigationRemarks,
                    [key]: prev.investigationRemarks?.[key] || "",
                  },
                }));
              }}
              className="mt-1 text-xs text-pink-400 hover:underline flex items-center gap-1"
            >
              <MessageCirclePlus className="w-4 h-4" />
              <span>Add {inv.label} Remark</span>
            </button>
          )}

          {/* Collapsible Remark Section */}
          {expanded && (
            <div className="w-full animate-fadeIn mt-2 transition-all duration-500 ease-in-out">
              <div className="relative">
                <Textarea
                  disabled={disabled}
                  className="mt-1 pr-10 resize-none rounded-2xl border-2 border-pink-200 hover:border-pink-300 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 bg-gradient-to-br from-pink-50/50 to-rose-50/30 placeholder:text-gray-400 text-gray-700 shadow-sm hover:shadow-md focus:shadow-lg min-h-[100px] p-4"
                  placeholder={`Enter remark for ${inv.label}...`}
                  value={remarkValue}
                  onChange={(e) =>
                    setForm((prev: any) => ({
                      ...prev,
                      investigationRemarks: {
                        ...prev.investigationRemarks,
                        [key]: e.target.value,
                      },
                    }))
                  }
                />

                {/* Mic button */}
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
                    <Mic className="w-4 h-4 text-pink-400" />
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                {listening && isActiveField
                  ? `Listening... ${
                      interimTranscript
                        ? `(Processing: "${interimTranscript}")`
                        : "Speak now"
                    }`
                  : "Click mic to dictate"}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    const updated = { ...form.investigationRemarks };
                    delete updated[key];
                    setForm((prev: any) => ({
                      ...prev,
                      investigationRemarks: updated,
                    }));
                    toggleExpanded(key, false);
                  }}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Clear
                </button>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    const updated = { ...form.investigationRemarks };
                    delete updated[key];
                    setForm((prev: any) => ({
                      ...prev,
                      investigationRemarks: updated,
                    }));
                    toggleExpanded(key, false);
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
