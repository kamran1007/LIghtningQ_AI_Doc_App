"use client";

import React, { useEffect, useRef, useState } from "react";
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
import AppointmentListSkeleton from "@/components/ui/skeletonloader/AppointmentList";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { FunnelIcon as FilterIcon } from "@heroicons/react/24/solid";
import AppointmentActionsDialog from "./AppointmentActionsDialog";
import ConsultationDrawer from "../consultation/ConsultationDrawer";
import { Funnel } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

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
  const [selectedDate, setSelectedDate] = useState(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const filterRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const calendarPopup = document.querySelector(".p-datepicker");
      const multiSelectPanel = document.querySelector(".p-multiselect-panel");

      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node) &&
        !(calendarPopup && calendarPopup.contains(event.target as Node)) &&
        !(multiSelectPanel && multiSelectPanel.contains(event.target as Node))
      ) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [displayText, setDisplayText] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const messages = [
    "Search patient by Phone No.",
    "Search patient by Name",
    "Search patient by MR No.",
  ];

  useEffect(() => {
    const current = messages[msgIndex];
    if (current && charIndex < current.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + current.charAt(charIndex));
        setCharIndex((prev) => prev + 1);
      }, 70);
      return () => clearTimeout(timeout);
    } else if (current) {
      const timeout = setTimeout(() => {
        setCharIndex(0);
        setDisplayText("");
        setMsgIndex((prev) => (prev + 1) % messages.length);
      }, 1500); // wait before switching message
      return () => clearTimeout(timeout);
    }
  }, [charIndex, msgIndex]);

  const dispatch = useAppDispatch();
  const { data, total, loading, page, limit } = useAppSelector(
    (state) => state.AppointmentData
  );
  const [currentPage, setCurrentPage] = useState(1);

  // fetch appointments whenever page or limit changes
  useEffect(() => {
    dispatch(fetchAllAppointmentPatient({ page: currentPage, limit }));
  }, [currentPage, limit, dispatch]);

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (_: any, value: number) => {
    setCurrentPage(value); // just update local page state
  };

  const [imageErrorMap, setImageErrorMap] = useState<Record<number, boolean>>(
    {}
  );
  const { setEventAddOpen, setEditingEvent } = useEvents(); // 👈 get from context
  const [appointments, setAppointments] = useState([]);

  async function fetchAppointments(filters: any) {
    try {
      const data = await GetFilterSearchappointment(filters);
      setAppointments(data?.data);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    }
  }

  const filteredAppointments = data.filter((a) =>
    filter === "all" ? true : a.status?.toLowerCase() === filter
  );

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
  const [showFilter, setShowFilter] = useState(false);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedSpecialists, setSelectedSpecialists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterData, setFilterData] = useState({ gender: "", date: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  const debounceSearch = useRef<NodeJS.Timeout>(null);

  function handleSearch(val: string) {
    setSearchTerm(val);

    if (debounceSearch.current) clearTimeout(debounceSearch.current);

    debounceSearch.current = setTimeout(() => {
      dispatch(fetchAllAppointmentPatient({ search: val, page: 1, limit: 10 }));
    }, 500);
  }
  useEffect(() => {
    const today = toLocalDateString(new Date()); // ⬅️ Use local-adjusted date
    setSelectedDate(new Date());

    fetchAppointments({
      ...filterData,
      appointmentDate: today,
      page: 1,
      limit: 10,
    });
  }, []);

  function toLocalDateString(date: Date) {
    const offsetDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const result = offsetDate.toISOString().split("T")[0];
    console.log("📆 toLocalDateString() =>", result);

    return date.toLocaleDateString("en-CA"); // gives 'YYYY-MM-DD'
  }

  function handleFilterChange(key: string, value: any) {
    const newFilter = { ...filterData, [key]: value };
    setFilterData(newFilter);

    const formattedDate =
      key === "appointmentDate" && value instanceof Date
        ? toLocalDateString(value)
        : filterData.appointmentDate;

    const updatedFilters = {
      ...newFilter,
      appointmentDate: formattedDate, // always a string: "YYYY-MM-DD"
    };
    console.log(
      "📅 Sending appointmentDate filter:",
      updatedFilters.appointmentDate
    );

    console.log("📅 Filter Date:", updatedFilters.appointmentDate);

    fetchAppointments({
      search: searchTerm,
      ...updatedFilters,
      page: 1,
      limit: 10,
    });
  }

  const classificationTabs = [
    { key: "all", label: "All" },
    { key: "current", label: "Current" },
    { key: "new", label: "New" },
    // { key: "discharged", label: "Discharged" },
    { key: "high", label: "High Priority" },
  ];

  const specialistOptions = [
    { name: "Cardiologist", code: "cardio" },
    { name: "Dermatologist", code: "derma" },
    { name: "Neurologist", code: "neuro" },
    // Add dynamically if needed
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
      mode: "RESCHEDULED", // 👈 optional field to detect mode in form
    });
    setEventAddOpen(true);
    setDrawerOpen(false);
  };

  const handleCancel = (appointment: any) => {
    setEditingEvent({
      ...appointment,
      mode: "CANCELLED", // 👈 optional field to detect mode in form
    });
    setEventAddOpen(true);
    setDrawerOpen(false);
  };
  const handleOpenDialog = (patient: any) => {
    setSelectedPatient(patient);
    setDialogOpen(true);
  };
  const startConsultation = (patient: any) => {
    setSelectedPatient(patient);
    setDialogOpen(false);
    setDrawerOpen(true);
  };
  return (
    <div className="p-0 py-1 space-y-1 ">
      {/* Filter Buttons */}

      <div className="w-full px-1 mb-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          {/* LEFT: Classification Tabs */}
          <div className="flex gap-1 overflow-auto rounded-xl p-1 flex-wrap">
            {classificationTabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                  filter === key
                    ? "bg-teal-100 text-grey-700 shadow-xl"
                    : "bg-gray-50 text-zinc-600 hover:bg-purple-100 border border-zinc-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* RIGHT: Search + Filter Funnel */}
          <div className="flex items-center gap-1 flex-wrap justify-end">
            {/* Search Input */}
            <input
              type="text"
              placeholder={displayText}
                className="pl-5 pr-5 py-2 text-sm h-10 border border-gray-300 rounded-4xl shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all w-60 duration-300 ease-in-out hover:shadow-md focus:shadow-lg"

              onChange={(e) => handleSearch(e.target.value)}
            />

            {/* Funnel Filter */}
            <div className="relative" ref={filterRef}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setShowFilter((prev) => !prev)}
                      className="p-0 rounded hover:bg-gray-100"
                    >
                      <Funnel className="text-zinc-600 h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={6}
                    className="bg-black text-white text-xs px-3 py-1 rounded-md shadow-sm"
                  >
                    {" "}
                    <p>Toggle filter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Dropdown Filter Panel */}
              {showFilter && (
                <div className="absolute right-0 mt-2 w-80 z-50 bg-white border border-zinc-200 shadow-xl rounded-xl p-4 transition-all duration-300 animate-fade-slide-down">
                  {/* Gender Filter */}
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-1 block">
                      Gender
                    </label>
                    <MultiSelect
                      value={selectedGenders}
                      onChange={(e) => {
                        const selected = e.value;
                        setSelectedGenders(selected);
                        const genderCodes = selected
                          .map((item: any) => item.code)
                          .join(",");
                        handleFilterChange("gender", genderCodes);
                      }}
                      options={[
                        { name: "Male", code: "male" },
                        { name: "Female", code: "female" },
                        { name: "Other", code: "other" },
                      ]}
                      optionLabel="name"
                      display="chip"
                      placeholder="Select Gender(s)"
                      className="w-full"
                    />
                  </div>

                  {/* Specialist Filter */}
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-1 block">
                      Specialist
                    </label>
                    <MultiSelect
                      value={selectedSpecialists}
                      onChange={(e) => setSelectedSpecialists(e.value)}
                      options={specialistOptions}
                      optionLabel="name"
                      display="chip"
                      placeholder="Select Specialist(s)"
                      className="w-full"
                    />
                  </div>

                  {/* Date Filter */}
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-1 block">
                      Appointment Date
                    </label>
                    <Calendar
                      value={selectedDate}
                      onChange={(e) => {
                        const selected =
                          e.value instanceof Date ? e.value : new Date(e.value);
                        setSelectedDate(selected);
                        handleFilterChange("appointmentDate", selected);
                      }}
                      placeholder="Select a Date"
                      dateFormat="dd/mm/yy"
                      className="w-full"
                      showIcon
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <AppointmentListSkeleton rows={10} />
      ) : (
        <div className="w-full overflow-hidden rounded-md shadow-sm border-b border-purple-600">
          <table className="w-full text-sm text-left border-b border-purple-600">
            <thead className="bg-purple-100 text-zinc-600 text-xs font-sans border-b border-purple-600">
              <tr className="divide-x divide-zinc-200 ">
                <th className="px-4 py-3 border-b border-purple-600">Name</th>
                <th className="px-4 py-3 border-b border-purple-600">MRN</th>
                <th className="px-4 py-3 border-b border-purple-600">
                  Contact Info
                </th>
                <th className="px-4 py-3 border-b border-purple-600">Age</th>
                <th className="px-4 py-3 border-b border-purple-600">
                  Specialist
                </th>
                <th className="px-4 py-3 border-b border-purple-600">Reason</th>
                <th className="px-4 py-3 border-b border-purple-600">Acuity</th>
                <th className="px-4 py-3 border-b border-purple-600">
                  Assigned Provider
                </th>
                <th className="px-4 py-3 border-b border-purple-600">
                  Last Visit
                </th>
                <th className="px-2 py-3 w-16 text-center border-b border-purple-600">
                  Action
                </th>
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
                    // onClick={() => openSheet(p)}
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
                      {/* <MoreHorizontal
                        className="w-5 h-5 text-blue-500 cursor-pointer"
                        onClick={(e) => {
                          // e.stopPropagation(); // ✅ prevent row click
                          handleOpenDialog(p); // ✅ open dialog
                        }}
                      /> */}

                      {/* <AppointmentActionsDialog
                        open={dialogOpen}
                        onOpenChange={setDialogOpen}
                        patient={p}
                        onReschedule={() => {
                          setDialogOpen(false);
                          handleReschedule(selectedPatient);
                        }}
                        onCancel={() => {
                          setDialogOpen(false);
                          handleCancel(selectedPatient);
                        }}
                        onViewCaseHistory={() => {
                          setDialogOpen(false);
                          console.log(
                            "Viewing case history for",
                            selectedPatient
                          );
                        }}
                        onStartConsultation={() => {
                          startConsultation(selectedPatient);
                        }}
                      />
                      <ConsultationDrawer
                        open={drawerOpen}
                        onClose={() => closeSheet()}
                        patient={selectedPatient}
                      /> */}

                      <AppointmentActionsDialog
                        patient={p}
                        onReschedule={(appointment) => {
                          handleReschedule(appointment);
                        }}
                        onCancel={(appointment) => {
                          handleCancel(appointment);
                        }}
                        onViewCaseHistory={(appointment) => {
                          console.log("Viewing case history for", appointment);
                        }}
                        onStartConsultation={(appointment) => {
                          startConsultation(appointment);
                        }}
                      />
                      <ConsultationDrawer
                        // patient={p}
                        open={drawerOpen}
                        onClose={() => closeSheet()}
                        patient={selectedPatient}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center pt-2">
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            color="secondary"
          />
        </Stack>
      </div>
    </div>
  );
}
