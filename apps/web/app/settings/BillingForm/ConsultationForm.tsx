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
import { IndianRupee, Loader2 } from "lucide-react";
import { Toast } from "primereact/toast";
import { getallhospitalByUser } from "@/lib/admin";
import { getAllAppointmentType, FetchDoctorRole } from "@/lib/bookappointment";
import { createOrUpdateBillingItem, GetBillingItem } from "@/lib/billing";
import { Label } from "@/components/ui/label";

interface ConsultationFormProps {
  onCancel: () => void;
  editData?: any;
  onSuccess?: (updatedList?: any[]) => void; // ✅ allow data to be passed
}

export default function ConsultationForm({
  onCancel,
  editData,
  onSuccess,
}: ConsultationFormProps) {
  const toast = useRef<Toast>(null);

  const [form, setForm] = useState({
    BillingItemChargeId: undefined as number | undefined,
    BillingItemName: "",
    code: "",
    hospitalId: undefined as number | undefined,
    chargeTypeId: undefined as number | undefined,
    appointmentTypeId: undefined as number | undefined,
    doctorId: undefined as number | undefined,
    walkinPrice: undefined as number | undefined,
    telePrice: undefined as number | undefined,
    fastTrackCharges: undefined as number | undefined,
    numberOfFollowups: undefined as number | undefined,
    followupValidity: undefined as number | undefined,
    maxDiscountPercent: undefined as number | undefined,
    maxDiscountInr: undefined as number | undefined,
    finalWalkinPrice: undefined as number | undefined, // ✅ add this
    createdBy: undefined as number | undefined,
  });

  const [hospitalList, setHospitalList] = useState<any[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<any[]>([]);
  const [doctorList, setDoctorList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [discountMode, setDiscountMode] = useState<"percent" | "inr">(
    "percent"
  );
  const [finalWalkinPrice, setFinalWalkinPrice] = useState<number>(0);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 🧩 Fetch dropdown data
  useEffect(() => {
    (async () => {
      try {
        const [hospitals, appointments, doctors] = await Promise.all([
          getallhospitalByUser(),
          getAllAppointmentType(),
          FetchDoctorRole(),
        ]);

        setHospitalList(hospitals?.return?.data ?? []);
        setAppointmentTypes(appointments?.return ?? []); // ✅ matches your API
        setDoctorList(doctors?.return ?? []);
      } catch (error) {
        console.error("❌ Failed to load dropdown data:", error);
        toast.current?.show({
          severity: "error",
          summary: "Failed to load data",
          life: 3000,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (editData) {
      setForm({
        BillingItemChargeId: editData.BillingItemChargeId,
        BillingItemName: editData.BillingItemName ?? "",
        code: editData.code ?? "",
        hospitalId: editData.hospital?.HospitalId ?? undefined,
        chargeTypeId: editData.chargeType?.BillItemTypeId ?? undefined,
        appointmentTypeId: editData.appointmentType?.AppointmentTypeId ?? undefined,
        doctorId: editData.doctor?.UserId ?? undefined,
        walkinPrice: editData.walkinPrice ?? 0,
        telePrice: editData.telePrice ?? 0,
        fastTrackCharges: editData.fastTrackCharges ?? 0,
        numberOfFollowups: editData.numberOfFollowups ?? 0, // ✅ fixed name
        followupValidity: editData.followupValidity ?? 0, // ✅ fixed name
        maxDiscountPercent: editData.maxDiscountPercent ?? 0,
        maxDiscountInr: editData.maxDiscountInr ?? 0,
        finalWalkinPrice: editData.finalWalkinPrice, // ✅ add this

        createdBy: editData.createdBy ?? undefined,
      });
    }
  }, [editData]);

  // 🧮 Auto-recalculate INR discount whenever walkinPrice or percent changes
  // 🧮 Auto-recalculate discount + final price whenever related fields change
  useEffect(() => {
    let discountInr = form.maxDiscountInr ?? 0;
    let discountPercent = form.maxDiscountPercent ?? 0;

    if (form.walkinPrice) {
      if (discountMode === "percent" && discountPercent) {
        discountInr = (form.walkinPrice * discountPercent) / 100;
        handleChange("maxDiscountInr", Number(discountInr.toFixed(2)));
      } else if (discountMode === "inr" && discountInr) {
        discountPercent = (discountInr / form.walkinPrice) * 100;
        handleChange("maxDiscountPercent", Number(discountPercent.toFixed(2)));
      }

      // 🧾 Calculate final walk-in price and update both states
      const payable = form.walkinPrice - discountInr;
      setFinalWalkinPrice(Number(payable.toFixed(2)));
      handleChange("finalWalkinPrice", Number(payable.toFixed(2))); // ✅ keep in sync
    } else {
      setFinalWalkinPrice(0);
      handleChange("finalWalkinPrice", 0);
    }
  }, [
    form.walkinPrice,
    form.maxDiscountPercent,
    form.maxDiscountInr,
    discountMode,
  ]);

  // 💾 Save to API
const handleSave = async () => {
  if (!form.hospitalId || !form.appointmentTypeId || !form.BillingItemName || !form.hospitalId || !form.walkinPrice || form.walkinPrice <= 0) {
    toast.current?.show({
      severity: "warn",
      summary: "Please fill all required fields",
      life: 2000,
    });
    return;
  }

  try {
    setLoading(true);
    const { finalWalkinPrice, ...rest } = form;

    const payload = {
      ...rest,
      walkinPrice: Number(form.walkinPrice) || 0,
      telePrice: Number(form.telePrice) || 0,
      fastTrackCharges: Number(form.fastTrackCharges) || 0,
      numberOfFollowups: Number(form.numberOfFollowups) || 0,
      followupValidity: Number(form.followupValidity) || 0,
      maxDiscountPercent: Number(form.maxDiscountPercent) || 0,
      maxDiscountInr: Number(form.maxDiscountInr) || 0,
      chargeTypeId: Number(1),
      appointmentTypeId: Number(form.appointmentTypeId) || 0,
      isActive: true,
    };

    console.log("📤 Submitting Billing Item:", payload);
    const response = await createOrUpdateBillingItem(payload);

    toast.current?.show({
      severity: "success",
      summary: "Saved Successfully",
      detail: response?.message || "Billing item added successfully",
      life: 2500,
    });

    // ✅ Immediately refresh billing items
    const updatedList = await GetBillingItem();
    console.log("✅ Refreshed billing item list:", updatedList);

    // ✅ Call parent callback if provided
    onSuccess?.(updatedList?.return ?? []);

    // ✅ Clear the form
    setForm({
      BillingItemChargeId: undefined,
      BillingItemName: "",
      code: "",
      hospitalId: undefined,
      chargeTypeId: undefined,
      appointmentTypeId: undefined,
      doctorId: undefined,
      walkinPrice: undefined,
      telePrice: undefined,
      fastTrackCharges: undefined,
      numberOfFollowups: undefined,
      followupValidity: undefined,
      maxDiscountPercent: undefined,
      maxDiscountInr: undefined,
      finalWalkinPrice: undefined,
      createdBy: undefined,
    });
  } catch (error: any) {
    toast.current?.show({
      severity: "error",
      summary: "Save Failed",
      detail: error?.message || "Unable to save billing item",
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
      code: "",
      hospitalId: undefined,
      chargeTypeId: undefined,
      appointmentTypeId: undefined,
      doctorId: undefined,
      walkinPrice: undefined,
      telePrice: undefined,
      fastTrackCharges: undefined,
      numberOfFollowups: undefined,
      followupValidity: undefined,
      maxDiscountPercent: undefined,
      maxDiscountInr: undefined,
      finalWalkinPrice: undefined, // ✅ add this

      createdBy: undefined,
    });
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-inner border border-gray-200 space-y-4">
      <Toast ref={toast} />
      <h3 className="text-lg font-semibold text-gray-700">
        Add New Consultation Item
      </h3>

      {/* Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 🏥 Hospital */}
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

        {/* 🩺 Consultation Type */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            Consultation Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={form.appointmentTypeId?.toString()}
            onValueChange={(val) => handleChange("appointmentTypeId", Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Appointment Type" />
            </SelectTrigger>
            <SelectContent className="border-white shadow-2xl rounded-2xl">
              {appointmentTypes.map((type) => (
                <SelectItem
                  key={type.AppointmentTypeId}
                  value={type.AppointmentTypeId.toString()}
                >
                  {type.AppointmentTypeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 🧾 Procedure Name */}
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

        {/* 👨‍⚕️ Doctor */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            Doctor <span className="text-red-500">*</span>
          </Label>
          <Select
            value={form.doctorId?.toString()}
            onValueChange={(val) => handleChange("doctorId", Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Doctor" />
            </SelectTrigger>
            <SelectContent className="border-white shadow-2xl rounded-2xl">
              {doctorList.map((doc) => (
                <SelectItem key={doc.UserId} value={doc.UserId.toString()}>
                  {doc.firstName} {doc.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
        {/* 🆔 Code */}
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

        {/* 🏥 Walk-in Price */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            Walk-in Price (INR) <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <span className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs font-semibold">
              ₹
            </span>
            <Input
              type="number"
              placeholder="Enter Walk-in Price"
              value={form.walkinPrice ?? ""}
              onChange={(e) =>
                handleChange("walkinPrice", Number(e.target.value))
              }
            />
          </div>
        </div>

        {/* 📞 Tele Consultation Price */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            Tele-Consultation Price (INR)
          </Label>
          <div className="flex items-center gap-2">
            <span className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs font-semibold">
              ₹
            </span>
            <Input
              type="number"
              placeholder="Enter Tele-Consultation Price"
              value={form.telePrice ?? ""}
              onChange={(e) =>
                handleChange("telePrice", Number(e.target.value))
              }
            />
          </div>
        </div>

        {/* ⚡ Fast Track Charges */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            Fast Track Charges (INR)
          </Label>
          <div className="flex items-center gap-2">
            <span className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs font-semibold">
              ₹
            </span>
            <Input
              type="number"
              placeholder="Enter Fast Track Charges"
              value={form.fastTrackCharges ?? ""}
              onChange={(e) =>
                handleChange("fastTrackCharges", Number(e.target.value))
              }
            />
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {/* 🆓 Number of Free Followups */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            No. of Free Followups
          </Label>
          <Input
            placeholder="Enter Number of Followups"
            type="number"
            value={form.numberOfFollowups ?? ""}
            onChange={(e) =>
              handleChange("numberOfFollowups", Number(e.target.value))
            }
          />
        </div>

        {/* 📅 Followup Validity (in Days) */}
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            Followup Validity (Days)
          </Label>
          <Input
            placeholder="Enter Validity"
            type="number"
            value={form.followupValidity ?? ""}
            onChange={(e) =>
              handleChange("followupValidity", Number(e.target.value))
            }
          />
        </div>

        {/* 💸 Max Discount (%) */}
        {/* 💸 Max Discount */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1.5">
            <Label className="text-sm font-medium text-gray-700">
             Discount ({discountMode === "percent" ? "%" : "INR"})
            </Label>

            {/* Toggle Button */}
          </div>

          <div className="flex items-center gap-2">
            <Button
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
                  // convert % → INR based on walkin price
                  const discountInr =
                    form.walkinPrice && val
                      ? (form.walkinPrice * val) / 100
                      : 0;
                  handleChange("maxDiscountPercent", val);
                  handleChange("maxDiscountInr", discountInr);
                } else {
                  // convert INR → %
                  const discountPercent =
                    form.walkinPrice && val
                      ? (val / form.walkinPrice) * 100
                      : 0;
                  handleChange("maxDiscountInr", val);
                  handleChange("maxDiscountPercent", discountPercent);
                }
              }}
            />
          </div>

          {/* Auto-calculated value hint */}
          {form.walkinPrice && (
            <p className="text-xs text-gray-500 mt-1">
              {discountMode === "percent"
                ? `≈ ₹${(
                    (form.walkinPrice * (form.maxDiscountPercent ?? 0)) /
                    100
                  ).toFixed(2)}`
                : `≈ ${(form.maxDiscountPercent ?? 0).toFixed(2)}%`}
            </p>
          )}
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
  );
}
