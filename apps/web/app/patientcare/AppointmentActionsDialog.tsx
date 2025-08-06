"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CalendarClock,
  XCircle,
  ClipboardList,
  Stethoscope,
  MoreHorizontal,
} from "lucide-react";
import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Sidebar } from "primereact/sidebar";
import PatientCaseHistory from "app/patientvisithistory/CaseHistory";

interface AppointmentActionsDialogProps {
  patient: any;
  onCancel: () => void;
  onReschedule: () => void;
  onViewCaseHistory: (patient: any) => void; // Keep if you still want to trigger callback
  onStartConsultation: () => void;
}

export default function AppointmentActionsDialog({
  patient,
  onReschedule,
  onCancel,
  onViewCaseHistory,
  onStartConsultation,
}: AppointmentActionsDialogProps) {
  const [open, setOpen] = useState(false);
  const [isCaseHistoryOpen, setIsCaseHistoryOpen] = useState(false);
  const toast = useRef<Toast>(null);

  const isPastDate = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointmentDate = new Date(dateStr);
    appointmentDate.setHours(0, 0, 0, 0);

    return appointmentDate < today;
  };

  return (
    <>
      <Toast ref={toast} />

      {/* Case History Sidebar */}
      <PatientCaseHistory
        visible={isCaseHistoryOpen}
        onHide={() => setIsCaseHistoryOpen(false)}
        patient={patient}
      />

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <MoreHorizontal
            className="w-6 h-6 text-blue-600 cursor-pointer"
            onClick={() => setOpen(true)}
          />
        </Dialog.Trigger>

        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 200,
                    duration: 0.35,
                  }}
                />
              </Dialog.Overlay>

              <Dialog.Content asChild forceMount>
                <motion.div
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 200,
                    duration: 0.35,
                  }}
                  className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl"
                >
                  <h2 className="text-lg font-medium text-center mb-4 text-[#22E0D4] font-mono">
                    Appointment Actions Panel
                  </h2>

                  <div className="flex flex-col gap-3">
                    <Button
                      variant="ghost"
                      className="justify-start gap-3"
                      onClick={() => {
                        if (isPastDate(patient.appointmentDate)) {
                          toast.current?.show({
                            severity: "error",
                            summary: "Error",
                            detail: "You can't reschedule a past appointment.",
                            life: 4000,
                          });
                          return;
                        }
                        onReschedule(patient);
                        setOpen(false);
                      }}
                    >
                      <CalendarClock className="w-5 h-5 text-purple-500" />
                      Reschedule Appointment
                    </Button>

                    <Button
                      variant="ghost"
                      className="justify-start gap-3"
                      onClick={() => {
                        if (isPastDate(patient.appointmentDate)) {
                          toast.current?.show({
                            severity: "error",
                            summary: "Error",
                            detail: "You can't cancel a past appointment.",
                            life: 4000,
                          });
                          return;
                        }
                        onCancel(patient);
                        setOpen(false);
                      }}
                    >
                      <XCircle className="w-5 h-5 text-red-500" />
                      Cancel Appointment
                    </Button>

                    <Button
                      variant="ghost"
                      className="justify-start gap-3"
                      onClick={() => {
                        if (isPastDate(patient.appointmentDate)) {
                          toast.current?.show({
                            severity: "error",
                            summary: "Error",
                            detail:
                              "You can't start consultation for a past appointment.",
                            life: 4000,
                          });
                          return;
                        }
                        onStartConsultation(patient);
                        setOpen(false);
                      }}
                    >
                      <Stethoscope className="w-5 h-5 text-teal-500" />
                      Start Consultation
                    </Button>

                    <Button
                      variant="ghost"
                      className="justify-start gap-3"
                      onClick={() => {
                        setIsCaseHistoryOpen(true);
                      }}
                    >
                      <ClipboardList className="w-5 h-5 text-green-500" />
                      View Case History
                    </Button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </>
  );
}
