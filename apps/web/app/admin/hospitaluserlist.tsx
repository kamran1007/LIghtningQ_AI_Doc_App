"use client";

import React, { useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Edit, MoreHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchHospitalUsers } from "@/store/hospitalusersSlice";
import { toggleStatus as toggleUserStatus } from "@/lib/admin"; // alias to avoid name clash
import { toast } from "react-hot-toast";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { HospitalUserSkeleton } from "@/components/ui/skeletonloader/hospitalUserSkeleton";
// import EditUserModal from "./EditUserModal"; // You can create this for editing users

export type User = {
  UserId: number;
  firstName: string;
  employeeId: string;
  mobile: string;
  gender: string;
  email: string;
  role: {
    name: string;
  };
  experience: string;
  isActive: boolean;
};

const UserList = () => {

  const dispatch = useDispatch<AppDispatch>();
  const {
    data: users,
    total,
    loading,
  } = useSelector((state: RootState) => state.hospitalUsers);
  console.log("user data", users);
  const isLoading = useSelector(
    (state: RootState) => state.hospitalUsers.loading
  );

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0, // MaterialReactTable uses 0-based indexing
    pageSize: 10,
  });
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

const toggleStatus = async (user: User) => {
  const success = await toggleUserStatus(user);
  if (success) {
    toast.success(user.isActive ? "User Deactivated successfully ❌" : "User Activated successfully ✅");
    const { pageIndex, pageSize } = pagination;
    dispatch(fetchHospitalUsers({ page: pageIndex + 1, limit: pageSize }));
  } else {
    toast.error("Could not update status");
  }
};


  useEffect(() => {
    const { pageIndex, pageSize } = pagination;
    dispatch(fetchHospitalUsers({ page: pageIndex + 1, limit: pageSize }));
  }, [dispatch, pagination]);

  const columns = [
    {
      accessorKey: "firstName",
      header: "Name",
      size: 60,
      muiTableHeadCellProps: {
        sx: { textAlign: "center" },
      },
    },
    {
      accessorKey: "Employee_ID",
      header: "Employee ID",
      size: 60,
      muiTableHeadCellProps: {
        sx: { textAlign: "center" },
      },
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
      size: 60,
      muiTableHeadCellProps: {
        sx: { textAlign: "center" },
      },
    },
    {
      accessorKey: "gender",
      header: "Gender",
      size: 60,
      muiTableHeadCellProps: {
        sx: { textAlign: "center" },
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 60,
      muiTableHeadCellProps: {
        sx: {
          textAlign: "center", // ⬅️ center text
          justifyContent: "center", // ⬅️ center if using flex
          alignItems: "center", // ⬅️ vertical align center
          padding: "18px", // ⬅️ padding
          margin: "0 auto",
        },
      },
    },
    {
      accessorKey: "role.Rolename",
      header: "Role Name",
      size: 60,
      muiTableHeadCellProps: {
        sx: { textAlign: "center" },
      },
    },
    {
      accessorKey: "Experience",
      header: "Experience",
      size: 60,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      size: 30,

      Cell: ({ row }: { row: { original: User } }) => (
        <Switch
  checked={row.original.isActive}
  className="cursor-pointer"
  onCheckedChange={() => toggleStatus(row.original)} // ✅ uses the correct function
/>

      ),
    },
    {
      id: "actions",
      header: "Action",
      size: 30,

      Cell: ({ row }: { row: { original: User } }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <MoreHorizontal className="w-5 h-5 text-blue-500 cursor-pointer"/>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleEdit(row.original)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4 text-blue-500" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="w-full">
      {loading ? (<HospitalUserSkeleton/>):<MaterialReactTable
        columns={columns}
        data={users}
        manualPagination
        rowCount={total}
        state={{ pagination }}
        onPaginationChange={setPagination}
        enableSorting
        enablePagination
        // isLoading={loading}
        enableSorting={false} // ✅ disables sorting completely
        enableColumnActions={false} // ✅ removes column action menu
        enableColumnFilters={false} // ✅ removes filter icon & logic
        enableGlobalFilter={false} // ✅ removes global search bar
        muiTableHeadCellProps={{
          sx: {
            whiteSpace: "nowrap",
            padding: "4px", // 🪶 tighter padding
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            whiteSpace: "nowrap",
            // padding: '4px',
          },
        }}
        muiTableBodyRowProps={{
          sx: {
            '&:hover': {
              backgroundColor: '#e3f2fd !important',
            },
          },
        }}
        muiTableToolbarButtonProps={{
          sx: {
            color: 'lightblue',
            '&:hover': {
              color: '#2196f3', // slightly darker blue
            },
          },
        }}
        muiTopToolbarProps={{
          sx: {
            '& .MuiButtonBase-root': {
              color: 'black', // default icon color
              '&:hover': {
                color: '#2196f3', // hover color
              },
            },
          },
        }}
      />}
      

      {/* <EditUserModal open={editOpen} onOpenChange={setEditOpen} user={selectedUser} /> */}
    </div>
  );
};

export default UserList;
