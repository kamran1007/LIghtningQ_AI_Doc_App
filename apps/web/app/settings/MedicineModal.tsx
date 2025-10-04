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
import { Toast } from "primereact/toast";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Plus, Trash2, Pencil, X, Loader2 } from "lucide-react";
import { addupdateMedicine, FetchMedication } from "@/lib/consultation";
import { Controller, useForm } from "react-hook-form";

interface MedicineModalProps {
  open: boolean;
  onClose: () => void;
}
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { deleteMedicine } from "@/lib/setting";
type Medicine = {
  MedicineName: string;
  OnlyMedicineName: string;
  Strength?: string;
  Units?: string;
  ScheduleType?: string;
  MedicineTypeName?: string;
  GenericName?: string;
  HSNCode?: string;
  Instructions?: string;
};

const initialForm: Medicine = {
  MedicineName: "",
  OnlyMedicineName: "",
  Strength: "",
  Units: "",
  ScheduleType: "",
  MedicineTypeName: "",
  GenericName: "",
  HSNCode: "",
  Instructions: "",
};
interface MedicineFormValues {
  medicineType: string;
  unit?: string;
  ScheduleType?: string;
  MedicineType?: string;
  // add other fields if needed, e.g. Strength, Instructions...
}

const MedicineModal: React.FC<MedicineModalProps> = ({ open, onClose }) => {
  const toast = useRef<Toast>(null);
  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<MedicineFormValues>({
    defaultValues: {
      medicineType: "", // default field
      unit: "",
      ScheduleType: "",
      MedicineType: "",
      // add other fields if needed
    },
  });
  const [showForm, setShowForm] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [form, setForm] = useState<Medicine>(initialForm);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [medicineList, setMedicineList] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const { ConsultationMedication, createdAt, updatedAt, ...cleanForm } =
        form as any; // Exclude unwanted fields

      const payload = {
        ...form,
        MedicineId:
          selectedIndex !== null
            ? medicineList[selectedIndex]?.MedicineId
            : undefined,
      };

      console.log("📤 Sending to backend:", payload);
      const saved = await addupdateMedicine(payload);

      if (selectedIndex !== null) {
        const updated = [...medicineList];
        updated[selectedIndex] = saved;
        setMedicineList(updated);
      } else {
        setMedicineList((prev) => [...prev, saved]);
      }

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Medicine saved successfully",
        life: 4000,
        // className: "custom-toast-container",
      });
      setForm(initialForm);
      setSelectedIndex(null);
      setShowForm(false);
      setTimeout(() => {
        onClose(); // ✅ Correctly calling the onClose function
      }, 800);
    } catch (error: any) {
      console.error("❌ Error saving medicine:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save Medicine",
        life: 4000,
        className: "custom-toast-container",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: any, index: number) => {
    const medicineId = item?.MedicineId;
    if (!medicineId) return;

    try {
      await deleteMedicine(medicineId);

      // Remove from local state after successful delete
      setMedicines((prev) => prev.filter((_, i) => i !== index));

      toast.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "Medicine deleted successfully",
        life: 3000,
      });
      getMedicines();
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to delete medicine",
        life: 3000,
      });
    }
  };

  const handleEdit = (item: any, index: number) => {
    const { IsDeleted, ...rest } = item; // exclude IsDeleted from form
    setForm(rest);
    setSelectedIndex(index); // ✅ store the index number
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm(initialForm);
    setSelectedIndex(null);
    setShowForm(false);
  };

  const getMedicines = async () => {
    try {
      setLoading(true);
      const data = await FetchMedication();
      console.log("medicine data has been log", data);
      setMedicineList(data?.return); // Assuming API returns array
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getMedicines();
  }, []);
  return (
    <>
      <Toast ref={toast} />

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="bg-white/70 backdrop-blur-md rounded-xl border-none shadow-2xl max-w-6xl p-6 no-scrollbar">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-slate-800">
                Manage Medicines
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
                onClick={() => {
                  setShowForm(true);
                  setForm(initialForm);
                  setSelectedIndex(null);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Medicine
              </Button>
            </div>

            {showForm && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-lg p-4 shadow-inner border-gray-300 mb-6">
                <Input
                  placeholder="Medicine Name *"
                  value={form.MedicineName}
                  onChange={(e) =>
                    setForm({ ...form, MedicineName: e.target.value })
                  }
                />
                <Input
                  placeholder="Only Medicine Name *"
                  value={form.OnlyMedicineName}
                  onChange={(e) =>
                    setForm({ ...form, OnlyMedicineName: e.target.value })
                  }
                />
                <Input
                  placeholder="Strength"
                  value={form.Strength}
                  onChange={(e) =>
                    setForm({ ...form, Strength: e.target.value })
                  }
                />
                <Controller
                  name="unit"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={form.Units}
                      onValueChange={(value) =>
                        setForm({ ...form, Units: value })
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select Unit" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                        <SelectItem value="mg">mg</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="mcg">mcg</SelectItem>
                        <SelectItem value="%">%</SelectItem>
                        <SelectItem value="Gms">Gms</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                <Controller
                  name="ScheduleType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={form.ScheduleType}
                      onValueChange={(value) =>
                        setForm({ ...form, ScheduleType: value })
                      }
                    >
                      {" "}
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Schedule Type" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                        <SelectItem value="G">G</SelectItem>
                        <SelectItem value="H">H</SelectItem>
                        <SelectItem value="X">X</SelectItem>
                        <SelectItem value="H1">H1</SelectItem>
                        <SelectItem value="O">O</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {/* <Input
                  placeholder="Schedule Type"
                  value={form.ScheduleType}
                  onChange={(e) =>
                    setForm({ ...form, ScheduleType: e.target.value })
                  }
                /> */}
                <Controller
                  name="MedicineType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={form.MedicineTypeName}
                      onValueChange={(value) =>
                        setForm({ ...form, MedicineTypeName: value })
                      }
                    >
                      {" "}
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select medicine type" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                        <SelectItem value="TABLET">Tablet</SelectItem>
                        <SelectItem value="CAPSULE">Capsule</SelectItem>
                        <SelectItem value="SYRUP">Syrup</SelectItem>
                        <SelectItem value="INJECTION">Injection</SelectItem>
                        <SelectItem value="OINTMENT">Ointment</SelectItem>
                        <SelectItem value="DROPS">Drops</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Input
                  placeholder="Generic Name"
                  value={form.GenericName}
                  onChange={(e) =>
                    setForm({ ...form, GenericName: e.target.value })
                  }
                />
                <Input
                  placeholder="HSN Code"
                  value={form.HSNCode}
                  onChange={(e) =>
                    setForm({ ...form, HSNCode: e.target.value })
                  }
                />
                <Input
                  placeholder="Instructions"
                  value={form.Instructions}
                  onChange={(e) =>
                    setForm({ ...form, Instructions: e.target.value })
                  }
                />

                <div className="col-span-1 md:col-span-3 flex justify-end gap-4 mt-6">
                  <Button
                    className="px-4 py-2 bg-red-400 hover:bg-red-500"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="px-4 py-2 bg-green-400 hover:bg-green-500 flex items-center gap-2"
                    onClick={handleSave}
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

            <div className="overflow-auto rounded-lg border-gray-300 bg-white shadow-md">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>M Name</TableHead>
                      <TableHead>M Type</TableHead>
                      <TableHead>M Strength</TableHead>
                      <TableHead>M Units</TableHead>
                      <TableHead>M Schedule</TableHead>
                      <TableHead>Generic Name</TableHead>
                      <TableHead>HSN Code</TableHead>
                      <TableHead>Instruction</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      const filteredList =
                        medicineList?.filter(
                          (med) =>
                            med.IsDeleted === false ||
                            med.IsDeleted === 0 ||
                            med.IsDeleted === "false"
                        ) || [];

                      if (filteredList.length === 0) {
                        return (
                          <TableRow>
                            <TableCell colSpan={9} className="p-4 text-center">
                              No medicines found.
                            </TableCell>
                          </TableRow>
                        );
                      }

                      return filteredList.map((med, idx) => (
                        <TableRow key={med.MedicineId || idx}>
                          <TableCell>{med.MedicineName}</TableCell>
                          <TableCell>{med.MedicineTypeName}</TableCell>
                          <TableCell>{med.Strength}</TableCell>
                          <TableCell>{med.Units}</TableCell>
                          <TableCell>{med.ScheduleType}</TableCell>
                          <TableCell>{med.GenericName}</TableCell>
                          <TableCell>{med.HSNCode}</TableCell>
                          <TableCell>{med.Instructions}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(med, idx)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(med, idx)}
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

export default MedicineModal;
