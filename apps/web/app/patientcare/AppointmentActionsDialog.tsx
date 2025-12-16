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
  ReceiptText,
} from "lucide-react";
import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PatientCaseHistory from "app/patientvisithistory/CaseHistory";
import { useEvents } from "@/context/events-context";

interface AppointmentActionsDialogProps {
  patient: any;
  onCancel: (patient: any) => void;
  onReschedule: (patient: any) => void;
  onViewCaseHistory: (patient: any) => void;
  onStartConsultation: (patient: any) => void;
  onBilling?: (appointment: any) => void; // ✅ New optional prop
}

export default function AppointmentActionsDialog({
  patient,
  onReschedule,
  onCancel,
  onStartConsultation,
  onBilling,
}: AppointmentActionsDialogProps) {
  const [open, setOpen] = useState(false);
  const [isCaseHistoryOpen, setIsCaseHistoryOpen] = useState(false);
  const toast = useRef<Toast>(null);
  const { setEventAddOpen, setEditingEvent } = useEvents();

  const accessRights = useSelector(
    (state: RootState) => state.hospitalAccessRight.data
  );

  // ✅ Extract "Patient Care" module
  const patientCareModule = accessRights?.find(
    (m: any) => m.ModuleName === "Patient Care"
  );

  // ✅ Correct helper — use Submodules not SubModules
  const getPermission = (subName: string) =>
    patientCareModule?.Submodules?.find((s: any) => s.SubModuleName === subName)
      ?.Permissions?.[0];

  // ✅ Individual submodule permissions
  const vitalPerm = getPermission("vitals");
  const consultPerm = getPermission("Consultation");
  const casePerm = getPermission("Case History");

  const canViewVitals = vitalPerm?.CanView ?? false;
  const canUpdateVitals = vitalPerm?.CanUpdate ?? false;

  const canViewConsultation = consultPerm?.CanView ?? false;
  const canUpdateConsultation = consultPerm?.CanUpdate ?? false;

  const canViewCaseHistory = casePerm?.CanView ?? false;
  const canCreateCaseHistory = casePerm?.CanCreate ?? false;

  // Get Billing permission from ANY module
  const billingModule = accessRights
    ?.flatMap((mod: any) => mod.Submodules || [])
    ?.find((s: any) => s.SubModuleName === "Billing");

  const isBillingEnabled = billingModule?.enabled ?? false;

  const hoverchange =
    "justify-start gap-3 hover:bg-[linear-gradient(135deg,rgba(34,211,238,0.35)_0%,rgba(129,140,248,0.15)_100%)]";

  const isPastDate = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(dateStr);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate < today;
  };

  const showToast = (message: string, type: "error" | "warn" = "error") => {
    toast.current?.show({
      severity: type,
      summary: type === "error" ? "Error" : "Warning",
      detail: message,
      life: 4000,
    });
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
                  <h2 className="text-lg font-medium text-center mb-4 text-[#2cbbb1] font-serif">
                    Appointment Actions Panel
                  </h2>

                  <div className="flex flex-col gap-3">
                    {/* Reschedule Appointment */}
                    <Button
                      variant="ghost"
                      className={hoverchange}
                      onClick={() => {
                        if (isPastDate(patient.appointmentDate)) {
                          showToast("You can't reschedule a past appointment.");
                          return;
                        }
                        if (patient?.consultation) {
                          showToast(
                            "Consultation has started you cannot Reschedule"
                          );
                          return;
                        }
                        onReschedule(patient);
                        setOpen(false);
                      }}
                    >
                      <CalendarClock className="w-5 h-5 text-purple-500" />
                      Reschedule Appointment
                    </Button>

                    {/* Cancel Appointment */}
                    <Button
                      variant="ghost"
                      className={hoverchange}
                      onClick={() => {
                        if (isPastDate(patient.appointmentDate)) {
                          showToast("You can't cancel a past appointment.");
                          return;
                        }
                        if (patient?.consultation) {
                          showToast(
                            "Consultation has started you cannot Cancel"
                          );
                          return;
                        }
                        onCancel(patient);
                        setOpen(false);
                      }}
                    >
                      <XCircle className="w-5 h-5 text-red-500" />
                      Cancel Appointment
                    </Button>

                    {/* Vitals */}
                    <Button
                      variant="ghost"
                      disabled={!canViewVitals}
                      className={`${hoverchange} ${
                        !canViewVitals
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={() => {
                        if (!canViewVitals) {
                          showToast(
                            "You don’t have permission to view vitals."
                          );
                          return;
                        }
                        if (isPastDate(patient.appointmentDate)) {
                          showToast(
                            "You can't add vitals for a past appointment."
                          );
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

                    {/* Consultation */}
                    <Button
                      variant="ghost"
                      disabled={!canViewConsultation}
                      className={`${hoverchange} ${
                        !canViewConsultation
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={() => {
                        // 🔐 Permission check
                        if (!canViewConsultation) {
                          showToast(
                            "You don’t have permission to start consultation."
                          );
                          return;
                        }

                        // ✅ Resume if already ongoing
                        if (patient?.consultationStatus === "ONGOING") {
                          onStartConsultation({
                            ...patient,
                            initialTab: "consultation",
                          });
                          setOpen(false);
                          return;
                        }

                        // 📅 Date validation (only for NEW consultations)
                        const appointmentDate = new Date(
                          patient.appointmentDate
                        );
                        const today = new Date();

                        appointmentDate.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);

                        if (appointmentDate < today) {
                          return showToast(
                            "You can't start consultation for a past appointment."
                          );
                        }

                        if (appointmentDate > today) {
                          return showToast(
                            "You can't start consultation for a future appointment.",
                            "warn"
                          );
                        }

                        // 🚀 Start consultation (today)
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

                    {/* Case History */}
                    <Button
                      variant="ghost"
                      disabled={!canViewCaseHistory}
                      className={`${hoverchange} ${
                        !canViewCaseHistory
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={() => {
                        if (!canViewCaseHistory) {
                          showToast(
                            "You don’t have permission to view case history."
                          );
                          return;
                        }
                        setIsCaseHistoryOpen(true);
                      }}
                    >
                      <ClipboardList className="w-5 h-5 text-green-500" />
                      View Case History
                    </Button>
                    {/* Billing */}
                    <Button
                      variant="ghost"
                      disabled={!isBillingEnabled}
                      className={`${hoverchange} ${
                        !isBillingEnabled
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={() => {
                        // First check consultation status
                        // if (
                        //   patient?.consultation?.consultationStatus !==
                        //   "COMPLETED"
                        // ) {
                        //   showToast(
                        //     "Consultation is not complete. You cannot start billing."
                        //   );
                        //   return;
                        // }

                        // Then check billing permission
                        if (!isBillingEnabled) {
                          showToast(
                            "You don’t have permission to access billing."
                          );
                          return;
                        }

                        // Continue billing flow...

                        if (!onBilling) return;
                        onBilling(patient);
                        setOpen(false);
                      }}
                    >
                      <ReceiptText className="w-5 h-5 text-amber-500" />
                      Billing
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
