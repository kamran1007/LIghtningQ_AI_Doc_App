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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Moon, Sun, X, ClockArrowUp, ClockArrowDown } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { User } from "app/admin/hospitaluserlist";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { AddUpdateDoctorTimeSlot, CreateTimeSlot, fetchDoctorSlots, UpdateTimeslot } from "@/lib/admin";
import { DoctorSlotSkeleton } from "@/components/ui/skeletonloader/DoctorSlotSkeleton";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface TimeslotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const daysOfWeek = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const Timeslot: React.FC<TimeslotProps> = ({ open, onOpenChange, user }) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [acceptAppointments, setAcceptAppointments] = useState(true);
  const [cancelledDays, setCancelledDays] = useState<string[]>([]);
  const [dndDays, setDndDays] = useState<string[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState("");

  const [showRemarkDialog, setShowRemarkDialog] = useState(false);
  const [remarkDay, setRemarkDay] = useState<string | null>(null);
  const [remarkText, setRemarkText] = useState("");
  const [remarkType, setRemarkType] = useState<"DND" | "CANCEL" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPermanentCancelled, setIsPermanentCancel] = useState(false);

  type TimeSlot = {
    DoctorTimeSlotId?: number;
    morning: { from: string; to: string };
    evening: { from: string; to: string };
    consultTime: string;
    isDND: boolean;
    dndRemarks?: string;
    isCancelled: boolean;
    cancellationRemarks?: string;
    acceptAppointments: boolean;
    isPermanentCancelled: boolean;
    hospitalId?: number; // optional, if needed
  };

  const [slotsByDay, setSlotsByDay] = useState<Record<string, TimeSlot>>({});
  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );

    setSlotsByDay((prev) => ({
      ...prev,
      [day]: prev[day] ?? { ...defaultDaySlot },
    }));
  };

  const handleCancelDay = (day: string) => {
    setCancelledDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleMarkDND = (day: string) => {
    setDndDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const isTimeInRange = (target: string, start?: string, end?: string) => {
    if (!target || !start || !end) return false;

    const toMinutes = (time: string): number => {
      const [h = "0", m = "0"] = time.split(":");
      return parseInt(h) * 60 + parseInt(m);
    };

    const targetMins = toMinutes(target);
    const startMins = toMinutes(start);
    const endMins = toMinutes(end);

    return targetMins >= startMins && targetMins <= endMins;
  };

  // Slot time helpers should be inside a function where 'day' is defined, such as renderSlotInputs.

  type SlotUpdateDetails = {
    DoctorTimeSlotId?: number;
    DayOfWeek: string;
    Morning_From: string | null;
    Morning_To: string | null;
    Evening_From: string | null;
    Evening_To: string | null;
    consult_Time_InMin: number;
    DNDremarks?: string;
    Slot_cancellation_remarks?: string;
    is_DND?: boolean;
    is_SlotCancelled?: boolean;
    isPermanentCancelled?: boolean;
    isDeleted?: boolean; // optional, only if supported
    hospitalId?: number; // optional, if needed
    isSlotChanged?: boolean; // optional, if needed
  };

  // const handleSave = async () => {
  //   if (!user) return;

  //   try {
  //     const updateSlots: SlotUpdateDetails[] = [];
  //     const createSlots: Omit<SlotUpdateDetails, "DoctorTimeSlotId">[] = [];

  //     for (const day of selectedDays) {
  //       const slot = slotsByDay[day];
  //       const errors: string[] = [];

  //       if (!slot) {
  //         errors.push(`${day}: Slot is not configured.`);
  //         continue;
  //       }

  //       if (!slot.morning?.from || !slot.morning?.to) {
  //         errors.push(`${day}: Morning slot time is incomplete.`);
  //       }

  //       if (!slot.evening?.from || !slot.evening?.to) {
  //         errors.push(`${day}: Evening slot time is incomplete.`);
  //       }

  //       if (!slot.consultTime || isNaN(parseInt(slot.consultTime))) {
  //         errors.push(`${day}: Consult time is missing or invalid.`);
  //       }

  //       if (!slot.hospitalId || isNaN(Number(slot.hospitalId))) {
  //         errors.push(`${day}: Hospital is not selected.`);
  //       }

  //       if (errors.length > 0) {
  //         toast.error(errors.join("\n"));
  //         return;
  //       }
  //     }

  //     selectedDays.forEach((day) => {
  //       const slot = slotsByDay[day] ?? defaultDaySlot;

  //       const baseSlot = {
  //         DayOfWeek: day,
  //         Morning_From: slot.morning?.from || "",
  //         Morning_To: slot.morning?.to || "",
  //         Evening_From: slot.evening?.from || "",
  //         Evening_To: slot.evening?.to || "",
  //         consult_Time_InMin: parseInt(slot.consultTime) || 15,
  //         Accept_Appointment_Selected_Date: slot.acceptAppointments ?? true,
  //         DNDremarks: slot.isDND ? slot.dndRemarks || "Marked DND" : undefined,
  //         Slot_cancellation_remarks: slot.isCancelled
  //           ? slot.cancellationRemarks || "Marked Cancelled"
  //           : undefined,
  //         isPermanentCancelled: slot.isPermanentCancelled ?? false,
  //         hospitalId: slot.hospitalId,
  //       };

  //       if ("DoctorTimeSlotId" in slot && slot.DoctorTimeSlotId) {
  //         updateSlots.push({
  //           ...baseSlot,
  //           DoctorTimeSlotId: slot.DoctorTimeSlotId,
  //           is_DND: slot.isDND,
  //           is_SlotCancelled: slot.isCancelled,
  //           isDeleted: false,
  //           hospitalId: slot.hospitalId ?? undefined, // ✅ use per-slot hospital ID
  //         });
  //       } else {
  //         createSlots.push({
  //           ...baseSlot,
  //           is_DND: slot.isDND,
  //           is_SlotCancelled: slot.isCancelled,
  //           isDeleted: false,
  //           hospitalId: slot.hospitalId ?? undefined, // ✅ use per-slot hospital ID
  //         });
  //       }
  //     }); // ✅ closing forEach here

  //     const allSavedDays = Object.keys(slotsByDay); // Previously saved
  //     const inactiveDays = allSavedDays.filter(
  //       (day) => !selectedDays.includes(day)
  //     );

  //     inactiveDays.forEach((day) => {
  //       const slot = slotsByDay[day];
  //       if (slot?.DoctorTimeSlotId) {
  //         updateSlots.push({
  //           DayOfWeek: day,
  //           DoctorTimeSlotId: slot.DoctorTimeSlotId,
  //           Morning_From: "",
  //           Morning_To: "",
  //           Evening_From: "",
  //           Evening_To: "",
  //           consult_Time_InMin: 15,
  //           Accept_Appointment_Selected_Date: false,
  //           is_DND: false,
  //           is_SlotCancelled: false,
  //           isPermanentCancelled: false,
  //           DNDremarks: "",
  //           Slot_cancellation_remarks: "",
  //           isDeleted: true, // optional: only if supported
  //         });
  //       }
  //     });

  //     const commonPayload = {
  //       userId: user.UserId,
  //     };
  //     let res = null;
  //     let response = null;
  //     // 1. Update
  //     if (updateSlots.length > 0) {
  //       const updatePayload = {
  //         ...commonPayload,
  //         slots: updateSlots,
  //       };
  //       res = await UpdateTimeslot(updatePayload);
  //       console.log("Response from UpdateTimeslot:", res);
  //     }

  //     // 2. Create
  //     if (createSlots.length > 0) {
  //       const createPayload = {
  //         ...commonPayload,
  //         timeSlots: createSlots,
  //       };
  //       response = await CreateTimeSlot(createPayload);
  //       console.log("Response from CreateTimeSlot:", response);
  //     }
  //     console.log("Slots saved successfully:", {
  //       updateSlots,
  //       createSlots,
  //     });
  //     if (res?.return?.HttpCode === 200 || response?.return?.HttpCode === 201) {
  //       toast.success("Time slots saved successfully!");
  //       onOpenChange(false);
  //     }
  //   } catch (err) {
  //     console.error("Save error:", err);
  //     toast.error("Failed to save time slots.");
  //   }
  // };

  const handleSave = async () => {
    if (!user) return;
  
    try {
      const finalSlots: Omit<SlotUpdateDetails, "DoctorTimeSlotId">[] = [];
  
      for (const day of selectedDays) {
        const slot = slotsByDay[day];
        const errors: string[] = [];
  
        if (!slot) {
          errors.push(`${day}: Slot is not configured.`);
          continue;
        }
  
        if (
          (!slot.morning?.from || !slot.morning?.to) &&
          (!slot.evening?.from || !slot.evening?.to)
        ) {
          errors.push(`${day}: At least one complete slot (morning or evening) is required.`);
        }
  
        if (!slot.consultTime || isNaN(parseInt(slot.consultTime))) {
          errors.push(`${day}: Consult time is missing or invalid.`);
        }
  
        if (!slot.hospitalId || isNaN(Number(slot.hospitalId))) {
          errors.push(`${day}: Hospital is not selected.`);
        }
  
        if (errors.length > 0) {
          toast.error(errors.join("\n"));
          return;
        }
  
        finalSlots.push({
          DayOfWeek: day,
          Morning_From: slot.morning?.from || "",
          Morning_To: slot.morning?.to || "",
          Evening_From: slot.evening?.from || "",
          Evening_To: slot.evening?.to || "",
          consult_Time_InMin: parseInt(slot.consultTime) || 15,
          DNDremarks: slot.isDND ? slot.dndRemarks || "Marked DND" : undefined,
          Slot_cancellation_remarks: slot.isCancelled
            ? slot.cancellationRemarks || "Marked Cancelled"
            : undefined,
          isPermanentCancelled: slot.isPermanentCancelled ?? false,
          hospitalId: slot.hospitalId,
          is_DND: slot.isDND,
          is_SlotCancelled: slot.isCancelled,
          isDeleted: false,
          isSlotChanged: Boolean(slot.DoctorTimeSlotId), // Track if this is an update
        });
      }
  
      // Handle deselected days → mark as deleted
      const allSavedDays = Object.keys(slotsByDay);
      const inactiveDays = allSavedDays.filter((day) => !selectedDays.includes(day));
  
      inactiveDays.forEach((day) => {
        const slot = slotsByDay[day];
        if (slot?.DoctorTimeSlotId) {
          finalSlots.push({
            DayOfWeek: day,
            Morning_From: "",
            Morning_To: "",
            Evening_From: "",
            Evening_To: "",
            consult_Time_InMin: 15,
            DNDremarks: "",
            Slot_cancellation_remarks: "",
            is_DND: false,
            is_SlotCancelled: false,
            isPermanentCancelled: false,
            isDeleted: true,
            hospitalId: slot.hospitalId ?? undefined,
            isSlotChanged: true, // Mark as deleted
          });
        }
      });
  
      // 🔁 New unified payload
      const payload = {
        userId: user.UserId,
        Accept_Appointment_Selected_Date: selectedDays.every(
          (day) => slotsByDay[day]?.acceptAppointments
        ),
        timeSlots: finalSlots,
      };
  
      const res = await AddUpdateDoctorTimeSlot(payload);
      console.log("Response from AddUpdateDoctorTimeSlot:", res);
      if (res?.return?.HttpCode === 201) {
        toast.success("Time slots saved successfully!");
        onOpenChange(false);
      } else {
        toast.error("Something went wrong saving slots.");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save time slots.");
    }
  };

  // const hospitals = useSelector((state: RootState) => state.hospital.data);
  function getDateForDay(day: string): string {
    const today = new Date();
    const dayIndexMap: Record<string, number> = {
      SUN: 0,
      MON: 1,
      TUE: 2,
      WED: 3,
      THU: 4,
      FRI: 5,
      SAT: 6,
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
    };

    const upperDay = day.toUpperCase();
    const key = upperDay.slice(0, 3); // "MON", "TUE", etc.
    const targetIndex = dayIndexMap[key] ?? dayIndexMap[day];
    if (typeof targetIndex !== "number") return "";

    const todayIndex = today.getDay();
    const diff = (targetIndex - todayIndex + 7) % 7;

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);

    return targetDate
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
      .toUpperCase(); // e.g., "JUN 17"
  }

  const defaultDaySlot = {
    morning: { from: "", to: "" },
    evening: { from: "", to: "" },
    consultTime: "15",
    isDND: false,
    isCancelled: false,
    acceptAppointments: true,
    dndRemarks: "",
    cancellationRemarks: "",
    isPermanentCancelled: false,
    hospitalId: undefined, // Optional, if needed
  };
  const dayNames = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
  const todayIndex = (new Date().getDay() + 6) % 7;
  const today = dayNames[todayIndex]!;
  const selectedDaysWithoutToday = selectedDays.filter((day) => day !== today);
  const showTodaySlot = selectedDays.includes(today);
  useEffect(() => {
    const loadSlots = async () => {
      if (user) {
        setIsLoading(true); // ⏳ Start skeleton
        try {
          const result = await fetchDoctorSlots(user.UserId); // ✅ Here!

          const allSlots = result?.return?.slots || [];
          console.log("Fetched slots:", allSlots);
          // const selectedHospitals = allSlots?.HospitalId;
          // if (!selectedHospitals && allSlots?.HospitalId) {
          //   setSelectedHospitalId(selectedHospitals);
          // }
          const newSlotsByDay: Record<string, TimeSlot> = {};
          const cancelled: string[] = [];
          const dnd: string[] = [];

          for (const slot of allSlots) {
            const day = slot.DayOfWeek?.toUpperCase() || today;
            const slotObj: TimeSlot = {
              DoctorTimeSlotId: slot?.DoctorTimeSlotId,
              morning: {
                from: slot?.Morning_From || "",
                to: slot?.Morning_To || "",
              },
              evening: {
                from: slot?.Evening_From || "",
                to: slot?.Evening_To || "",
              },
              consultTime: slot?.consult_Time_InMin?.toString() || "15",
              isDND: slot?.is_DND ?? false,
              dndRemarks: slot?.DNDremarks || "",
              isCancelled: slot?.is_SlotCancelled ?? false,
              cancellationRemarks: slot?.Slot_cancellation_remarks || "",
              acceptAppointments:
                Boolean(slot?.Accept_Appointment_Selected_Date),

              isPermanentCancelled: slot?.isPermanentCancelled ?? false,
              hospitalId: slot?.HospitalId ?? undefined, // ✅ Store per-slot hospital
            };

            if (slotObj.isCancelled) cancelled.push(day);
            if (slotObj.isDND) dnd.push(day);
            newSlotsByDay[day] = slotObj;
            // setSelectedHospitalId(slot?.hospitalId);
          }

          setSlotsByDay(newSlotsByDay);
          setCancelledDays(cancelled);
          setDndDays(dnd);

          if (
            selectedDays.length === 0 &&
            Object.keys(newSlotsByDay).length > 0
          ) {
            const allFetchedDays = Object.keys(newSlotsByDay);
            const daysToSelect = allFetchedDays.includes(today)
              ? allFetchedDays
              : [...allFetchedDays, today];

            setSelectedDays(Array.from(new Set(daysToSelect)));
          }
        } catch (error) {
          console.error("Error fetching doctor slots", error);
        } finally {
          setIsLoading(false); // ✅ Hide skeleton
        }
      }
    };

    loadSlots();
  }, [user, selectedHospitalId]);

  const renderSlotInputs = (day: string) => (
    <>
      <div className="flex justify-center gap-4 mb-2">
        <div>
          <Label
            className="flex justify-center gap-1"
            title={"Time Start (FROM)"}
          >
            <ClockArrowUp className="w-5 h-5 mb-3 text-blue-500 cursor-pointer" />
            {/* Start */}
          </Label>{" "}
          <Input
            type="time"
            value={slotsByDay[day]?.morning?.from || ""}
            onChange={(e) =>
              setSlotsByDay((prev) => ({
                ...prev,
                [day]: {
                  ...defaultDaySlot,
                  ...prev[day],
                  morning: {
                    ...defaultDaySlot.morning,
                    ...prev[day]?.morning,
                    from: e.target.value,
                  },
                },
              }))
            }
          />
        </div>
        <div>
          <Label className="flex justify-center gap-2" title={"Time End (TO)"}>
            <ClockArrowDown className="w-5 h-5 mb-3  text-blue-500" />
            {/* End */}
          </Label>
          <Input
            type="time"
            value={slotsByDay[day]?.morning?.to || ""}
            onChange={(e) =>
              setSlotsByDay((prev) => ({
                ...prev,
                [day]: {
                  ...defaultDaySlot,
                  ...prev[day],
                  morning: {
                    ...defaultDaySlot.morning,
                    ...prev[day]?.morning,
                    to: e.target.value,
                  },
                },
              }))
            }
          />
        </div>
        <div
          className="text-right font-medium text-sm w-24 flex items-center gap-1 mt-4"
          title={"Morning Slot"}
        >
          <Sun
            className={`w-4 h-4 transition-all duration-300 ${
              isTimeInRange(
                "08:00", // 👈 morning reference time
                slotsByDay[day]?.morning?.from || "",
                slotsByDay[day]?.morning?.to || ""
              )
                ? "text-yellow-500 fill-yellow-400 drop-shadow"
                : "text-muted-foreground"
            }`}
          />{" "}
          Morning
        </div>
      </div>

      {/* Evening */}
      <div className="flex justify-center gap-4 mb-2">
        <div>
          {/* <ClockArrowUp className="w-5 h-5" /> */}
          <Input
            type="time"
            value={slotsByDay[day]?.evening?.from || ""}
            onChange={(e) =>
              setSlotsByDay((prev) => ({
                ...prev,
                [day]: {
                  ...defaultDaySlot,
                  ...prev[day],
                  evening: {
                    ...defaultDaySlot.evening,
                    ...prev[day]?.evening,
                    from: e.target.value,
                  },
                },
              }))
            }
          />
        </div>
        <div>
          {/* <ClockArrowDown className="w-5 h-5" /> */}
          <Input
            type="time"
            value={slotsByDay[day]?.evening?.to || ""}
            onChange={(e) =>
              setSlotsByDay((prev) => ({
                ...prev,
                [day]: {
                  ...defaultDaySlot,
                  ...prev[day],
                  evening: {
                    ...defaultDaySlot.evening,
                    ...prev[day]?.evening,
                    to: e.target.value,
                  },
                },
              }))
            }
          />
        </div>
        <div
          className="text-right font-medium text-sm w-24 flex items-center gap-1 mb-1"
          title={"Evening Slot"}
        >
          <Moon
            className={`w-4 h-4 transition-all duration-300 ${
              isTimeInRange(
                "18:00", // 👈 evening reference time
                slotsByDay[day]?.evening?.from || "",
                slotsByDay[day]?.evening?.to || ""
              )
                ? "text-blue-500 fill-blue-400 drop-shadow"
                : "text-muted-foreground"
            }`}
          />{" "}
          Evening
        </div>
      </div>

      {/* Consultation Time */}
      <div className="flex items-end gap-4">
        {/* Average Consultation Time */}
        <div className="flex-1">
          <Label>Average Consultation Time (mins)</Label>
          <Input
            type="number"
            value={slotsByDay[day]?.consultTime || "15"}
            onChange={(e) =>
              setSlotsByDay((prev) => ({
                ...prev,
                [day]: {
                  ...defaultDaySlot,
                  ...prev[day],
                  consultTime: e.target.value,
                },
              }))
            }
          />
        </div>

        {/* Select Hospital */}
        <div className="flex-1">
          <Label className="mb-1 block text-sm font-medium text-gray-700">
            Select Hospital (Branch)
          </Label>

          <Select
            value={slotsByDay[day]?.hospitalId?.toString() ?? ""}
            onValueChange={(value) => {
              const hospitalId = Number(value);

              setSlotsByDay((prev) => {
                const existing = prev[day] || {
                  DoctorTimeSlotId: undefined,
                  morning: { from: "", to: "" },
                  evening: { from: "", to: "" },
                  consultTime: "15",
                  isDND: false,
                  dndRemarks: "",
                  isCancelled: false,
                  cancellationRemarks: "",
                  acceptAppointments: true,
                  isPermanentCancelled: false,
                  hospitalId,
                };

                return {
                  ...prev,
                  [day]: {
                    ...existing,
                    hospitalId,
                  },
                };
              });
            }}
          >
            <SelectTrigger className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <SelectValue placeholder="Select Hospital" />
            </SelectTrigger>
            <SelectContent className="border-white shadow-2xl rounded-2xl data-[state=checked]:bg-white data-[highlighted]:bg-white">
              {user?.AdminAccess.map((hosp: any) => (
                <SelectItem
                  key={hosp.hospital.HospitalId}
                  value={hosp.hospital.HospitalId.toString()}
                >
                  {hosp.hospital.HospitalName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent
        size="md"
        className="max-h-[95vh] overflow-y-auto p-4 max-w-3xl no-scrollbar"
      >
        <div className="flex justify-between items-center">
          <DialogTitle className="text-xl font-semibold">
            Doctor Time Slot
          </DialogTitle>
          <DialogClose asChild>
            <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition cursor-pointer">
              <X className="w-6 h-6" />
            </button>
          </DialogClose>
        </div>
        {isLoading ? (
          <DoctorSlotSkeleton />
        ) : (
          <>
            {/* Day selector */}
            <div className="grid grid-cols-7 gap-2 my-4">
              {daysOfWeek.map((day, idx) => {
                const isSelected = selectedDays.includes(day);
                const isCancelled = cancelledDays.includes(day);
                const isDND = dndDays.includes(day);
                const isToday = idx === todayIndex;

                return isSelected || isCancelled || isDND ? (
                  <ContextMenu key={idx}>
                    <ContextMenuTrigger asChild>
                      <div className="flex flex-col items-center space-y-3">
                        <span className="text-xs text-gray-600">
                          {getDateForDay(day)}
                        </span>

                        <Button
                          variant="outline"
                          title={day}
                          className={cn(
                            "rounded-full h-10 w-24 cursor-pointer",
                            isCancelled
                              ? "bg-red-500 text-white"
                              : isDND
                                ? "bg-yellow-400 text-white"
                                : isToday && isSelected
                                  ? "bg-blue-500 hover:bg-green-500 text-white"
                                  : isToday
                                    ? "bg-blue-400 text-white" // 💙 Today gets priority
                                    : isSelected
                                      ? "bg-green-500 text-white"
                                      : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-300"
                          )}
                          onClick={() => toggleDay(day)}
                        >
                          <div className="flex flex-col items-center leading-tight">
                            <span className="text-sm font-semibold">
                              {day.slice(0, 3).toUpperCase()}
                            </span>
                          </div>
                        </Button>
                      </div>
                    </ContextMenuTrigger>

                    <ContextMenuContent className="w-40 border-gray-300 text-gray-700 shadow-2xl rounded-lg cursor-pointer">
                      <ContextMenuItem
                        onClick={() => {
                          if (cancelledDays.includes(day)) {
                            setSlotsByDay((prev) => {
                              const existing = prev[day] ?? defaultDaySlot;
                              return {
                                ...prev,
                                [day]: {
                                  ...existing,
                                  isCancelled: false,
                                  cancellationRemarks: "",
                                },
                              };
                            });
                            setCancelledDays((prev) =>
                              prev.filter((d) => d !== day)
                            );
                          } else {
                            setRemarkDay(day);
                            setRemarkType("CANCEL");
                            setRemarkText(
                              slotsByDay[day]?.cancellationRemarks || ""
                            );
                            setShowRemarkDialog(true);
                          }
                        }}
                      >
                        {cancelledDays.includes(day)
                          ? "Undo Cancel"
                          : "Cancel Slot"}
                      </ContextMenuItem>

                      <ContextMenuItem
                        onClick={() => {
                          if (dndDays.includes(day)) {
                            setSlotsByDay((prev) => {
                              const existing = prev[day] ?? defaultDaySlot;
                              return {
                                ...prev,
                                [day]: {
                                  ...existing,
                                  isDND: false,
                                  dndRemarks: "",
                                },
                              };
                            });
                            setDndDays((prev) => prev.filter((d) => d !== day));
                          } else {
                            setRemarkDay(day);
                            setRemarkType("DND");
                            setRemarkText(slotsByDay[day]?.dndRemarks || "");
                            setShowRemarkDialog(true);
                          }
                        }}
                      >
                        {dndDays.includes(day) ? "Unmark DND" : "Mark as DND"}
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ) : (
                  <div
                    key={idx}
                    className="flex flex-col items-center space-y-3"
                  >
                    <span className="text-xs text-gray-600">
                      {getDateForDay(day)}
                    </span>
                    <Button
                      variant="outline"
                      title={day}
                      className={cn(
                        "rounded-full h-10 w-24 cursor-pointer",
                        isToday
                          ? "bg-blue-400 text-white"
                          : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-300"
                      )}
                      onClick={() => toggleDay(day)}
                    >
                      <div className="flex flex-col items-center leading-tight">
                        <span className="text-sm font-semibold">
                          {day.slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                    </Button>
                  </div>
                );
              })}
            </div>
            <Dialog open={showRemarkDialog} onOpenChange={setShowRemarkDialog}>
              <DialogContent className="sm:max-w-md">
                <DialogTitle className="text-lg font-medium">
                  {remarkType === "CANCEL" ? "Cancel Slot" : "Mark as DND"} for{" "}
                  {remarkDay}
                </DialogTitle>

                <div className="mt-4 space-y-2">
                  <Label>
                    {remarkType === "CANCEL"
                      ? "Cancellation Remark"
                      : "DND Remark"}
                  </Label>
                  <Input
                    placeholder="Enter remark"
                    value={remarkText}
                    onChange={(e) => setRemarkText(e.target.value)}
                  />
                </div>

                <DialogFooter className="mt-6">
                  <div className="flex items-center gap-2 flex-1">
                    <Switch
                      checked={
                        remarkDay
                          ? (slotsByDay[remarkDay]?.isPermanentCancelled ??
                            false)
                          : false
                      }
                      onCheckedChange={(checked) => {
                        setSlotsByDay((prev) => ({
                          ...prev,
                          [remarkDay ?? ""]: {
                            ...defaultDaySlot,
                            ...prev[remarkDay ?? ""],
                            isPermanentCancelled: checked,
                          },
                        }));
                      }}
                    />
                    <span className="text-sm font-medium">
                      Cancel permanently (apply to all future {remarkDay})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setShowRemarkDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (!remarkDay || !remarkType) return;

                      setSlotsByDay((prev) => {
                        const prevSlot = prev[remarkDay] ?? defaultDaySlot;

                        return {
                          ...prev,
                          [remarkDay]: {
                            ...prevSlot,
                            isDND: remarkType === "DND" ? true : prevSlot.isDND,
                            dndRemarks:
                              remarkType === "DND"
                                ? remarkText
                                : prevSlot.dndRemarks,
                            isCancelled:
                              remarkType === "CANCEL"
                                ? true
                                : prevSlot.isCancelled,
                            cancellationRemarks:
                              remarkType === "CANCEL"
                                ? remarkText
                                : prevSlot.cancellationRemarks,
                          },
                        };
                      });

                      if (remarkType === "CANCEL") {
                        setCancelledDays((prev) =>
                          prev.includes(remarkDay) ? prev : [...prev, remarkDay]
                        );
                      } else {
                        setDndDays((prev) =>
                          prev.includes(remarkDay) ? prev : [...prev, remarkDay]
                        );
                      }

                      setShowRemarkDialog(false);
                      setRemarkText("");
                      setRemarkType(null);
                      setRemarkDay(null);
                    }}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* Time inputs per selected day */}
            {/* {selectedDays.length > 1 ? (
  <Accordion type="multiple" className="my-4">
    {selectedDays.map((day) => (
      <AccordionItem key={day} value={day}>
        <AccordionTrigger
          className={cn(
            "rounded-md px-4 py-2 text-sm font-semibold w-full text-left",
            cancelledDays.includes(day)
              ? "bg-red-50 text-black"
              : dndDays.includes(day)
              ? "bg-yellow-50 text-black"
              : "bg-green-50 text-black"
          )}
        >
          <div className="flex justify-between items-center w-full">
            <span>{day}</span>
            {cancelledDays.includes(day) && (
              <span className="text-md italic text-black">
                {slotsByDay[day]?.cancellationRemarks}
              </span>
            )}
            {dndDays.includes(day) && !cancelledDays.includes(day) && (
              <span className="text-md italic text-black">
                {slotsByDay[day]?.dndRemarks}
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="border rounded-4xl p-4 mb-4 bg-white border-gray-200 drop-shadow-xl">
          {renderSlotInputs(day)}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
) : selectedDays.length === 1 && selectedDays[0] ? (
  <div
    key={selectedDays[0]}
    className="border rounded-4xl p-4 mb-4 bg-white border-gray-200 drop-shadow-2xl"
  >
    <h4 className="text-base font-semibold text-blue-400 mb-3">
      {selectedDays[0]}
    </h4>
    {renderSlotInputs(selectedDays[0])}
  </div>
) : null} */}

            {/* ✅ Render today's slot open by default (outside accordion) */}
            <Accordion
              type="multiple"
              defaultValue={[today]} // Today is open by default
              className="my-4"
            >
              {/* 🔵 Today Slot (collapsible) */}
              {showTodaySlot && (
                <AccordionItem key={today} value={today}>
                  <AccordionTrigger
                    className={cn(
                      "rounded-md px-4 py-2 text-sm font-semibold w-full text-left",
                      cancelledDays.includes(today)
                        ? "bg-red-50 text-black"
                        : dndDays.includes(today)
                          ? "bg-yellow-50 text-black"
                          : "bg-blue-50 text-black"
                    )}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span>{today} (Today)</span>
                      {cancelledDays.includes(today) && (
                        <span className="text-md italic text-black">
                          {slotsByDay[today]?.cancellationRemarks}
                        </span>
                      )}
                      {dndDays.includes(today) &&
                        !cancelledDays.includes(today) && (
                          <span className="text-md italic text-black">
                            {slotsByDay[today]?.dndRemarks}
                          </span>
                        )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="border rounded-4xl p-4 mb-4 bg-white border-gray-200 drop-shadow-xl">
                    {renderSlotInputs(today)}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* 🗓️ Other Selected Days */}
              {selectedDaysWithoutToday.map((day) => (
                <AccordionItem key={day} value={day}>
                  <AccordionTrigger
                    className={cn(
                      "rounded-md px-4 py-2 text-sm font-semibold w-full text-left",
                      cancelledDays.includes(day)
                        ? "bg-red-50 text-black"
                        : dndDays.includes(day)
                          ? "bg-yellow-50 text-black"
                          : "bg-green-50 text-black"
                    )}
                  >
                    <div
                      className="flex justify-between items-center w-full"
                      title="Remark"
                    >
                      <span>{day}</span>
                      {cancelledDays.includes(day) && (
                        <span className="text-md italic text-black">
                          {slotsByDay[day]?.cancellationRemarks}
                        </span>
                      )}
                      {dndDays.includes(day) &&
                        !cancelledDays.includes(day) && (
                          <span className="text-md italic text-black">
                            {slotsByDay[day]?.dndRemarks}
                          </span>
                        )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="border rounded-4xl p-4 mb-4 bg-white border-gray-200 drop-shadow-xl">
                    {renderSlotInputs(day)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Hospital dropdown */}
            {/* <div className="my-4">
              <Label>Select Hospital (Branch)</Label>
              <select
                className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={selectedHospitalId}
                onChange={(e) => setSelectedHospitalId(e.target.value)}
              >
                <option value="">Select Hospital</option>
                {user?.AdminAccess.map((hosp: any) => (
                  <option
                    key={hosp.hospital.HospitalId}
                    value={hosp.hospital.HospitalId}
                  >
                    {hosp.hospital.HospitalName}
                  </option>
                ))}
              </select>
            </div> */}
            <div className="flex items-center gap-2 flex-1">
              <Switch
                checked={selectedDays.every(
                  (day) => slotsByDay[day]?.acceptAppointments
                )}
                onCheckedChange={(checked) => {
                  setSlotsByDay((prev) => {
                    const updated: typeof prev = { ...prev };

                    selectedDays.forEach((day) => {
                      updated[day] = {
                        ...defaultDaySlot,
                        ...updated[day],
                        acceptAppointments: checked,
                      };
                    });

                    return updated;
                  });
                }}
              />
              <span className="text-sm font-medium">
                Accept Appointments on Selected Days
              </span>
            </div>
            {/* Footer */}
            <DialogFooter className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mt-6">
              {/* LEFT: Slot Status Legend */}
              <div className="flex flex-col items-start w-full sm:w-2px/3">
                <div className="flex flex-wrap gap-x-0 gap-y-2 text-xs font-medium">
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <span className="w-4 h-4 bg-gray-300 rounded-full"></span>{" "}
                    Empty slot
                  </div>
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <span className="w-4 h-4 bg-green-500 rounded-full"></span>{" "}
                    Slot Present
                  </div>
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <span className="w-4 h-4 bg-red-500 rounded-full"></span>{" "}
                    Cancelled
                  </div>
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <span className="w-4 h-4 bg-yellow-400 rounded-full"></span>{" "}
                    DND(Do Not Disturb)
                  </div>
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <span className="w-4 h-4 bg-blue-500 rounded-full"></span>{" "}
                    Today Day
                  </div>
                </div>
              </div>

              {/* RIGHT: Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  className="rounded-full h-10 cursor-pointer shadow-2xl bg-red-500 border-gray-300 text-white hover:bg-red-600"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-full h-10 cursor-pointer shadow-2xl"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Timeslot;
