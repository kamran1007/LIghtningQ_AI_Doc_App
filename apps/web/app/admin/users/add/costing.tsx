"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { X, Loader2Icon } from "lucide-react";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { AddUpdateDoctorCosting, fetchDoctorCosting } from "@/lib/admin";
import toast from "react-hot-toast";
import { DoctorCostingSkeleton } from "@/components/ui/skeletonloader/DoctorCostingSkeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface CostingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const Costing: React.FC<CostingProps> = ({ open, onOpenChange, user }) => {
  // 🔐 Fetch Access Rights
  const accessRights = useSelector(
    (state: RootState) => state.hospitalAccessRight.data
  );

  const adminModule = accessRights?.find((m: any) => m.ModuleName === "Admin");
  const costingSub = adminModule?.Submodules?.find(
    (s: any) => s.SubModuleName === "Costing"
  );

  const canViewCosting = costingSub?.Permissions?.[0]?.CanView ?? false;
  const canUpdateCosting = costingSub?.Permissions?.[0]?.CanUpdate ?? false;

  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(
    null
  );
  const [costings, setCostings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const hospitalOptions =
    user?.AdminAccess?.map((h: any) => ({
      id: h.hospital.HospitalId,
      name: h.hospital.HospitalName,
    })) ?? [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  const resetFormWithCosting = (costing: any) => {
    reset({
      walkInFee: costing.walkInFee || "",
      teleConsultFee: costing.teleConsultFee || "",
      fastTrackFee: costing.fastTrackFee || "",
      homeVisitFee: costing.homeVisitFee || "",
      emergencyFee: costing.emergencyFee || "",
      procedureFee: costing.procedureFee || "",
      freeFollowupCount: costing.freeFollowupCount || "",
      followupValidityDays: costing.followupValidityDays || "",
      tax: costing.tax || "",
      discount: costing.discount || "",
      insuranceApplicable: costing.insuranceApplicable || false,
      commission: costing.commission || "",
    });
  };

  useEffect(() => {
    if (open && user?.UserId) {
      setIsLoading(true);
      fetchDoctorCosting(user.UserId)
        .then((data) => {
          const allCostings = data?.return?.costings ?? [];
          setCostings(allCostings);

          if (allCostings.length) {
            const defaultCosting = allCostings[0];
            setSelectedHospitalId(defaultCosting.hospitalId);
            setValue("hospitalId", defaultCosting.hospitalId);
            resetFormWithCosting(defaultCosting);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [open, user?.UserId]);

  const onSubmit = async (formData: any) => {
    try {
      const payload = {
        doctorId: user?.UserId,
        hospitalIds: [parseInt(formData.hospitalId)],
        walkInFee: parseFloat(formData.walkInFee),
        teleConsultFee: parseFloat(formData.teleConsultFee),
        fastTrackFee: parseFloat(formData.fastTrackFee),
        homeVisitFee: parseFloat(formData.homeVisitFee),
        emergencyFee: parseFloat(formData.emergencyFee),
        procedureFee: parseFloat(formData.procedureFee),
        freeFollowupCount: parseInt(formData.freeFollowupCount),
        followupValidityDays: parseInt(formData.followupValidityDays),
        tax: parseFloat(formData.tax),
        discount: parseFloat(formData.discount),
        commission: parseFloat(formData.commission) || 10,
        insuranceApplicable: !!formData.insuranceApplicable,
      };

      const res = await AddUpdateDoctorCosting(payload);

      if (res.ok) {
        toast.success("Costing saved successfully!");
        onOpenChange(false);
        reset();
      } else {
        const err = await res.json();
        toast.error("Failed to save costing: " + err.message);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong.");
    }
  };

  // ❌ If user doesn't have view permission
  if (!canViewCosting) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-6 text-center max-w-md rounded-2xl"onInteractOutside={(e) => e.preventDefault()} // 🛑 Prevent close on outside click
          onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogTitle className="text-lg font-semibold text-red-500 mb-2">
            Access Denied
          </DialogTitle>
          <p className="text-gray-600 mb-4">
            You don’t have permission to view or modify doctor costing details.
          </p>
          <DialogFooter className="flex justify-center mt-4">
            <Button
              onClick={() => onOpenChange(false)}
              className="rounded-full px-6 bg-teal-500 text-white hover:bg-teal-600"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] overflow-y-auto p-6 max-w-4xl rounded-2xl no-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <DialogTitle className="text-2xl font-semibold text-teal-500">
            Add Costing Details
          </DialogTitle>
          <DialogClose asChild>
            <button
              className="text-teal-600 hover:bg-teal-100 p-2 rounded-full transition cursor-pointer"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </DialogClose>
        </div>

        {!canUpdateCosting && (
          <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 p-2 rounded-lg mb-4">
            You have view-only access. Editing is disabled.
          </div>
        )}

        {isLoading ? (
          <DoctorCostingSkeleton />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="hidden"
              {...register("hospitalId")}
              value={selectedHospitalId ?? ""}
            />

            {/* Hospital Selector */}
            <div className="mb-6 w-[40%]">
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                Select Hospital (Branch) <span className="text-red-500">*</span>
              </Label>
              <Select
                disabled={!canUpdateCosting}
                value={selectedHospitalId?.toString() || ""}
                onValueChange={(value) => {
                  if (!canUpdateCosting) return;
                  const selectedId = parseInt(value);
                  setSelectedHospitalId(selectedId);
                  const selectedCosting = costings.find(
                    (c) => c.hospitalId === selectedId
                  );
                  if (selectedCosting) {
                    resetFormWithCosting(selectedCosting);
                  } else {
                    reset();
                  }
                  setValue("hospitalId", selectedId);
                }}
              >
                <SelectTrigger className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500">
                  <SelectValue placeholder="Select Hospital" />
                </SelectTrigger>
                <SelectContent className="border-white shadow-2xl rounded-2xl">
                  {hospitalOptions.map((hosp) => (
                    <SelectItem key={hosp.id} value={hosp.id.toString()}>
                      {hosp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Consultation Fees Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 mb-6">
              {[
                { name: "walkInFee", label: "Walk-in Consultation Fee", req: true },
                { name: "teleConsultFee", label: "Tele Consultation Fee" },
                { name: "fastTrackFee", label: "FastTrack Charges" },
                { name: "freeFollowupCount", label: "No. of Free Follow-ups" },
                { name: "followupValidityDays", label: "Follow-up Validity (Days)" },
                { name: "commission", label: "Commission Charges" },
              ].map((field) => (
                <div key={field.name}>
                  <Label>
                    {field.label}
                    {field.req && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    {...register(field.name)}
                    placeholder={`e.g. ${field.label}`}
                    defaultValue="0"
                    disabled={!canUpdateCosting}
                  />
                </div>
              ))}
            </div>

            {/* Additional Charges Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 mb-6">
              {[
                { name: "homeVisitFee", label: "Home Visit Charges" },
                { name: "emergencyFee", label: "Emergency Charges" },
                { name: "procedureFee", label: "Additional Procedure Charges" },
              ].map((field) => (
                <div key={field.name}>
                  <Label>{field.label}</Label>
                  <Input
                    {...register(field.name)}
                    placeholder={`e.g. ${field.label}`}
                    defaultValue="0"
                    disabled={!canUpdateCosting}
                  />
                </div>
              ))}
            </div>

            {/* Tax & Discount Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 mb-6">
              <div>
                <Label>Tax %</Label>
                <Input
                  {...register("tax")}
                  placeholder="e.g. 18"
                  disabled={!canUpdateCosting}
                />
              </div>
              <div>
                <Label>Discount %</Label>
                <Input
                  {...register("discount")}
                  placeholder="e.g. 5"
                  disabled={!canUpdateCosting}
                />
              </div>
              <div className="flex items-end gap-2 mt-6">
                <input
                  type="checkbox"
                  {...register("insuranceApplicable")}
                  id="insuranceApplicable"
                  className="w-4 h-4"
                  disabled={!canUpdateCosting}
                />
                <Label htmlFor="insuranceApplicable">
                  Insurance Applicable
                </Label>
              </div>
            </div>

            {/* Footer Buttons */}
            <DialogFooter className="w-full flex flex-col sm:flex-row justify-end items-center gap-4 mt-6">
              <Button
                type="button"
                className="rounded-full h-10 px-6 bg-red-500 text-white hover:bg-red-600 shadow-2xl"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!canUpdateCosting}
                className={`rounded-full h-10 px-6 shadow-2xl ${
                  canUpdateCosting
                    ? "bg-green-400 text-white hover:bg-green-500"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={(e) => {
                  if (!canUpdateCosting) {
                    e.preventDefault();
                    toast.error("You don’t have permission to update costing.");
                    return;
                  }
                }}
              >
                {isSubmitting ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Costing;
