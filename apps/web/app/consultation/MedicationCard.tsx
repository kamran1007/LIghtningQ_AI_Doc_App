// components/MedicationCard.tsx
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
import { X, Pill } from "lucide-react";
import DrugAutocompleteInput from "@/components/DrugAutocompleteInput";

interface Medication {
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
  durationUnit?: string;
  notes: string;
}

interface MedicationCardProps {
  medications: Medication[];
  handleMedicationChange: (
    index: number,
    field: keyof Medication,
    value: string
  ) => void;
  handleAddMedication: () => void;
  handleRemoveMedication: (index: number) => void;
}

export default function MedicationCard({
  medications,
  handleMedicationChange,
  handleAddMedication,
  handleRemoveMedication,
}: MedicationCardProps) {
  return (
    <Card className="p-4 rounded-xl shadow-sm border bg-white md:col-span-2 hover:shadow-xl hover:border-indigo-300">
      <div className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
        <Pill size={18} className="text-indigo-600" />
        Prescription & Medication
      </div>

      {medications.map((med, index) => (
        <div
          key={index}
          className="relative grid grid-cols-6 gap-2 mb-2 p-4 rounded-lg border border-gray-200 bg-gray-50"
        >
          <DrugAutocompleteInput
            value={med.drug}
            onChange={(val) => handleMedicationChange(index, "drug", val)}
          />

          <Select
            value={med.dosage}
            onValueChange={(value) =>
              handleMedicationChange(index, "dosage", value)
            }
          >
            <SelectTrigger className="col-span-1">
              <SelectValue placeholder="Dosage" />
            </SelectTrigger>
            <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
              {" "}
              {["0.5", "1", "2", "5"].map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={med.frequency}
            onValueChange={(value) =>
              handleMedicationChange(index, "frequency", value)
            }
          >
            <SelectTrigger className="col-span-1">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
              {" "}
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

          <div className="flex gap-2 col-span-2">
            <div className="!w-60">
              <Input
                type="number"
                placeholder="Duration"
                value={med.duration}
                onChange={(e) =>
                  handleMedicationChange(index, "duration", e.target.value)
                }
              />
            </div>

            <Select
              value={med.durationUnit || "Days"}
              onValueChange={(value) =>
                handleMedicationChange(index, "durationUnit", value)
              }
            >
              <SelectTrigger className="min-w-[80px]">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                {" "}
                {[
                  "Days",
                  "Weeks",
                  "Months",
                  "Years",
                  "Life Time",
                  "To Be Continued",
                ].map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            placeholder="Notes"
            value={med.notes}
            onChange={(e) =>
              handleMedicationChange(index, "notes", e.target.value)
            }
            className="col-span-1"
          />

          <button
            type="button"
            onClick={() => handleRemoveMedication(index)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddMedication}
          className="border-[#22E0D4] text-gray-700 hover:bg-gray-100"
        >
          + Add Medication
        </Button>
      </div>
    </Card>
  );
}
