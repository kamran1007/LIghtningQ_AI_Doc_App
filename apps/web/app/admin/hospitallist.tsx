"use client";

import React, { useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import Image from "next/image";
import { MoreHorizontal, Eye, Edit, Plus } from "lucide-react";
import AddHospitalForm from "./addhospitalform";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HospitalTableSkeleton } from "@/components/ui/skeletonloader/hospitalListSkeleton";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchHospitals } from "@/store/hospitalSlice";
import ViewHospitalModal from "./ViewHospital";
export type Hospital = {
  HospitalName: string;
  HospitalCode: string;
  ParentHospitalCode: string;
  SpecializationType: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  contactNumber: string;
  email: string;
  website: string;
  logoUrl: string;
  latitude: number;
  longitude: number;
  level: string;
  status: string;
  isActive: boolean;
  parentHospitalId: number | null;
  organizationId: number;
  createdById: number | null;
  updatedById: number | null;
  deletedById: number | null;
};
const HospitalList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hospitalData = useSelector((state: RootState) => state.hospital.data);
  const isLoading = useSelector((state: RootState) => state.hospital.loading);

  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);

  const handleView = (hospitalData: Hospital) => {
    setSelectedHospital(hospitalData);
    setOpenViewModal(true);
  };

  const handleEdit = (hospital: any) => {
    setSelectedHospital(hospital);
    setOpenModal(true);
  };

  const handleAddNew = () => {
    setSelectedHospital(null); // Clear selection to create new
    setOpenModal(true);
  };

  useEffect(() => {
    dispatch(fetchHospitals());
  }, [dispatch]);

  const columns = [
    {
      accessorKey: "HospitalName",
      header: "Hospital Name",
      muiTableHeadCellProps: {
        sx: { textAlign: "center" },
      },
    },
    {
      accessorKey: "HospitalCode",
      header: "Hospital Code",
      size: 30, // further reduce the size
      muiTableBodyCellProps: {
        sx: {
          maxWidth: "100px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      },
    },
    {
      accessorKey: "address",
      header: "Address",
      size: 250, // Increased
      muiTableHeadCellProps: {
        sx: { textAlign: "center" },
      },
      Cell: ({ row }: { row: { original: any } }) => (
        <div
          title={row.original.address}
          className="line-clamp-2 max-w-xs overflow-hidden text-ellipsis break-words"
        >
          {row.original.address}
        </div>
      ),
    },
    {
      accessorKey: "contactNumber",
      header: "Contact Number",
      size: 20, // Decreased
    },
    {
      accessorKey: "email",
      header: "Email",
      muiTableHeadCellProps: {
        sx: { textAlign: "center" },
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 20,
      muiTableHeadCellProps: {
        sx: { textAlign: "center" },
      },
    },
    {
      id: "actions",
      header: "Action",
      size: 20, // Reduced size
      enableColumnActions: false,
      enableSorting: false,
      Cell: ({ row }: { row: { original: any } }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <MoreHorizontal className="w-5 h-5 cursor-pointer text-teal-500" />{" "}
            {/* Blue color */}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="!w-20 !min-w-[10rem] p-1">
            <DropdownMenuItem
              onClick={() => handleView(row.original)}
              className="flex items-center gap-2 hover:bg-teal-50 rounded-md cursor-pointer"
            >
              <Eye className="w-4 h-4 text-teal-500" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleEdit(row.original)}
              className="flex items-center gap-2 hover:bg-teal-50 rounded-md cursor-pointer"
            >
              <Edit className="w-4 h-4 text-teal-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAddNew()}
              className="flex items-center gap-2 hover:bg-teal-50 rounded-md cursor-pointer"
            >
              <Plus className="w-4 h-4 text-teal-500" />
              Add New
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="w-full">
      {isLoading ? (
        <HospitalTableSkeleton />
      ) : hospitalData.length > 0 ? (
        <MaterialReactTable
          columns={columns}
          data={hospitalData}
          enableSorting
          enablePagination
          enableSorting={false} // ✅ disables sorting completely
          enableColumnActions={false} // ✅ removes column action menu
          enableColumnFilters={false} // ✅ removes filter icon & logic
          enableGlobalFilter={false} // ✅ removes global search bar
          
          muiTableBodyCellProps={{
            sx: {
              whiteSpace: "nowrap",
              // padding: '4px',
            },
          }}
          muiTableBodyRowProps={{
          sx: {
            '&:hover': {
              backgroundColor: '#8AFFFF !important',
            },
          },
        }}
        muiTableToolbarButtonProps={{
          sx: {
            color: 'teal',
            '&:hover': {
              color: '#2EFFFF', // slightly darker blue
            },
          },
        }}
        muiTopToolbarProps={{
          sx: {
            '& .MuiButtonBase-root': {
              color: 'black', // default icon color
              '&:hover': {
                color: '#2EFFFF', // hover color
              },
            },
          },
        }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-[calc(90vh-150px)] px-2 text-center overflow-hidden">
          <Image
            src="/NoHospitalList.png"
            alt="No Hospital List"
            width={500}
            height={500}
            priority={false}
            className="w-full max-w-5xl max-h-[55vh] object-contain"
          />
          <p className="mt-2 text-lg font-semibold text-gray-700">
            No Hospital List Found! Please add.
          </p>
        </div>
      )}
      <AddHospitalForm
        open={openModal}
        onOpenChange={setOpenModal}
        hospital={selectedHospital}
      />
      {selectedHospital && (
        <ViewHospitalModal
          isOpen={openViewModal}
          onOpenChange={setOpenViewModal}
          hospital={selectedHospital}
        />
      )}
    </div>
  );
};

export default HospitalList;
