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

interface AsideProps {
  user: User | null;
}

const Aside: React.FC<AsideProps> = ({ user }) => {
  const [openModal, setOpenModal] = useState(false);
  const navItems = [
    {
      label: "Access Rights",
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
    },
    {
      label: "Time Slots",
      icon: <Clock className="w-4 h-4 text-blue-600" />,
      onClick: () => setIsTimeSlotDialogOpen(), // Open dialog
    },
    {
      label: "Costing",
      icon: <DollarSign className="w-4 h-4 text-blue-600" />,
      onClick: () => setIsCostingDialogOpen(),
    },
  ];
  const setIsTimeSlotDialogOpen = () => {
    console.log("Opening Timeslot dialog");
    setOpenModal(true);
  };

  const setIsCostingDialogOpen = () => {
    console.log("Opening Timeslot dialog");
    setOpenModal(true);
  };
  return (
    <>
      <aside className="w-52 bg-white p-4 rounded-4xl shadow-2xl space-y-6">
        {/* Back Button */}
        <div>
          <div className="flex">
            <Button
              asChild
              className="justify-center rounded-2xl"
              title="Back to Admin"
            >
              <Link href="/admin" className="flex items-center gap-1 text-sm">
                <CircleChevronLeft className="h-4 w-4" />
                {/* Back */}
              </Link>
            </Button>
          </div>
        </div>

        {/* Section Title */}
        <div className="px-2 flex flex-col items-center mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1 flex items-center">
            User Settings
          </h2>
          <div className="h-1 w-40 bg-blue-500 rounded-full flex items-center" />
        </div>

        {/* Navigation List */}
        <ul className="space-y-2 text-sm">
          {navItems.map((item, idx) => (
            <li
              key={idx}
              onClick={item.onClick} // ✅ Hook up the click handler here
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-white hover:bg-blue-50 transition-colors cursor-pointer group"
            >
              {item.icon}
              <span className="font-medium text-gray-700 group-hover:text-blue-600">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </aside>
      <Timeslot open={openModal} onOpenChange={setOpenModal} user={user} />
    </>
  );
}

export default Aside;
