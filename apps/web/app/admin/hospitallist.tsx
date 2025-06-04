import React, { useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import Image from "next/image";
import { getallhospitalByUser } from "@/lib/admin";
import { MoreHorizontal, Eye, Edit, Plus } from "lucide-react";
import AddHospitalForm from "./addhospitalform"; // adjust the path if different

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const HospitalList = () => {
  const [hospitalData, setHospitalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleView = () => {
    console.log("View clicked:");
    // Navigate to view page or open modal
  };

  const handleEdit = (hospital: any) => {
    setSelectedHospital(hospital);
    setOpenModal(true);
  };;

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete`)) {
      console.log("Deleting:");
      // Call delete API here
    }
  };

  useEffect(() => {
    // Fetch hospital data from the API
    const fetchHospitals = async () => {
      try {
        const response = await getallhospitalByUser();
        console.log(response);
        setHospitalData(response.return.data); // ✅ Correct key access
      } catch (error) {
        console.error("Failed to fetch hospitals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const columns = [
    {
      accessorKey: "name",
      header: "Hospital Name",
    },
    {
      accessorKey: "hospitalCode",
      header: "Hospital Code",
      size: 5,
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "contactNumber",
      header: "Contact Number",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 5,
    },
    {
      id: "actions",
      header: "Action",
      size: 100,
      enableColumnActions: false,
      enableSorting: false,
      Cell: ({ row }: { row: { original: any } }) => (

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <MoreHorizontal className="w-5 h-5 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="!w-20 !min-w-[10rem] p-1">
            <DropdownMenuItem
              onClick={() => handleView()}
              className="flex items-center gap-2  hover:bg-blue-50 rounded-md cursor-pointer"
            >
              <Eye className="w-4 h-4 text-blue-500" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleEdit(row.original)}
              className="flex items-center gap-2  hover:bg-blue-50 rounded-md cursor-pointer"
            >
              <Edit className="w-4 h-4 text-blue-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAddNew(row.original)}
              className="flex items-center gap-2  hover:bg-blue-50 rounded-md cursor-pointer"
            >
              <Plus className="w-4 h-4 text-blue-500" />
              Add New
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
      ),
      
    },
    // Add more columns as needed
  ];

  return (
    
    <div className="w-full">
      {isLoading ? (
        <p>Loading hospitals...</p>
      ) : hospitalData.length > 0 ? (
        <MaterialReactTable
          columns={columns}
          data={hospitalData}
          enableSorting
          enablePagination
          // Add additional props as needed
          muiTopToolbarProps={{
            sx: {
              
              backgroundColor: '', // light gray or any custom color
              color: '#33ffe3', // text color (gray-800)
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
    </div>
    
  );
};

export default HospitalList;

function handleAddNew(original: any): void {
  throw new Error("Function not implemented.");
}
