"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getallhospitalByUser } from "@/lib/admin";
import { Label } from "@/components/ui/label";
import { Toast } from "primereact/toast";
import { Loader2 } from "lucide-react";
import { createOrUpdateBillingItem } from "@/lib/billing";

interface OtherChargesFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  editData?: any; // For update mode
}

export default function OtherChargesForm({
  onCancel,
  onSuccess,
  editData,
}: OtherChargesFormProps) {
  const toast = useRef<Toast>(null);
  const [hospitalList, setHospitalList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [discountMode, setDiscountMode] = useState<"percent" | "inr">(
    "percent"
  );

  // ✅ Form state
  const [form, setForm] = useState({
    BillingItemChargeId: undefined as number | undefined,
    hospitalId: undefined as number | undefined,
    chargeTypeId: 4, // Assuming 4 = "Other Charges" in BillItemType
    BillingItemName: "",
    code: "",
    price: undefined as number | undefined,
    maxDiscountPercent: undefined as number | undefined,
    maxDiscountInr: undefined as number | undefined,
    description: "",
  });

  // ✅ Handle field changes
  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Fetch hospitals
  useEffect(() => {
    (async () => {
      try {
        const hospitals = await getallhospitalByUser();
        setHospitalList(hospitals?.return?.data ?? []);
      } catch (error) {
        console.error("❌ Failed to load hospitals:", error);
        toast.current?.show({
          severity: "error",
          summary: "Failed to load hospitals",
          life: 3000,
        });
      }
    })();
  }, []);

  // ✅ Pre-fill form for update
  useEffect(() => {
    if (editData) {
      setForm({
        BillingItemChargeId: editData.BillingItemChargeId ?? undefined,
        hospitalId: editData.hospital?.HospitalId ?? undefined,
        chargeTypeId: editData.chargeTypeId ?? 4,
        BillingItemName: editData.BillingItemName ?? "",
        code: editData.code ?? "",
        price: Number(editData.price) ?? undefined,
        maxDiscountPercent: Number(editData.maxDiscountPercent) ?? undefined,
        maxDiscountInr: Number(editData.maxDiscountInr) ?? undefined,
        description: editData.description ?? "",
      });
    }
  }, [editData]);

  // ✅ Clear form
  const handleClear = () => {
    setForm({
      BillingItemChargeId: undefined,
      hospitalId: undefined,
      chargeTypeId: 4,
      BillingItemName: "",
      code: "",
      price: undefined,
      maxDiscountPercent: undefined,
      maxDiscountInr: undefined,
      description: "",
    });
  };

  // ✅ Save / Update handler
  const handleSave = async () => {
    if (!form.hospitalId || !form.BillingItemName || !form.price) {
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
      };

      console.log("📤 Submitting Other Charges Payload:", payload);

      const res = await createOrUpdateBillingItem(payload);
      const isUpdate = !!form.BillingItemChargeId;

      toast.current?.show({
        severity: "success",
        summary: isUpdate ? "Updated Successfully" : "Saved Successfully",
        life: 2500,
      });

      handleClear();
      onSuccess?.();
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Save Failed",
        detail: error?.message || "Unable to save item",
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
        {editData ? "Edit Other Charge" : "Add Other Hospital Charge"}
      </h3>

      {/* --- Form Fields --- */}
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

        {/* Charge Type */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            Item Type
          </Label>
          <Select
            value={form.chargeTypeId?.toString()}
            onValueChange={(val) => handleChange("chargeTypeId", Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Item Type" />
            </SelectTrigger>
            <SelectContent className="border-white shadow-2xl rounded-2xl">
              <SelectItem value="4">OTHER CHARGES</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Item Name */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            Item Name <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="Enter Item Name"
            value={form.BillingItemName ?? ""}
            onChange={(e) => handleChange("BillingItemName", e.target.value)}
          />
        </div>

        {/* Code */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            Code
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
            Price (₹) <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <span className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs font-semibold">
              ₹
            </span>
            <Input
              type="number"
              placeholder="Enter Price"
              value={form.price ?? ""}
              onChange={(e) => handleChange("price", Number(e.target.value))}
            />
          </div>
        </div>

        {/* Discount Section with Toggle */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            Max Discount ({discountMode === "percent" ? "%" : "₹"})
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
              Switch to {discountMode === "percent" ? "₹" : "%"}
            </Button>

            {/* Discount Input */}
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

          {/* Auto Display Calculation */}
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

        {/* Discount */}
        

        {/* Notes */}
        <div className="flex flex-col md:col-span-2">
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

      {/* --- Action Buttons --- */}
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
