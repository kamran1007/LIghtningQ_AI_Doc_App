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
import { getUserRole, toggleStatus as toggleUserStatus } from "@/lib/admin";
import { toast } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { HospitalUserSkeleton } from "@/components/ui/skeletonloader/hospitalUserSkeleton";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { FetchHospital } from "@/lib/dashboard";
import { Input } from "@/components/ui/input";
import { getSession } from "@/lib/session";
import { MRT_ColumnDef } from "material-react-table"; // ✅ make sure this import exists

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
  role: { name: string };
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

  // ✅ Get Access Rights from Redux
  const accessRights = useSelector(
    (state: RootState) => state.hospitalAccessRight.data
  );

  // ✅ Extract "Manage User" permissions under "Admin" module
  const adminModule = accessRights?.find((m: any) => m.ModuleName === "Admin");
  const manageUserSub = adminModule?.Submodules?.find(
    (s: any) => s.SubModuleName === "Manage User"
  );
  const permissionObj = Array.isArray(manageUserSub?.Permissions)
    ? manageUserSub.Permissions[0]
    : manageUserSub?.Permissions;

  const canView = permissionObj?.CanView ?? true;
  const canUpdate = permissionObj?.CanUpdate ?? false;

  // 🔒 Prevent viewing the page entirely if no view permission
  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-600">
        <p className="text-lg font-semibold">
          You do not have permission to view this module.
        </p>
      </div>
    );
  }

  const [isLoading, setIsLoading] = useState(false);
  const [hospitalrole, setRole] = useState<any[]>([]);
  const [hospitalData, setHospitalData] = useState<any[]>([]);
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
        setOrganizationId(session?.user?.OrganizationId ?? null);
      } catch {
        toast.error("Failed to fetch session data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessionData();
  }, []);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleEdit = (user: User) => {
    if (!canUpdate) {
      toast.error("You do not have permission to edit users.");
      return;
    }
    localStorage.setItem("adminTab", "user");
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
        const [roles, hospitals] = await Promise.all([
          getUserRole(),
          FetchHospital(),
        ]);
        setRole(roles?.return?.data ?? []);
        setHospitalData(hospitals ?? []);
      } catch {
        toast.error("Failed to fetch data");
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
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // ✅ Table Columns
  const columns: MRT_ColumnDef<User>[] = [
    {
      accessorFn: (row) => `${row.firstName || ""} ${row.lastName || ""}`,
      id: "fullName",
      header: "Name",
      size: 140,
      muiTableHeadCellProps: () => ({
        align: "center",
        sx: { fontWeight: 600, whiteSpace: "nowrap" },
      }),
      muiTableBodyCellProps: () => ({
        align: "center",
        sx: { fontSize: "0.9rem" },
      }),
    },
    {
      accessorKey: "Employee_ID",
      header: "Employee ID",
      size: 110,
      muiTableHeadCellProps: () => ({ align: "center" }),
      muiTableBodyCellProps: () => ({ align: "center" }),
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
      size: 130,
      muiTableHeadCellProps: () => ({ align: "center" }),
      muiTableBodyCellProps: () => ({ align: "center" }),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      size: 100,
      muiTableHeadCellProps: () => ({ align: "center" }),
      muiTableBodyCellProps: () => ({ align: "center" }),
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 200,
      muiTableHeadCellProps: () => ({ align: "center" }),
      muiTableBodyCellProps: () => ({
        align: "center",
        sx: { maxWidth: 220, textOverflow: "ellipsis", overflow: "hidden" },
      }),
    },
    {
      accessorKey: "role.Rolename",
      header: "Role Name",
      size: 150,
      muiTableHeadCellProps: () => ({ align: "center" }),
      muiTableBodyCellProps: () => ({ align: "center" }),
    },
    {
      accessorKey: "Experience",
      header: "Experience",
      size: 120,
      muiTableHeadCellProps: () => ({ align: "center" }),
      muiTableBodyCellProps: () => ({ align: "center" }),
      Cell: ({ row }) => {
        const exp = row.getValue<number | string>("Experience");
        return exp ? `${exp} ${Number(exp) > 1 ? "years" : "year"}` : "-";
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      size: 100,
      muiTableHeadCellProps: () => ({ align: "center" }),
      muiTableBodyCellProps: () => ({ align: "center" }),
      Cell: ({ row }) => (
        <Switch
          checked={row.original.isActive}
          onCheckedChange={() => toggleStatus(row.original)}
          className="data-[state=checked]:bg-green-500 transition-colors duration-300 border-1 border-gray-300 rounded-full"
        />
      ),
    },
    {
      id: "actions",
      header: "Action",
      size: 100,
      muiTableHeadCellProps: () => ({ align: "center" }),
      muiTableBodyCellProps: () => ({ align: "center" }),
      Cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <MoreHorizontal className="w-5 h-5 text-teal-500 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-1">
            {canUpdate ? (
              <DropdownMenuItem
                onClick={() => handleEdit(row.original)}
                className="flex items-center gap-1 px-2 py-1 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
              >
                <Edit className="w-4 h-4 text-teal-500" />
                Edit
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() =>
                  toast.error("You do not have permission to edit users.")
                }
                className="flex items-center gap-1 px-2 py-1 text-sm text-gray-400 cursor-not-allowed"
              >
                <Edit className="w-4 h-4 text-gray-300" />
                Edit (Locked)
              </DropdownMenuItem>
            )}
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
          data={users ?? []}
          manualPagination
          rowCount={total ?? 0}
          state={{ pagination }}
          onPaginationChange={setPagination}
          enableSorting={false}
          enableColumnActions={false}
          enableColumnFilters={false}
          enableGlobalFilter={false}
        />
      )}
    </div>
  );
};

export default UserList;
