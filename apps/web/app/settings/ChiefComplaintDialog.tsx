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
import { Plus, Trash2, Pencil, X, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { getUserSpecialization } from "@/lib/admin";
import toast from "react-hot-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AddUpdatechiefComplaint,
  FetchChiefComplaint,
} from "@/lib/consultation";
import { Toast } from "primereact/toast";
import { deleteChiefComplaintTag } from "@/lib/setting";

interface ChiefComplaintModalProps {
  open: boolean;
  onClose: () => void;
}

type ChiefComplaint = {
  ChiefComplainTagName: string;
  SpecializationId?: number;
  ChiefComplaintTagId?: number;
  ChiefComplaintId?: number;
};
interface ChiefComplaintForm {
  ChiefComplainTagName: string;
  SpecializationId?: number | string; // RHF often treats selects as string
  ChiefComplaintId?: number;
  ChiefComplaintTagId?: number;
  medicineType?: string; // example additional field
}

const ChiefComplaintModal: React.FC<ChiefComplaintModalProps> = ({
  open,
  onClose,
}) => {
  const toast = useRef<Toast>(null);

  const [showForm, setShowForm] = useState(false);
  const [complaints, setComplaints] = useState<ChiefComplaint[]>([]);
  const [specializations, setSpecializations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chiefComplaintList, setChiefComplaintList] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<ChiefComplaint>({
    ChiefComplainTagName: "",
    SpecializationId: 0,
    ChiefComplaintTagId: 0,
    ChiefComplaintId: 0,
  });

  const handleAdd = async () => {
    // ✅ Validation: Stop execution if invalid
    if (!form.ChiefComplainTagName.trim() || !form.SpecializationId) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill all required fields",
        life: 4000,
      });
      return; // prevent continuing
    }

    try {
      setIsLoading(true);

      // Call API
      await AddUpdatechiefComplaint({
        ChiefComplainTagName: form.ChiefComplainTagName,
        specializationId: form.SpecializationId,
        ChiefComplaintTagId: form?.ChiefComplaintTagId,
      });

      const actionMessage = form.ChiefComplaintTagId
        ? "Chief complaint updated successfully"
        : "Chief complaint added successfully";

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: actionMessage,
        life: 4000,
      });

      // Refresh list from backend
      getchiefcomplainttag();

      // ✅ Update local state optimistically
      if (form.ChiefComplaintTagId) {
        setComplaints((prev) =>
          prev.map((c) =>
            c.ChiefComplaintTagId === form.ChiefComplaintTagId ? form : c
          )
        );
      } else {
        setComplaints((prev) => [...prev, form]);
      }

      // ✅ Reset form
      setForm({
        ChiefComplainTagName: "",
        SpecializationId: undefined,
        ChiefComplaintTagId: 0,
      });
      setShowForm(false);
    } catch (err: any) {
      console.error("❌ Error saving chief complaint:", err);

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to save chief complaint",
        life: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    // const item = chiefComplaintList[index];

    // Normalize key names for form state
    setForm({
      ChiefComplainTagName: item.ChiefComplainTagName,
      SpecializationId:
        item.SpecializationId ?? item.specializationId ?? undefined,
      ChiefComplaintId: item.ChiefComplaintId,
      ChiefComplaintTagId: item?.ChiefComplaintTagId,
    });

    // Sync with react-hook-form as well
    reset({
      ChiefComplainTagName: item.ChiefComplainTagName,
      SpecializationId: item.SpecializationId ?? item.specializationId ?? "",
    });

    // setSelectedIndex(index);
    setShowForm(true);
  };

  const getchiefcomplainttag = async () => {
    try {
      setLoading(true);
      const data = await FetchChiefComplaint();
      console.log("medicine data has been log", data);
      setChiefComplaintList(data?.return); // Assuming API returns array
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getchiefcomplainttag();
  }, []);

  const handleDelete = async (item: any) => {
    const ChiefComplaintTagId = item.ChiefComplaintTagId || 0;
    if (!ChiefComplaintTagId) return;

    try {
      await deleteChiefComplaintTag(ChiefComplaintTagId);

      // Remove from local state after successful delete
      // setMedicines((prev) => prev.filter((_, i) => i !== index));

      toast.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "Medicine deleted successfully",
        life: 3000,
      });
      getchiefcomplainttag();
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to delete medicine",
        life: 3000,
      });
    }
  };
  // const { control, reset, handleSubmit } = useForm({
  //   defaultValues: {
  //     medicineType: "", // default field
  //   },
  // });
  const { control, reset, handleSubmit } = useForm<ChiefComplaintForm>({
    defaultValues: {
      ChiefComplainTagName: "",
      SpecializationId: "",
      ChiefComplaintId: 0,
      ChiefComplaintTagId: 0,
      medicineType: "",
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
          summary: "Error",
          detail: "Failed to fetch initial data",
          life: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
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
                Manage Chief Complaints
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
                Add Complaint
              </Button>
            </div>

            {showForm && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-lg p-4 shadow-inner border-gray-300 mb-6">
                <Input
                  placeholder="Chief Complaint Tag Name *"
                  value={form.ChiefComplainTagName}
                  onChange={(e) =>
                    setForm({ ...form, ChiefComplainTagName: e.target.value })
                  }
                />
                <Controller
                  name="SpecializationId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString() ?? ""}
                      onValueChange={(value) => {
                        const numValue = Number(value);
                        field.onChange(numValue);
                        setForm((prev) => ({
                          ...prev,
                          SpecializationId: numValue,
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Specialization" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
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

                <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-6">
                  <Button
                    className="px-4 py-2 bg-red-400 hover:bg-red-500"
                    onClick={() => {
                      setForm({
                        ChiefComplainTagName: "",
                        SpecializationId: undefined,
                      });
                      setShowForm(false);
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

            {/* Table Section */}
            <div className="overflow-auto rounded-lg border-gray-300 bg-white shadow-md">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Chief Complaint Tag Name</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      const filteredList =
                        chiefComplaintList?.filter(
                          (item) =>
                            item.IsDeleted === false ||
                            item.IsDeleted === 0 ||
                            item.IsDeleted === "false"
                        ) || [];

                      if (filteredList.length === 0) {
                        return (
                          <TableRow>
                            <TableCell colSpan={9} className="p-4 text-center">
                              No chief complaints found.
                            </TableCell>
                          </TableRow>
                        );
                      }

                      return filteredList.map((item, idx) => (
                        <TableRow key={item.ChiefComplaintId || idx}>
                          <TableCell>{item.ChiefComplainTagName}</TableCell>
                          <TableCell>
                            {item.specialization?.SpecializationName ?? "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(item)} // Pass item instead of index
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(item)} // Pass item instead of index
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ));
                    })()}
                  </TableBody>
                </Table>
              )}
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChiefComplaintModal;
