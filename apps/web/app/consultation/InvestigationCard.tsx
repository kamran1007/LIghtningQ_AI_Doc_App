// Updated InvestigationCard with per-field mic control

"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CreatableSelect from "react-select/creatable";
import { PlusCircle, Microscope, MicOff, Mic, Trash2 } from "lucide-react";
import { AddUpdateInvestigation, FetchInvestigation } from "@/lib/consultation";
import { getProfile } from "@/lib/action";
import Select from "react-select";
import { useFieldSpeechRecognition } from "./useFieldSpeechRecognition";

const InvestigationCard = ({
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
  const [listeningField, setListeningField] = useState<string | null>(null);

  useEffect(() => {
    fetchOptions();
  }, []);

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

  return (
    <Card className="p-4 rounded-xl shadow-sm border bg-white w-full hover:shadow-xl hover:border-pink-300">
      <div className="flex items-center gap-2 mb-2 font-semibold text-gray-800">
        <Microscope size={18} className="text-pink-600" /> Investigations
      </div>

      <div className="space-y-2">
        <Label className="text-sm block mb-1">Select Investigations</Label>
        <Select
          isMulti
          options={investigationOptions}
          value={form.investigations}
          onChange={(selectedOptions) => {
            setForm((prev: any) => {
              const newRemarks = { ...prev.investigationRemarks };
              selectedOptions.forEach((option: any) => {
                if (!newRemarks[option.value]) newRemarks[option.value] = "";
              });
              return {
                ...prev,
                investigations: selectedOptions,
                investigationRemarks: newRemarks,
              };
            });
          }}
          onInputChange={(value) => setInputValue(value)}
          placeholder="Select or search investigations..."
          className="text-sm w-full"
          classNamePrefix="react-select"
          styles={{
            ...customStyles,
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            menu: (base) => ({ ...base, zIndex: 9999, position: "absolute" }),
            menuList: (base) => ({
              ...base,
              maxHeight: "200px",
              overflowY: "auto",
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
                  className="text-blue-500 hover:underline ml-2"
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

      {form.investigations?.map((inv: any) => {
        const remark = form.investigationRemarks?.[inv.value] || "";
        const {
          transcript,
          listening,
          startListening,
          stopListening,
          resetTranscript,
        } = useFieldSpeechRecognition(inv.value);

        useEffect(() => {
          if (transcript) {
            setForm((prev: any) => {
              const existingRemark =
                prev.investigationRemarks?.[inv.value] || "";
              return {
                ...prev,
                investigationRemarks: {
                  ...prev.investigationRemarks,
                  [inv.value]: `${existingRemark} ${transcript}`.trim(),
                },
              };
            });
          }
        }, [transcript]);

        return (
          <div key={inv.value} className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">
                {inv.label}
              </label>
              <button
                type="button"
                onClick={() => {
                  const updatedRemarks = { ...form.investigationRemarks };
                  updatedRemarks[inv.value] = "";
                  setForm((prev: any) => ({
                    ...prev,
                    investigationRemarks: updatedRemarks,
                  }));
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full">
              <Textarea
                className="mt-1"
                placeholder={`Enter remark for ${inv.label}...`}
                value={remark}
                onChange={(e) => {
                  const updatedRemarks = {
                    ...form.investigationRemarks,
                    [inv.value]: e.target.value,
                  };
                  setForm((prev: any) => ({
                    ...prev,
                    investigationRemarks: updatedRemarks,
                  }));
                }}
              />
              <button
                type="button"
                onClick={() => (listening ? stopListening() : startListening())}
                className={`absolute right-2 bottom-4 p-0.5 rounded-full transition ${
                  listening
                    ? "bg-red-100 hover:bg-red-200"
                    : "bg-blue-100 hover:bg-blue-200"
                }`}
              >
                {listening ? (
                  <MicOff className="w-5 h-5 text-red-600 animate-pulse" />
                ) : (
                  <Mic className="w-5 h-5 text-[#22E0D4]" />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </Card>
  );
};

export default InvestigationCard;
