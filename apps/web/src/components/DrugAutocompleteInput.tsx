"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { addupdateMedicine, FetchMedication } from "@/lib/consultation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toast } from "primereact/toast";
interface DrugAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean; // ✅ make it optional
}

interface Medicine {
  MedicineId: number;
  MedicineName: string;
  OnlyMedicineName: string;
  IsFrequent: string;
  [key: string]: any; // allow other props
}
const addMedicineSchema = z.object({
  MedicineName: z.string().min(1, "Medicine name is required"),
  OnlyMedicineName: z.string().min(1, "Only medicine name is required"),
  Strength: z.string().optional(),
  Units: z.string().optional(),
  MedicineUnitId: z.coerce.number().optional(),
  ScheduleType: z.string().optional(),
  MedicineTypeName: z.string().optional(),
  MedicineType: z.coerce.number().optional(),
  HSNCode: z.string().optional(),
  Instructions: z.string().optional(),
  GenericName: z.string().optional(),
  ScheduleTypeId: z.coerce.number().optional(),
  UserId: z.coerce.number().optional(),
  AvailableStock: z.coerce.number().optional(),
  HospitalId: z.coerce.number().optional(),
  pharmacyPrice: z.coerce.number().optional(),
  CategoryId: z.coerce.number().optional(),
  IsFrequent: z.string().optional(),
});

export default function DrugAutocompleteInput({
  value,
  onChange,
  disabled = false,
}: DrugAutocompleteInputProps) {
  const [options, setOptions] = useState<Medicine[]>([]);
  const [filtered, setFiltered] = useState<Medicine[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const toast = useRef<Toast>(null);

  // Fetch medication list on mount
  // ✅ Define it outside so it's accessible
  const fetchDrugs = async () => {
    try {
      const res = await FetchMedication();
      console.log("Fetched drugs:", res);
      setOptions(res?.return || []);
    } catch (err) {
      console.error("Failed to fetch medicine list:", err);
    }
  };

  // 📦 Call inside useEffect
  useEffect(() => {
    fetchDrugs();
  }, []);

  // Update filtered suggestions whenever value changes
  useEffect(() => {
    const safeValue = value?.toString().trim() || ""; // ✅ prevent undefined errors

    if (safeValue) {
      const search = safeValue.toLowerCase();
      const match = options.filter((option) => {
        const medicineName = option.MedicineName?.toLowerCase() || "";
        const onlyName = option.OnlyMedicineName?.toLowerCase() || "";
        return medicineName.includes(search) || onlyName.includes(search);
      });
      setFiltered(match);
    } else {
      // Show top 15 items: 10 frequent + 5 others
      const frequent = options
        .filter((option) => option.IsFrequent === "Y")
        .slice(0, 10);
      const others = options
        .filter((option) => option.IsFrequent !== "Y")
        .slice(0, 5);
      setFiltered([...frequent, ...others]);
    }
  }, [value, options]);

  // Determine display text: if search matches the MedicineName, show it; otherwise fallback
  const getDisplayText = (med: Medicine): string => {
    const search = value.toLowerCase();
    const medicineName = med.MedicineName || "";
    const onlyName = med.OnlyMedicineName || "";
    if (medicineName.toLowerCase().includes(search)) {
      return medicineName;
    }
    return onlyName || medicineName;
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addMedicineSchema),
  });
  const onSubmit = async (formData: any) => {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, v]) => v !== "" && v !== null && v !== undefined
        )
      );
      const result = await addupdateMedicine(cleanedData);
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Medicine Added successfully",
        life: 4000,
        // className: "custom-toast-container",
      });
      reset(); // clear form
      setOpenAddDialog(false);
      fetchDrugs(); // refresh options
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to add medicine",
        life: 4000,
        className: "custom-toast-container",
      });
      console.error("Add medicine failed", err);
    }
  };
  return (
    <>
      <Toast ref={toast} />

      <div className="relative w-full">
        <Input
          value={value ?? ""}
          disabled={disabled}
          placeholder="Drug Name"
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        />

        {showSuggestions && (
          <ul className="absolute z-50 bg-white border border-gray-300 shadow-lg w-full max-h-40 overflow-y-auto rounded-md text-sm mt-1">
            {filtered.map((med) => (
              <li
                key={med.MedicineId}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => {
                  onChange(getDisplayText(med));
                  setShowSuggestions(false);
                }}
              >
                {getDisplayText(med)}
              </li>
            ))}

            {filtered.length === 0 && value.trim() !== "" && (
              <li className="px-3 py-2 text-gray-600 bg-yellow-50 flex justify-between items-center">
                <span>No match found</span>
                <button
                  onMouseDown={() => setOpenAddDialog(true)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  + Add Drug
                </button>
              </li>
            )}
          </ul>
        )}

        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogContent className="no-scrollbar max-h-[70vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-sans">Add New Drug</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-sans">
                    Medicine Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("MedicineName")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                    placeholder="e.g. Paracetamol"
                  />
                  {errors.MedicineName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.MedicineName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-sans">
                    Only Medicine Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("OnlyMedicineName")}
                    className="w-full px-4 py-2 border  border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                    placeholder="e.g. PCM"
                  />
                  {errors.OnlyMedicineName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.OnlyMedicineName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <input
                  {...register("GenericName")}
                  placeholder="Generic Name"
                  className="input-style"
                />
                <input
                  {...register("Strength")}
                  placeholder="Strength"
                  className="input-style"
                />
                <input
                  {...register("Units")}
                  placeholder="Units"
                  className="input-style"
                />
                <input
                  {...register("MedicineUnitId")}
                  placeholder="Medicine Unit ID"
                  className="input-style"
                />
                <input
                  {...register("MedicineType")}
                  placeholder="Medicine Type ID"
                  className="input-style"
                />
                <input
                  {...register("MedicineTypeName")}
                  placeholder="Type Name"
                  className="input-style"
                />
                <input
                  {...register("ScheduleTypeId")}
                  placeholder="Schedule ID"
                  className="input-style"
                />
                <input
                  {...register("ScheduleType")}
                  placeholder="Schedule Type"
                  className="input-style"
                />
                <input
                  {...register("HSNCode")}
                  placeholder="HSN Code"
                  className="input-style"
                />
                <input
                  {...register("Instructions")}
                  placeholder="Instructions"
                  className="input-style"
                />
                <input
                  {...register("pharmacyPrice")}
                  placeholder="Pharmacy Price"
                  className="input-style"
                />
                <input
                  {...register("AvailableStock")}
                  placeholder="Available Stock"
                  className="input-style"
                />
                <input
                  {...register("CategoryId")}
                  placeholder="Category ID"
                  className="input-style"
                />
                <input
                  {...register("IsFrequent")}
                  placeholder="Is Frequent (Y/N)"
                  className="input-style"
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-4 bg-primary text-white py-2 rounded-xl hover:bg-primary/90 transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Confirm Add
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
