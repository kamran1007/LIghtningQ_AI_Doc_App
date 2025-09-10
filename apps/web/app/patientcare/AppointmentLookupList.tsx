"use client";

import React, { JSX, useEffect, useRef, useState } from "react";
import {
  Search,
  FunnelPlus,
  CalendarSearch,
  User,
  VenusAndMars,
  FileBadge2,
  FileBadge,
  Star,
  ActivitySquare,
  Accessibility,
  Crown,
  Bed,
  Circle,
} from "lucide-react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { GetFilterSearchappointment } from "@/lib/bookappointment"; // ✅ adjust import path
import { BACKEND_URL } from "@/lib/constants";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Image as PrimeImage } from "primereact/image";
import { fetchAllAppointmentPatient } from "@/store/AppointmentSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEvents } from "@/context/events-context";
import AppointmentListSkeleton from "@/components/ui/skeletonloader/AppointmentList";
import AppointmentActionsDialog from "./AppointmentActionsDialog";
import ConsultationDrawer from "../consultation/ConsultationDrawer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "react-date-range";

import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { getUserSpecialization } from "@/lib/admin";
import { useSelector } from "react-redux";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [patientGender, setPatientGender] = useState<string | undefined>();
  const [specializations, setSpecializations] = useState([]);
  const [activeChip, setActiveChip] = useState("All Appointments"); // ✅ default

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

  const tagIconMap: Record<string, JSX.Element> = {
    VIP: <Crown className="w-4 h-4 text-yellow-500" />,
    "wheel Chair": <Accessibility className="w-4 h-4 text-blue-500" />,
    "Oxygen Mask": <ActivitySquare className="w-4 h-4 text-cyan-500" />,
    Disabled: <Accessibility className="w-4 h-4 text-gray-500" />,
    Stretcher: <Bed className="w-4 h-4 text-rose-500" />,
    "Red Triage": <Circle className="w-4 h-4 text-red-600" />,
    "Yellow Triage": <Circle className="w-4 h-4 text-yellow-500" />,
    "Green Triage": <Circle className="w-4 h-4 text-green-600" />,
    "Black Triage": <Circle className="w-4 h-4 text-black" />,
  };

  const [displayText, setDisplayText] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const messages = [
    "Search patient by Phone No.",
    "Search patient by Name",
    "Search patient by MRN.",
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
  // useEffect(() => {
  //   dispatch(fetchAllAppointmentPatient({ page: currentPage, limit }));
  // }, [currentPage, limit, dispatch]);

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

  const filteredAppointments = data?.filter((a) =>
    filter === "all" ? true : a.status?.toLowerCase() === filter
  );

  const closeSheet = () => {
    setDrawerOpen(false);
    setSelectedPatient(null);
    setFullScreen(false);
  };
  const [showFilter, setShowFilter] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterData, setFilterData] = useState({ gender: "", date: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [ageRange, setAgeRange] = useState<[number, number]>([16, 29]);
  const [ageDirty, setAgeDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<
    string | undefined
  >();

  const debounceSearch = useRef<NodeJS.Timeout>(null);

  function setSearchQuery(val: string) {
    setSearchTerm(val);

    if (debounceSearch.current) clearTimeout(debounceSearch.current);

    debounceSearch.current = setTimeout(() => {
      dispatch(
        fetchAllAppointmentPatient({
          search: val,
          page: 1,
          limit: 10,
          hospitalId: selectedHospital
            ? Number(selectedHospital?.hospitalId)
            : undefined,
        })
      );
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

  const startConsultation = (patient: any) => {
    setSelectedPatient(patient);
    setDialogOpen(false);
    setDrawerOpen(true);
  };
  function formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // YYYY-MM-DD in local timezone
  }

  const todayStr = formatDateLocal(new Date());

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(todayStr), // local today
      endDate: new Date(todayStr), // local today
      key: "selection",
    },
  ]);
  const selectedHospital = useSelector(
    (state: any) => state.hospitalSelection?.selectedHospital
  );

  const chipFilters: Record<string, any> = {
    "All Appointments": {}, // no extra filter
    "New Appointment": { visitTypeId: 1 },
    "High Priority": { acuity: "High" },
    Completed: { isConsultationcompleted: true },
  };

  useEffect(() => {
    const loadAppointmentdatefilter = async () => {
      try {
        const startDate = dateRange[0]?.startDate
          ? formatDateLocal(dateRange[0].startDate)
          : undefined;

        const endDate = dateRange[0]?.endDate
          ? formatDateLocal(dateRange[0].endDate)
          : undefined;

        const filters: Record<string, string | number | undefined> = {
          hospitalId: selectedHospital
            ? Number(selectedHospital?.hospitalId)
            : undefined,
          page: currentPage,
          limit,
          ...chipFilters[activeChip], // merge chip filter here
        };

        if (startDate && !endDate) {
          filters.appointmentDate = startDate;
        } else if (startDate && endDate) {
          filters.appointmentDateFrom = startDate;
          filters.appointmentDateTo = endDate;
        }

        const data = await dispatch(
          fetchAllAppointmentPatient(filters)
        ).unwrap();
        setAppointments(data);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      }
    };

    loadAppointmentdatefilter();
  }, [dateRange, dispatch, currentPage, limit, selectedHospital, activeChip]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        const [specRes] = await Promise.all([
          // getOrganizationByUser(),
          getUserSpecialization(),
          // getallusers(),
        ]);

        // setOrganizations(orgRes?.return?.data ?? []);
        // setRoles(roleRes?.return?.data ?? []);
        setSpecializations(specRes?.return?.data ?? []);

        // ✅ Set user if editing
        // if (userId) {
        //   const foundUser = userList.find(
        //     (u: { UserId: number }) => u.UserId === Number(userId)
        //   );
        //   setUser(foundUser ?? null);
        // console.log("Found user for editing:", foundUser);
        // console.log("Editing user:", user);
        // }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleApplyFilters = () => {
    console.log("Applying filters:", {
      ageRange,
      ageDirty,
      gender: patientGender,
      SpecializationId: selectedSpecialization,
    });

    dispatch(
      fetchAllAppointmentPatient({
        page: currentPage,
        limit: limit,
        SpecializationId: selectedSpecialization
          ? Number(selectedSpecialization)
          : undefined,
        hospitalId: selectedHospital
          ? Number(selectedHospital?.hospitalId)
          : undefined,
        gender:
          patientGender && patientGender !== "all-gender"
            ? patientGender
            : undefined,
        minAge: ageRange[0],
        maxAge: ageRange[1],
      })
    );

    setIsDialogOpen(false);
  };

  return (
    <div className="p-0 py-0.5 space-y-1 ">
      <div className="flex items-center justify-between w-full gap-4">
        {/* Left side → Chips */}
        {/* Left side → Filter Chips */}
        <div className="flex items-center gap-2">
          {[
            "All Appointments",
            "New Appointment",
            "High Priority",
            "Completed",
          ].map((label) => (
            <div
              key={label}
              onClick={() => setActiveChip(label)}
              className={`px-4 py-1 rounded-full border cursor-pointer transition shadow-2xl
      ${
        activeChip === label
          ? "bg-gradient-to-r from-cyan-500  to-teal-500 text-white border-teal-500"
          : "bg-white text-gray-500 border-teal-400 hover:bg-teal-50 hover:text-gray-600"
      }`}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Right side → Search, Calendar, Filter */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-sm mt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-8 text-teal-400" />
            <Input
              type="text"
              ref={inputRef}
              placeholder={displayText}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 w-full rounded-3xl border border-gray-200 h-10
          bg-white shadow-sm focus:border-pink-400 focus:ring-2 
          focus:ring-pink-200 transition-all"
            />
          </div>

          {/* Calendar Icon + Picker */}
          <div className="relative inline-block">
            <CalendarSearch
              className="w-6 h-6 text-teal-300 cursor-pointer"
              onClick={() => setShowPicker((prev) => !prev)}
            />
            {showPicker && (
              <div className="absolute z-50 mt-2 shadow-lg bg-white rounded-lg p-2 right-full mr-2">
                <DateRangePicker
                  ranges={dateRange}
                  onChange={(item) => setDateRange([item.selection])}
                  rangeColors={["#22E0D4"]}
                />
              </div>
            )}
          </div>

          {/* Filter Icon */}
          <FunnelPlus
            className="w-6 h-6 text-teal-300 cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <AppointmentListSkeleton rows={10} />
      ) : (
        <div
          className="w-full overflow-hidden rounded-md shadow-sm border-b mt-2"
          style={{
            borderColor: "transparent",
            backgroundImage:
              "linear-gradient(135deg, #5eead4 0%, #818cf8 100%)",
            padding: "1px",
          }}
        >
          {" "}
          <div className="rounded-md overflow-hidden bg-white">
            <table className="w-full text-sm text-left">
              <thead
                className="text-zinc-600 text-xs font-sans"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #5eead4 0%, #818cf8 100%)",
                  color: "white",
                }}
              >
                <tr className="divide-x divide-zinc-200">
                  <th className="px-2 py-3 w-1 text-center whitespace-nowrap">
                    S.No.
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap">Patient Info</th>
                  <th className="px-4 py-3  whitespace-nowrap">Contact Info</th>
                  <th className="px-4 py-3 whitespace-nowrap">Visit Type</th>

                  {/* <th className="px-4 py-3 whitespace-nowrap">Age</th> */}
                  <th className="px-4 py-3 whitespace-nowrap">Specialist</th>
                  <th className="px-4 py-3 whitespace-nowrap">Reason</th>
                  <th className="px-4 py-3 whitespace-nowrap">Acuity</th>
                  <th className="px-4 py-3 whitespace-nowrap">
                    Assign Provider
                  </th>
                  <th className="px-2 py-3 w-16 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white">
                {filteredAppointments?.map((p, idx) => {
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
                      <td className="px-2 py-3">{idx + 1}</td>
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

                        <td className="px-2 py-3">
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <p className="truncate max-w-[160px] cursor-default">
                                    {p?.patient?.Prefix} {p?.patient?.firstName}{" "}
                                    {p?.patient?.lastName}
                                  </p>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="top"
                                  className="bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg"
                                >
                                  {`${p?.patient?.firstName} ${p?.patient?.lastName}`}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {/* Tag icons */}
                            <div className="flex gap-1 items-center">
                              {p?.TagPatients?.slice(0, 2).map((tag: any) => (
                                <TooltipProvider key={tag.TagPatientId}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span>
                                        {tagIconMap[tag.TagPatientName] || (
                                          <Circle className="w-4 h-4 text-gray-400" />
                                        )}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="top"
                                      className="bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg"
                                    >
                                      {tag.TagPatientName}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ))}

                              {/* Show +N if more than 3 */}
                              {p?.TagPatients?.length > 2 && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="text-xs font-medium text-gray-600 cursor-pointer">
                                        +{p.TagPatients.length - 2}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="top"
                                      className="bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg space-y-1"
                                    >
                                      {p.TagPatients.slice(2).map(
                                        (extraTag: any) => (
                                          <div
                                            key={extraTag.TagPatientId}
                                            className="flex items-center gap-1"
                                          >
                                            {tagIconMap[
                                              extraTag.TagPatientName
                                            ] || (
                                              <Circle className="w-3 h-3 text-gray-400" />
                                            )}
                                            <span>
                                              {extraTag.TagPatientName}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </div>

                          {/* MRN, Age, Gender */}
                          <div className="text-sm text-gray-600">
                            {p?.patient?.Patient_Medical_Record_No} |{" "}
                            {p?.patient?.dateOfBirth
                              ? calculateAge(p?.patient?.dateOfBirth)
                              : "-"}{" "}
                            (
                            {p?.patient?.gender
                              ? p.patient.gender.toLowerCase() === "male"
                                ? "M"
                                : p.patient.gender.toLowerCase() === "female"
                                  ? "F"
                                  : "-"
                              : "-"}
                            )
                          </div>
                        </td>
                      </td>

                      {/* <td className="px-4 py-3">
                        {p?.patient?.Patient_Medical_Record_No}
                      </td> */}
                      <td className="px-2 py-3 whitespace-nowrap max-w-[200px]">
                        {/* Mobile + Area */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="truncate cursor-default">
                                {p?.patient?.mobile}
                                {p?.patient?.area
                                  ? ` | ${
                                      p.patient.area.length > 12
                                        ? p.patient.area.slice(0, 12) + "..."
                                        : p.patient.area
                                    }`
                                  : ""}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg"
                            >
                              {p?.patient?.mobile}
                              {p?.patient?.area ? ` | ${p.patient.area}` : ""}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* Email */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-xs text-muted-foreground truncate cursor-default">
                                {p?.patient?.email}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg"
                            >
                              {p?.patient?.email || "-"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="truncate max-w-[120px] cursor-default">
                                {p?.visitType?.AppointmentTypeName?.length > 9
                                  ? p.visitType.AppointmentTypeName.slice(
                                      0,
                                      9
                                    ) + "..."
                                  : p?.visitType?.AppointmentTypeName || "-"}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg"
                            >
                              {p?.visitType?.AppointmentTypeName || "-"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>

                      {/* <td className="px-4 py-3">
                        {p?.patient?.dateOfBirth
                          ? calculateAge(p?.patient?.dateOfBirth)
                          : "-"}
                      </td> */}
                      <td className="px-2 py-3">
                        {p?.doctor?.Specialization?.SpecializationName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="truncate max-w-[120px] cursor-default">
                                {p?.reason?.length > 12
                                  ? p.reason.slice(0, 12) + "..."
                                  : p?.reason}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg"
                            >
                              {p?.reason || "-"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>

                      <td className="px-2 py-3">
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded-xl ${getAcuityColor(
                            p?.acuity
                          )}`}
                        >
                          {p?.acuity}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="truncate max-w-[150px] cursor-default">
                                {`Dr. ${p?.doctor?.firstName ?? ""} ${p?.doctor?.lastName ?? ""}`}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg"
                            >
                              {`Dr. ${p?.doctor?.firstName ?? ""} ${p?.doctor?.lastName ?? ""}`}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>

                      <td className="px-2 py-3 w-10 text-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="inline-flex items-center justify-center w-full h-full cursor-pointer">
                                <AppointmentActionsDialog
                                  patient={p}
                                  onReschedule={(appointment) => {
                                    handleReschedule(appointment);
                                  }}
                                  onCancel={(appointment) => {
                                    handleCancel(appointment);
                                  }}
                                  onViewCaseHistory={(appointment) => {
                                    console.log(
                                      "Viewing case history for",
                                      appointment
                                    );
                                  }}
                                  onStartConsultation={(appointment) => {
                                    startConsultation(appointment);
                                  }}
                                />
                                <ConsultationDrawer
                                  open={drawerOpen}
                                  onClose={() => closeSheet()}
                                  patient={selectedPatient}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg"
                            >
                              Appointment Action Panel(ATP)
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "20px",
              },
              "& .Mui-selected": {
                background: "linear-gradient(135deg, #5eead4 0%, #818cf8 100%)",
                color: "#fff",
              },
              "& .Mui-selected:hover": {
                background: "linear-gradient(135deg, #22d3ee 0%, #6366f1 100%)", // darker hover
              },
            }}
          />
        </Stack>
      </div>

      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetContent
          side="right"
          className="w-[600px] sm:w-[700px] lg:w-[800px] overflow-y-auto no-scrollbar px-6 border-b-cyan-700"
          // ✅ no default X button
        >
          <SheetHeader>
            <SheetTitle className="font-sans text-xl p-0 text-teal-400 mb-0 mt-0">
              Appointment Filter
            </SheetTitle>
          </SheetHeader>

          {/* 🔹 Filters */}
          <div className="mb-2 flex flex-col gap-4 mt-2 ">
            {/* Age Range */}
            <div className="flex flex-col w-full bg-white border border-teal-300 rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-teal-400" />
                <span className="font-medium text-gray-700">Age Range</span>
              </div>

              <Slider
                min={0}
                max={120}
                step={1}
                value={ageRange}
                onValueChange={(val) => {
                  setAgeRange(val as [number, number]);
                  setAgeDirty(true);
                }}
                className="w-full
          [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-teal-400
          [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 rounded-full
      
          [&_[class*='SliderTrack']]:bg-teal-300  [&_[class*='SliderTrack']]:h-2
          [&_[class*='SliderRange']]:bg-teal-500
        "
              />

              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{ageRange[0]} yrs</span>
                <span>{ageRange[1]} yrs</span>
              </div>
            </div>

            {/* Hospital Filter */}
            <Select
              value={selectedSpecialization}
              onValueChange={setSelectedSpecialization}
            >
              <SelectTrigger className="w-full border border-teal-300 rounded-lg shadow-sm focus:border-[#22E0D4] focus:ring-2 focus:ring-[#22E0D4] transition flex items-center gap-2">
                <FileBadge className="w-5 h-5 text-teal-400" />
                <SelectValue placeholder="Select Specialist" />
              </SelectTrigger>
              <SelectContent className="border-gray-300 shadow-2xl rounded-2xl">
                <SelectItem value="all-hospitals">All Specialist</SelectItem>
                {specializations.map((spec: any) => (
                  <SelectItem
                    key={spec.SpecializationId}
                    value={spec.SpecializationId.toString()}
                  >
                    {spec.SpecializationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Gender Filter */}
            <Select value={patientGender} onValueChange={setPatientGender}>
              <SelectTrigger className="w-full border border-teal-300 rounded-lg shadow-sm focus:border-[#22E0D4] focus:ring-2 focus:ring-[#22E0D4] transition flex items-center gap-2">
                <VenusAndMars className="w-5 h-5 text-teal-400" />
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className="border-gray-300 shadow-2xl rounded-2xl">
                <SelectItem value="all-gender">All Gender</SelectItem>
                <SelectItem value="MALE">MALE</SelectItem>
                <SelectItem value="FEMALE">FEMALE</SelectItem>
                <SelectItem value="OTHER">OTHER</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Apply Button */}
          <SheetFooter>
            <button
              className="bg-teal-300 hover:bg-teal-500 text-white px-4 py-2 rounded-lg shadow-2xl  transition"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
