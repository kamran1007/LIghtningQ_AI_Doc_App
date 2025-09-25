import { Button } from "@/components/ui/button";
import {
  CircleChevronLeft,
  Clock,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Timeslot from "./timeslot";
import { User } from "app/admin/hospitaluserlist";
import Costing from "./costing";
import { set } from "zod";
import toast from "react-hot-toast";
import AccessRight from "./accessright";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";

interface AsideProps {
  user: User | null;
}

const Aside: React.FC<AsideProps> = ({ user }) => {
  const [openAccessRightDialog, setOpenAccessRightDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openCostingModal, setOpenCostingModal] = useState(false);

  const navItems = [
    {
      label: "Access Rights",
      icon: <ShieldCheck className="w-4 h-4 text-teal-400" />,
      onClick: () => setIsAccessRightDialogOpen(), // Open dialog
    },
    {
      label: "Time Slots",
      icon: <Clock className="w-4 h-4 text-teal-400" />,
      onClick: () => setIsTimeSlotDialogOpen(), // Open dialog
    },
    {
      label: "Costing",
      icon: <DollarSign className="w-4 h-4 text-teal-400" />,
      onClick: () => setIsCostingDialogOpen(),
    },
  ];

  const setIsAccessRightDialogOpen = () => {
    if (!user) {
      setOpenAccessRightDialog(false);
      toast.error("User has Not Added!  Add user first.");
    } else {
      console.log("Opening Access right dialog");
      setOpenAccessRightDialog(true);
    }
  };

  const setIsTimeSlotDialogOpen = () => {
    if (!user) {
      setOpenModal(false);
      toast.error("User has Not Added!  Add user first.");
    } else {
      console.log("Opening Timeslot dialog");
      setOpenModal(true);
    }
  };

  const setIsCostingDialogOpen = () => {
    if (!user) {
      setOpenCostingModal(false);
      toast.error("User has Not Added!  Add user first.");
    } else {
      console.log("Opening Timeslot dialog");
      setOpenCostingModal(true);
    }
  };
  return (
    <>
      <aside className="w-52 bg-white p-4 rounded-4xl shadow-2xl space-y-6">
        {/* Back Button */}
        <div>
          <div className="flex">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    className="justify-center rounded-2xl"
                  >
                    <Link
                      href="/admin"
                      className="flex items-center gap-1 text-sm"
                    >
                      <CircleChevronLeft className="h-4 w-4 text-teal-400" />
                      {/* You can leave text hidden if you only want tooltip */}
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
        </div>

        {/* Section Title */}
        <div className="px-2 flex flex-col items-center mt-6 font-sans">
          <h2 className="text-lg font-semibold text-gray-800 mb-1 flex items-center">
            User Settings
          </h2>
          <div className="h-1 w-40 bg-teal-500 rounded-full flex items-center font-sans" />
        </div>

        {/* Navigation List */}
        <ul className="space-y-2 text-sm">
          {navItems.map((item, idx) => (
            <li
              key={idx}
              onClick={item.onClick} // ✅ Hook up the click handler here
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-white hover:bg-teal-50 transition-colors cursor-pointer group"
            >
              {item.icon}
              <span className="font-medium text-gray-700 group-hover:text-teal-400">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </aside>
      <Timeslot open={openModal} onOpenChange={setOpenModal} user={user} />
      <Costing
        open={openCostingModal}
        onOpenChange={setOpenCostingModal}
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
