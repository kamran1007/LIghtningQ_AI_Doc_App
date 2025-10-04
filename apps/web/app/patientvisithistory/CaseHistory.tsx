import React, { useEffect, useRef, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import Lottie from "lottie-react";
import successAnimation from "@/assets/ECG.json";
import {
  User,
  FileText,
  ClipboardList,
  Calendar,
  Folder,
  Activity,
  Users,
  LogOut,
  Menu,
  CalendarIcon,
  ClockIcon,
  MapPinHouse,
  Copy,
  CalendarDays,
  UserCheck,
  Clock,
  ChevronLeftIcon,
  HandHeart,
  Stethoscope,
  TestTube,
  NotebookPen,
  CalendarCheck,
  Pill,
  ChevronUp,
  ChevronDown,
  FlaskConical,
  ClipboardSignature,
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

import dayjs from "dayjs";

import { differenceInMonths, differenceInYears } from "date-fns";
import { BACKEND_URL } from "@/lib/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import {
  FetchPatientAppointment,
  Patientappointmentcasesheet,
} from "@/lib/consultation";
import { format } from "date-fns";
import { Messages } from "primereact/messages";
import { Toast } from "primereact/toast";
import { cn } from "@/lib/utils";
import DemographicsCard from "./DemographicsCard";
import EncounterLogCard from "./EncounterLogCard";
import { generateConsultationPDF } from "@/utils/consultationPdf";

interface CaseHistoryProps {
  visible: boolean;
  onHide: () => void;
  patient: any;
}
type RecentVisitResponse = {
  return: Array<{
    AppointmentId: number;
    // add other fields here...
  }>;
};

// Patient related
interface Allergy {
  AllergyName: string;
}

interface MedicalHistory {
  MedicalHistoryName: string;
}

interface PatientData {
  allergies?: Allergy[];
  medicalHistory?: MedicalHistory[];
}

// Case sheet related
interface Medication {
  medicationName: string;
}

interface ChiefComplaint {
  ChiefComplainTagName: string;
}

interface ConsultationChiefComplaint {
  chiefComplaint: ChiefComplaint;
}

interface Vitals {
  HeartRate?: number;
  Temperature?: number;
  Systolic?: number;
  Diastolic?: number;
  Weight?: number;
  Height?: number;
  OxygenSaturation?: number;
  BloodGroup?: string;
  BMI?: number;
}

interface Appointment {
  Vitals: Vitals[];
}

interface AppointmentCaseSheet {
  ConsultationMedication?: Medication[];
  ConsultationCheifComplaint?: ConsultationChiefComplaint[];
  appointment?: Appointment;
  IsconsultationCompleted?: boolean;
  updatedAt?: string;
}

export default function PatientCaseHistory({
  visible,
  onHide,
  patient,
}: CaseHistoryProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // starts collapsed
  const [recentVisit, SetRecentVisit] = useState<RecentVisitResponse | null>(
    null
  );
  const [lastFetchedPatientId, setLastFetchedPatientId] = useState<
    number | null
  >(null);
  const [consultationloadingId, setConsultationLoading] = useState<
    number | null
  >(null);
  const [appointmentcasesheet, setAppointmentcasesheet] =
    useState<AppointmentCaseSheet | null>(null);
  const [selectedSection, setSelectedSection] = useState("Overview");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(
    recentVisit?.return?.[0]?.AppointmentId ?? null
  );
  const [recentVisitLoading, setRecentVisitLoading] = useState(false);

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

  const sidebarMenu = [
    { label: "Overview", icon: <User size={16} /> },
    // { label: "Claims", icon: <FileText size={16} /> },
    // { label: "Clinical", icon: <ClipboardList size={16} /> },
    { label: "Care Plan", icon: <HandHeart size={16} /> },
    { label: "Documents", icon: <Folder size={16} /> },
    // { label: "Reports", icon: <Activity size={16} /> },
    { label: "Demographics", icon: <Users size={16} /> },
    { label: "Encounter Log", icon: <ClipboardList size={16} /> },
  ];
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  };

  const getColorByInitials = (initials: string) => {
    const code = initials.charCodeAt(0);
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-pink-100 text-pink-600",
      "bg-green-100 text-green-600",
      "bg-yellow-100 text-yellow-600",
      "bg-purple-100 text-purple-600",
      "bg-orange-100 text-orange-600",
      "bg-red-100 text-red-600",
      "bg-teal-100 text-teal-600",
      "bg-indigo-100 text-indigo-600",
    ];
    return colors[code % colors.length];
  };
  const imageUrl = patient?.patient?.profileImageUrl
    ? `${BACKEND_URL}${patient?.patient?.profileImageUrl}`
    : null;
  const initials = getInitials(
    patient?.patient?.firstName,
    patient?.patient?.lastName
  );
  const colorClass = getColorByInitials(initials);

  const getAge = (dob: string) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const now = new Date();
    const years = differenceInYears(now, birthDate);
    const months = differenceInMonths(now, birthDate) % 12;
    return `${years} year${years !== 1 ? "s" : ""} ${months} month${
      months !== 1 ? "s" : ""
    }`;
  };
  const PatientId = patient?.patient?.PatientId || 0;
  const AppointmentId = patient?.AppointmentId || 0;
  useEffect(() => {
    const fetchVitals = async () => {
      try {
        setRecentVisitLoading(true);
        const data = await FetchPatientAppointment(PatientId);
        SetRecentVisit(data || []);
        setLastFetchedPatientId(PatientId);

        const consultationData =
          await Patientappointmentcasesheet(AppointmentId);
        setAppointmentcasesheet(consultationData?.data || []);
        console.log("Fetched Consultation Data:", consultationData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setRecentVisitLoading(false); // always stop animation
      }
    };

    if (visible && PatientId && PatientId !== lastFetchedPatientId) {
      fetchVitals();
    }
  }, [visible, PatientId]);

  useEffect(() => {
    if (recentVisit?.return?.length && !selectedAppointmentId) {
      setSelectedAppointmentId(recentVisit.return[0]?.AppointmentId ?? null);
    }
  }, [recentVisit, selectedAppointmentId]);

  const toast = useRef<Toast>(null);

  const handleCopy = () => {
    const mrn = patient?.patient?.Patient_Medical_Record_No;
    navigator.clipboard.writeText(mrn || "");
    toast.current?.show({
      severity: "info",
      summary: "Copied",
      detail: "MRN copied successfully!",
      life: 2000,
    });
  };

  const handleCardClick = async (appointmentId: number) => {
    try {
      setConsultationLoading(appointmentId);
      setSelectedAppointmentId(appointmentId);
      const consultationData = await Patientappointmentcasesheet(appointmentId);
      console.log("Fetched Consultation Data:", consultationData);
      setAppointmentcasesheet(consultationData?.data || []);

      // TODO: show consultationData in a modal, drawer, etc.
    } catch (error) {
      console.error("Error fetching consultation:", error);
    } finally {
      setConsultationLoading(null);
    }
  };
  // console.log("PATIENT INFO", patient);
  const createConsultationSections = (consultationData: any) => {
    return [
      {
        key: "chiefComplaint",
        title: "Chief Complaint",
        icon: ClipboardList,
        tag: `${consultationData?.ConsultationCheifComplaint?.length ?? 0} complaints`,
        remark: consultationData?.CheifcomplaintNotes,
        content: consultationData?.ConsultationCheifComplaint?.map((cc: any) => (
          <div
            key={cc.ConsultationComplaintId}
            className="px-2 py-1 bg-teal-50 dark:bg-slate-700 rounded-md mb-1"
          >
            <span className="text-sm font-medium text-teal-800 dark:text-teal-300">
              • {cc.chiefComplaint?.ChiefComplainTagName || "Unnamed"}
            </span>
          </div>
        )),
      },
      {
        key: "clinicalNote",
        title: "Clinical Note",
        icon: FileText,
        tag: consultationData?.ConsultationclinicalNotes?.length
          ? "Available"
          : "N/A",
        remark: null,
        content: consultationData?.ConsultationclinicalNotes?.map(
          (note: any) => <p key={note.ClinicalNoteId}>{note.content}</p>
        ),
      },
      {
        key: "investigation",
        title: "Investigations",
        icon: FlaskConical,
        tag: `${consultationData?.ConsultationInvestigation?.length ?? 0} entries`,
        remark: null,
        content: consultationData?.ConsultationInvestigation?.map((inv: any) => (
          <div
            key={inv.ConsultationInvestigationId}
            className="mb-2 space-y-1 p-2 rounded-md bg-slate-100 dark:bg-slate-700"
          >
            <p className="text-sm font-medium">
              {inv.InvestigationSubType?.InvestigationSubTypename}
              <span className="text-xs text-gray-400 ml-2">
                ({inv.InvestigationType?.InvestigationTypeName})
              </span>
            </p>
            <p className="text-xs italic text-gray-500 dark:text-gray-300">
              {inv.ConsultationInvestigatRemark}
            </p>
          </div>
        )),
      },
      {
        key: "diagnosis",
        title: "Diagnosis",
        icon: Stethoscope,
        tag: `${consultationData?.ConsultationDiagnosis?.length ?? 0} entries`,
        remark: null,
        content: consultationData?.ConsultationDiagnosis?.map((dx: any) => (
          <div
            key={dx.ConsultationDiagnosisId}
            className="mb-2 p-2 bg-emerald-50 dark:bg-slate-700 rounded-md"
          >
            <p className="font-medium">
              {dx.diagnosis?.DiagnosisName}
              <span className="ml-2 text-xs text-gray-500">
                ({dx.diagnosis?.icdCode})
              </span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {dx.DiagnosisRemark}
            </p>
          </div>
        )),
      },
      {
        key: "treatment",
        title: "Treatment & Instructions",
        icon: ClipboardSignature,
        tag: "Typed",
        remark: null,
        content: consultationData?.ConsultationTreatment?.map((tx: any) => (
          <pre
            key={tx.ConsultationTreatmentId}
            className="whitespace-pre-wrap bg-gray-100 dark:bg-slate-800 p-3 rounded-md text-sm"
          >
            {tx.treatmentText}
          </pre>
        )),
      },
      {
        key: "medication",
        title: "Medications",
        icon: Pill,
        tag: `${consultationData?.ConsultationMedication?.length ?? 0} prescribed`,
        remark: null,
        content: consultationData?.ConsultationMedication?.map((med: any) => (
          <div
            key={med.ConsultationMedicationId}
            className="mb-2 p-2 bg-indigo-50 dark:bg-slate-700 rounded-md"
          >
            <p className="font-medium text-indigo-800 dark:text-indigo-300">
              {med.medicationName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {med.dosage} tab(s), {med.frequency} for {med.duration} day(s)
            </p>
            {med.remarks && (
              <p className="text-xs italic text-gray-600 dark:text-gray-300">
                {med.remarks}
              </p>
            )}
          </div>
        )),
      },
      {
        key: "followup",
        title: "Follow-Up Plan",
        icon: CalendarCheck,
        tag: "Next Visit",
        remark:
          consultationData?.ConsultationFollowUpPlan?.[0]?.followUpText || "",
        content: (
          <div className="text-sm font-medium">
            Next Visit:{" "}
            <span className="text-blue-700 dark:text-blue-300">
              {dayjs(
                consultationData?.ConsultationFollowUpPlan?.[0]?.nextDate
              ).format("DD MMM, YYYY")}
            </span>{" "}
            ({consultationData?.ConsultationFollowUpPlan?.[0]?.duration}{" "}
            {consultationData?.ConsultationFollowUpPlan?.[0]?.unit})
          </div>
        ),
      },
    ];
  };
  const sections = createConsultationSections(appointmentcasesheet);

  return (
    <Sidebar
      visible={visible}
      onHide={onHide}
      showCloseIcon={false}
      fullScreen
      className="p-0 bg-white dark:bg-slate-900 no-scrollbar"
    >
      {/* Header */}
      <>
        <Toast ref={toast} position="bottom-right" />

        {recentVisitLoading && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white/40 backdrop-blur-3xl h">
            <Lottie
              animationData={successAnimation}
              loop
              autoplay
              className="w-48 h-48"
              renderer="svg" // use SVG renderer for better performance
            />
          </div>
        )}

        <div className="w-full border-b-amber-300 shadow py-1 px-4 flex items-center justify-between bg-white dark:bg-slate-900 dark:border-slate-700 sticky-header bg-gradient-to-b from-[#dbfffd] to-[#eff8f8]">
          <div className="flex items-center gap-2">
            <Avatar className="h-12 w-12 rounded-full">
              {imageUrl ? (
                <AvatarImage
                  src={imageUrl}
                  alt={patient?.patient?.firstName}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div
                  className={`h-12 w-12 flex items-center justify-center rounded-full text-sm font-medium ${colorClass}`}
                >
                  {initials}
                </div>
              )}
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">
                {patient?.patient?.firstName} {patient?.patient?.lastName}
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {"  "}
                {getAge(patient?.patient?.dateOfBirth)} •{" "}
                {patient?.patient?.gender} •{" "}
                <i className="pi pi-phone text-gray-400 ml-1 h-3" />{" "}
                {patient?.patient?.mobile || "N/A"} •{" "}
                <span className="flex items-center gap-1 inline-flex">
                  MRN:{" "}
                  <span className="font-medium">
                    {patient?.patient?.Patient_Medical_Record_No}
                  </span>
                  <Copy
                    className="w-3.5 h-5 cursor-pointer text-slate-500 hover:text-black dark:hover:text-white"
                    onClick={handleCopy}
                  />
                </span>
              </div>
              <div className="flex items-start gap-2 mt-1">
                <MapPinHouse className="h-4 w-4 mt-0.5 text-violet-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {patient?.patient?.addressLine1}, {patient?.patient?.city},{" "}
                  {patient?.patient?.state}, India
                </p>
              </div>
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={onHide}>
            <LogOut size={18} />
          </Button>
        </div>

        {/* Layout */}
        <div className="flex h-[calc(100%-80px)] ">
          {/* Sidebar Menu */}
          <div
            className={`transition-all duration-300  ${
              sidebarCollapsed ? "w-[60px]" : "w-[200px]"
            } border-r border-gray-200 dark:border-slate-700 p-3 bg-gradient-to-b from-teal-50 to-teal-100 dark:from-slate-800 dark:to-slate-900 shadow-md `}
          >
            {/* Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="mb-6 text-teal-600 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-slate-700"
            >
              <Menu
                size={18}
                className={`transition-transform duration-300 ${
                  sidebarCollapsed ? "rotate-180" : ""
                }`}
              />
            </Button>

            {/* Sidebar Items */}
            <TooltipProvider>
              <div className="flex flex-col gap-3">
                {sidebarMenu.map((item, idx) => {
                  const isSelected = selectedSection === item.label;

                  return (
                    <div key={idx} className="relative group">
                      <button
                        onClick={() => setSelectedSection(item.label)}
                        className={cn(
                          "flex items-center w-full px-3 py-3 rounded-lg transition-colors shadow hover:shadow-2xl",
                          sidebarCollapsed ? "justify-center" : "space-x-2",
                          isSelected
                            ? "bg-teal-100 text-teal-800 dark:bg-slate-700"
                            : "hover:bg-teal-50 dark:hover:bg-slate-700"
                        )}
                      >
                        <span className="text-lg">{item.icon}</span>
                        {!sidebarCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </button>

                      {sidebarCollapsed && (
                        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 px-3 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap transition-all duration-300 ease-in-out">
                          {item.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-4 transition-all duration-300">
            {selectedSection === "Overview" && (
              <ScrollArea className="h-full space-y-4 pr-1">
                {/* Medical Summary */}
                <Card className="p-6 border rounded-2xl shadow-lg bg-white/70 dark:bg-slate-800/60 backdrop-blur-md">
                  <div className="flex items-center mb-4">
                    <ClipboardList
                      className="text-teal-600 dark:text-teal-400 mr-2"
                      size={20}
                    />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Medical Summary
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-200">
                    <div>
                      <p className="font-medium mb-1">Allergies:</p>
                      {patient?.patient?.allergies?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {patient.patient.allergies.map(
                            (a: Allergy, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 dark:bg-red-700/30 dark:text-red-300"
                              >
                                {a.AllergyName}
                              </span>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="italic text-gray-400">None</p>
                      )}
                    </div>

                    <div>
                      <p className="font-medium mb-1">Medical History:</p>
                      {patient?.patient?.medicalHistory?.length ? (
                        <ul className="list-disc list-inside">
                          {patient.patient.medicalHistory.map(
                            (c: MedicalHistory, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 dark:bg-green-700/30 dark:text-green-300"
                              >
                                {c.MedicalHistoryName}
                              </span>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="italic text-gray-400">None</p>
                      )}
                    </div>

                    <div>
                      <p className="font-medium mb-1">Medications:</p>
                      {appointmentcasesheet?.ConsultationMedication?.length ? (
                        <ul className="list-disc list-inside">
                          {appointmentcasesheet.ConsultationMedication.map(
                            (m: Medication, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-700/30 dark:text-blue-300"
                              >
                                {m.medicationName}
                              </span>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="italic text-gray-400">None</p>
                      )}
                    </div>

                    <div>
                      <p className="font-medium mb-1">Medical Conditions :</p>
                      {appointmentcasesheet?.ConsultationCheifComplaint
                        ?.length ? (
                        <ul className="list-disc list-inside">
                          {appointmentcasesheet.ConsultationCheifComplaint.map(
                            (p: ConsultationChiefComplaint, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600 dark:bg-yellow-700/30 dark:text-yellow-300"
                              >
                                {p.chiefComplaint.ChiefComplainTagName}
                              </span>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="italic text-gray-400">None</p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Vitals */}
                <Card className="p-6 border rounded-2xl shadow-lg bg-white/70 dark:bg-slate-800/60 backdrop-blur-md">
                  <div className="flex items-center mb-4">
                    <Activity
                      className="text-teal-600 dark:text-teal-400 mr-2"
                      size={20}
                    />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Vitals Overview
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-800 dark:text-gray-200">
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-slate-700">
                      <p className="font-semibold">Heart Rate</p>
                      <p className="text-lg">
                        {appointmentcasesheet?.appointment?.Vitals[0]
                          ?.HeartRate || "--"}{" "}
                        <span className="text-xs">bpm</span>
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-yellow-50 dark:bg-slate-700">
                      <p className="font-semibold">Temperature</p>
                      <p className="text-lg">
                        {appointmentcasesheet?.appointment?.Vitals[0]
                          ?.Temperature || "--"}{" "}
                        <span className="text-xs">°F</span>
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-slate-700">
                      <p className="font-semibold">Blood Pressure</p>
                      <p className="text-lg">
                        {appointmentcasesheet?.appointment?.Vitals[0]
                          ?.Systolic &&
                        appointmentcasesheet?.appointment?.Vitals[0]?.Diastolic
                          ? `${appointmentcasesheet?.appointment?.Vitals[0]?.Systolic}/${appointmentcasesheet?.appointment?.Vitals[0]?.Diastolic} mmHg`
                          : "--"}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-50 dark:bg-slate-700">
                      <p className="font-semibold">Weight</p>
                      <p className="text-lg">
                        {appointmentcasesheet?.appointment?.Vitals[0]?.Weight ||
                          "--"}{" "}
                        <span className="text-xs">Kg</span>
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-50 dark:bg-slate-700">
                      <p className="font-semibold">Height</p>
                      <p className="text-lg">
                        {appointmentcasesheet?.appointment?.Vitals[0]?.Height ||
                          "--"}{" "}
                        <span className="text-xs">Cm</span>
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-sky-50 dark:bg-slate-700">
                      <p className="font-semibold">SpO₂</p>
                      <p className="text-lg">
                        {appointmentcasesheet?.appointment?.Vitals[0]
                          ?.OxygenSaturation || "--"}{" "}
                        <span className="text-xs">%</span>
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-violet-50 dark:bg-slate-700">
                      <p className="font-semibold">Blood Group</p>
                      <p className="text-lg">
                        {bloodGroupMap[
                          appointmentcasesheet?.appointment?.Vitals[0]
                            ?.BloodGroup ?? ""
                        ] || "--"}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-slate-700">
                      <p className="font-semibold">BMI</p>
                      <p className="text-lg">
                        {appointmentcasesheet?.appointment?.Vitals[0]?.BMI ||
                          "--"}{" "}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 border rounded-2xl shadow-lg bg-white/70 dark:bg-slate-800/60 backdrop-blur-md">
                  <div className="flex items-center mb-4">
                    <FileText
                      className="text-teal-600 dark:text-teal-400 mr-2"
                      size={20}
                    />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Overview Summary
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 dark:text-gray-200">
                    {/* Upcoming Appointment */}
                    <div className="flex items-center space-x-2">
                      <CalendarDays className="text-green-500" size={18} />
                      <p className="font-medium">Upcoming Appointment:</p>
                      <span className="text-base text-gray-500">--</span>
                    </div>

                    {/* Consultation Status */}
                    <div className="flex items-center space-x-2">
                      <FileText className="text-indigo-500" size={18} />
                      <p className="font-medium">Consultation Status:</p>
                      <span className="text-base capitalize">
                        {appointmentcasesheet?.IsconsultationCompleted !==
                        undefined
                          ? appointmentcasesheet.IsconsultationCompleted
                            ? "Completed"
                            : "Incomplete"
                          : "--"}
                      </span>
                    </div>

                    {/* Last Updated By */}
                    <div className="flex items-center space-x-2">
                      <UserCheck className="text-rose-500" size={18} />
                      <p className="font-medium">Last Updated By:</p>
                      <span className="text-base">--</span>
                    </div>

                    {/* Last Updated At */}
                    <div className="flex items-center space-x-2">
                      <Clock className="text-yellow-500" size={18} />
                      <p className="font-medium">Last Updated At:</p>
                      <span className="text-base">
                        {(appointmentcasesheet?.updatedAt &&
                          format(
                            new Date(appointmentcasesheet.updatedAt),
                            "dd MMMM yyyy, hh:mm a"
                          )) ||
                          "--"}
                      </span>
                    </div>
                  </div>
                </Card>
              </ScrollArea>
            )}
            {selectedSection === "Care Plan" && (
              <ScrollArea className="h-full space-y-4 pr-1">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 px-1">
                  Consultation Summary
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {sections.map(
                    ({ title, icon: Icon, key, content, tag, remark }) => (
                      <Card
                        key={key}
                        className="p-5 rounded-2xl shadow-xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-gray-200 dark:border-slate-700 space-y-3 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Icon className="text-teal-600 dark:text-teal-400 w-5 h-5" />
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                              {title}
                            </h3>
                          </div>

                          {tag && (
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-700 dark:text-white shadow-sm">
                              {tag}
                            </span>
                          )}
                        </div>

                        {remark && (
                          <div className="text-sm italic text-gray-500 dark:text-gray-400 px-1">
                            {remark}
                          </div>
                        )}

                        <div className="text-sm text-gray-700 dark:text-gray-200 border-t border-dashed border-gray-300 dark:border-slate-600 pt-3">
                          {content}
                        </div>
                      </Card>
                    )
                  )}
                </div>
              </ScrollArea>
            )}

            {selectedSection === "Documents" && (
              <ScrollArea className="h-full space-y-4 pr-1">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 px-1">
                  Document And prints
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <button
                    onClick={() =>
                      generateConsultationPDF(appointmentcasesheet, patient)
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Download Consultation PDF
                  </button>
                </div>
              </ScrollArea>
            )}
            {selectedSection === "Demographics" && (
              <DemographicsCard patient={patient?.patient} />
            )}

            {selectedSection === "Encounter Log" && (
              <EncounterLogCard appointmentcasesheet={appointmentcasesheet} />
            )}
          </div>

          {/* Right Section */}
          <div className="w-[300px] overflow-y-auto  px-1  dark:border-slate-700 py-4 transition-all duration-300 recent-visit-wrapper bg-gradient-to-b">
            <ScrollArea className="h-full pr-1">
              <div className="flex justify-between items-center px-2 mb-3">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 font-sans">
                  Recent Visits
                </h4>
                <button className="text-xs text-purple-600 hover:underline">
                  + New Visit
                </button>
              </div>

              <Card className="w-full p-0.5 shadow-none border-b-teal-200 bg-transparent">
                <div className="space-y-3 relative">
                  {(recentVisit?.return || []).map(
                    (visit: any, idx: number) => {
                      const isSelected =
                        visit?.AppointmentId === selectedAppointmentId;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleCardClick(visit?.AppointmentId)}
                          className={`relative cursor-pointer p-3 border rounded-xl bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition ${
                            isSelected ? "ring-2 ring-fuchsia-300" : ""
                          }`}
                        >
                          {/* Arrow Indicator */}
                          {isSelected && (
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2">
                              <div className="w-4 h-4 bg-fuchsia-500 text-white flex items-center justify-center rounded-full shadow">
                                <ChevronLeftIcon className="w-3 h-3" />
                              </div>
                            </div>
                          )}

                          {/* Doctor Info */}
                          <div className="flex justify-between items-center mb-1">
                            <div>
                              <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                                Dr. {visit?.doctor?.firstName}{" "}
                                {visit?.doctor?.lastName}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {
                                  visit?.doctor?.Specialization
                                    ?.SpecializationName
                                }
                              </p>
                            </div>
                            {visit.visitType && (
                              <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300 rounded-full whitespace-nowrap">
                                {visit.visitType?.AppointmentTypeName}
                              </span>
                            )}
                          </div>

                          {/* Date & Time */}
                          <div className="flex justify-between items-center text-[12px] text-gray-600 dark:text-gray-400 mt-1 w-full">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-3.5 h-3.5 text-fuchsia-300" />
                              <span>
                                {visit?.appointmentDate &&
                                  format(
                                    new Date(visit.appointmentDate),
                                    "dd MMMM yyyy"
                                  )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-3.5 h-3.5 text-sky-300" />
                              <span>
                                {visit?.appointmentDate &&
                                  format(
                                    new Date(visit.appointmentDate),
                                    "hh:mm a"
                                  )}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </Card>
            </ScrollArea>
          </div>
        </div>
      </>
    </Sidebar>
  );
}
