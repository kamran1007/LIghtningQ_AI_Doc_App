"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider"; // shadcn/ui slider

import {
  CalendarSearch,
  MoreHorizontal,
  Search,
  User,
  VenusAndMars,
} from "lucide-react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllRegisterPatient } from "@/store/PatientSlice";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BACKEND_URL } from "@/lib/constants";
import { Image as PrimeImage } from "primereact/image";
import { useEvents } from "@/context/events-context";
import PatientTableSkeleton from "@/components/ui/skeletonloader/PatientTableSkeleton";
import { useSelector } from "react-redux";

import {
  FlaskConical,
  FunnelPlus,
  Hospital,
  Stethoscope,
  X,
} from "lucide-react";
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

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { DateRangePicker } from "react-date-range";
import { FetchHospital } from "@/lib/dashboard";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
};
// const [isDialogOpen, setIsDialogOpen] = useState(false);

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

export default function AllRegisterPatientList() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hospitalData, setHospitalData] = useState([]);

  const [selectedHospitals, setSelectedHospitals] = useState<
    string | undefined
  >();
  const [patientGender, setPatientGender] = useState<string | undefined>();

  const dispatch = useAppDispatch();
  const { data, total, loading, page, limit } = useAppSelector(
    (state) => state.patientData
  );
  const [currentPage, setCurrentPage] = useState(page || 1);
  const { setRegisterPatientOpen, setEditingPatient } = useEvents();

  const selectedHospital = useSelector(
    (state: any) => state.hospitalSelection?.selectedHospital
  );
  const [pageSize] = useState(10);
  // console.log("Hospital data in Register patient sceren ", selectedHospital);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [ageRange, setAgeRange] = useState<[number, number]>([16, 29]);
  const [ageDirty, setAgeDirty] = useState(false); // has user touched the age slider?
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    dispatch(
      fetchAllRegisterPatient({
        organizationId: selectedHospital?.hospital?.organizationId,
        search: debouncedSearch || undefined,

        // hospitalId: selectedHospital?.hospitalId,
        page: currentPage,
        limit,
      })
    );
  }, [dispatch, currentPage, limit, debouncedSearch]);

  const totalPages = Math.ceil(total / limit);
  const [imageErrorMap, setImageErrorMap] = useState<Record<number, boolean>>(
    {}
  );

  const [dateRange, setDateRange] = useState<any[]>([]); // empty initially

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

  // useEffect(() => {
  //   dispatch(
  //     fetchAllRegisterPatient({
  //       page: currentPage,
  //       limit: pageSize,
  //       search: debouncedSearch || undefined,

  //       hospitalId: selectedHospitals ? Number(selectedHospitals) : undefined,
  //       organizationId: selectedHospital?.hospital?.organizationId ?? undefined,

  //       gender:
  //         patientGender && patientGender !== "all" ? patientGender : undefined,

  //       // ✅ only include when the user adjusted the slider
  //       minAge: ageDirty ? ageRange[0] : undefined,
  //       maxAge: ageDirty ? ageRange[1] : undefined,
  //     })
  //   );
  // }, [
  //   dispatch,
  //   currentPage,
  //   pageSize,
  //   debouncedSearch,
  //   selectedHospitals,
  //   selectedHospital,
  //   patientGender,
  //   ageRange,
  //   ageDirty,
  // ]);

  const handleApplyFilters = () => {
    console.log("Applying filters:", {
      ageRange,
      ageDirty,
      gender: patientGender,
      hospitalId: selectedHospitals,
    });

    dispatch(
      fetchAllRegisterPatient({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch || undefined,
        hospitalId: selectedHospitals ? Number(selectedHospitals) : undefined,
        organizationId: selectedHospital?.hospital?.organizationId ?? undefined,
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
            className="pl-10 pr-4 py-3 w-full rounded-2xl border border-gray-200 h-10
        bg-white shadow-sm focus:border-pink-400 focus:ring-2 
        focus:ring-pink-200 transition-all"
          />
          {searchQuery.length > 0 && searchQuery.length < 3 && (
            <p className="text-xs text-gray-400 mt-1 pl-2">
              Enter at least 3 characters
            </p>
          )}
        </div>

        {/* Filter Icon */}
        <FunnelPlus
          className="w-6 h-6 text-teal-300 cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        />
      </div>
      {/* Table */}
      {loading ? (
        <PatientTableSkeleton rows={8} /> // show loader while loading
      ) : (
        <>
          {/* Wrapper aligned to right */}

          <div className="mt-4 w-full overflow-hidden rounded-md shadow-sm bg-blue-400">
            <table className="w-full text-sm text-left border-b border-blue-400">
              <thead className="bg-blue-100 text-zinc-600 text-xs font-sans border-b border-blue-400">
                <tr className="divide-x divide-zinc-200">
                  <th className="px-4 py-3 border-b border-blue-400">Name</th>
                  <th className="px-4 py-3 border-b border-blue-400">MRN</th>
                  <th className="px-4 py-3 border-b border-blue-400">
                    Contact Info
                  </th>
                  <th className="px-4 py-3 border-b border-blue-400">Age</th>
                  <th className="px-4 py-3 border-b border-blue-400">
                    Last Visit
                  </th>
                  <th className="px-2 py-3 w-16 text-center border-b border-blue-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white">
                {data.map((p, idx) => {
                  const imageUrl = p.profileImageUrl
                    ? `${BACKEND_URL}${p.profileImageUrl}`
                    : null;
                  const initials = getInitials(p.firstName, p.lastName);
                  const fallbackColor = getColorByInitials(initials);

                  const imageError = imageErrorMap[idx];
                  return (
                    <tr key={idx} className="hover:bg-[#EFFFFD] cursor-pointer">
                      <td className="flex items-center gap-3 px-4 py-3 font-medium text-zinc-800">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                          {!imageError && imageUrl ? (
                            <PrimeImage
                              src={imageUrl}
                              alt={`${p.firstName} ${p.lastName}`}
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
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className={fallbackColor}>
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        <span>
                          {p.firstName} {p.lastName}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-zinc-700">
                        {p.Patient_Medical_Record_No}
                      </td>
                      <td className="px-4 py-3 space-y-0.5">
                        <p>{p.mobile}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.email}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {p.dateOfBirth ? calculateAge(p.dateOfBirth) : "-"}
                      </td>
                      <td className="px-4 py-3">{p.lastVisit || "-"}</td>
                      <td className="px-2 py-3 w-16 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="focus:outline-none">
                            <MoreHorizontal className="w-5 h-5 text-blue-500 cursor-pointer" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-md shadow-md border border-gray-200 bg-white"
                          >
                            <DropdownMenuItem>View Record</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingPatient(p); // set selected patient
                                setRegisterPatientOpen(true); // open modal
                              }}
                            >
                              Edit
                            </DropdownMenuItem>{" "}
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
                color="primary"
              />
            </Stack>
          </div>
          <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <SheetContent
              side="right"
              className="w-[600px] sm:w-[700px] lg:w-[800px] overflow-y-auto no-scrollbar px-6"
              // ✅ no default X button
            >
              <SheetHeader>
                <SheetTitle className="font-sans text-xl p-0">
                  Filter
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
                  value={selectedHospitals}
                  onValueChange={setSelectedHospitals}
                >
                  <SelectTrigger className="w-full border border-teal-300 rounded-lg shadow-sm focus:border-[#22E0D4] focus:ring-2 focus:ring-[#22E0D4] transition flex items-center gap-2">
                    <Hospital className="w-4 h-4 text-teal-400" />
                    <SelectValue placeholder="Select Hospital" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-300 shadow-2xl rounded-2xl">
                    <SelectItem value="all-hospitals">All Hospitals</SelectItem>
                    {hospitalData.map((hospital) => (
                      <SelectItem
                        key={hospital.HospitalId}
                        value={String(hospital.HospitalId)}
                      >
                        {hospital.HospitalName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Gender Filter */}
                <Select value={patientGender} onValueChange={setPatientGender}>
                  <SelectTrigger className="w-full border border-teal-300 rounded-lg shadow-sm focus:border-[#22E0D4] focus:ring-2 focus:ring-[#22E0D4] transition flex items-center gap-2">
                    <VenusAndMars className="w-4 h-4 text-teal-400" />
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
                  className="bg-teal-300 hover:bg-teal-500 text-white px-4 py-2 rounded-lg shadow-2xl shadow-md transition"
                  onClick={handleApplyFilters}
                >
                  Apply Filters
                </button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  );
}
