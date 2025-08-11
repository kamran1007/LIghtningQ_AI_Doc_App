"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button"; // Assuming you're using shadcn/ui
import { Plus } from "lucide-react";
import HospitalList from "./hospitallist";
import AddHospitalForm from "./addhospitalform";
import { useEffect, useState } from "react";
import { getOrganizationByUser } from "@/lib/admin";
import Hospitaluserlist from "./hospitaluserlist";
import Link from "next/link";
import Image from "next/image";
import { text } from "stream/consumers";

const AdminTabs = () => {
  type OrganizationType = {
    OrganizationId: number;
    OrganizationName: string;
    Organizationcode: string;
  };
  const [activeTab, setActiveTab] = useState("hospital");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [hospitalData, setHospitalData] = useState<
    OrganizationType | undefined
  >(undefined);

  useEffect(() => {
    const storedTab = localStorage.getItem("adminTab");
    if (storedTab) {
      setActiveTab(storedTab);
      localStorage.removeItem("adminTab"); // clear after reading
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem("adminTab", value); // optional: track tab switch
  };


  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await getOrganizationByUser();
        const data = response?.return?.data?.[0];

        console.log("API response:", response);
        console.log("Setting hospital data:", data);

        setHospitalData(data);
      } catch (error) {
        console.error("Failed to fetch hospitals:", error);
      }
    };

    fetchHospitals();
  }, []);

  return (
    // <Tabs defaultValue="hospital" className="w-full">
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">

      {/* Sticky Tab Header */}
      <TabsList className="mb-4 w-full flex gap-2 sticky top-0 z-40 bg-white shadow-lg px-2 py-2 rounded-xl">
        <TabsTrigger
          value="hospital"
          className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-teal-400 data-[state=active]:text-teal-400 cursor-pointer"
        >
          Manage Hospital
        </TabsTrigger>
        <TabsTrigger
          value="user"
          className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-teal-400 data-[state=active]:text-teal-400 cursor-pointer"
        >
          Manage User
        </TabsTrigger>
      </TabsList>

      {/* Manage Hospital Tab */}
      <TabsContent value="hospital">
        <div className="flex justify-between items-center mb-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-500">
            <Image
              src="/hospital.png"
              alt="User avatar"
              width={30}
              height={30}
  className="object-contain"
            />
            <span className="font-sans font-display text-[22px] sm:text-[22px] leading-snug">
              Hospital List
            </span>
          </h2>{" "}
          <Button
            onClick={() => setIsAddOpen(true)}
            variant="default"
            className="flex items-center gap-2 cursor-pointer text-white bg-black transition-all duration-300 custom-gradient-hover"
          >
            <Plus className="w-4 h-4" />
            Add Hospital
          </Button>
        </div>

        <HospitalList />
        <AddHospitalForm
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          Organizationdata={hospitalData}
        />
      </TabsContent>

      {/* Manage User Tab */}
      <TabsContent value="user">
        <div className="flex justify-between items-center mb-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-black-600">
            <Image
              src="/customer.png"
              alt="User avatar"
              width={30}
              height={30}
            />
            <span className=" font-sans font-display text-[22px] sm:text-[24px] leading-snug">
              User List
            </span>
          </h2>
          <Link href="/admin/users/add">
            <Button
              variant="default"
              className="flex items-center gap-2 cursor-pointer text-white bg-black transition-all duration-300 custom-gradient-hover"
            >
              <Plus className="w-4 h-4" />
              {/* <Image
        src="/add.png"
        alt="Add User"
        width={16}
        height={16}
        className="w-4 h-4"
      /> */}
              Add User
            </Button>
          </Link>
        </div>
        <Hospitaluserlist />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
