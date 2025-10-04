"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // import { Button } from "@mui/material";
import { X, ChevronDown 
} from "lucide-react";

import {

  Loader2Icon,
} from "lucide-react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { AddUpdateDoctorCosting, fetchDoctorCosting } from "@/lib/admin";
import toast from "react-hot-toast";
import { DoctorCostingSkeleton } from "@/components/ui/skeletonloader/DoctorCostingSkeleton";

interface CostingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const Costing: React.FC<CostingProps> = ({ open, onOpenChange, user }) => {
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

  // const toggleSelect = (id: number) => {
  //   setSelectedHospitalIds((prev) =>
  //     prev.includes(id) ? prev.filter((val) => val !== id) : [...prev, id]
  //   );
  // };
  const toggleSelect = (id: number) => {
    setSelectedHospitalId(id);
    setValue("hospitalId", id); // ✅ Update the form with selected hospital

    const selectedCosting = costings.find((c) => c.hospitalId === id);
    if (selectedCosting) {
      resetFormWithCosting(selectedCosting);
    }
  };

  //onsubmit
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors,isSubmitting },
  } = useForm();
  const onSubmit = async (formData: any) => {
    try {
      const payload = {
        doctorId: user?.UserId,
        hospitalIds: [parseInt(formData.hospitalId)], // ✅ convert to number
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
        insuranceApplicable: !!formData.insuranceApplicable, // ✅ fixed here
      };

      const res = await AddUpdateDoctorCosting(payload);

      if (res.ok) {
        // const result = await res?.json();
        // console.log("Costing saved:", result);
        toast.success("Adding Costing successfully!");
        onOpenChange(false);
        reset();
      } else {
        const err = await res.json();
        toast.error("Failed to save costing: " + err.message);
        console.error("Save error:", err);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

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
      commission: costing.commission || "", // Default to 10% if not provided
      
    });
  };

  useEffect(() => {
    if (open && user?.UserId) {
      setIsLoading(true);

      fetchDoctorCosting(user.UserId).then((data) => {
        const allCostings = data?.return?.costings ?? [];
        setCostings(allCostings);

        if (allCostings.length) {
          const defaultCosting = allCostings[0];
          setSelectedHospitalId(defaultCosting.hospitalId);
          setValue("hospitalId", defaultCosting.hospitalId);
          resetFormWithCosting(defaultCosting);
        }

        setIsLoading(false); // ✅ only after data is set
      });
    }
  }, [open, user?.UserId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] overflow-y-auto p-6 max-w-4xl rounded-2xl no-scrollbar">
        {/* ✅ Always render DialogTitle for accessibility */}
        <div className="flex items-center justify-between mb-4">
          <DialogTitle className="text-2xl font-semibold">
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

        {isLoading ? (
          <DoctorCostingSkeleton />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Header Actions */}
            {/* <div className="flex justify-end mb-1">
              <DialogClose asChild>
                <button className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </DialogClose>
            </div> */}

            {/* Hidden Hospital ID Field */}
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
                value={selectedHospitalId?.toString() || ""}
                onValueChange={(value) => {
                  const selectedId = parseInt(value);
                  setSelectedHospitalId(selectedId);
                  const selectedCosting = costings.find(
                    (c) => c.hospitalId === selectedId
                  );
                  if (selectedCosting) {
                    resetFormWithCosting(selectedCosting);
                  } else {
                    reset(); // clear form
                  }
                  setValue("hospitalId", selectedId);
                }}
              >
                <SelectTrigger className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500">
                  <SelectValue placeholder="Select Hospital" />
                </SelectTrigger>
                <SelectContent className="border-white shadow-2xl rounded-2xl data-[state=checked]:bg-white data-[highlighted]:bg-white">
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
              <div>
                <Label>
                  Walk-in Consultation Fee{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input {...register("walkInFee")} placeholder="e.g. 500"   defaultValue="0"/>
              </div>
              <div>
                <Label>Tele Consultation Fee</Label>
                <Input {...register("teleConsultFee")} placeholder="e.g. 400"   defaultValue="0"
 />
              </div>
              <div>
                <Label>FastTrack Charges</Label>
                <Input {...register("fastTrackFee")} placeholder="e.g. 700"   defaultValue="0"
/>
              </div>
              <div>
                <Label>No. of Free Follow-ups</Label>
                <Input
                  defaultValue="0"

                  {...register("freeFollowupCount")}
                  placeholder="e.g. 2"
                />
              </div>
              <div>
                <Label>Follow-up Validity (Days)</Label>
                <Input
                  defaultValue="0"

                  {...register("followupValidityDays")}
                  placeholder="e.g. 10"
                />
              </div>
              <div>
                <Label>Commission Charges</Label>
                <Input
                  {...register("commission")}

                  defaultValue="0"
                  placeholder="e.g. 10%"
                />
              </div>
            </div>

            {/* Additional Charges Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 mb-6">
              <div>
                <Label>Home Visit Charges</Label>
                <Input {...register("homeVisitFee")} placeholder="e.g. 800"   defaultValue="0"
 />
              </div>
              <div>
                <Label>Emergency Charges</Label>
                <Input {...register("emergencyFee")} placeholder="e.g. 1000"  />
              </div>
              <div>
                <Label>Additional Procedure Charges</Label>
                <Input {...register("procedureFee")} placeholder="e.g. 1200" />
              </div>
            </div>

            {/* Tax & Discount Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 mb-6">
              <div>
                <Label>Tax %</Label>
                <Input {...register("tax")} placeholder="e.g. 18" />
              </div>
              <div>
                <Label>Discount %</Label>
                <Input {...register("discount")} placeholder="e.g. 5" />
              </div>
              <div className="flex items-end gap-2 mt-6">
                <input
                  type="checkbox"
                  {...register("insuranceApplicable")}
                  id="insuranceApplicable"
                  className="w-4 h-4"
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
                className="rounded-full h-10 px-6 cursor-pointer bg-red-500 text-white hover:bg-red-600 shadow-2xl"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-full h-10 px-6 cursor-pointer bg-green-400 text-white shadow-2xl hover:bg-green-500"
              >
                {isSubmitting ? <Loader2Icon className="animate-spin" />
                                   : "Save"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Costing;
