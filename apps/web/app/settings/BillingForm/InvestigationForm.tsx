"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { getallhospitalByUser, getUserSpecialization } from "@/lib/admin";
import { FetchInvestigation } from "@/lib/consultation";
import { Toast } from "primereact/toast";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { createOrUpdateBillingItem } from "@/lib/billing";

interface InvestigationFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  editData?: any;
}

export default function InvestigationForm({
  onCancel,
  onSuccess,
  editData,
}: InvestigationFormProps) {
  const toast = useRef<Toast>(null);

  const [userSpecialization, setUserSpecialization] = useState<any[]>([]);
  const [hospitalList, setHospitalList] = useState<any[]>([]);
  const [investigationList, setInvestigationList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Discount toggle state
  const [discountMode, setDiscountMode] = useState<"percent" | "inr">(
    "percent"
  );

  // ✅ Form state
  const [form, setForm] = useState({
    specializationId: undefined as number | undefined,
    hospitalId: undefined as number | undefined,
    investigationTypeId: undefined as number | undefined,
    BillingItemName: "",
    code: "",
    price: undefined as number | undefined,
    maxDiscountPercent: undefined as number | undefined,
    maxDiscountInr: undefined as number | undefined,
    description: "",
    chargeTypeId: undefined as number | undefined,
  });

  // ✅ Handle changes
  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Load dropdown data
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [Specialization, hospitals, Investigations] = await Promise.all([
          getUserSpecialization(),
          getallhospitalByUser(),
          FetchInvestigation(),
        ]);
        setUserSpecialization(Specialization?.return?.data ?? []);
        setHospitalList(hospitals?.return?.data ?? []);
        setInvestigationList(Investigations?.data?.investigationTypeData ?? []);
      } catch (error) {
        console.error("❌ Failed to load dropdown data:", error);
        toast.current?.show({
          severity: "error",
          summary: "Failed to load data",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ Pre-fill form for edit mode
  useEffect(() => {
    if (editData) {
      setForm({
        specializationId:
          editData.specialization?.SpecializationId ?? undefined,
        hospitalId: editData.hospital?.HospitalId ?? undefined,
        investigationTypeId: editData.investigationTypeId ?? undefined,
        BillingItemName: editData.BillingItemName ?? "",
        code: editData.code ?? "",
        price: Number(editData.price) ?? 0,
        maxDiscountPercent: Number(editData.maxDiscountPercent) ?? 0,
        maxDiscountInr: Number(editData.maxDiscountInr) ?? 0,
        description: editData.description ?? "",
        chargeTypeId: editData.chargeTypeId ?? undefined,
      });
    }
  }, [editData]);

  // ✅ Clear form
  const handleClear = () => {
    setForm({
      specializationId: undefined,
      hospitalId: undefined,
      investigationTypeId: undefined,
      BillingItemName: "",
      code: "",
      price: undefined,
      maxDiscountPercent: undefined,
      maxDiscountInr: undefined,
      description: "",
      chargeTypeId: undefined,
    });
  };

  // ✅ Save handler
  const handleSave = async () => {
    if (
      !form.BillingItemName ||
      !form.hospitalId ||
      !form.specializationId ||
      !form.price
    ) {
      toast.current?.show({
        severity: "warn",
        summary: "Please fill all required fields",
        life: 2000,
      });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...form,
        price: Number(form.price),
        maxDiscountPercent: Number(form.maxDiscountPercent) || 0,
        maxDiscountInr: Number(form.maxDiscountInr) || 0,
        chargeTypeId: Number(3),
      };

      console.log("📤 Submitting Investigation Payload:", payload);
      const response = await createOrUpdateBillingItem(payload);

      toast.current?.show({
        severity: "success",
        summary: "Saved Successfully",
        life: 2500,
      });

      handleClear();
      onSuccess?.();
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Save Failed",
        detail: error?.message || "Unable to save investigation",
        life: 2500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-inner border border-gray-200 space-y-4">
      <Toast ref={toast} />
      <h3 className="text-lg font-semibold text-gray-700">
        {editData ? "Edit Investigation" : "Add New Investigation"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Hospital */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            Hospital/Clinic <span className="text-red-500">*</span>
          </Label>
          <Select
            value={form.hospitalId?.toString()}
            onValueChange={(val) => handleChange("hospitalId", Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Hospital/Clinic" />
            </SelectTrigger>
            <SelectContent className="border-white shadow-2xl rounded-2xl">
              {hospitalList.map((hosp) => (
                <SelectItem
                  key={hosp.HospitalId}
                  value={hosp.HospitalId.toString()}
                >
                  {hosp.HospitalName} — {hosp.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Specialization */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            Specialization <span className="text-red-500">*</span>
          </Label>
          <Select
            value={form.specializationId?.toString()}
            onValueChange={(val) =>
              handleChange("specializationId", Number(val))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Specialization" />
            </SelectTrigger>
            <SelectContent className="border-white shadow-2xl rounded-2xl">
              {userSpecialization.map((spec) => (
                <SelectItem
                  key={spec.SpecializationId}
                  value={spec.SpecializationId.toString()}
                >
                  {spec.SpecializationName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Investigation Type */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            Investigation Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={form.investigationTypeId?.toString()}
            onValueChange={(val) =>
              handleChange("investigationTypeId", Number(val))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Investigation Type" />
            </SelectTrigger>
            <SelectContent className="border-white shadow-2xl rounded-2xl">
              {investigationList.map((Inv) => (
                <SelectItem
                  key={Inv.InvestigationTypeId}
                  value={Inv.InvestigationTypeId.toString()}
                >
                  {Inv.InvestigationType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Investigation Name */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            Investigation Name <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="Enter Investigation Name"
            value={form.BillingItemName ?? ""}
            onChange={(e) => handleChange("BillingItemName", e.target.value)}
          />
        </div>
      </div>

      {/* Price + Discount Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 items-center">
        {/* General Cost */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            General Cost (₹) <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <span className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs font-semibold">
              ₹
            </span>
            <Input
              type="number"
              placeholder="Enter General Cost"
              value={form.price ?? ""}
              onChange={(e) => handleChange("price", Number(e.target.value))}
            />
          </div>
        </div>

        {/* Discount Section with Toggle */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            Max Discount ({discountMode === "percent" ? "%" : "INR"})
          </Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs px-2 py-0.5 border-teal-500 text-teal-600 hover:bg-teal-50"
              onClick={() =>
                setDiscountMode((prev) =>
                  prev === "percent" ? "inr" : "percent"
                )
              }
            >
              Switch to {discountMode === "percent" ? "INR" : "%"}
            </Button>

            <Input
              type="number"
              placeholder={
                discountMode === "percent"
                  ? "Enter Discount %"
                  : "Enter Discount ₹"
              }
              className="w-full"
              value={
                discountMode === "percent"
                  ? (form.maxDiscountPercent ?? "")
                  : (form.maxDiscountInr ?? "")
              }
              onChange={(e) => {
                const val = Number(e.target.value);
                if (discountMode === "percent") {
                  const discountInr =
                    form.price && val ? (form.price * val) / 100 : 0;
                  handleChange("maxDiscountPercent", val);
                  handleChange(
                    "maxDiscountInr",
                    Number(discountInr.toFixed(2))
                  );
                } else {
                  const discountPercent =
                    form.price && val ? (val / form.price) * 100 : 0;
                  handleChange("maxDiscountInr", val);
                  handleChange(
                    "maxDiscountPercent",
                    Number(discountPercent.toFixed(2))
                  );
                }
              }}
            />
          </div>

          {form.price && (
            <p className="text-xs text-gray-500 mt-1">
              {discountMode === "percent"
                ? `≈ ₹${(
                    ((form.price ?? 0) * (form.maxDiscountPercent ?? 0)) /
                    100
                  ).toFixed(2)}`
                : `≈ ${(form.maxDiscountPercent ?? 0).toFixed(2)}%`}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            Notes
          </Label>
          <Input
            placeholder="Enter Notes"
            value={form.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" /> Saving...
            </>
          ) : (
            "💾 Save"
          )}
        </Button>
        <Button
          variant="outline"
          className="border-red-400 text-red-500"
          onClick={handleClear}
        >
          ✖ Clear
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-600 text-white"
          onClick={onCancel}
        >
          ❌ Cancel
        </Button>
      </div>
    </div>
  );
}
