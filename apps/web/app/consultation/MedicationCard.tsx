"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { X, Pill, Loader2Icon, Plus } from "lucide-react";
import DrugAutocompleteInput from "@/components/DrugAutocompleteInput";
import { Medication } from "@/types/consultation";

interface MedicationCardProps {
  disabled: boolean;
  medications: Medication[];
  handleMedicationChange: (
    index: number,
    field: keyof Medication,
    value: string
  ) => void;
  handleAddMedication: () => void | Promise<void>;
  handleRemoveMedication: (index: number) => void;
}

export default function MedicationCard({
  disabled,
  medications,
  handleMedicationChange,
  handleAddMedication,
  handleRemoveMedication,
}: MedicationCardProps) {
  const [isSaving, setIsSaving] = useState(false);

  // ⏳ Wrapper for async or delayed add action
  const handleAddMedicationWithLoader = async () => {
    try {
      setIsSaving(true);
      await Promise.resolve(handleAddMedication()); // support async or sync handler
    } catch (error) {
      console.error("Error adding medication:", error);
    } finally {
      setTimeout(() => setIsSaving(false), 400); // slight delay for smoother UX
    }
  };

  return (
    <Card className="p-4 rounded-xl shadow-sm border bg-white md:col-span-2 hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
        <Pill size={18} className="text-indigo-600" />
        Prescription & Medication
      </div>

      {medications.length === 0 && (
        <p className="text-gray-400 text-sm italic mb-2">
          No medications added yet. Click “Add Medication” below.
        </p>
      )}

      {medications.map((med, index) => (
        <div
          key={index}
          className="relative grid grid-cols-6 gap-2 mb-3 p-3 rounded-lg border border-gray-200 bg-gray-50/80 hover:border-indigo-200 transition-all"
        >
          {/* ❌ Remove button */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleRemoveMedication(index)}
            className="absolute top-1 right-1 text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>

          {/* 🧪 Medication Name */}
          <DrugAutocompleteInput
            value={med.medicationName}
            onChange={(val) =>
              handleMedicationChange(index, "medicationName", val)
            }
            disabled={disabled}
          />

          {/* 💊 Dosage */}
          <Select
            value={med.dosage}
            disabled={disabled}
            onValueChange={(value) =>
              handleMedicationChange(index, "dosage", value)
            }
          >
            <SelectTrigger className="col-span-1">
              <SelectValue placeholder="Dosage" />
            </SelectTrigger>
            <SelectContent className="border-gray-300 shadow-2xl rounded-2xl">
              {["0.5", "1", "2", "5"].map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* ⏱ Frequency */}
          <Select
            value={med.frequency}
            disabled={disabled}
            onValueChange={(value) =>
              handleMedicationChange(index, "frequency", value)
            }
          >
            <SelectTrigger className="col-span-1">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent className="border-gray-300 shadow-2xl rounded-2xl">
              {[
                "Once a day",
                "Twice a day",
                "Three times a day",
                "0-1-0",
                "1-0-1",
                "1-1-1",
                "At Night",
                "SOS",
              ].map((freq) => (
                <SelectItem key={freq} value={freq}>
                  {freq}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* ⏳ Duration + Unit */}
          <div className="flex gap-2 col-span-2">
            <Input
              type="number"
              disabled={disabled}
              placeholder="Duration"
              value={med.duration}
              onChange={(e) =>
                handleMedicationChange(index, "duration", e.target.value)
              }
              className="text-sm"
            />

            <Select
              value={med.unit || "Days"}
              disabled={disabled}
              onValueChange={(value) =>
                handleMedicationChange(index, "unit", value)
              }
            >
              <SelectTrigger className="min-w-[90px]">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent className="border-gray-300 shadow-2xl rounded-2xl">
                {[
                  "Days",
                  "Weeks",
                  "Months",
                  "Years",
                  "Lifetime",
                  "To Be Continued",
                ].map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 📝 Remarks */}
          <div className="col-span-1">
            <Input
              placeholder="Remarks"
              disabled={disabled}
              value={med.remarks}
              onChange={(e) =>
                handleMedicationChange(index, "remarks", e.target.value)
              }
              className="text-sm"
            />
          </div>
        </div>
      ))}

      {/* ➕ Add Medication Button */}
      <div className="flex justify-end mt-3">
        <Button
          variant="outline"
          disabled={disabled || isSaving}
          size="sm"
          onClick={handleAddMedicationWithLoader}
          className="border-[#22E0D4] text-gray-700 hover:bg-gray-100 flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2Icon className="animate-spin text-indigo-500 w-4 h-4" />
              <span className="text-indigo-600 font-medium">Adding...</span>
            </>
          ) : (
            <>
              <Plus className="text-indigo-600 w-4 h-4" />
              <span className="text-gray-700 font-medium">
                Add Medication
              </span>
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
