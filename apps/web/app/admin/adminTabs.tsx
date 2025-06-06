"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button"; // Assuming you're using shadcn/ui
import { Plus } from "lucide-react";
import HospitalList from "./hospitallist";
import AddHospitalForm from "./addhospitalform";
import { useEffect, useState } from "react";
import { getOrganizationByUser } from "@/lib/admin";

const AdminTabs = () => {
  type OrganizationType = {
    id: number;
    OrganizationName: string;
    Organizationcode: string;
  };
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [hospitalData, setHospitalData] = useState<OrganizationType | undefined>(undefined);
  
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
    <Tabs defaultValue="hospital" className="w-full">
  {/* Sticky Tab Header */}
  <TabsList className="mb-4 border-b w-full flex gap-2 sticky top-0 z-40 bg-white shadow-sm">
    <TabsTrigger
      value="hospital"
      className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 cursor-pointer"
    >
      Manage Hospital
    </TabsTrigger>
    <TabsTrigger
      value="user"
      className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 cursor-pointer"
    >
      Manage User
    </TabsTrigger>
  </TabsList>

  {/* Manage Hospital Tab */}
  <TabsContent value="hospital">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-gray-700">Hospital List</h2>
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
    <AddHospitalForm open={isAddOpen} onOpenChange={setIsAddOpen} Organizationdata={hospitalData} />
  </TabsContent>

  {/* Manage User Tab */}
  <TabsContent value="user">
    <h2 className="text-lg font-semibold mb-4">User List</h2>
    <div className="border rounded p-4">[User List Component]</div>
  </TabsContent>
</Tabs>

  );
};

export default AdminTabs;
