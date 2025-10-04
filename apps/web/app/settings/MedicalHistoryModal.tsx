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
import {
  addupdatemedicalhistory,
  deleteMedicalHistory,
  getmedicalhistory,
} from "@/lib/setting";
import { useForm } from "react-hook-form";
import { Toast } from "primereact/toast";

interface MedicalHistoryModalProps {
  open: boolean;
  onClose: () => void;
}

type MedicalHistory = {
  MedicalHistoryName: string;
  MedicalHistoryId: number;
  duration?: string;
  Remark?: string;
};

const MedicalHistoryModal: React.FC<MedicalHistoryModalProps> = ({
  open,
  onClose,
}) => {
  const toast = useRef<Toast>(null);

  const [showForm, setShowForm] = useState(false);
  const [histories, setHistories] = useState<MedicalHistory[]>([]);
  const [form, setForm] = useState<MedicalHistory>({
    MedicalHistoryName: "",
    MedicalHistoryId: 0,
    duration: "",
    Remark: "",
  });
  const [loading, setLoading] = useState(false);
  const [medicalhistoryList, setMedicalhistoryList] = useState<any[]>([]);
 const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { control, reset, handleSubmit } = useForm({
    defaultValues: {},
  });

  const handleAdd = async () => {
    if (!form.MedicalHistoryName.trim()) return;

    try {
      setLoading(true);

      // Prepare payload according to your backend expectation
      const payload = {
        MedicalHistoryName: form.MedicalHistoryName,
        MedicalHistoryId: form.MedicalHistoryId
        // you can pass duration too if backend supports it
      };

      const saved = await addupdatemedicalhistory(payload);0

      // If backend returns the created/updated record
      setHistories((prev) => [...prev, saved]);

      // Reset form
      setForm({ MedicalHistoryName: "", MedicalHistoryId: 0 });
      setShowForm(false);
    } catch (error) {
      console.error("❌ Error saving medical history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any,index:number) => {
    setSelectedIndex(index); // ✅ store the index number
    setForm({
      MedicalHistoryName: item.MedicalHistoryName,
      MedicalHistoryId: item.MedicalHistoryId,
    });

    reset({
      MedicalHistoryName: item.MedicalHistoryName,
      MedicalHistoryId: item.MedicalHistoryId,
    });

    setShowForm(true);
  };

  const handleDelete = async (item: any) => {
    const MedicalHistoryId = item?.MedicalHistoryId;
    if (!MedicalHistoryId) return;

    try {
      await deleteMedicalHistory(MedicalHistoryId);

      // Remove from local state after successful delete
      // setMedicines((prev) => prev.filter((_, i) => i !== index));

      toast.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "Investigation deleted successfully",
        life: 3000,
      });
      getmedicalhistorydata();
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to delete medicine",
        life: 3000,
      });
    }
  };

  const getmedicalhistorydata = async () => {
    try {
      setLoading(true);
      const data = await getmedicalhistory();
      console.log("medicine data has been log", data);
      setMedicalhistoryList(data?.return); // Assuming API returns array
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getmedicalhistorydata();
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
                Manage Medical History
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
                Add Medical History
              </Button>
            </div>

            {showForm && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-lg p-4 shadow-inner border-gray-300 mb-6">
                <Input
                  placeholder="Medical History Name *"
                  value={form.MedicalHistoryName}
                  onChange={(e) =>
                    setForm({ ...form, MedicalHistoryName: e.target.value })
                  }
                />
                {/* <Input
                placeholder="Duration"
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: e.target.value })
                }
              />
              <Input
                placeholder="Remark"
                value={form.Remark}
                onChange={(e) =>
                  setForm({ ...form, Remark: e.target.value })
                }
              /> */}

                <div className="col-span-1 md:col-span-3 flex justify-end gap-4 mt-6">
                  <Button
                    className="px-4 py-2 bg-red-400 hover:bg-red-500"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="px-4 py-2 bg-green-400 hover:bg-green-500 flex items-center gap-2"
                    onClick={handleAdd}
                    disabled={loading}
                  >
                    {loading ? (
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    {/* <TableHead>Duration</TableHead>
                    <TableHead>Remark</TableHead> */}
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
                  ) : (
                    (() => {
                      const filteredList =
                        medicalhistoryList?.filter(
                          (item) =>
                            item.IsDeleted === false ||
                            item.IsDeleted === 0 ||
                            item.IsDeleted === "false"
                        ) || [];

                      if (filteredList.length === 0) {
                        return (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center p-4">
                              No medical history found.
                            </TableCell>
                          </TableRow>
                        );
                      }

                      return filteredList.map((h, idx) => (
                        <TableRow key={h.MedicalHistoryId || idx}>
                          <TableCell>{h.MedicalHistoryName}</TableCell>
                          {/* <TableCell>{h.duration || "-"}</TableCell>
                          <TableCell>{h.Remark || "-"}</TableCell> */}
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(h,idx)} // Pass full item
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(h)} // Pass full item
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

export default MedicalHistoryModal;
