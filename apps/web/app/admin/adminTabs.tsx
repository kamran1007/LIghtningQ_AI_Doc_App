"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import HospitalList from "./hospitallist";
import AddHospitalForm from "./addhospitalform";
import { useEffect, useState } from "react";
import { getOrganizationByUser } from "@/lib/admin";
import Hospitaluserlist from "./hospitaluserlist";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const AdminTabs = () => {
  type OrganizationType = {
    OrganizationId: number;
    OrganizationName: string;
    Organizationcode: string;
  };

  const [activeTab, setActiveTab] = useState("hospital");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [hospitalData, setHospitalData] = useState<OrganizationType>();

  // 🔹 Get access rights from Redux
  const accessRights = useSelector(
    (state: RootState) => state.hospitalAccessRight?.data
  );
  console.log("Access Rights in AdminTabs:", accessRights);

  // 🔹 Extract Admin module (based on your ModuleName)
  const adminModule = accessRights?.find(
    (mod: any) => mod.ModuleName === "Admin"
  );

  // 🔹 Utility to get permissions of a specific submodule
  const getPermission = (subModuleName: string) => {
    const sub = adminModule?.Submodules?.find(
      (s: any) => s.SubModuleName === subModuleName
    );
    // 👇 FIX: handle array properly
    const perm = Array.isArray(sub?.Permissions)
      ? sub.Permissions[0]
      : sub?.Permissions;

    return (
      perm ?? {
        CanView: false,
        CanCreate: false,
        CanUpdate: false,
        CanDelete: false,
        CanAI_Assist: false,
      }
    );
  };

  // Permissions for submodules
  const hospitalPerm = getPermission("Manage Hospital");
  const userPerm = getPermission("Manage User");

  useEffect(() => {
    const storedTab = localStorage.getItem("adminTab");
    if (storedTab) {
      setActiveTab(storedTab);
      localStorage.removeItem("adminTab");
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem("adminTab", value);
  };

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await getOrganizationByUser();
        const data = response?.return?.data?.[0];
        setHospitalData(data);
      } catch (error) {
        console.error("Failed to fetch hospitals:", error);
      }
    };
    fetchHospitals();
  }, []);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      {/* Tabs Header */}
      <TabsList className="mb-4 w-full flex gap-2 sticky top-0 z-40 bg-white shadow-lg px-2 py-2 rounded-xl">
        {hospitalPerm.CanView && (
          <TabsTrigger
            value="hospital"
            className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-teal-400 data-[state=active]:text-teal-400 cursor-pointer"
          >
            Manage Hospital
          </TabsTrigger>
        )}
        {userPerm.CanView && (
          <TabsTrigger
            value="user"
            className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-teal-400 data-[state=active]:text-teal-400 cursor-pointer"
          >
            Manage User
          </TabsTrigger>
        )}
      </TabsList>

      {/* Manage Hospital Tab */}
      {hospitalPerm.CanView && (
        <TabsContent value="hospital">
          <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-700">
              <Image
                src="/hospital.png"
                alt="Hospital icon"
                width={30}
                height={30}
                className="object-contain"
              />
              <span className="font-sans font-display text-[22px] sm:text-[22px] leading-snug">
                Hospital List
              </span>
            </h2>
            {hospitalPerm.CanCreate && (
              <Button
                onClick={() => setIsAddOpen(true)}
                variant="default"
                className="flex items-center gap-2 cursor-pointer text-white bg-black transition-all duration-300 custom-gradient-hover"
              >
                <Plus className="w-4 h-4" />
                Add Hospital
              </Button>
            )}
          </div>

          <HospitalList />
          <AddHospitalForm
            open={isAddOpen}
            onOpenChange={setIsAddOpen}
            Organizationdata={hospitalData}
          />
        </TabsContent>
      )}

      {/* Manage User Tab */}
      {userPerm.CanView && (
        <TabsContent value="user">
          <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-700">
              <Image
                src="/customer.png"
                alt="User icon"
                width={30}
                height={30}
                className="object-contain"
              />
              <span className="font-sans font-display text-[22px] sm:text-[22px] leading-snug">
                User List
              </span>
            </h2>

            {userPerm.CanCreate && (
              <Link href="/admin/users/add">
                <Button
                  variant="default"
                  className="flex items-center gap-2 cursor-pointer text-white bg-black transition-all duration-300 custom-gradient-hover"
                >
                  <Plus className="w-4 h-4" />
                  Add User
                </Button>
              </Link>
            )}
          </div>

          <Hospitaluserlist />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default AdminTabs;
