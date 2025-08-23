"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { addupdateProcedure, FetchProcedure } from "@/lib/consultation";
import { getUserSpecialization } from "@/lib/admin";
import { Controller, useForm } from "react-hook-form";

interface ProcedureModalProps {
  open: boolean;
  onClose: () => void;
}
import { Toast } from "primereact/toast";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { deleteprocedure } from "@/lib/setting";

type Procedure = {
  ProcedureName: string;
  ProcedureCode?: string;
  specializationId?: number;
  ProcedureId?: number;
};

const ProcedureModal: React.FC<ProcedureModalProps> = ({ open, onClose }) => {
  const toast = useRef<Toast>(null);

  const [showForm, setShowForm] = useState(false);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [form, setForm] = useState<Procedure>({
    ProcedureName: "",
    ProcedureCode: "",
    specializationId: undefined,
    ProcedureId: 0,
  });
  const [specializations, setSpecializations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [proceduresList, setProceduresList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!form.ProcedureName) return alert("Procedure Name is required");

    try {
      // ✅ Prepare payload
      const payload = {
        ProcedureName: form.ProcedureName,
        ProcedureCode: form.ProcedureCode,
        specializationId: form.specializationId,
        ProcedureId: form?.ProcedureId,
      };

      // ✅ Send to backend
      const savedProcedure = await addupdateProcedure(payload);

      // ✅ Update local state with response
      setProcedures((prev) => [...prev, savedProcedure]);

      // ✅ Reset form
      setForm({
        ProcedureName: "",
        ProcedureCode: "",
        specializationId: undefined,
      });
      setShowForm(false);
      toast.current?.show({
        severity: "success",
        summary: "added",
        detail: "Diagnosis added successfully",
        life: 3000,
      });
      getProceduresdata();
    } catch (error) {
      console.error("Error adding procedure:", error);
      toast.current?.show({
        severity: "error",
        summary: "failed",
        detail: "Diagnosis adding  failed",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        const [specRes] = await Promise.all([getUserSpecialization()]);

        setSpecializations(specRes?.return?.data ?? []);

        // ✅ Set user if editing
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to fetch initial data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

 const handleDelete = async (item: any) => {
     const ProcedureId = item.ProcedureId || 0;
     if (!ProcedureId) return;
 
     try {
       await deleteprocedure(ProcedureId);
 
       // Remove from local state after successful delete
       // setMedicines((prev) => prev.filter((_, i) => i !== index));
 
       toast.current?.show({
         severity: "success",
         summary: "Deleted",
         detail: "Procedure deleted successfully",
         life: 3000,
       });
       getProceduresdata();
     } catch (error: any) {
       toast.current?.show({
         severity: "error",
         summary: "Error",
         detail: error.message || "Failed to delete Procedure",
         life: 3000,
       });
     }
   };

  const { control, reset, handleSubmit } = useForm({
    defaultValues: {},
  });

  const getProceduresdata = async () => {
    try {
      setLoading(true);
      const data = await FetchProcedure();
      console.log("medicine data has been log", data);
      setProceduresList(data?.return); // Assuming API returns array
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getProceduresdata();
  }, []);

  const handleEdit = (item: any) => {
    setForm({
      ProcedureName: item.ProcedureName,
      ProcedureCode: item.ProcedureCode,
      specializationId: item.specializationId,
      ProcedureId: item?.ProcedureId,
    });

    reset({
      ProcedureName: item.ProcedureName,
      ProcedureCode: item.ProcedureCode,
      specializationId: item.specializationId,
      ProcedureId: item?.ProcedureId,
    });

    setShowForm(true);
  };

  return (
    <>
      <Toast ref={toast} />

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="bg-white/70 backdrop-blur-md rounded-xl border-none shadow-2xl max-w-5xl p-6  no-scrollbar">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-slate-800">
                Manage Procedures
              </DialogTitle>
              <button
                onClick={onClose}
                className="text-teal-300 hover:bg-teal-400 p-2 rounded-full transition cursor-pointer absolute top-4 right-3"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </DialogHeader>

            <div className="my-4">
              <Button
                className="bg-blue-300"
                onClick={() => setShowForm(!showForm)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Procedure
              </Button>
            </div>

            {showForm && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-lg p-4 shadow-inner border-gray-300 mb-6">
                <Input
                  placeholder="Procedure Name *"
                  value={form.ProcedureName}
                  onChange={(e) =>
                    setForm({ ...form, ProcedureName: e.target.value })
                  }
                />
                <Input
                  placeholder="Procedure Code"
                  value={form.ProcedureCode}
                  onChange={(e) =>
                    setForm({ ...form, ProcedureCode: e.target.value })
                  }
                />
                <Controller
                  name="specializationId" // ✅ match form state
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString() ?? ""}
                      onValueChange={(value) => {
                        const numValue = Number(value);
                        field.onChange(numValue);
                        setForm((prev) => ({
                          ...prev,
                          specializationId: numValue, // ✅ match form state
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Specialization" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                        {" "}
                        {specializations.map((spec: any) => (
                          <SelectItem
                            key={spec.SpecializationId}
                            value={spec.SpecializationId.toString()}
                          >
                            {spec.SpecializationName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <div className="col-span-1 md:col-span-3 flex justify-end gap-4 mt-6">
                  <Button
                    className="px-4 py-2 bg-red-400 hover:bg-red-500"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="px-4 py-2 bg-green-400 hover:bg-green-500"
                    onClick={handleAdd}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-auto rounded-lg border-gray-300 bg-white shadow-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Procedure Name</TableHead>
                    <TableHead>Procedure Code</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center p-4">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : proceduresList?.filter(
                      (proc) =>
                        proc.IsDeleted === false ||
                        proc.IsDeleted === 0 ||
                        proc.IsDeleted === "false"
                    )?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center p-4">
                        No procedures found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    proceduresList
                      ?.filter(
                        (proc) =>
                          proc.IsDeleted === false ||
                          proc.IsDeleted === 0 ||
                          proc.IsDeleted === "false"
                      )
                      .map((proc, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{proc.ProcedureName}</TableCell>
                          <TableCell>{proc.ProcedureCode || "-"}</TableCell>
                          <TableCell>
                            {proc.specialization?.SpecializationName ?? "-"}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(proc)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(proc)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProcedureModal;
