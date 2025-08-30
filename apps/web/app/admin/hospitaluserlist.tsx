"use client";

import React, { useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  Edit,
  Hospital,
  MoreHorizontal,
  Search,
  UserRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchHospitalUsers } from "@/store/hospitalusersSlice";
import { getUserRole, toggleStatus as toggleUserStatus } from "@/lib/admin"; // alias to avoid name clash
import { toast } from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { HospitalUserSkeleton } from "@/components/ui/skeletonloader/hospitalUserSkeleton";
import AddUserPage from "./users/add/page";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { FetchDoctorRole } from "@/lib/bookappointment";
import { FetchHospital } from "@/lib/dashboard";
import { Input } from "@/components/ui/input";
import { fetchUserProfile } from "@/store/authSlice";
import { getSession } from "@/lib/session";

// import EditUserModal from "./EditUserModal"; // You can create this for editing users

export type User = {
  UserId: number;
  Prefix: string;
  imageUrl: string;
  SignatureOfUser: string;
  firstName: string;
  lastName: string;
  Employee_ID: string;
  mobile: string;
  gender: string;
  email: string;
  role: {
    name: string;
  };
  SpecializationId: number;
  Experience: string;
  roleId: number;
  isActive: boolean;
  dateOfBirth: string;
  AdminAccess: [];
};

