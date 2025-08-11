"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import { deleteinvestigation, getInvestigationType } from "@/lib/setting";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { AddUpdateInvestigation, FetchInvestigation } from "@/lib/consultation";
import { Toast } from "primereact/toast";

interface InvestigationModalProps {
  open: boolean;
  onClose: () => void;
}

type Investigation = {
  InvestigationTypeId: number;
  InvestigationSubTypename?: string;
  InvestigationSubTypeId?: number;
};

const InvestigationModal: React.FC<InvestigationModalProps> = ({
  open,
  onClose,
}) => {
  const toast = useRef<Toast>(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Investigation>({
    InvestigationTypeId: 0,
    InvestigationSubTypename: "",
    InvestigationSubTypeId: 0,
  });
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [investigationTag, setInvestigationTag] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [investigationList, setInvestigationList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!form.InvestigationTypeId || !form.InvestigationSubTypename?.trim()) {
      toast.error("Please select type and enter subtype name");
      return;
    }

    try {
      setIsLoading(true);

      // Call API
      await AddUpdateInvestigation({
        InvestigationSubTypename: form.InvestigationSubTypename.trim(),
        InvestigationTypeId: form.InvestigationTypeId,
        InvestigationSubTypeId: form.InvestigationSubTypeId,
      });

      // toast.success("Investigation added successfully");
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Investigation added successfully",
        life: 4000,
        // className: "Investigation added successfully",
      });

      // Update local state
      setInvestigations((prev) => [...prev, form]);

      // Reset form
      setForm({ InvestigationTypeId: 0, InvestigationSubTypename: "" });
      setShowForm(false);
      setTimeout(() => {
        onClose(); // ✅ Correctly calling the onClose function
      }, 800);
    } catch (error: any) {
      console.error(error);
      toast.current?.show({
        severity: "error",
        summary: "errror",
        detail: "Investigation adding failed",
        life: 4000,
        // className: "Investigation added successfully",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleEdit = (item: any) => {

    setForm({
      InvestigationSubTypename: item.InvestigationSubTypename,
      InvestigationTypeId: item.InvestigationTypeId,
      InvestigationSubTypeId: item?.InvestigationSubTypeId,
    });

    reset({
      InvestigationSubTypename: item.InvestigationSubTypename,
      InvestigationTypeId: item.InvestigationTypeId ?? "",
    });

    setShowForm(true);
  };

  const handleDelete = async (index: number) => {
    const InvestigationSubTypeId =
      investigationList[index]?.InvestigationSubTypeId;
    if (!InvestigationSubTypeId) return;

    try {
      await deleteinvestigation(InvestigationSubTypeId);

      // Remove from local state after successful delete
      // setMedicines((prev) => prev.filter((_, i) => i !== index));

      toast.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "Investigation deleted successfully",
        life: 3000,
      });
      getInvestigationList();
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to delete medicine",
        life: 3000,
      });
    }
  };
  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      medicineType: "", // default field
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        const [InvRes] = await Promise.all([getInvestigationType()]);

        setInvestigationTag(InvRes?.return ?? []);

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

  const getInvestigationList = async () => {
    try {
      setLoading(true);
      const data = await FetchInvestigation();

      const investigations = data?.data?.consultationInvestigation ?? [];
      console.log("investigation data has been log", investigations);

      // Map main type with its sub-investigationType
      const mappedList = investigations.flatMap(
        (inv: any) =>
          inv.options?.map((opt: any) => ({
            InvestigationTypeId: inv.InvestigationTypeId,
            InvestigationType: inv.InvestigationType,
            IsDeleted: opt.IsDeleted,
            InvestigationSubTypeId: opt.InvestigationSubTypeId,
            InvestigationSubTypename: opt.subInveatigationType,
            value: opt.value,
            color: opt.color,
          })) || []
      );
      console.log("data has been log", mappedList);
      setInvestigationList(mappedList);
      console.log(
        investigationList.map((item) => ({
          id: item.InvestigationSubTypeId,
          IsDeleted: item.IsDeleted,
          type: typeof item.IsDeleted,
        }))
      );
    } catch (error) {
      console.error("Error fetching investigations:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getInvestigationList();
  }, []);

  return (
    <>
      <Toast ref={toast} />

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="bg-white/70 backdrop-blur-md rounded-xl border-none shadow-2xl max-w-4xl p-6 no-scrollbar">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-slate-800">
                Manage Investigations
              </DialogTitle>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-teal-600 hover:text-teal-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </DialogHeader>

            <div className="my-4">
              <Button
                className="bg-blue-300"
                onClick={() => setShowForm(!showForm)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Investigation
              </Button>
            </div>

            {showForm && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-lg p-4 shadow-inner border-gray-300 mb-6">
                <Controller
                  name="InvestigationTypeId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString() ?? ""}
                      onValueChange={(value) => {
                        const numValue = Number(value);
                        field.onChange(numValue);
                        setForm((prev) => ({
                          ...prev,
                          InvestigationTypeId: numValue,
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Investigation Type" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                        {investigationTag?.map((spec: any) => (
                          <SelectItem
                            key={spec.InvestigationTypeId}
                            value={spec.InvestigationTypeId.toString()}
                          >
                            {spec.InvestigationTypeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <Input
                  placeholder="Investigation Subtype Name"
                  value={form.InvestigationSubTypename}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      InvestigationSubTypename: e.target.value,
                    })
                  }
                />

                <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-6">
                  <Button
                    className="px-4 py-2 bg-red-400 hover:bg-red-500"
                    onClick={() => {
                      setForm({
                        InvestigationTypeId: 0,
                        InvestigationSubTypename: "",
                      });
                      setShowForm(false);
                    }}
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
                    <TableHead>Investigation Type</TableHead>
                    <TableHead>Subtype Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center p-4">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : (
                    (() => {
                      const filteredList =
                        investigationList?.filter(
                          (item) =>
                            item.IsDeleted === false ||
                            item.IsDeleted === 0 ||
                            item.IsDeleted === "false"
                        ) || [];

                      if (filteredList.length === 0) {
                        return (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center p-4">
                              No investigations found.
                            </TableCell>
                          </TableRow>
                        );
                      }

                      return filteredList.map((item, idx) => (
                        <TableRow key={item.InvestigationSubTypeId || idx}>
                          <TableCell>{item.InvestigationType}</TableCell>
                          <TableCell>{item.InvestigationSubTypename}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(item)} // Pass whole item
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(item)} // Pass whole item
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ));
                    })()
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

export default InvestigationModal;
