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
  SquareActivity,
} from "lucide-react";
import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Sidebar } from "primereact/sidebar";
import PatientCaseHistory from "app/patientvisithistory/CaseHistory";
import { useEvents } from "@/context/events-context";

interface AppointmentActionsDialogProps {
  patient: any;
  onCancel: (patient: any) => void; // 👈 takes patient
  onReschedule: (patient: any) => void; // 👈 takes patient
  onViewCaseHistory: (patient: any) => void;
  onStartConsultation: (patient: any) => void;
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
  const { setEventAddOpen, setEditingEvent } = useEvents();

  const isPastDate = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointmentDate = new Date(dateStr);
    appointmentDate.setHours(0, 0, 0, 0);

    return appointmentDate < today;
  };

  const hoverchange =
    "justify-start gap-3 hover:bg-[linear-gradient(135deg,rgba(34,211,238,0.35)_0%,rgba(129,140,248,0.15)_100%)]";

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
            className="w-6 h-6 text-teal-400 cursor-pointer"
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
                  <h2 className="text-lg font-medium text-center mb-4 text-[#2cbbb1] font-sans ">
                    Appointment Actions Panel
                  </h2>

                  <div className="flex flex-col gap-3 hover:to-blue-100">
                    <Button
                      variant="ghost"
                      className={hoverchange}
                      onClick={() => {
                        if (
                          isPastDate(patient.appointmentDate) ||
                          patient.IsConsultationCompleted
                        ) {
                          toast.current?.show({
                            severity: "error",
                            summary: "Error",
                            detail: patient.IsConsultationCompleted
                              ? "You can't reschedule a completed consultation."
                              : "You can't reschedule a past appointment.",
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
                      className={hoverchange}
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
                      className={hoverchange}
                      onClick={() => {
                        if (isPastDate(patient.appointmentDate)) {
                          toast.current?.show({
                            severity: "error",
                            summary: "Error",
                            detail:
                              "You can't add vitals for a past appointment.",
                            life: 4000,
                          });
                          return;
                        }
                        onStartConsultation({
                          ...patient,
                          initialTab: "vitals",
                        });
                        setOpen(false);
                      }}
                    >
                      <SquareActivity className="w-5 h-5 text-blue-500" />
                      Vitals
                    </Button>

                    <Button
                      variant="ghost"
                      className={hoverchange}
                      onClick={() => {
                        const appointmentDate = new Date(
                          patient.appointmentDate
                        );
                        const today = new Date();

                        // Remove time part for strict date comparison
                        appointmentDate.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);

                        if (appointmentDate < today) {
                          toast.current?.show({
                            severity: "error",
                            summary: "Error",
                            detail:
                              "You can't start consultation for a past appointment.",
                            life: 4000,
                          });
                          return;
                        }

                        if (appointmentDate > today) {
                          toast.current?.show({
                            severity: "warn",
                            summary: "Warning",
                            detail:
                              "You can't start consultation for a future appointment.",
                            life: 4000,
                          });
                          return;
                        }

                        // ✅ Allow only for today's appointments
                        onStartConsultation({
                          ...patient,
                          initialTab: "consultation",
                        });

                        setOpen(false);
                      }}
                    >
                      <Stethoscope className="w-5 h-5 text-teal-500" />
                      Start Consultation
                    </Button>

                    <Button
                      variant="ghost"
                      className={hoverchange}
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
