"use client";
// app/(admin)/AppSetting.tsx
import { Scrollbars } from 'react-custom-scrollbars-2';

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  FlaskConical,
  Pill,
  PlusCircle,
  Scissors,
  Stethoscope,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { blue } from '@mui/material/colors';

// Lazy load the modal component
const MedicineModal = dynamic(() => import("../settings/MedicineModal"), {
  ssr: false,
});
const DiagnosisDialog = dynamic(() => import("../settings/DiagnosisDialog"), {
  ssr: false,
});
const InvestigationDialog = dynamic(
  () => import("../settings/InvestigationDialog"),
  {
    ssr: false,
  }
);
const ChiefComplaintDialog = dynamic(
  () => import("../settings/ChiefComplaintDialog"),
  {
    ssr: false,
  }
);

const ProcedureDialog = dynamic(() => import("../settings/ProcedureModal"), {
  ssr: false,
});
const MedicalHistoryDialog = dynamic(
  () => import("../settings/MedicalHistoryModal"),
  {
    ssr: false,
  }
);

const settings = [
  {
    name: "Medicine",
    color: "bg-gradient-to-tr from-teal-300 to-teal-400",
    icon: <Pill className="w-4 h-4" />,
  },
  {
    name: "Chief Complaint",
    color: "bg-gradient-to-tr from-teal-200 to-teal-300",
    icon: <Stethoscope className="w-4 h-4" />,
  },
  {
    name: "Investigation",
    color: "bg-gradient-to-tr from-teal-300 to-teal-400",
    icon: <FlaskConical className="w-4 h-4" />,
  },
  {
    name: "Diagnosis",
    color: "bg-gradient-to-tr from-teal-200 to-teal-300",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    name: "Procedures",
    color: "bg-gradient-to-tr from-teal-300 to-teal-400",
    icon: <Scissors className="w-4 h-4" />,
  },
  {
    name: "Medical History Tags",
    color: "bg-gradient-to-tr from-teal-200 to-teal-300",
    icon: <History className="w-4 h-4" />,
  },

  // {
  //   name: "Vitals Templates",
  //   color: "bg-gradient-to-tr from-teal-200 to-teal-300",
  // },

  // {
  //   name: "Advice Templates",
  //   color: "bg-gradient-to-tr from-teal-200 to-teal-300",
  // },
];

// const settings = [
//   { name: "Medicine", color: "bg-gradient-to-tr from-sky-200 to-blue-300" },
//   { name: "Chief Complaint", color: "bg-gradient-to-tr from-rose-200 to-pink-300" },
//   { name: "Investigation", color: "bg-gradient-to-tr from-amber-200 to-yellow-300" },
//   { name: "Diagnosis", color: "bg-gradient-to-tr from-emerald-200 to-green-300" },
//   { name: "Procedures", color: "bg-gradient-to-tr from-purple-200 to-indigo-300" },
//   { name: "Vitals Templates", color: "bg-gradient-to-tr from-cyan-200 to-teal-300" },
//   { name: "Medical History Tags", color: "bg-gradient-to-tr from-lime-200 to-green-300" },
//   { name: "Advice Templates", color: "bg-gradient-to-tr from-fuchsia-200 to-purple-300" },
// ];

function AppSetting() {
  const [openSetting, setOpenSetting] = useState<string | null>(null);

  const handleOpenModal = (name: string) => {
    console.log("Opening:", name); // <- debug
    if (
      [
        "Medicine",
        "Diagnosis",
        "Investigation",
        "Chief Complaint",
        "Procedures",
        "Medical History Tags",
      ].includes(name)
    ) {
      setOpenSetting(name);
    }
  };

  const closeModal = () => setOpenSetting(null);

  return (
    // <Scrollbars className='custom-scrollbar overflow-auto h-screen' >

       <div className="min-h-screen bg-gradient-to-br from-white to-teal-50 p-2 custom-scrollbar">
      {/* <h1 className="text-2xl font-semibold text-slate-800 mb-4 font-sans">App Settings</h1> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {settings.map((setting, index) => (
          <Card
            key={index}
            onClick={() => handleOpenModal(setting.name)}
            className={cn(
              "rounded-2xl shadow-xl transform transition duration-300 hover:scale-105",
              setting.color,
              "text-gray-700 font-sans"
            )}
          >
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {/* <setting.icon className="w-6 h-6 text-white" /> */}
                  {setting.icon}
                  <h2 className="text-lg font-bold tracking-wide">
                    {setting.name}
                  </h2>
                </div>
                <p className="text-sm opacity-80">
                  Manage {setting.name.toLowerCase()} settings.
                </p>
              </div>

              <Button
                variant="ghost"
                className="mt-6 w-full justify-center gap-2 text-white hover:bg-white/20"
                onClick={() => handleOpenModal(setting.name)}
              >
                <PlusCircle className="w-5 h-5" />
                Add {setting.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Load Medicine Modal only when needed */}
      {/* Conditionally load modals based on state */}
      {openSetting === "Medicine" && (
        <MedicineModal open onClose={closeModal} />
      )}
      {openSetting === "Diagnosis" && (
        <DiagnosisDialog open onClose={closeModal} />
      )}
      {openSetting === "Investigation" && (
        <InvestigationDialog open onClose={closeModal} />
      )}
      {openSetting === "Chief Complaint" && (
        <ChiefComplaintDialog open onClose={closeModal} />
      )}
      {openSetting === "Procedures" && (
        <ProcedureDialog open onClose={closeModal} />
      )}
      {openSetting === "Medical History Tags" && (
        <MedicalHistoryDialog open onClose={closeModal} />
      )}
    </div>
    // </Scrollbars>
   
  );
}

export default AppSetting;
