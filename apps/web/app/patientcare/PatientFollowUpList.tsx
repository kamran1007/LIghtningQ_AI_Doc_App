"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { CalendarSearch, MoreHorizontal, Search } from "lucide-react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useAppDispatch } from "@/store/hooks";
import { fetchAllRegisterPatient } from "@/store/PatientSlice";

import { useEvents } from "@/context/events-context";
import PatientTableSkeleton from "@/components/ui/skeletonloader/PatientTableSkeleton";
import { useSelector } from "react-redux";
import { DateRangePicker, DateRange } from "react-date-range";

import { Hospital } from "lucide-react";

import { FetchHospital } from "@/lib/dashboard";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { GetPatientFollowUp } from "@/lib/patientcare";

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

function calculateAge(dob: string): string {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const isBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());
  if (!isBirthdayPassed) age--;
  return `${age} Years`;
}

interface Hospital {
  HospitalId: number;
  HospitalName: string;
}

export default function PatientFollowUpList() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hospitalData, setHospitalData] = useState<Hospital[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // reuse pageSize

  const dispatch = useAppDispatch();

  const { setRegisterPatientOpen, setEditingPatient ,setEventAddOpen,
 } = useEvents();

  const selectedHospital = useSelector(
    (state: any) => state.hospitalSelection?.selectedHospital
  );
  // console.log("Hospital data in Register patient sceren ", selectedHospital);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const formatDateLocal = (date?: Date) => {
    if (!date) return undefined;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const todayStr = formatDateLocal(new Date());

  const today = new Date();

  const [dateRange, setDateRange] = useState<DateRange[]>([
    {
      startDate: today,
      endDate: today,
      key: "selection",
    },
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const selectedRange = dateRange?.[0];

  useEffect(() => {
    if (!selectedHospital?.hospitalId) return;

    const fetchFollowups = async () => {
      setLoading(true);
      try {
        const res = await GetPatientFollowUp({
          organizationId: selectedHospital.hospital.organizationId,
          hospitalId: selectedHospital.hospitalId,
          search: debouncedSearch || undefined,
          fromDate: formatDateLocal(selectedRange?.startDate),
          toDate: formatDateLocal(selectedRange?.endDate),

          page: currentPage,
          limit: limit,
        });

        setData(res.data);
        setTotal(res.count);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowups();
  }, [selectedHospital, debouncedSearch, dateRange, currentPage]);

  const totalPages = Math.ceil(total / limit);
  const [imageErrorMap, setImageErrorMap] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        const [hosRes] = await Promise.all([FetchHospital()]);

        setHospitalData(hosRes ?? []);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to fetch initial data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.length >= 3 || searchQuery.length === 0) {
        setDebouncedSearch(searchQuery);
      }
    }, 500); // standard debounce time 500ms

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearch !== "") {
      dispatch(
        fetchAllRegisterPatient({
          search: debouncedSearch,
          organizationId: selectedHospital?.hospital?.organizationId,
        })
      );
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });

      // remove focus (cursor) after fetch
    }
  }, [debouncedSearch]);

  const formatDateTime = (date?: string | null) => {
    if (!date) return "-";

    const d = new Date(date);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateOnly = (date?: string | Date) => {
    if (!date) return "-";

    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };



  return (
    <div className="p-0 py-1 space-y-1">
      <div className="flex items-center justify-end w-full gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-6 text-teal-400" />
          <Input
            type="text"
            ref={inputRef}
            placeholder="Search Name, MRN., Mobile No"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 w-full rounded-3xl border border-gray-200 h-10
        bg-white shadow-sm focus:border-pink-400 focus:ring-2 
        focus:ring-pink-200 transition-all"
          />
          {searchQuery.length > 0 && searchQuery.length < 3 && (
            <p className="text-xs text-gray-400 mt-1 pl-2">
              Enter at least 3 characters
            </p>
          )}
        </div>

        <div className="relative inline-flex items-center">
          {/* Calendar Button */}
          <button
            type="button"
            title="Search by date"
            onClick={(e) => {
              e.stopPropagation();
              setShowPicker((prev) => !prev);
            }}
            className="cursor-pointer"
          >
            <CalendarSearch className="w-6 h-6 text-teal-300" />
          </button>

          {/* Date Picker */}
          {showPicker && (
            <div
              className="absolute top-full right-0 mt-2 z-[9999] bg-white rounded-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <DateRangePicker
                ranges={dateRange}
                onChange={(item) => setDateRange([item.selection])}
              />
            </div>
          )}
        </div>
      </div>
      {/* Table */}
      {loading ? (
        <PatientTableSkeleton rows={8} /> // show loader while loading
      ) : (
        <>
          {/* Wrapper aligned to right */}

          <div
            className="w-full overflow-hidden rounded-md shadow-sm border-b mt-2"
            style={{
              borderColor: "transparent",
              backgroundImage:
                "linear-gradient(135deg, #22d3ee 0%, #818cf8 100%)",
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
                      "linear-gradient(to right, #14b8a6, #a855f7)",
                    color: "white",
                    borderRadius: "0.5rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <tr className="divide-x divide-zinc-200 whitespace-nowrap">
                    <th className="px-4 py-3 w-1 text-center whitespace-nowrap">
                      S.No.
                    </th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">MRN</th>
                    <th className="px-4 py-3">Contact Info</th>
                    <th className="px-4 py-3">Age</th>

                    <th className="px-4 py-3 w-46">Follow-up Date</th>
                    <th className="px-2 py-3 w-46 text-center">Last Visit</th>
                    <th className="px-2 py-3">Notified</th>
                    <th className="px-2 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 bg-white">
                  {data.map((p: any, idx) => (
                    <tr key={idx} className="hover:bg-[#EFFFFD]">
                      <td className="px-4 py-3 text-center">{p.sno}</td>

                      {/* Patient Info */}
                      <td className="px-4 py-3 font-medium text-zinc-800">
                        {p.name}
                      </td>

                      {/* MRN */}
                      <td className="px-4 py-3">{p.Patient_Medical_Record_No ?? "-"}</td>

                      {/* Contact */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col leading-tight">
                          <span className="text-sm font-medium text-zinc-800">
                            {p.contact}
                            {p.area && (
                              <>
                                {" "}
                                |{" "}
                                <span className="text-zinc-600">{p.area}</span>
                              </>
                            )}
                          </span>

                          {p.email && (
                            <span className="text-xs text-zinc-500 truncate max-w-[200px]">
                              {p.email}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Age */}
                      <td className="px-4 py-3">{p.age} years</td>

                      {/* Follow-up Date */}
                      <td className="px-4 py-3">
                        {formatDateOnly(p.followUpDate)}
                      </td>

                      {/* Last Visit */}
                      <td className="px-4 py-3">
                        {formatDateTime(p.lastVisit)}
                      </td>
                      <td className="px-4 py-3">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer
            ${
              p.PushNotification
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
                              >
                                {p.PushNotification ? "Yes" : "No"}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {p.PushNotification
                                ? "Reminder has been sent to the patient"
                                : "Reminder has not been sent yet"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>

                      {/* Action */}
                      <td className="px-2 py-3 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <MoreHorizontal className="w-5 h-5 text-blue-500 cursor-pointer" />
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingPatient(p); // ✅ pass patient directly
                                setEventAddOpen(true); // ✅ open popup
                              }}
                            >
                              Book Appointment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center pt-2">
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, value) => setCurrentPage(value)}
                variant="outlined"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: "20px",
                  },
                  "& .Mui-selected": {
                    background: "linear-gradient(to right, #14b8a6, #a855f7)",
                    color: "#fff",
                  },
                  "& .Mui-selected:hover": {
                    background: "linear-gradient(to right, #14b8a6, #a855f7)", // darker hover
                  },
                }}
              />
            </Stack>
          </div>
        </>
      )}
    </div>
  );
}
