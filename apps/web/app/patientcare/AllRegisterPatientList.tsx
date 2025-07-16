"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllRegisterPatient } from "@/store/PatientSlice";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BACKEND_URL } from "@/lib/constants";
import { Image as PrimeImage } from "primereact/image";
import { useEvents } from "@/context/events-context";
import PatientTableSkeleton from "@/components/ui/skeletonloader/PatientTableSkeleton";

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

export default function AllRegisterPatientList() {
  const dispatch = useAppDispatch();
  const { data, total, loading, page, limit } = useAppSelector(
    (state) => state.patientData
  );
  const [currentPage, setCurrentPage] = useState(page || 1);
  const { setRegisterPatientOpen, setEditingPatient } = useEvents();

  useEffect(() => {
    dispatch(fetchAllRegisterPatient({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  const totalPages = Math.ceil(total / limit);
  const [imageErrorMap, setImageErrorMap] = useState<Record<number, boolean>>(
    {}
  );

  return (
    <div className="p-0 py-1 space-y-1">
      {/* Table */}
      {loading ? (
        <PatientTableSkeleton rows={8} /> // show loader while loading
      ) : (
        <>
          <div className="w-full overflow-hidden rounded-md shadow-sm bg-blue-400">
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
        </>
      )}
    </div>
  );
}
