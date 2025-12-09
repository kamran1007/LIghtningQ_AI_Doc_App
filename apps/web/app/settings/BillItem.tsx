"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toast } from "primereact/toast";
import { useForm } from "react-hook-form";
import { addupdateProcedure, FetchProcedure } from "@/lib/consultation";
import { getUserSpecialization } from "@/lib/admin";
import ConsultationTable from "./BillingTable/ConsultationTable";
import ProcedureTable from "./BillingTable/ProcedureTable";
import InvestigationTable from "./BillingTable/InvestigationTable";
import OtherChargesTable from "./BillingTable/OtherChargesTable";
import dynamic from "next/dynamic";

const DynamicConsultationForm = dynamic(
  () => import("./BillingForm/ConsultationForm"),
  { ssr: false }
);
const DynamicProcedureForm = dynamic(
  () => import("./BillingForm/ProcedureForm"),
  { ssr: false }
);
const DynamicInvestigationForm = dynamic(
  () => import("./BillingForm/InvestigationForm"),
  { ssr: false }
);
const DynamicOtherChargesForm = dynamic(
  () => import("./BillingForm/OtherChargesForm"),
  { ssr: false }
);

interface BillItemProps {
  open: boolean;
  onClose: (open: boolean) => void;
}

const BillItem: React.FC<BillItemProps> = ({ open, onClose }) => {
  interface Specialization {
    SpecializationId: number;
    SpecializationName: string;
  }

  interface Procedure {
    ProcedureId: number;
    ProcedureName: string;
    ProcedureCode?: string | null;
    specialization?: { SpecializationName: string } | null;
    chargeType?: string | null;
  }

  const toast = useRef<Toast>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{
    ProcedureName: string;
    ProcedureCode: string;
    specializationId?: number | undefined;
    ProcedureId: number;
  }>({
    ProcedureName: "",
    ProcedureCode: "",
    specializationId: undefined,
    ProcedureId: 0,
  });
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [proceduresList, setProceduresList] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("consultation");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [consultationData, setConsultationData] = useState<any[]>([]);
  const [procedureData, setProcedureData] = useState<any[]>([]);
  const [investigationData, setInvestigationData] = useState<any[]>([]);
  const [otherData, setOtherData] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const { control, reset } = useForm();

  // derive a filtered list for the active tab/category
  const filteredProcedures = proceduresList.filter(
    (p) => (p.chargeType ?? "consultation") === activeTab
  );

  const chargeTabs = [
    { id: "consultation", name: "Consultation Charges" },
    { id: "procedure", name: "OPD Procedures" },
    { id: "investigation", name: "Investigations" },
    // { id: "surgery", name: "Surgeries" },
    // { id: "surgerypackage", name: "Surgery Packages" },
    // { id: "labinvestigation", name: "Lab Investigation" },
    { id: "other", name: "Other Charges" },
  ];

  useEffect(() => {
    getProceduresdata();
    getSpecializations();
  }, []);

  const getSpecializations = async () => {
    try {
      const res = await getUserSpecialization();
      setSpecializations(res?.return?.data ?? []);
    } catch (error) {
      console.error("Failed to fetch specialization:", error);
    }
  };

  const getProceduresdata = async () => {
    try {
      setLoading(true);
      const data = await FetchProcedure();
      setProceduresList(data?.return || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.ProcedureName)
      return toast.current?.show({
        severity: "warn",
        summary: "Name required",
      });

    try {
      setIsLoading(true);
      const payload = {
        ProcedureName: form.ProcedureName,
        ProcedureCode: form.ProcedureCode,
        specializationId: form.specializationId,
        ProcedureId: form?.ProcedureId,
        chargeType: activeTab, // ✅ track which tab/category it belongs to
      };
      await addupdateProcedure(payload);
      toast.current?.show({
        severity: "success",
        summary: "Saved Successfully",
      });
      getProceduresdata();
      setForm({
        ProcedureName: "",
        ProcedureCode: "",
        specializationId: undefined,
        ProcedureId: 0,
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding procedure:", error);
      toast.current?.show({ severity: "error", summary: "Save Failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (item: { ProcedureId: any }) => {};

  function handleCancelForm(): void {
    onClose(false);
  }

  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setShowForm(true); // open form in edit mode
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          className="bg-white/80 backdrop-blur-lg rounded-2xl border-none shadow-2xl max-w-6xl p-6 no-scrollbar"
          onInteractOutside={(e) => e.preventDefault()} // 🛑 Prevent close on outside click
          onEscapeKeyDown={(e) => e.preventDefault()} // 🛑 Prevent close on ESC key
        >
          {" "}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-slate-800">
                Manage Billing Items
              </DialogTitle>
              <button
                onClick={() => onClose(false)}
                className="text-gray-500 hover:text-red-500 p-2 rounded-full absolute top-4 right-4 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </DialogHeader>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full mt-4"
            >
              <TabsList className="flex flex-wrap gap-2 bg-transparent mb-6">
                {chargeTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`
      rounded-full border text-sm px-4 py-2 font-medium transition-all duration-200
      ${
        activeTab === tab.id
          ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white border-teal-500 shadow-md"
          : "border-teal-400 text-gray-700 hover:bg-teal-50 hover:text-teal-600"
      }
    `}
                  >
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {chargeTabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="space-y-4">
                  {/* Add Button */}
                  <div className="flex justify-between items-center mb-4">
                    <Button
                      onClick={() =>
                        setShowForm((prev) =>
                          activeTab === tab.id ? !prev : true
                        )
                      }
                      className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add {tab.name}
                    </Button>
                  </div>

                  {/* Conditionally Render the Form */}
                  {showForm && activeTab === tab.id && (
                    <Suspense
                      fallback={
                        <div className="text-gray-500 text-sm">
                          Loading form...
                        </div>
                      }
                    >
                      {tab.id === "consultation" && (
                        <DynamicConsultationForm
                          key={selectedItem?.BillingItemChargeId || "new"}
                          onCancel={handleCancelForm}
                          onSuccess={() => {
                            setRefreshKey((prev) => prev + 1); // ✅ Trigger re-render of table
                            setShowForm(false);
                            setSelectedItem(null);
                          }}
                          editData={selectedItem}
                        />
                      )}

                      {tab.id === "procedure" && (
                        <DynamicProcedureForm
                          key={selectedItem?.BillingItemChargeId || "new"}
                          editData={selectedItem} // ✅ pass selected item to form
                          onCancel={handleCancelForm}
                          onSuccess={() => {
                            setRefreshKey((prev) => prev + 1);
                            setShowForm(false);
                            setSelectedItem(null);
                          }}
                        />
                      )}

                      {tab.id === "investigation" && (
                        <DynamicInvestigationForm
                          editData={selectedItem}
                          onCancel={() => setShowForm(false)}
                          onSuccess={() => {
                            setShowForm(false);
                            setRefreshKey((prev) => prev + 1);
                          }}
                        />
                      )}

                      {tab.id === "other" && (
                        <DynamicOtherChargesForm
                          onCancel={handleCancelForm}
                          onSuccess={() => {
                            setRefreshKey((prev) => prev + 1);
                            setShowForm(false);
                            setSelectedItem(null);
                          }}
                          editData={selectedItem}
                        />
                      )}
                    </Suspense>
                  )}

                  {/* Show Table for this Tab */}
                  {tab.id === "consultation" && (
                    <ConsultationTable
                      key={refreshKey} // ✅ Forces useEffect re-run
                      onEdit={(item) => {
                        setSelectedItem(item);
                        setShowForm(true);
                      }}
                    />
                  )}

                  {tab.id === "procedure" && (
                    <ProcedureTable
                      refreshTrigger={refreshKey}
                      onEdit={(item) => {
                        console.log("🩺 Edit procedure clicked:", item); // ✅ debugger/test
                        setSelectedItem(item);
                        setShowForm(true);
                      }}
                    />
                  )}
                  {tab.id === "investigation" && (
                    <InvestigationTable
                      refreshTrigger={refreshKey}
                      onEdit={(item) => {
                        setSelectedItem(item);
                        setShowForm(true);
                      }}
                    />
                  )}

                  {tab.id === "other" && (
                    <OtherChargesTable
                      refreshTrigger={refreshKey}
                      onEdit={(item) => {
                        setSelectedItem(item);
                        setShowForm(true);
                      }}
                    />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BillItem;
