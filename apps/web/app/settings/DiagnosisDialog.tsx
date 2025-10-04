"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Toast } from "primereact/toast";

import { getUserSpecialization } from "@/lib/admin";
import { Controller, useForm } from "react-hook-form";
import { AddUpdateDiagnosis, FetchDiagnosis } from "@/lib/consultation";
import { deletediagonasis } from "@/lib/setting";
interface Diagnosis {
  DiagnosisName: string;
  icdCode?: string;
  DiagnosisId?: number;
  specializationId?: number;
}

interface DiagnosisDialogProps {
  open: boolean;
  onClose: () => void;
}

interface DiagnosisPayload {
  DiagnosisName: string;
  specializationId?: number; // <-- optional
  icdCode?: string;
  DiagnosisId?: number;
}
interface DiagnosisFormValues {
  DiagnosisName: string;
  icdCode?: string;
  specializationId?: number; // must match your Controller field
  DiagnosisId?: number;
}

export default function DiagnosisDialog({
  open,
  onClose,
}: DiagnosisDialogProps) {
  const toast = useRef<Toast>(null);

  const [showForm, setShowForm] = useState(false);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [form, setForm] = useState<Diagnosis>({
    DiagnosisName: "",
    icdCode: "",
    DiagnosisId: 0,
    specializationId: undefined,
  });
  const [specializations, setSpecializations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [diagonasisList, setDiagonasisList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const handleAdd = async () => {
    if (!form.DiagnosisName.trim()) return;

    try {
      setIsLoading(true);

      // Prepare payload
      const payload: DiagnosisPayload = {
        DiagnosisName: form.DiagnosisName.trim(),
        specializationId: form.specializationId, // guaranteed number now
        icdCode: form.icdCode?.trim() || undefined,
        DiagnosisId: form.DiagnosisId || undefined,
      };

      // Call API
      const saved = await AddUpdateDiagnosis(payload as any);

      // Update local state
      setDiagnoses((prev) => [...prev, saved?.data ?? payload]);

      // Reset form
      setForm({ DiagnosisName: "", icdCode: "", specializationId: undefined });
      setShowForm(false);
      toast.current?.show({
        severity: "success",
        summary: "added",
        detail: "Diagnosis added successfully",
        life: 3000,
      });
      getdiagonasisdata();
    } catch (error) {
      console.error("Error adding diagnosis:", error);
      toast.current?.show({
        severity: "error",
        summary: "failed",
        detail: "Diagnosis adding  failed",
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: any,index: number) => {
    setSelectedIndex(index); // ✅ store the index number
    setForm({
      DiagnosisName: item.DiagnosisName,
      DiagnosisId: item.DiagnosisId,
      specializationId: item.specializationId,
      icdCode: item?.icdCode,
    });

    reset({
      DiagnosisName: item.DiagnosisName,
      DiagnosisId: item.DiagnosisId,
      specializationId: item.specializationId,
      icdCode: item?.icdCode,
    });

    setShowForm(true);
  };

  const handleDelete = async (item: any) => {
    const DiagnosisId = item.DiagnosisId || 0;
    if (!DiagnosisId) return;

    try {
      await deletediagonasis(DiagnosisId);

      // Remove from local state after successful delete
      // setMedicines((prev) => prev.filter((_, i) => i !== index));

      toast.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "Diagonasis deleted successfully",
        life: 3000,
      });
      getdiagonasisdata();
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to delete Diagonasis",
        life: 3000,
      });
    }
  };

  const { control, reset, handleSubmit } = useForm<DiagnosisFormValues>({
    defaultValues: {
      DiagnosisName: "",
      icdCode: "",
      specializationId: undefined,
      DiagnosisId: undefined,
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        const [specRes] = await Promise.all([getUserSpecialization()]);

        setSpecializations(specRes?.return?.data ?? []);

        // ✅ Set user if editing
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.current?.show({
          severity: "error",
          summary: "failed",
          detail: "Failed to fetch initial data",
          life: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const getdiagonasisdata = async () => {
    try {
      setLoading(true);
      const data = await FetchDiagnosis();
      console.log("medicine data has been log", data);
      setDiagonasisList(data?.return); // Assuming API returns array
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getdiagonasisdata();
  }, []);

  return (
    <>
      <Toast ref={toast} />

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="bg-white/70 backdrop-blur-md rounded-xl border-none shadow-2xl max-w-5xl p-6 no-scrollbar">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-slate-800">
                Manage Diagnosis
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
                Add Diagnosis
              </Button>
            </div>

            {showForm && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-lg p-4 shadow-inner border-gray-300 mb-6">
                <Input
                  placeholder="Diagnosis Name *"
                  value={form.DiagnosisName}
                  onChange={(e) =>
                    setForm({ ...form, DiagnosisName: e.target.value })
                  }
                />
                <Input
                  placeholder="ICD Code"
                  value={form.icdCode}
                  onChange={(e) =>
                    setForm({ ...form, icdCode: e.target.value })
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
                    onClick={() => {
                      setShowForm(false);
                      setForm({
                        DiagnosisName: "",
                        icdCode: "",
                        specializationId: undefined,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="px-4 py-2 bg-green-400 hover:bg-green-500 flex items-center gap-2"
                    onClick={handleAdd}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                      </>
                    ) : (
                      <span>{selectedIndex !== null ? "Update" : "Save"}</span>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Diagnosis Table */}
            <div className="overflow-auto rounded-lg border-gray-300 bg-white shadow-md">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Diagnosis Name</TableHead>
                      <TableHead>ICD Code</TableHead>
                      <TableHead>Specialization ID</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {diagonasisList?.filter(
                      (item) =>
                        item.IsDeleted === false ||
                        item.IsDeleted === 0 ||
                        item.IsDeleted === "false"
                    )?.length > 0 ? (
                      diagonasisList
                        .filter(
                          (item) =>
                            item.IsDeleted === false ||
                            item.IsDeleted === 0 ||
                            item.IsDeleted === "false"
                        )
                        .map((diag, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{diag.DiagnosisName}</TableCell>
                            <TableCell>{diag.icdCode || "-"}</TableCell>
                            <TableCell>
                              {diag?.specialization?.SpecializationName || "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(diag,idx)} // Pass item instead of index
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(diag)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center p-4">
                          No diagnosis found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
