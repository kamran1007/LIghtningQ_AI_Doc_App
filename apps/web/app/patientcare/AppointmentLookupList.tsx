
"use client";
import { motion, AnimatePresence } from "framer-motion";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Maximize2, X, Edit } from "lucide-react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { TabView, TabPanel } from "primereact/tabview";

const patients = [
  {
    name: "Kamran Quamar",
    mrn: "252342432432",
    phone: "34543543543",
    email: "kam@gmail.com",
    dob: "26 Years",
    specialist: "Cardiologist",
    reason: "Hypertension",
    acuity: "High",
    assignedProvider: "Dr. AK Khan",
    lastVisit: "2025-02-02",
    status: "current",
  },
  {
    name: "Riya Sharma",
    mrn: "998877665544",
    phone: "+91 9876543210",
    email: "riya.sharma@gmail.com",
    dob: "22 Years",
    specialist: "ENT",
    reason: "Throat Pain",
    acuity: "Medium",
    assignedProvider: "Dr. Lakshman",
    lastVisit: "2025-06-12",
    status: "high",
  },
];

const getAcuityColor = (acuity) => {
  switch (acuity) {
    case "High":
      return "bg-red-100 text-red-600";
    case "Medium":
      return "bg-yellow-100 text-yellow-600";
    case "Low":
      return "bg-green-100 text-green-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function AppointmentLookupList() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredPatients =
    filter === "all" ? patients : patients.filter((p) => p.status === filter);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const currentPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openSheet = (patient) => {
    setSelectedPatient(patient);
    setDrawerOpen(true);
    setFullScreen(false);
  };

  const closeSheet = () => {
    setDrawerOpen(false);
    setSelectedPatient(null);
    setFullScreen(false);
  };

  const scrollableTabs = [
    { title: "Vitals", content: "Vitals form here..." },
    { title: "Records", content: "Records form here..." },
    { title: "Medications", content: "Medications form here..." },
    { title: "Test Results", content: "Test results component..." },
  ];

  const classificationTabs = [
    { key: "all", label: "All" },
    { key: "current", label: "Current" },
    { key: "new", label: "New" },
    { key: "discharged", label: "Discharged" },
    { key: "high", label: "High Priority" },
  ];

  function handleEdit(original: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="p-0 py-3 space-y-4">
      {/* Modern Tab-like Classification Filter */}
      <div className="flex gap-1 px-2 overflow-auto rounded-xl  p-1">
        {classificationTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${
              filter === key
                ? "bg-[#EFFFFD] text-grey-600 shadow-xl"
                : "bg-pink-50 text-zinc-600 hover:bg-purple-100 border border-zinc-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="w-full overflow-hidden rounded-md shadow-sm border-b border-purple-600">
        <table className="w-full text-sm text-left border-b border-purple-600">
          <thead className="bg-purple-100 text-zinc-600 text-xs font-sans border-b border-purple-600">
            <tr className="divide-x divide-zinc-200">
              <th className="px-4 py-3 border-b border-purple-600">Name</th>
              <th className="px-4 py-3border-b border-purple-600">MRN</th>
              <th className="px-4 py-3border-b border-purple-600">Contact Info</th>
              <th className="px-4 py-3border-b border-purple-600">Age</th>
              <th className="px-4 py-3border-b border-purple-600">Specialist</th>
              <th className="px-4 py-3border-b border-purple-600">Reason</th>
              <th className="px-4 py-3border-b border-purple-600">Acuity</th>
              <th className="px-4 py-3 border-b border-purple-600">Assigned Provider</th>
              <th className="px-4 py-3 border-b border-purple-600">Last Visit</th>
              <th className="px-2 py-3 w-16 text-center border-b border-purple-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {currentPatients.map((p, idx) => (
              <tr
                key={idx}
                className="hover:bg-[#EFFFFD] cursor-pointer"
                onClick={() => openSheet(p)}
              >
                <td className="px-4 py-3 font-medium text-zinc-800">
                  {p.name}
                </td>
                <td className="px-4 py-3 text-zinc-700">{p.mrn}</td>
                <td className="px-4 py-3 space-y-0.5">
                  <p>{p.phone}</p>
                  <p className="text-xs text-muted-foreground">{p.email}</p>
                </td>
                <td className="px-4 py-3">{p.dob}</td>
                <td className="px-4 py-3">{p.specialist}</td>
                <td className="px-4 py-3">{p.reason}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-xl ${getAcuityColor(p.acuity)}`}
                  >
                    {p.acuity}
                  </span>
                </td>
                <td className="px-4 py-3">{p.assignedProvider}</td>
                <td className="px-4 py-3">{p.lastVisit}</td>
                {/* <td className="px-2 py-3 w-16 text-center">
                  <MoreHorizontal className="w-4 h-4 text-zinc-600" />
                </td> */}
                <td className="px-2 py-3 w-16 text-center">
                  <div className="flex justify-center gap-1 items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:outline-none">
                        <MoreHorizontal className="w-5 h-5 text-blue-500 cursor-pointer" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className=" rounded-md shadow-md border border-gray-200 bg-white"
                      >
                        <DropdownMenuItem>View Record</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center pt-2">
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, value) => setCurrentPage(value)}
            variant="outlined"
            color="secondary"
          />
        </Stack>
      </div>

      {/* Patient Sheet Drawer */}
      <AnimatePresence>
  {drawerOpen && (
    <motion.div
      key="drawer"
      initial={{ x: "100%" }}
      animate={{ x: 0, width: fullScreen ? "100vw" : "40vw" }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-0 right-0 z-50 h-full bg-white shadow-xl"
    >
      <div className="flex justify-between items-center px-4 pt-4">
        <h2 className="text-lg font-semibold">
          {selectedPatient?.name} - {selectedPatient?.mrn}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFullScreen(!fullScreen)}
            className="cursor-pointer"
          >
            <Maximize2 className="w-6 h-6 text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeSheet}
            className="cursor-pointer w-10 h-10"
          >
            <X className="w-10 h-10 text-red-600" />
          </Button>
        </div>
      </div>

      <div className="px-4 pb-6 overflow-y-auto h-[calc(100%-4rem)]">
        <TabView scrollable>
          {scrollableTabs.map((tab) => (
            <TabPanel key={tab.title} header={tab.title}>
              <p className="m-0">{tab.content}</p>
            </TabPanel>
          ))}
        </TabView>
      </div>
    </motion.div>
  )}
</AnimatePresence>


    </div>
  );
}
