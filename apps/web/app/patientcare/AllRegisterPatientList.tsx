"use client";

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
    lastVisit: "2025-02-02",
  },
  {
    name: "Riya Sharma",
    mrn: "998877665544",
    phone: "+91 9876543210",
    email: "riya.sharma@gmail.com",
    dob: "22 Years",
    lastVisit: "2025-06-12",
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

export default function AllRegisterPatientList() {
  const [filter, setFilter] = useState("Appt");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredPatients =
    filter === "Appt" ? patients : patients.filter((p) => p.status === filter);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const currentPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function handleEdit(original: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="p-0 py-1 space-y-1">
      {/* Modern Tab-like Classification Filter */}
      <div className="flex gap-1 px-2 overflow-auto rounded-xl  p-1"></div>

      {/* Table */}
      <div className="w-full overflow-hidden rounded-md shadow-sm  bg-blue-400">
        <table className="w-full text-sm text-left border-b border-blue-400">
          <thead className="bg-blue-100 text-zinc-600 text-xs font-sans border-b border-blue-400">
            <tr className="divide-x divide-zinc-200">
              <th className="px-4 py-3 border-b border-blue-400">Name</th>
              <th className="px-4 py-3border-b border-blue-400">MRN</th>
              <th className="px-4 py-3border-b border-blue-400">
                Contact Info
              </th>
              <th className="px-4 py-3border-b border-blue-400">Age</th>

              <th className="px-4 py-3 border-b border-blue-400">Last Visit</th>
              <th className="px-2 py-3 w-16 text-center border-b border-blue-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {currentPatients.map((p, idx) => (
              <tr key={idx} className="hover:bg-[#EFFFFD] cursor-pointer">
                <td className="px-4 py-3 font-medium text-zinc-800">
                  {p.name}
                </td>
                <td className="px-4 py-3 text-zinc-700">{p.mrn}</td>
                <td className="px-4 py-3 space-y-0.5">
                  <p>{p.phone}</p>
                  <p className="text-xs text-muted-foreground">{p.email}</p>
                </td>
                <td className="px-4 py-3">{p.dob}</td>

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
            color="primary"
          />
        </Stack>
      </div>

      {/* Patient Sheet Drawer */}
    </div>
  );
}
