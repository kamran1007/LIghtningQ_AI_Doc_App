"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  CircleChevronLeft,
  Clock,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import Timeslot from "./timeslot";
import Costing from "./costing";
import AccessRight from "./accessright";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { User } from "@/types/user";

interface AsideProps {
  user: User | null;
}

const Aside: React.FC<AsideProps> = ({ user }) => {
  // State for modals
  const [openAccessRightDialog, setOpenAccessRightDialog] = useState(false);
  const [openTimeSlotDialog, setOpenTimeSlotDialog] = useState(false);
  const [openCostingDialog, setOpenCostingDialog] = useState(false);

  // ✅ Get permissions from Redux store
  const accessRights = useSelector(
    (state: RootState) => state.hospitalAccessRight.data
  );

  // ✅ Find the "Admin" module
  const adminModule = accessRights?.find(
    (m: any) => m.ModuleName === "Admin"
  );

  // ✅ Extract submodules
  const submodules = adminModule?.Submodules ?? [];

  // ✅ Check if each submodule is enabled
  const accessRightEnabled =
    submodules.find((s: any) => s.SubModuleName === "Access Right")?.enabled ??
    false;

  const timeSlotEnabled =
    submodules.find((s: any) => s.SubModuleName === "Time Slot")?.enabled ??
    false;

  const costingEnabled =
    submodules.find((s: any) => s.SubModuleName === "Costing")?.enabled ?? false;

  // ✅ Helper handlers with permission + user checks
  const handleAccessRightOpen = () => {
    if (!accessRightEnabled) {
      toast.error("Access Rights is disabled for your role.");
      return;
    }
    if (!user) {
      toast.error("Please add the user first before managing access rights.");
      return;
    }
    setOpenAccessRightDialog(true);
  };

  const handleTimeSlotOpen = () => {
    if (!timeSlotEnabled) {
      toast.error("Time Slot module is disabled for your role.");
      return;
    }
    if (!user) {
      toast.error("Please add the user first before managing time slots.");
      return;
    }
    setOpenTimeSlotDialog(true);
  };

  const handleCostingOpen = () => {
    if (!costingEnabled) {
      toast.error("Costing module is disabled for your role.");
      return;
    }
    if (!user) {
      toast.error("Please add the user first before managing costing.");
      return;
    }
    setOpenCostingDialog(true);
  };

  // ✅ Define navigation items dynamically based on permissions
  const navItems = [
    {
      label: "Access Rights",
      icon: <ShieldCheck className="w-4 h-4 text-teal-400" />,
      onClick: handleAccessRightOpen,
      enabled: accessRightEnabled,
    },
    {
      label: "Time Slots",
      icon: <Clock className="w-4 h-4 text-teal-400" />,
      onClick: handleTimeSlotOpen,
      enabled: timeSlotEnabled,
    },
    {
      label: "Costing",
      icon: <DollarSign className="w-4 h-4 text-teal-400" />,
      onClick: handleCostingOpen,
      enabled: costingEnabled,
    },
  ];

  return (
    <>
      <aside className="w-52 bg-white p-4 rounded-4xl shadow-2xl space-y-6">
        {/* Back Button */}
        <div className="flex justify-start">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild className="justify-center rounded-2xl">
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 text-sm"
                  >
                    <CircleChevronLeft className="h-4 w-4 text-teal-400" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                sideOffset={6}
                className="bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg z-[9999]"
              >
                Back to Admin
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Section Title */}
        <div className="px-2 flex flex-col items-center mt-6 font-sans">
          <h2 className="text-lg font-semibold text-gray-800 mb-1 flex items-center">
            User Settings
          </h2>
          <div className="h-1 w-40 bg-teal-500 rounded-full" />
        </div>

        {/* Navigation List */}
        <ul className="space-y-2 text-sm">
          {navItems.map((item, idx) => (
            <li
              key={idx}
              onClick={() => item.enabled && item.onClick()}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors 
                ${
                  item.enabled
                    ? "cursor-pointer bg-white hover:bg-teal-50 group"
                    : "cursor-not-allowed opacity-50 bg-gray-50"
                }`}
            >
              {item.icon}
              <span
                className={`font-medium ${
                  item.enabled
                    ? "text-gray-700 group-hover:text-teal-400"
                    : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Dialog Components */}
      <Timeslot
        open={openTimeSlotDialog}
        onOpenChange={setOpenTimeSlotDialog}
        user={user}
      />
      <Costing
        open={openCostingDialog}
        onOpenChange={setOpenCostingDialog}
        user={user}
      />
      <AccessRight
        open={openAccessRightDialog}
        onOpenChange={setOpenAccessRightDialog}
        user={user}
      />
    </>
  );
};

export default Aside;
