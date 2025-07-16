"use client";

import React, { useEffect, useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { GetFilterSearchappointment } from "@/lib/bookappointment"; // ✅ adjust import path
import { BACKEND_URL } from "@/lib/constants";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Image as PrimeImage } from "primereact/image";
import { fetchAllAppointmentPatient } from "@/store/AppointmentSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEvents } from "@/context/events-context";

const getAcuityColor = (acuity: string) => {
  switch (acuity?.toLowerCase()) {
    case "high":
      return "bg-red-50 text-red-500";
    case "moderate":
      return "bg-yellow-50 text-yellow-600";
    case "low":
      return "bg-green-50 text-green-700";
    default:
      return "bg-gray-50 text-gray-600";
  }
};

export default function AppointmentLookupList() {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useAppDispatch();
  const { data, total, loading, page, limit } = useAppSelector(
    (state) => state.AppointmentData // ✅ use correct slice name
  );

  useEffect(() => {
    dispatch(fetchAllAppointmentPatient({ page, limit }));
  }, [dispatch, page, limit]); // only depend on Redux state

  const totalPages = Math.ceil(total / limit);

  const [imageErrorMap, setImageErrorMap] = useState<Record<number, boolean>>(
    {}
  );
  const { setEventAddOpen, setEditingEvent } = useEvents(); // 👈 get from context

  const filteredAppointments =
    filter === "all"
      ? data
      : data.filter((a) => a.status?.toLowerCase() === filter);

  const openSheet = (patient: any) => {
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
  function calculateAge(dateOfBirth: string): string {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const isBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());
    if (!isBirthdayPassed) age--;
    return `${age} Years`;
  }
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  };

  const getColorByInitials = (initials: string) => {
    const code = initials.charCodeAt(0);
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-pink-100 text-pink-600",
      "bg-green-100 text-green-600",
      "bg-yellow-100 text-yellow-600",
      "bg-purple-100 text-purple-600",
      "bg-orange-100 text-orange-600",
      "bg-red-100 text-red-600",
      "bg-teal-100 text-teal-600",
      "bg-indigo-100 text-indigo-600",
    ];
    return colors[code % colors.length];
  };
  const handleReschedule = (appointment: any) => {
    setEditingEvent({
      ...appointment,
      mode: "reschedule", // 👈 optional field to detect mode in form
    });
    setEventAddOpen(true);
    setDrawerOpen(false);
  };

  const handleCancel = (appointment: any) => {
    setEditingEvent({
      ...appointment,
      mode: "cancel", // 👈 optional field to detect mode in form
    });
    setEventAddOpen(true);
    setDrawerOpen(false);
  };
  return (
    <div className="p-0 py-3 space-y-4">
      {/* Filter Buttons */}
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">MRN</th>
              <th className="px-4 py-3">Contact Info</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Specialist</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Acuity</th>
              <th className="px-4 py-3">Assigned Provider</th>
              <th className="px-4 py-3">Last Visit</th>
              <th className="px-2 py-3 w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {filteredAppointments.map((p, idx) => {
              const imageUrl = p?.patient?.profileImageUrl
                ? `${BACKEND_URL}${p?.patient?.profileImageUrl}`
                : null;
              const initials = getInitials(
                p?.patient?.firstName,
                p?.patient?.lastName
              );
              const fallbackColor = getColorByInitials(initials);
              const imageError = imageErrorMap?.[idx]; // make sure imageErrorMap is defined via useState

              return (
                <tr
                  key={idx}
                  className="hover:bg-[#EFFFFD] cursor-pointer"
                  onClick={() => openSheet(p)}
                >
                  <td className="flex items-center gap-3 px-2 py-3 font-medium text-zinc-800">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                      {!imageError && imageUrl ? (
                        <PrimeImage
                          src={imageUrl}
                          alt={`${p?.patient?.firstName} ${p?.patient?.lastName}`}
                          preview
                          downloadable
                          className="h-full w-full object-cover rounded-full"
                          imageClassName="h-full w-full object-cover rounded-full"
                          onError={() =>
                            setImageErrorMap((prev) => ({
                              ...prev,
                              [idx]: true,
                            }))
                          }
                        />
                      ) : (
                        <Avatar className="w-10 h-10 rounded-full ring-1 ring-zinc-300 shadow-sm">
                          <AvatarFallback
                            className={`w-full h-full rounded-full flex items-center justify-center font-medium text-sm ${fallbackColor}`}
                          >
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <span>
                      {p?.patient?.firstName} {p?.patient?.lastName}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {p?.patient?.Patient_Medical_Record_No}
                  </td>
                  <td className="px-4 py-3">
                    <p>{p?.patient?.mobile}</p>
                    <p className="text-xs text-muted-foreground">
                      {p?.patient?.email}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {p?.patient?.dateOfBirth
                      ? calculateAge(p?.patient?.dateOfBirth)
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {p?.doctor?.Specialization?.SpecializationName}
                  </td>
                  <td className="px-4 py-3">{p?.reason}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-xl ${getAcuityColor(
                        p?.acuity
                      )}`}
                    >
                      {p?.acuity}
                    </span>
                  </td>
                  <td className="px-4 py-3">Dr. {p?.doctor?.firstName}</td>
                  <td className="px-4 py-3">{p?.lastVisit || "-"}</td>
                  <td className="px-2 py-3 w-10 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:outline-none">
                        <MoreHorizontal className="w-4 h-5 text-blue-500 cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="!w-32 min-w-max p-1"
                      >
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation(); // ✅ prevent row click
                            handleReschedule(p);
                          }}
                        >
                          Reschedule
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation(); // ✅ prevent row click
                            handleCancel(p);
                          }}
                        >
                          Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
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

      {/* Drawer */}
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
                {selectedPatient?.patient?.name} -{" "}
                {selectedPatient?.patient?.mrn}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFullScreen(!fullScreen)}
                >
                  <Maximize2 className="w-6 h-6 text-blue-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeSheet}
                  className="w-10 h-10"
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