const UserList = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const {
    data: users,
    total,
    loading,
  } = useSelector((state: RootState) => state.hospitalUsers);
  console.log("user data", users);
  const [isLoading, setIsLoading] = useState(false);

  const [hospitalrole, setRole] = useState([]);
  const [hospitalData, setHospitalData] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHospital, setSelectedHospital] = useState<"all" | number>(
    "all"
  );
  const [selectedRole, setSelectedRole] = useState<"all" | number>("all");
  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setIsLoading(true);
        const session = await getSession();
        const orgId = session?.user?.OrganizationId ?? null;
        console.log("Organization ID:", orgId);
        setOrganizationId(orgId); // ✅ store in state
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to fetch initial data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, []);
  // const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0, // MaterialReactTable uses 0-based indexing
    pageSize: 10,
  });

  // const handleEdit = (user: User) => {
  //   router.push(`/admin/users/add?page=edit&userId=${user.UserId}`);
  // };
  const handleEdit = (user: User) => {
    // Store current tab in localStorage
    localStorage.setItem("adminTab", "user");
    // Redirect to user edit page
    router.push(`/admin/users/add?page=edit&userId=${user.UserId}`);
  };
  const toggleStatus = async (user: User) => {
    const success = await toggleUserStatus(user);
    if (success) {
      toast.success(
        user.isActive
          ? "User Deactivated successfully ❌"
          : "User Activated successfully ✅"
      );
      const { pageIndex, pageSize } = pagination;
      dispatch(
        fetchHospitalUsers({
          page: pageIndex + 1,
          limit: pageSize,
          search: debouncedSearch,
          hospitalId: selectedHospital,
          roleId: selectedRole,
          organizationId: organizationId ?? 1,
        })
      );
    } else {
      toast.error("Could not update status");
    }
  };

  useEffect(() => {
    const { pageIndex, pageSize } = pagination;

    dispatch(
      fetchHospitalUsers({
        page: pageIndex + 1,
        limit: pageSize,
        search: debouncedSearch,
        hospitalId: selectedHospital,
        roleId: selectedRole,
        organizationId: organizationId ?? 1,
      })
    );
  }, [
    dispatch,
    pagination,
    debouncedSearch,
    selectedHospital,
    selectedRole,
    organizationId,
  ]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        const [docRes, hosRes] = await Promise.all([
          getUserRole(),
          FetchHospital(),
        ]);

        setRole(docRes?.return?.data ?? []);
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

  // ✅ Whenever filters change, send it to parent

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
      Cell: ({ row }) => {
        const exp = row.getValue("Experience") as number | string | null;
        if (!exp) return "-";
        return `${exp} ${Number(exp) > 1 ? "years" : "year"}`;
      },
    },

    {
      accessorKey: "isActive",
      header: "Status",
      size: 30,

      Cell: ({ row }: { row: { original: User } }) => (
        <Switch
          checked={row.original.isActive}
          onCheckedChange={() => toggleStatus(row.original)}
          className="data-[state=checked]:bg-green-500 transition-colors duration-300 border-1 border-gray-300 rounded-full"
        >
          <span className="sr-only">Toggle Active</span>
        </Switch>
      ),
    },
    {
      id: "actions",
      header: "Action",
      size: 30,

      Cell: ({ row }: { row: { original: User } }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <MoreHorizontal className="w-5 h-5 text-teal-500 cursor-pointer" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="!w-[100px] !min-w-[100px] p-1 rounded-md shadow-md border border-gray-200 bg-white"
          >
            <DropdownMenuItem
              onClick={() => handleEdit(row.original)}
              className="flex items-center gap-1 px-2 py-1 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
            >
              <Edit className="w-4 h-4 text-teal-500" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="w-full">
      {loading ? (
        <HospitalUserSkeleton />
      ) : (
        <MaterialReactTable
          columns={columns}
          data={users ?? []} // ✅ fallback to empty array
          manualPagination
          rowCount={total ?? 0} // ✅ safe fallback
          state={{ pagination }}
          onPaginationChange={setPagination}
          enableSorting={false} // disables sorting completely
          enableColumnActions={false} // removes column action menu
          enableColumnFilters={false} // removes filter icon & logic
          enableGlobalFilter={false} // removes global search bar
          muiTableHeadCellProps={{
            sx: {
              whiteSpace: "nowrap",
              padding: "4px",
            },
          }}
          muiTableBodyCellProps={{
            sx: { whiteSpace: "nowrap" },
          }}
          muiTableBodyRowProps={{
            sx: {
              "&:hover": {
                backgroundColor: "#CCFBF1 !important",
              },
            },
          }}
          muiTableToolbarButtonProps={{
            sx: {
              color: "teal",
              "&:hover": { color: "#13D4D4" },
            },
          }}
          muiTopToolbarProps={{
            sx: {
              "& .MuiButtonBase-root": {
                color: "black",
                "&:hover": { color: "#13D4D4" },
              },
            },
          }}
          // 👇 filters moved into table toolbar
          renderTopToolbarCustomActions={() => (
            <div className="flex items-center gap-4 w-full">
              {/* Hospital Select */}
              <Select
                value={String(selectedHospital)}
                onValueChange={(value) =>
                  setSelectedHospital(value === "all" ? "all" : Number(value))
                }
              >
                <SelectTrigger className="w-64 border border-gray-300 rounded-lg shadow-sm focus:border-[#22E0D4] focus:ring-2 focus:ring-[#22E0D4] transition flex items-center gap-2">
                  <Hospital className="w-4 h-4 text-teal-400" />
                  <SelectValue placeholder="All Hospitals" />
                </SelectTrigger>
                <SelectContent className="border-gray-300 shadow-2xl rounded-2xl">
                  <SelectItem value="all">All Hospitals</SelectItem>
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

              {/* Role Select */}
              <Select
                value={String(selectedRole)}
                onValueChange={(value) =>
                  setSelectedRole(value === "all" ? "all" : Number(value))
                }
              >
                <SelectTrigger className="w-64 border border-gray-300 rounded-lg shadow-sm focus:border-[#22E0D4] focus:ring-2 focus:ring-[#22E0D4] transition flex items-center gap-2">
                  <UserRound className="w-4 h-4 text-teal-400" />
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent className="border-gray-300 shadow-2xl rounded-2xl">
                  <SelectItem value="all">All Roles</SelectItem>
                  {hospitalrole.map((role) => (
                    <SelectItem key={role.RoleId} value={String(role.RoleId)}>
                      {role.Rolename}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Search Input */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-400" />
                <Input
                  type="text"
                  placeholder="Search users, hospitals, roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 
            bg-white shadow-sm focus:border-pink-400 focus:ring-2 
            focus:ring-pink-200 transition-all"
                />
                {searchQuery.length > 0 && searchQuery.length < 3 && (
                  <p className="text-xs text-gray-400 mt-1 pl-2">
                    Enter at least 3 characters
                  </p>
                )}
              </div>
            </div>
          )}
        />
      )}

      {/* <EditUserModal open={editOpen} onOpenChange={setEditOpen} user={selectedUser} /> */}
    </div>
  );
};

export default UserList;
