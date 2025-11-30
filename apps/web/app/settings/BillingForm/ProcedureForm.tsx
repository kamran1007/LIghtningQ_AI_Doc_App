"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Toast } from "primereact/toast";
import { getallhospitalByUser } from "@/lib/admin";
import { FetchDoctorRole, getAllAppointmentType } from "@/lib/bookappointment";
import { createOrUpdateBillingItem, GetBillingItem } from "@/lib/billing";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ProcedureFormProps {
  onCancel: () => void;
  onSuccess?: (updatedList?: any[]) => void; // ✅ callback to refresh table
  editData?: any;
}

export default function ProcedureForm({
  onCancel,
  onSuccess,
  editData,
}: ProcedureFormProps) {
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);

  const [hospitalList, setHospitalList] = useState<any[]>([]);
  const [doctorList, setDoctorList] = useState<any[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<any[]>([]);
  const [discountMode, setDiscountMode] = useState<"percent" | "inr">(
    "percent"
  );

  // ✅ Form State
  const [form, setForm] = useState({
    BillingItemChargeId: undefined as number | undefined,
    BillingItemName: "",
    procedure: "procedure",
    code: "",
    hospitalId: undefined as number | undefined,
    chargeTypeId: undefined as number | undefined, // Appointment Type
    doctorId: undefined as number | undefined,
    amount: undefined as number | undefined,
    maxDiscountPercent: undefined as number | undefined,
    maxDiscountInr: undefined as number | undefined,
    notes: "",
    createdBy: undefined as number | undefined,
  });

  // ✅ Handle Form Field Change
  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Load Dropdown Data
  useEffect(() => {
    (async () => {
      try {
        const [hospitals, doctors, types] = await Promise.all([
          getallhospitalByUser(),
          FetchDoctorRole(),
          getAllAppointmentType(),
        ]);

        setHospitalList(hospitals?.return?.data ?? []);
        setDoctorList(doctors?.return ?? []);
        setAppointmentTypes(types?.return ?? []);
      } catch (error) {
        console.error("❌ Failed to load dropdowns:", error);
        toast.current?.show({
          severity: "error",
          summary: "Failed to load data",
          life: 3000,
        });
      }
    })();
  }, []);

  // ✅ Pre-fill form for editing
  useEffect(() => {
    if (editData) {
      setForm({
        BillingItemChargeId: editData.BillingItemChargeId ?? undefined,
        BillingItemName: editData.BillingItemName ?? "",
        procedure: "procedure",
        code: editData.code ?? "",
        hospitalId: editData.hospital?.HospitalId ?? undefined,
        chargeTypeId: editData.chargeType?.BillItemTypeId ?? undefined,
        doctorId: editData.doctor?.UserId ?? undefined,
        amount: editData.price ?? 0,
        maxDiscountPercent: editData.maxDiscountPercent ?? 0,
        maxDiscountInr: editData.maxDiscountInr ?? 0,
        notes: editData.description ?? "",
        createdBy: editData.createdBy ?? undefined,
      });
    }
  }, [editData]);

  // ✅ Save Procedure API Integration
  const handleSave = async () => {
    if (
      !form.hospitalId ||
      !form.amount ||
      !form.BillingItemName ||
      form.amount <= 0
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
        BillingItemChargeId: form.BillingItemChargeId ?? 0,
        BillingItemName: form.BillingItemName,
        code: form.code ?? "",
        hospitalId: Number(form.hospitalId),
        chargeTypeId: Number(2),
        doctorId: Number(form.doctorId) || null,
        price: Number(form.amount) || 0,
        maxDiscountPercent: Number(form.maxDiscountPercent) || 0,
        maxDiscountInr: Number(form.maxDiscountInr) || 0,
        description: form.notes ?? "",
        isActive: true,
      };

      console.log("📤 Submitting Procedure Payload:", payload);

      const response = await createOrUpdateBillingItem(payload);
      toast.current?.show({
        severity: "success",
        summary: "Saved Successfully",
        detail: response?.message || "Procedure saved successfully",
        life: 2500,
      });

      // ✅ Fetch updated list
      const updatedList = await GetBillingItem();
      onSuccess?.(updatedList?.return ?? []);

      // ✅ Clear form
      handleClear();
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Save Failed",
        detail: error?.message || "Unable to save procedure",
        life: 2500,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setForm({
      BillingItemChargeId: undefined,
      BillingItemName: "",
      procedure: "procedure",
      code: "",
      hospitalId: undefined,
      chargeTypeId: undefined,
      doctorId: undefined,
      amount: undefined,
      maxDiscountPercent: undefined,
      maxDiscountInr: undefined,
      notes: "",
      createdBy: undefined,
    });
  };

  return (
    <>
      <Toast ref={toast} />

      <div className="bg-white rounded-xl p-5 shadow-inner border border-gray-200 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          {editData ? "Edit Procedure" : "Add New Procedure"}
        </h3>

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Procedure Type */}
          <div className="flex flex-col">
            <Label className="text-sm font-medium text-gray-700 mb-1.5">
              Procedure Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.procedure ?? ""}
              onValueChange={(val) => handleChange("procedure", Number(val))}
            >
              {" "}
              <SelectTrigger>
                {" "}
                <SelectValue placeholder="Select Type" />{" "}
              </SelectTrigger>{" "}
              <SelectContent className="border-white shadow-2xl rounded-2xl">
                {" "}
                <SelectItem value="procedure">PROCEDURE</SelectItem>{" "}
              </SelectContent>{" "}
            </Select>
          </div>

          {/* Procedure Name */}
          <div className="flex flex-col">
            <Label className="text-sm font-medium text-gray-700 mb-1.5">
              Procedure Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Enter Procedure Name"
              value={form.BillingItemName ?? ""}
              onChange={(e) => handleChange("BillingItemName", e.target.value)}
            />
          </div>

          {/* Code */}
          <div className="flex flex-col">
            <Label className="text-sm font-medium text-gray-700 mb-1.5">
              Procedure Code
            </Label>
            <Input
              placeholder="Enter Code"
              value={form.code ?? ""}
              onChange={(e) => handleChange("code", e.target.value)}
            />
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <Label className="text-sm font-medium text-gray-700 mb-1.5">
              Amount (INR) <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <span className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs font-semibold">
                ₹
              </span>
              <Input
                type="number"
                placeholder="Amount"
                value={form.amount ?? ""}
                onChange={(e) => handleChange("amount", Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
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

          {/* Discount */}
          {/* Discount */}
          <div className="flex flex-col">
            <Label className="text-sm font-medium text-gray-700 mb-1.5">
            Max Discount ({discountMode === "percent" ? "%" : "INR"})
            </Label>

            <div className="flex items-center gap-2">
              {/* Toggle Button */}
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

              {/* Discount Input */}
              <Input
                type="number"
                placeholder={
                  discountMode === "percent"
                    ? "Enter Discount %"
                    : "Enter Discount in INR"
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
                    // ✅ Convert % → INR based on amount (not walkinPrice)
                    const discountInr =
                      form.amount && val ? (form.amount * val) / 100 : 0;

                    handleChange("maxDiscountPercent", val);
                    handleChange(
                      "maxDiscountInr",
                      Number(discountInr.toFixed(2))
                    );
                  } else {
                    // ✅ Convert INR → %
                    const discountPercent =
                      form.amount && val ? (val / form.amount) * 100 : 0;

                    handleChange("maxDiscountInr", val);
                    handleChange(
                      "maxDiscountPercent",
                      Number(discountPercent.toFixed(2))
                    );
                  }
                }}
              />
            </div>

            {/* Optional Helper Text */}
            {form.amount && (
              <p className="text-xs text-gray-500 mt-1">
                {discountMode === "percent"
                  ? `≈ ₹${(
                      (form.amount * (form.maxDiscountPercent ?? 0)) /
                      100
                    ).toFixed(2)}`
                  : `≈ ${(form.maxDiscountPercent ?? 0).toFixed(2)}%`}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="flex flex-col">
            <Label className="text-sm font-medium text-gray-700 mb-1.5">
              Notes
            </Label>
            <Input
              placeholder="Enter Notes"
              value={form.notes ?? ""}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            disabled={loading}
            onClick={handleSave}
            className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" /> Saving...
              </>
            ) : (
              <>💾 Save</>
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
    </>
  );
}
