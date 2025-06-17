"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X, Sun, Moon } from "lucide-react";
import "react-time-picker/dist/TimePicker.css";
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

interface TimeslotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const Timeslot: React.FC<TimeslotProps> = ({ open, onOpenChange }) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [amSlot, setAmSlot] = useState({ from: "", to: "" });
  const [pmSlot, setPmSlot] = useState({ from: "", to: "" });
  const [consultTime, setConsultTime] = useState("15");
  const [acceptAppointments, setAcceptAppointments] = useState(true);
  const [cancelledDays, setCancelledDays] = useState<string[]>([]);
  const [dndDays, setDndDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
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

  const todayIndex = (new Date().getDay() + 6) % 7;

  const handleSave = () => {
    const payload = {
      selectedDays,
      cancelledDays,
      dndDays,
      amSlot,
      pmSlot,
      consultTime,
      acceptAppointments,
    };
    console.log("Save Payload", payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent size="md" className="max-h-[100vh] overflow-y-auto p-4">
        <div className="flex justify-between items-center w-full ">
          <DialogTitle className="text-xl font-semibold">
            Doctor Time Slot
          </DialogTitle>
          <DialogClose asChild>
            <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition cursor-pointer">
              <X className="w-6 h-6" />
            </button>
          </DialogClose>
        </div>

        <div className="grid grid-cols-7 gap-2 my-4">
          {daysOfWeek.map((day, idx) => {
            const isSelected = selectedDays.includes(day);
            const isCancelled = cancelledDays.includes(day);
            const isDND = dndDays.includes(day);
            const isToday = idx === todayIndex;

            return (
              <ContextMenu key={idx}>
                <ContextMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "rounded-full h-10 cursor-pointer",
                      isCancelled
                        ? "bg-red-500 text-white"
                        : isDND
                          ? "bg-yellow-400 text-white"
                          : isSelected
                            ? "bg-green-500 text-white"
                            : isToday
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-300"
                    )}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </Button>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-40 border-gray-300 text-gray-700 shadow-2xl rounded-lg cursor-pointer">
                  <ContextMenuItem onClick={() => handleCancelDay(day)}>
                    {cancelledDays.includes(day)
                      ? "Undo Cancel"
                      : "Cancel Slot"}
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleMarkDND(day)}>
                    {dndDays.includes(day) ? "Unmark DND" : "Mark as DND"}
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-6 mb-2">
          <div className="flex gap-6">
            <div>
              <Label>FROM</Label>
              <Input
                type="time"
                value={amSlot.from}
                onChange={(e) => setAmSlot({ ...amSlot, from: e.target.value })}
              />
            </div>
            <div>
              <Label>TO</Label>
              <Input
                type="time"
                value={amSlot.to}
                onChange={(e) => setAmSlot({ ...amSlot, to: e.target.value })}
              />
            </div>
          </div>
          <div className="text-right font-medium text-sm w-24 flex items-center gap-1">
            <Sun className="w-4 h-4" /> Morning
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mb-2">
          <div className="flex gap-6">
            <div>
              <Label>FROM</Label>
              <Input
                type="time"
                value={pmSlot.from}
                onChange={(e) => setPmSlot({ ...pmSlot, from: e.target.value })}
              />
            </div>
            <div>
              <Label>TO</Label>
              <Input
                type="time"
                value={pmSlot.to}
                onChange={(e) => setPmSlot({ ...pmSlot, to: e.target.value })}
              />
            </div>
          </div>
          <div className="text-right font-medium text-sm w-24 flex items-center gap-1">
            <Moon className="w-4 h-4" /> Evening
          </div>
        </div>

        <div className="flex justify-between items-center gap-6 mt-2">
          <div className="w-1/2">
            <Label>Average Consultation Time (mins)</Label>
            <Input
              type="number"
              value={consultTime}
              min="5"
              step="5"
              onChange={(e) => setConsultTime(e.target.value)}
            />
          </div>
          <div className="w-1/2">
            <Label>Select Hospital (Branch)</Label>
            <select className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Select Hospital</option>
              <option value="GENERAL">GENERAL</option>
              <option value="OPHTHALMOLOGY">OPHTHALMOLOGY</option>
            </select>
          </div>
        </div>

        <DialogFooter className="w-full flex justify-between items-center gap-4 mt-4">
          {/* Switch aligned left */}
          <div className="flex items-center gap-2 flex-1">
            <Switch
              checked={acceptAppointments}
              onCheckedChange={setAcceptAppointments}
            />
            <span className="text-sm font-medium">
              Accept Appointments on Selected Days
            </span>
          </div>

          {/* Buttons aligned right */}
          <div className="flex items-center gap-2">
            <Button
              className="rounded-full h-10 cursor-pointer shadow-2xl bg-red-500 border-gray-300 text-white hover:bg-red-500"
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
      </DialogContent>
    </Dialog>
  );
};

export default Timeslot;
