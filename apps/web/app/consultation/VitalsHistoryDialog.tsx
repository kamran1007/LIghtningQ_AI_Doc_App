"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function VitalsHistoryDialog({
  open,
  onOpenChange,
  vitalsData = [],
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  vitalsData: any[];
}) {
  const formatDateTime = (dateTimeStr: string) => {
    const dateObj = new Date(dateTimeStr);
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  };

  const formatValue = (value: any, suffix = "") => {
    return value && value !== 0 ? `${value} ${suffix}` : "N/A";
  };
  const bloodGroupMap: Record<string, string> = {
    A_POS: "A+",
    A_NEG: "A-",
    B_POS: "B+",
    B_NEG: "B-",
    AB_POS: "AB+",
    AB_NEG: "AB-",
    O_POS: "O+",
    O_NEG: "O-",
  };
  const formatTime = (time: string | Date | null | undefined): string => {
    if (!time) return "N/A";
    try {
      const date = new Date(`1970-01-01T${time}`);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.div
                className="fixed z-50 top-1/2 left-1/2 w-[95vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium text-[#22E0D4]">
                    Vitals History
                  </h2>
                  <X
                    className="w-6 h-6 cursor-pointer text-red-500 hover:text-red-600 transition-colors"
                    onClick={() => onOpenChange(false)}
                  />
                </div>

                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
                  {vitalsData.length > 0 ? (
                    vitalsData.map((entry, i) => {
                      const { date, time } = formatDateTime(entry.updatedAt);

                      return (
                        <div
                          key={i}
                          className="p-4 bg-gray-100 rounded-xl shadow-sm border border-gray-300"
                        >
                          <div className="flex justify-between mb-3 text-sm text-gray-600">
                            <span>Date: {date}</span>
                            <span>Time: {formatTime(time)}</span>
                          </div>

                          <table className="w-full text-sm table-auto border-collapse">
                            <thead>
                              <tr className="bg-[#f9fdfc] border-b">
                                <th className="text-left text-[#000000] p-2  font-medium ">
                                  Type
                                </th>
                                <th className="text-left p-2 font-medium text-gray-700">
                                  Height
                                </th>
                                <th className="text-left p-2 font-medium text-gray-700">
                                  Weight
                                </th>
                                <th className="text-left p-2 font-medium text-gray-700">
                                  BMI
                                </th>
                                <th className="text-left p-2 font-medium text-gray-700">
                                  Temp
                                </th>
                                <th className="text-left p-2 font-medium text-gray-700">
                                  Systolic
                                </th>
                                <th className="text-left p-2 font-medium text-gray-700">
                                  Diastolic
                                </th>
                                <th className="text-left p-2 font-medium text-gray-700">
                                  Heart Rate
                                </th>
                                <th className="text-left p-2 font-medium text-gray-700">
                                  O2 Sat.
                                </th>
                                <th className="text-left p-2 font-medium text-gray-700">
                                  Blood Group
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-t">
                                <td className="p-2 font-medium text-gray-600">
                                  Value
                                </td>
                                <td className="p-2">
                                  {formatValue(entry.Height, "cm")}
                                </td>
                                <td className="p-2">
                                  {formatValue(entry.Weight, "kg")}
                                </td>
                                <td className="p-2">
                                  {formatValue(entry.BMI)}
                                </td>
                                <td className="p-2">
                                  {formatValue(entry.Temperature, "°F")}
                                </td>
                                <td className="p-2">
                                  {formatValue(entry.Systolic, "mmHg")}
                                </td>
                                <td className="p-2">
                                  {formatValue(entry.Diastolic, "mmHg")}
                                </td>
                                <td className="p-2">
                                  {formatValue(entry.HeartRate, "bpm")}
                                </td>
                                <td className="p-2">
                                  {formatValue(entry.OxygenSaturation, "%")}
                                </td>
                                <td className="p-2">
                                  {bloodGroupMap[entry.BloodGroup] || "N/A"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500 text-center">
                      No vitals history found.
                    </p>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
