"use client";
import React, { CSSProperties, useMemo, useRef } from "react";
import chroma from "chroma-js";
import { StylesConfig } from "react-select";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Controller, useFormContext } from "react-hook-form";

import { SpeedDial } from "primereact/speeddial";
import { useRouter } from "next/navigation"; // ✅ correct for app/
import { Toast } from "primereact/toast";
// import { Tooltip } from "primereact/tooltip";

import {
  Stethoscope,
  AlertTriangle,
  Thermometer,
  Droplet,
  HeartPulse,
  Ruler,
  Weight,
  Activity,
  AtSign,
  PhoneCall,
  ClipboardPlus,
  Languages,
  MilkOff,
  BriefcaseMedical,
  CalendarDays,
  UserRound,
  NotebookPen,
  History,
  Droplets,
  Scale,
  Loader2Icon,
  Plus,
  ClipboardList,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConsultationFormValues } from "@/types/consultation"; // or wherever you defined it

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabPanel, TabView } from "primereact/tabview";
import { Maximize2, X } from "lucide-react";
import { useState } from "react";
import { BACKEND_URL } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";

import { Label, Separator } from "@radix-ui/react-dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VitalCardInput } from "./VitalCardInput";
interface ConsultationDrawerProps {
  open: boolean;
  onClose: () => void;
  patient: any;
  initialTab?: string;
}
import { Medication } from "@/types/consultation";

// import { MultiSelect } from "@/components/multi-select";

import { useForm } from "react-hook-form";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useEffect } from "react";
import TreatmentInstructionsCard from "./TreatmentInstructions";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import {
  addupdateConsultation,
  AddUpdateVitals,
  GetPatientMedications,
  getVitalsWithHistory,
} from "@/lib/consultation";
import { is, tr } from "date-fns/locale";
import VitalsSkeleton from "@/components/ui/skeletonloader/VitalsSkeleton";
import setVitalsHistoryOpen from "./VitalsHistoryDialog";
import VitalsHistoryDialog from "./VitalsHistoryDialog";
import { ChiefComplaintCard } from "./ChiefComplaintCard";
import InvestigationCard from "./InvestigationCard";
import DiagnosisInputCard from "./DiagnosisInputCard";
import ClinicalNotesCard from "./ClinicalNotesCard";
import MedicationCard from "./MedicationCard";
import FollowUpPlanCard from "./FollowUpPlanCard";
import { useAppDispatch } from "@/store/hooks";
import { fetchAllAppointmentPatient } from "@/store/AppointmentSlice";
import { title } from "process";
import ProcedureInputCard from "./procedureCard";
import Lottie from "lottie-react";
import successAnimation from "@/assets/Success.json";
import { useSelector } from "react-redux";
import PatientCaseHistory from "app/patientvisithistory/CaseHistory";
import { Procedure } from "@/types/consultation";

export default function ConsultationDrawer({
  open,
  onClose,
  patient,
  initialTab,
}: ConsultationDrawerProps) {
  const [fullScreen, setFullScreen] = useState(false);
  const toast = useRef<Toast>(null);
  const router = useRouter();
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
  // const isSelected = selectedDoctorId === doc.DoctorId;
  function calculateAge(dateOfBirth: string | undefined): string {
    if (!dateOfBirth) return "N/A";

    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) return "Invalid Date";

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return `${age} Years`;
  }

  function formatDateTime(dateInput: string | Date | null | undefined): string {
    if (!dateInput) return "N/A";

    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "Invalid date";
    }

    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

  const [form, setForm] = useState<ConsultationFormValues>({
    followUpDuration: "",
    followUpUnit: "",
    clinicalnotesText: "",
    systolic: "",
    diastolic: "",
    weight: "",
    temperature: "",
    heartRate: "",
    oxygen: "",
    height: "",
    bloodgroup: "",
    BMI: "",
    BMIStatus: "",
    complaint: "",
    notes: "",
    investigations: [],
    investigationRemarks: {},
    diagnosis: "",
    treatment: "",
    followUp: "",
    complaints: [],
    medications: [
      {
        medicationName: "",
        dosage: "",
        frequency: "",
        duration: "",
        unit: "", // ✅ still fine — empty string satisfies string | undefined
        remarks: "",
      },
    ],
  });
  ({
    // followUp: "",
    followUpDuration: "",
    followUpUnit: "",
    clinicalnotesText: "",
    // bloodPressure: "",
    systolic: "",
    diastolic: "",
    weight: "",
    temperature: "",
    heartRate: "",
    oxygen: "",
    height: "",
    bloodgroup: "",
    BMI: "",
    BMIStatus: "",
    complaint: "",
    notes: "",
    investigations: [],
    investigationRemarks: {},
    diagnosis: "",
    treatment: "",
    followUp: "",
    complaints: [], // Changed to array to match usage

    medications: [
      {
        medicationName: "", // ✅ Changed from 'drug'
        dosage: "",
        frequency: "",
        duration: "",
        unit: "", // ✅ Added
        remarks: "",
      },
    ],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMedicationChange = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    setForm((prev) => {
      const current = prev.medications[index];
      if (!current) return prev;

      const updated = [...prev.medications];
      updated[index] = {
        medicationName: current.medicationName,
        dosage: current.dosage,
        frequency: current.frequency,
        duration: current.duration,
        unit: current.unit,
        remarks: current.remarks,
        [field]: value,
      };

      return { ...prev, medications: updated };
    });
  };

  const handleAddMedication = () => {
    setForm((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          medicationName: "",
          dosage: "",
          frequency: "",
          duration: "",
          unit: "",
          remarks: "",
        },
      ],
    }));
  };
  const [selectedTab, setSelectedTab] = useState(initialTab ?? "vitals");

  useEffect(() => {
    if (initialTab) {
      setSelectedTab(initialTab);
    }
  }, [initialTab]);
  // Chief Complaints
  type ChiefComplaint = {
    ChiefComplaintTagId: number;
    label: string;
    value: string;
  };

  // Investigations
  type Investigation = {
    InvestigationTypeId: number;
    InvestigationSubTypeId: number;
    value: string; // for select mapping
  };

  // Diagnosis
  type Diagnosis = {
    DiagnosisId: number;
    label: string;
  };

  interface MedicationHistory {
    consultationId: number;
    date: string;
    medications: Medication[];
  }

  interface PatientMedicineHistory {
    history: MedicationHistory[];
  }

  const [patientMedicineHistory, setPatientMedicineHistory] =
    useState<PatientMedicineHistory | null>(null);

  const [customCategory, setCustomCategory] = useState("Others"); // default
  const [chiefComplaints, setChiefComplaints] = useState<string[]>([]); // for tags
  const [complaintText, setComplaintText] = useState<string>(""); // for speech
  const [clinicalnotesText, setClinicalnotesText] = useState<string>(
    form.clinicalnotesText || ""
  );
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [listenings, setListenings] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [vitalsLoading, setVitalsLoading] = useState(false);
  const [vitalsHistory, setVitalsHistory] = useState<any[]>([]);

  const [patientMedicineLoading, setPatientMedicineLoading] = useState(false);

  const [vitalsHistoryOpen, setVitalsHistoryOpen] = useState(false);
  const [vitalsData, setVitalsData] = useState<any[]>([]);
  const [selectedChiefComplaints, setSelectedChiefComplaints] = useState<
    ChiefComplaint[]
  >([]);
  const [investigationCategories, setInvestigationCategories] = useState([]);
  const [InvestigationSubTypename, setCustomInvestigation] =
    useState<string>("");

  const [listeningClinicalNote, setListeningClinicalNote] = useState(false);
  const [listeningInvestigation, setListeningInvestigation] = useState(false);
  const [listeningDiagnosis, setListeningDiagnosis] = useState<string | null>(
    null
  ); // for per-diagnosis key
  const [listeningTreatment, setListeningTreatment] = useState(false);
  const [listeningChiefComplaint, setListeningChiefComplaint] = useState(false);
  const [selectedInvestigationKey, setSelectedInvestigationKey] = useState<
    string | null
  >(null);
  // const [remarkMap, setRemarkMap] = useState<Record<string, string>>({});
  const [remarkMap, setRemarkMap] = useState<{ [key: string]: string }>({});

  const [procedureremarkMap, setProcedureremarkMap] = useState<{
    [key: string]: string;
  }>({});
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const [consultationComleted, SetConsultationComlete] = useState(false);
  const selectedHospital = useSelector(
    (state: any) => state.hospitalSelection?.selectedHospital
  );
  const [isDisabled, setIsDisabled] = useState(true);
  const [isCaseHistoryOpen, setIsCaseHistoryOpen] = useState(false);

  // console.log("Selected Chief Complaints:", selectedChiefComplaints);
  const dispatch = useAppDispatch();

  const customStyles: StylesConfig<any, true> = {
    option: (styles, { data, isFocused, isSelected }) => {
      const color = chroma(data.color || "#f0f0f0");
      return {
        ...styles,
        backgroundColor: isSelected
          ? data.color
          : isFocused
            ? color.alpha(0.3).css()
            : undefined,
        color: isSelected ? "black" : "black",
      };
    },
    multiValue: (styles, { data }) => {
      const color = chroma(data.color || "#f0f0f0");
      return {
        ...styles,
        backgroundColor: color.alpha(0.3).css(),
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: "black",
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: "black",
      ":hover": {
        backgroundColor: data.color,
        color: "white",
      },
    }),
  };

  const [inputValue, setInputValue] = useState("");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // On stop listening, update input
  useEffect(() => {
    if (!listeningChiefComplaint && transcript) {
      setComplaintText((prev) =>
        prev ? `${prev}, ${transcript}` : transcript
      );
      resetTranscript();
    }
  }, [listeningChiefComplaint]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  useEffect(() => {
    if (!listeningClinicalNote && transcript) {
      setClinicalnotesText((prev) =>
        prev ? `${prev}, ${transcript}` : transcript
      );
      resetTranscript();
    }
  }, [listeningClinicalNote]);

  useEffect(() => {
    if (!listeningTreatment && transcript) {
      setForm((prev: any) => ({
        ...prev,
        treatment: prev.treatment
          ? prev.treatment + " " + transcript
          : transcript,
      }));
      resetTranscript();
    }
  }, [listeningTreatment]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  useEffect(() => {
    if (!listening && listeningInvestigation && transcript) {
      if (selectedInvestigationKey) {
        setForm((prev) => ({
          ...prev,
          investigationRemarks: {
            ...prev.investigationRemarks,
            [selectedInvestigationKey]:
              (prev.investigationRemarks?.[selectedInvestigationKey] ?? "") +
              " " +
              transcript,
          },
        }));
      }
      resetTranscript();
      setListeningInvestigation(false);
    }
  }, [listening, transcript, listeningInvestigation]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  // Optional: voice recognition

  const stopAllListening = () => {
    SpeechRecognition.stopListening();
    setListeningClinicalNote(false);
    setListeningInvestigation(false);
    setListeningDiagnosis(null);
    setListeningTreatment(false);
    setListeningChiefComplaint(false);
  };
  const handleChiefComplaintMicClick = () => {
    if (listeningChiefComplaint) {
      SpeechRecognition.stopListening();
      setListeningChiefComplaint(false);
    } else {
      stopAllListening();
      setListeningChiefComplaint(true);
      SpeechRecognition.startListening({
        continuous: false,
        language: "en-IN",
      });
    }
  };
  const handleClinicalNoteMicClick = () => {
    if (listeningClinicalNote) {
      SpeechRecognition.stopListening();
      setListeningClinicalNote(false);
    } else {
      stopAllListening();
      setListeningClinicalNote(true);
      SpeechRecognition.startListening({
        continuous: false,
        language: "en-IN",
      });
    }
  };

  // const handleInvestigationMicClick = (key: string) => {
  //   if (!browserSupportsSpeechRecognition) {
  //     alert("Your browser does not support speech recognition.");
  //     return;
  //   }

  //   if (listeningInvestigation) {
  //     SpeechRecognition.stopListening();
  //     setListeningInvestigation(false);
  //     setSelectedInvestigationKey(null);
  //   } else {
  //     stopAllListening();
  //     resetTranscript();
  //     setSelectedInvestigationKey(key); // capture which field to update
  //     setListeningInvestigation(true);
  //     SpeechRecognition.startListening({
  //       continuous: false,
  //       language: "en-IN",
  //     });
  //   }
  // };

  const handleTreatmentMicClick = () => {
    if (listeningTreatment) {
      SpeechRecognition.stopListening();
      setListeningTreatment(false);
    } else {
      stopAllListening();
      setListeningTreatment(true);
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: false,
        language: "en-IN",
      });
    }
  };

  const customsStyles: StylesConfig<any, true> = {
    control: (base) => ({
      ...base,
      minHeight: 44,
      fontSize: 14,
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "4px 6px",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#E0F2FE",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#0369A1",
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: 14,
    }),
  };

  const handleRemoveMedication = (index: number) => {
    setForm((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const handleFollowUpShortcut = (code: string) => {
    const match = code.match(/^(\d+)([DWMY])$/);
    if (!match) return;

    const value = match[1] ?? ""; // always string
    const unit = match[2] as "D" | "W" | "M" | "Y"; // narrow to valid keys

    const mappedUnit: string =
      {
        D: "Days",
        W: "Weeks",
        M: "Months",
        Y: "Years",
      }[unit] ?? "";

    setForm((prev) => ({
      ...prev,
      followUpDuration: value,
      followUpUnit: mappedUnit,
    }));
  };

  const tabVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };
  useEffect(() => {
    // by default lock if completed
    if (patient?.IsConsultationCompleted === true) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [patient?.IsConsultationCompleted]);
  const userHasEditAccess = true; // or false

  const items = [
    {
      label: "Edit",
      icon: "pi pi-file-edit",
      title: "Edit Consultation",
      command: () => {
        // ✅ Only allow edit if user has access
        if (userHasEditAccess) {
          setIsDisabled(false); // enable fields
          toast.current?.show({
            severity: "success",
            summary: "Edit Mode",
            detail: "You can now edit the consultation",
          });
        } else {
          toast.current?.show({
            severity: "warn",
            summary: "Access Denied",
            detail: "You do not have rights to edit this consultation",
          });
        }
      },
    },
    {
      label: "Complete Consultation",
      icon: "pi pi-file-check",
      title: "Complete Consultation",
      template: (item: any, options: any) => (
        <div {...options} title="Complete Consultation">
          <i className={item.icon} />
          {/* <span>{item.label}</span> */}
        </div>
      ),
      command: () => {
        handleSaveConsultation("Complete");
      },
    },
    {
      label: "Save",
      icon: "pi pi-save",
      template: (item: any, options: any) => (
        <div {...options} title="Save Consultation">
          <i className={item.icon} />
          {/* <span>{item.label}</span> */}
        </div>
      ),
      command: () => {
        handleSaveConsultation("save");
      },
    },
    // {
    //   label: "Upload",
    //   icon: "pi pi-upload",
    //   command: () => router.push("/fileupload"),
    // },
    {
      label: "Case History",
      icon: "pi pi-file-export",
      title: "Case history",
      template: (item: any, options: any) => (
        <div {...options} title="Case History">
          <i className={item.icon} />
          {/* <span>{item.label}</span> */}
        </div>
      ),

      command: () => {
        setIsCaseHistoryOpen(true); // ✅ open dialog/drawer
      },
    },
  ];

  <Button
    variant="ghost"
    className="justify-start gap-3"
    onClick={() => {
      setIsCaseHistoryOpen(true);
    }}
  >
    <ClipboardList className="w-5 h-5 text-green-500" />
    View Case History
  </Button>;

  useEffect(() => {
    const heightInMeters = Number(form.height) / 100;
    const weight = Number(form.weight);

    if (heightInMeters && weight) {
      const bmi = weight / (heightInMeters * heightInMeters);
      const roundedBmi = parseFloat(bmi.toFixed(2));

      let status = "";

      if (roundedBmi < 16) status = "Severely underweight";
      else if (roundedBmi < 17) status = "Very underweight";
      else if (roundedBmi < 18.5) status = "Underweight";
      else if (roundedBmi < 25) status = "Normal";
      else if (roundedBmi < 30) status = "Overweight";
      else if (roundedBmi < 35) status = "Obese Class I";
      else if (roundedBmi < 40) status = "Obese Class II";
      else status = "Obese Class III";

      setForm((prev) => ({
        ...prev,
        BMI: roundedBmi.toString(),
        BMIStatus: status,
      }));
    }
  }, [form.height, form.weight]);

  const appointmentId = patient?.AppointmentId;

  // ✅ define fetchVitals outside useEffect so it's reusable
  const fetchVitals = async () => {
    try {
      setVitalsLoading(true);
      const data = await getVitalsWithHistory(appointmentId);

      console.log("Fetched vitals data:", data);

      setVitalsHistory(data?.data?.history || []);

      if (data?.data?.current) {
        const current = data?.data?.current || {};

        setForm((prev) => ({
          ...prev,
          systolic: current.Systolic || "",
          diastolic: current.Diastolic || "",
          weight: current.Weight || "",
          temperature: current.Temperature || "",
          heartRate: current.HeartRate || "",
          oxygen: current.OxygenSaturation || "",
          height: current.Height || "",
          bloodgroup: current.BloodGroup || "",
          BMI: current.BMI || "",
          BMIStatus: current.BMIStatus || "",
        }));
      }

      setVitalsLoading(false);
    } catch (err) {
      console.error("Failed to fetch vitals:", err);
    }
  };

  // ✅ useEffect just calls fetchVitals
  useEffect(() => {
    if (appointmentId) {
      fetchVitals();
    }
  }, [appointmentId]);

  const fetchPatientMedicine = async () => {
    try {
      setPatientMedicineLoading(true);
      const data = await GetPatientMedications(patient?.PatientId);

      setPatientMedicineHistory(data?.return || []);
      console.log("Fetched Patient Medicine  data:", patientMedicineHistory);

      setPatientMedicineLoading(false);
    } catch (err) {
      console.error("Failed to Patient Medicine data:", err);
    }
  };

  // ✅ useEffect just calls fetchVitals
  useEffect(() => {
    if (patient?.PatientId) {
      fetchPatientMedicine();
    }
  }, [patient?.PatientId]);

  const handleSaveVitals = async () => {
    try {
      // Step 1: Construct the payload with all fields
      const rawPayload = {
        AppointmentId: Number(patient?.AppointmentId),
        Systolic: Number(form.systolic),
        Diastolic: Number(form.diastolic),
        Weight: Number(form.weight),
        Temperature: Number(form.temperature),
        HeartRate: Number(form.heartRate),
        OxygenSaturation: Number(form.oxygen),
        Height: Number(form.height),
        BloodGroup: form.bloodgroup,
        BMI: Number(form.BMI),
      };

      // Step 2: Remove all keys that are "", null, or undefined
      const cleanedPayload = Object.fromEntries(
        Object.entries(rawPayload).filter(
          ([_, v]) => v !== "" && v !== null && v !== undefined
        )
      );

      // Step 3: Make API call
      await AddUpdateVitals(cleanedPayload);
      console.log("Showing success toast…", toast.current);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Vitals saved successfully",
        life: 4000,
        // className: "custom-toast-container",
      });
      fetchVitals();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save vitals",
        life: 4000,
        className: "custom-toast-container",
      });
      console.error(error);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ConsultationFormValues>({
    defaultValues: {
      bloodgroup: "", // ✅ must be a string
      followUpDuration: "",
      followUpUnit: "",
      clinicalnotesText: "",
      systolic: "",
      diastolic: "",
      weight: "",
      temperature: "",
      heartRate: "",
      oxygen: "",
      height: "",
      BMI: "",
      BMIStatus: "",
      complaint: "",
      notes: "",
      investigations: [],
      investigationRemarks: {},
      diagnosis: "",
      treatment: "",
      followUp: "",
      complaints: [],
      medications: [
        {
          medicationName: "",
          dosage: "",
          frequency: "",
          duration: "",
          unit: "Days",
          remarks: "",
        },
      ],
    },
  });

  useEffect(() => {
    if (patient?.patient?.bloodGroup) {
      setValue("bloodgroup", patient.patient.bloodGroup);
    }
  }, [patient?.patient?.bloodGroup, setValue]);
  // const appointmentId = patient?.AppointmentId;
  // useEffect(() => {
  //   const fetchVitals = async () => {
  //     try {
  //       setVitalsLoading(true);
  //       const data = await getVitalsWithHistory(appointmentId); // pass appointmentId from props/context
  //       console.log("Fetched vitals data:", data);
  //       setVitalsHistory(data?.data?.history || []); // store history if needed
  //       if (data?.data?.current) {
  //         const current = data?.data?.current || {};

  //         setForm((prev) => ({
  //           ...prev,
  //           systolic: current.Systolic || "",
  //           diastolic: current.Diastolic || "",
  //           weight: current.Weight || "",
  //           temperature: current.Temperature || "",
  //           heartRate: current.HeartRate || "",
  //           oxygen: current.OxygenSaturation || "",
  //           height: current.Height || "",
  //           bloodgroup: current.BloodGroup || "", // match backend key
  //           BMI: current.BMI || "",
  //           BMIStatus: current.BMIStatus || "",
  //         }));
  //       }
  //       setVitalsLoading(false);
  //     } catch (err) {
  //       console.error("Failed to fetch vitals:", err);
  //     }
  //   };

  //   if (appointmentId) {
  //     fetchVitals();
  //   }
  // }, [appointmentId]);

  useEffect(() => {
    if (form.bloodgroup !== undefined) {
      setValue("bloodgroup", form.bloodgroup ?? "");
    }
  }, [form.bloodgroup, setValue]);

  const handleSaveConsultation = async (type: string) => {
    try {
      const isComplete = type?.toLowerCase() === "complete"; // case-insensitive check
      setIsSaving(true);

      // 🕒 Prepare timestamps
      const consultationStart =
        patient?.consultationStartDateTime || new Date().toISOString();
      const consultationEnd = isComplete ? new Date().toISOString() : "";

      // 🧩 Build final payload
      const payload = {
        ConsultationId: patient?.consultationId || undefined,
        AppointmentId: appointmentId, // ✅ Still required (used for relation connect on backend)
        consultationDatTime: consultationStart,
        consultationEndDateTime: consultationEnd,
        CheifcomplaintNotes: form?.notes || complaintText || "",
        IsSentCaseSheet: isComplete,
        IsConsultationCompleted: isComplete,

        // ✅ Chief Complaints
        ConsultationCheifComplaint: (selectedChiefComplaints || []).map(
          (item) => ({
            ChiefComplaintTagId: Number(item?.ChiefComplaintTagId) || 0,
          })
        ),

        // ✅ Investigations
        ConsultationInvestigation: (form.investigations || []).map((inv) => ({
          InvestigationTypeId: Number(inv.InvestigationTypeId),
          InvestigationSubTypeId: Number(inv.InvestigationSubTypeId),
          ConsultationInvestigatRemark:
            form.investigationRemarks?.[inv.value] || "",
        })),

        // ✅ Medications (mapped properly to DTO)
        ConsultationMedication: (form.medications || []).map((med) => ({
          medicationName: med.medicationName || med.medicationName || "",
          dosage: med.dosage || "",
          frequency: med.frequency || "",
          duration: med.duration || "",
          remarks: med.remarks || med.remarks || "",
        })),

        // ✅ Clinical Notes
        ConsultationclinicalNotes: clinicalnotesText
          ? [{ content: clinicalnotesText }]
          : [],

        // ✅ Diagnosis
        ConsultationDiagnosis: (diagnoses || []).map((diag) => ({
          diagnosisId: Number(diag?.DiagnosisId) || undefined,
          DiagnosisName: diag?.label || "",
          DiagnosisRemark: remarkMap?.[diag?.DiagnosisId] || "",
        })),

        // ✅ Treatment
        ConsultationTreatment: [
          {
            treatmentText: form.treatment || "",
            source: "TYPED",
          },
        ],

        // ✅ Follow-Up Plan
        ConsultationFollowUpPlan: {
          followUpText: form.followUp || "",
          duration: form.followUpDuration
            ? parseInt(form.followUpDuration, 10)
            : undefined,
          unit: form.followUpUnit || undefined,
          nextDate: calculateFollowUpDate(
            form.followUpDuration,
            form.followUpUnit
          ),
        },

        // ✅ followUpDate
        followUpDate: calculateFollowUpDate(
          form.followUpDuration,
          form.followUpUnit
        ),

        // ✅ Procedures
        ConsultationProcedure: (procedures || [])
          .filter(
            (proc) => proc?.ProcedureId && !isNaN(Number(proc.ProcedureId))
          )
          .map((proc) => ({
            ProcedureName: proc.label || "",
            ProcedureId: Number(proc.ProcedureId),
            Description: procedureremarkMap?.[proc.ProcedureId] || "",
          })),
      };

      console.log("🧠 Submitting payload:", payload);

      // ✅ Send payload to backend
      await addupdateConsultation(payload);

      toast.current?.show({
        severity: "success",
        summary: "Saved",
        detail: isComplete
          ? "Consultation completed successfully."
          : "Consultation draft saved.",
      });

      // ✅ UI handling
      setTimeout(() => {
        SetConsultationComlete(true);
        setTimeout(() => {
          SetConsultationComlete(false);
          const today = new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata",
          });
          onClose(); // Close modal or drawer
          dispatch(
            fetchAllAppointmentPatient({
              page: 1,
              limit: 10,
              hospitalId: selectedHospital
                ? Number(selectedHospital?.hospitalId)
                : undefined,
              appointmentDateFrom: today,
              appointmentDateTo: today,
            })
          );
        }, 2000);
      }, 1000);
    } catch (error) {
      console.error("❌ Error saving consultation", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save consultation. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const calculateFollowUpDate = (duration: string, unit: string) => {
    if (!duration || isNaN(Number(duration))) return null;

    const date = new Date();
    const intDuration = parseInt(duration, 10);

    switch (unit) {
      case "Days":
        date.setDate(date.getDate() + intDuration);
        break;
      case "Weeks":
        date.setDate(date.getDate() + intDuration * 7);
        break;
      case "Months":
        date.setMonth(date.getMonth() + intDuration);
        break;
      case "Years":
        date.setFullYear(date.getFullYear() + intDuration);
        break;
      default:
        return null;
    }
    return date.toISOString();
  };
  //binding consultation data
  useEffect(() => {
    if (patient?.consultation) {
      const consultation = patient.consultation;

      // Chief Complaints
      const chiefComplaintsFromDB =
        consultation.ConsultationCheifComplaint?.map((c: any) => ({
          label: c?.chiefComplaint?.ChiefComplainTagName,
          value: c?.chiefComplaint?.ChiefComplainTagName,
          ChiefComplaintTagId: c?.chiefComplaint?.ChiefComplaintTagId,
        })) || [];
      setSelectedChiefComplaints(chiefComplaintsFromDB);
      setComplaintText(consultation.CheifcomplaintNotes);
      // setChiefComplaintOptions
      // Clinical Notes
      const clinicalNotesFromDB =
        consultation.ConsultationclinicalNotes?.[0]?.content || "";
      setClinicalnotesText(clinicalNotesFromDB);

      // Diagnosis
      const diagnosisList =
        consultation.ConsultationDiagnosis?.map((d: any) => ({
          label: d?.diagnosis?.DiagnosisName || "",
          DiagnosisId: d?.diagnosis?.DiagnosisId?.toString() || "",
        })) || [];

      const diagnosisRemarkMap: Record<string, string> = {};
      consultation.ConsultationDiagnosis?.forEach((d: any) => {
        if (d?.diagnosisId) {
          diagnosisRemarkMap[d.diagnosisId.toString()] =
            d?.DiagnosisRemark || "";
        }
      });

      setDiagnoses(diagnosisList);
      setRemarkMap(diagnosisRemarkMap);

      // Investigations
      const investigationValues =
        consultation.ConsultationInvestigation?.map((i: any) => ({
          label: i?.InvestigationSubType?.InvestigationSubTypename,
          value: i?.InvestigationSubTypeId,
          InvestigationTypeId: i?.InvestigationTypeId,
          InvestigationSubTypeId: i?.InvestigationSubTypeId,
          InvestigationType: i?.InvestigationType?.InvestigationTypeName,
          color: i?.InvestigationType?.InvestigationTypeColorCode,
        })) || [];

      const investigationRemarks =
        consultation.ConsultationInvestigation?.reduce(
          (acc: Record<string, string>, i: any) => {
            acc[i?.InvestigationSubTypeId] =
              i?.ConsultationInvestigatRemark || "";
            return acc;
          },
          {}
        ) || {};
      console.log("INVESTIGATION REMARK ", investigationRemarks);
      setForm((prev: any) => ({
        ...prev,
        investigations: investigationValues,
        investigationRemarks,
      }));
      console.log("Rendering remarks for:", form.investigations);
      console.log("Remarks:", form.investigationRemarks);

      // Treatment Instructions
      const treatmentText =
        consultation.ConsultationTreatment?.[0]?.treatmentText || "";
      setForm((prev: any) => ({
        ...prev,
        treatment: treatmentText,
      }));

      // Follow-up
      const followUpData = consultation.ConsultationFollowUpPlan[0];

      const formattedDate = followUpData.nextDate
        ? new Date(followUpData.nextDate).toISOString().slice(0, 10)
        : "";

      setForm((prev: any) => ({
        ...prev,
        followUp: followUpData.followUpText || "",
        followUpDuration: followUpData.duration?.toString() || "",
        followUpUnit: followUpData.unit || "Days", // Default unit
      }));

      // Medications
      const meds =
        consultation.ConsultationMedication?.map((m: any) => ({
          medicationName: m?.medicationName || "", // ✅ Changed
          dosage: m?.dosage || "",
          frequency: m?.frequency || "",
          duration: m?.duration || "",
          unit: m?.unit || "", // ✅ Added
          remarks: m?.remarks || "",
        })) || [];
      console.log("medicine", meds);
      setForm((prev: any) => ({
        ...prev,
        medications: meds.length > 0 ? meds : prev.medications,
      }));

      // Procedures
      const procedureList =
        consultation.ConsultationProcedure?.map((p: any) => ({
          label: p?.procedure?.ProcedureName || "",
          ProcedureId: p?.procedure?.ProcedureId?.toString() || "",
        })) || [];

      const procedureremarkMap: Record<string, string> = {};
      consultation.ConsultationProcedure?.forEach((p: any) => {
        if (p?.ProcedureId) {
          procedureremarkMap[p.ProcedureId.toString()] = p?.Description || "";
        }
      });

      setProcedures(procedureList); // <-- setSelectedProcedures or whatever state you're using
      setProcedureremarkMap(procedureremarkMap);
    }
  }, [patient]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="drawer"
          initial={{ x: "100%" }}
          animate={{ x: 0, width: fullScreen ? "100vw" : "42vw" }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-0 right-0 z-50 h-full bg-white shadow-xl rounded-l-2xl border-l border-gray-200"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-0 py-0">
            <h1 className="text-lg font-semibold font-sans text-gray-600">
              {/* Patient Detail */}
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFullScreen(!fullScreen)}
              >
                <Maximize2 className="w-5 h-5 text-[#22E0D4]" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-6 h-6 text-red-600" />
              </Button>
            </div>
          </div>

          {/* Body */}
          <div className="px-4 pb-4 overflow-y-auto h-[calc(100%-4rem)]">
            {/* Patient Info */}

            <div
              className="sticky top-0 z-50 w-full rounded-tr-md shadow-sm bg-white px-2 py-1"
              style={{
                border: "1px solid transparent",
                borderImage: "linear-gradient(to right, #14b8a6, #6366f1) 1",
              }}
            >
              {" "}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <Avatar className="h-12 w-12 rounded-full">
                  <AvatarImage
                    src={imageUrl || undefined}
                    alt={patient?.patient?.firstName || "User"}
                    className="h-12 w-12 rounded-full object-cover"
                    onError={(e) =>
                      (e.currentTarget.src = "/default-avatar.png")
                    }
                  />
                  <AvatarFallback
                    className={`h-12 w-12 flex items-center justify-center rounded-full text-sm font-medium ${colorClass}`}
                  >
                    {initials || "?"}
                  </AvatarFallback>
                </Avatar>

                {/* Patient Details */}
                <div className="flex flex-col w-full text-sm text-gray-700 font-sans">
                  {fullScreen ? (
                    <div className="grid grid-cols-5 gap-x-2 gap-y-1 w-full -mx-4 font-sans text-[13px]">
                      {/* Row 1 */}
                      <div className="font-semibold text-base col-span-1 ">
                        {patient?.patient?.Prefix}.{" "}
                        {patient?.patient?.firstName}{" "}
                        {patient?.patient?.lastName}
                      </div>
                      <div className="flex items-center col-span-1 gap-0.5">
                        <AtSign className="w-4 h-4 text-[#22E0D4]" />

                        {patient?.patient?.email || "N/A"}
                      </div>
                      <div className="flex items-center col-span-1 gap-0.5 ">
                        <BriefcaseMedical className="w-4 h-4 text-[#22E0D4]" />

                        <span className="text-[12px] text-shadow-muted-foreground">
                          MRN.:
                        </span>
                        {patient?.patient?.Patient_Medical_Record_No || "N/A"}
                      </div>
                      <div className="flex items-center col-span-1 gap-0.5">
                        <MilkOff className="w-4 h-4 text-[#22E0D4]" />

                        <div className="flex items-center gap-2">
                          <p className="font-medium">Allergies:</p>

                          {patient?.patient?.allergies?.length ? (
                            <div className="flex items-center gap-2">
                              {/* Show only first allergy */}
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 dark:bg-red-700/30 dark:text-red-300">
                                {patient.patient.allergies[0]?.AllergyName}
                              </span>

                              {/* Show +N if more exist */}
                              {patient.patient.allergies.length > 1 && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="cursor-pointer text-xs font-medium text-gray-500 dark:text-gray-300">
                                        +{patient.patient.allergies.length - 1}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="flex flex-col gap-1">
                                        {patient.patient.allergies
                                          .slice(1)
                                          .map((a: any, idx: number) => (
                                            <span
                                              key={idx}
                                              className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 dark:bg-red-700/30 dark:text-red-300"
                                            >
                                              {a?.AllergyName}
                                            </span>
                                          ))}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          ) : (
                            <p className="italic text-gray-400">None</p>
                          )}
                        </div>
                        {/* {patient?.patient?.allergies || "None"} */}
                      </div>
                      <div className="flex items-center gap-2">
                        <Languages className="w-4 h-4 text-[#22E0D4]" />
                        <span className="text-[12px] text-shadow-muted-foreground font-medium">
                          Language Spoken:
                        </span>

                        {patient?.patient?.languages?.length ? (
                          <div className="flex items-center gap-2">
                            {/* First language */}
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-700/30 dark:text-blue-300">
                              {patient.patient.languages[0]?.LanguageName}
                            </span>

                            {/* +N with tooltip if more languages */}
                            {patient.patient.languages.length > 1 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-pointer text-xs font-medium text-gray-500 dark:text-gray-300">
                                      +{patient.patient.languages.length - 1}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="flex flex-col gap-1">
                                      {patient.patient.languages
                                        .slice(1)
                                        .map((lang: any) => (
                                          <span
                                            key={lang.LanguageId}
                                            className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-700/30 dark:text-blue-300"
                                          >
                                            {lang.LanguageName}
                                          </span>
                                        ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        ) : (
                          <span className="italic text-gray-400 text-xs">
                            N/A
                          </span>
                        )}
                      </div>

                      {/* Row 2 */}
                      <div className="flex items-center col-span-1 p-0 mx-10	">
                        {calculateAge(patient?.patient?.dateOfBirth)},{" "}
                        {patient?.patient?.gender}
                      </div>
                      <div className="flex items-center col-span-1 gap-0.5">
                        <PhoneCall className="w-4 h-4 text-[#22E0D4]" />
                        {patient?.patient?.mobile || "N/A"}
                      </div>
                      <div className="flex items-center col-span-3 gap-0.5 ">
                        <ClipboardPlus className="w-4 h-4 text-[#1ab4aa]" />

                        <div className="flex items-center gap-2">
                          <p className="font-medium">Medical History:</p>

                          {patient?.patient?.medicalHistory?.length ? (
                            <div className="flex items-center gap-2">
                              {/* Show only first medical history */}
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 dark:bg-green-700/30 dark:text-green-300">
                                {
                                  patient.patient.medicalHistory[0]
                                    ?.MedicalHistoryName
                                }
                              </span>

                              {/* Show +N if more exist */}
                              {patient.patient.medicalHistory.length > 1 && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="cursor-pointer text-xs font-medium text-gray-500 dark:text-gray-300">
                                        +
                                        {patient.patient.medicalHistory.length -
                                          1}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="flex flex-col gap-1">
                                        {patient.patient.medicalHistory
                                          .slice(1)
                                          .map((c: any, idx: number) => (
                                            <span
                                              key={idx}
                                              className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 dark:bg-green-700/30 dark:text-green-300"
                                            >
                                              {c?.MedicalHistoryName}
                                            </span>
                                          ))}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          ) : (
                            <p className="italic text-gray-400">None</p>
                          )}
                        </div>
                        {/* {patient?.patient?.medicalHistory || "N/A"} */}
                      </div>
                    </div>
                  ) : (
                    // Non-fullscreen mode
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-1">
                        <div className="font-semibold text-base">
                          {patient?.patient?.firstName}{" "}
                          {patient?.patient?.lastName}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <AtSign className="w-4 h-4 text-[#22E0D4]" />
                          {patient?.patient?.email || "N/A"}
                        </div>
                      </div>

                      {/* Row 2: Age/Gender + Phone */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-1 mt-1">
                        <div className="text-sm text-gray-700">
                          {calculateAge(patient?.patient?.dateOfBirth)},{" "}
                          {patient?.patient?.gender}
                        </div>
                        <div className="flex items-end gap-1 text-sm text-gray-700">
                          <PhoneCall className="w-4 h-4 text-[#22E0D4]" />
                          {patient?.patient?.mobile || "N/A"}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* visit info */}
            <div className="w-full text-sm text-gray-700 font-mono py-2">
              {fullScreen ? (
                // 👉 Full screen layout - single row grid
                <div className="grid grid-cols-5 gap-x-4 gap-y-2 w-full font-sans">
                  {/* Scheduled Time */}
                  <div className="flex items-start gap-2 col-span-1">
                    {/* Icon and label on same line */}
                    <CalendarDays className="w-4 h-4 text-blue-300" />
                    <div>
                      <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                        Scheduled Time & Date
                      </div>
                      <div className="text-sm font-medium -mx-4">
                        {formatDateTime(patient?.appointmentDate)}
                      </div>
                    </div>
                  </div>

                  {/* Assigned Physician */}
                  <div className="flex items-start gap-2 ">
                    <div className="flex items-center justify-items-center gap-1 text-[11px] text-muted-foreground">
                      <UserRound className="w-4 h-4  text-pink-300" />
                    </div>
                    <div>
                      {/* Icon and label on same line */}
                      <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                        Assign Provider
                      </div>
                      {/* Value on next line */}
                      <div className="text-sm font-medium -mx-4">
                        Dr. {patient?.doctor?.firstName || "N/A"}{" "}
                        {patient?.doctor?.lastName || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="flex flex-col">
                    {/* Label */}
                    <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                      <NotebookPen className="w-4 h-4 text-red-300" />
                      <span>Visit Reason</span>
                    </div>

                    {/* Value */}
                    <div className="flex flex-wrap gap-1">
                      {patient?.reason ? (
                        patient.reason.length > 35 ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                                  {patient.reason.slice(0, 35)}...
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs break-words">
                                  {patient.reason}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="text-m text-gray-700 dark:text-gray-300">
                            {patient.reason}
                          </span>
                        )
                      ) : (
                        <span className="italic text-gray-400">N/A</span>
                      )}
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="flex flex-col col-span-1">
                    <div className="flex items-center justify-center gap-1 text-[12px] text-muted-foreground">
                      <AlertTriangle className="w-4 h-4 text-yellow-300" />
                      Emergency Contact
                    </div>
                    {patient?.patient?.emergencyName ? (
                      <>
                        <div className="text-sm">
                          {patient.patient.emergencyName} (
                          {patient.patient.emergencyRelation || "N/A"})
                        </div>
                        <div className="text-sm">
                          {patient.patient.emergencyContact || "N/A"}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm">N/A</div>
                      </>
                    )}
                  </div>

                  {/* Fast Track Patient */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-center gap-1 text-[12px] text-muted-foreground">
                      <Stethoscope className="w-4 h-4 text-blue-300" />
                      Patient Type
                    </div>
                    <div>
                      {/* <Image
                      src="/fast-time.png"
                      alt="Fast Track"
                      width={20}
                      height={20}
                      className="object-contain"
                    /> */}
                      <span className="text-sm">
                        {patient?.fasttrackpatient
                          ? "Fast Track Patient"
                          : "Normal Patient"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                // 👉 Small screen layout - stacked flex
                <div className="flex flex-col gap-y-2 w-full font-mono">
                  {/* Row 1: Scheduled Time & Provider */}
                  <div className="grid grid-cols-2 gap-0.5">
                    <div className="flex items-start gap-1">
                      <CalendarDays className="w-4 h-4 text-blue-300" />

                      <div>
                        {/* Icon + Label aligned with small gap */}
                        <div className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                          Scheduled Time & Date
                        </div>

                        {/* Time value below */}
                        <div className="text-sm font-medium">
                          {formatDateTime(patient?.appointmentDate)}
                        </div>
                      </div>
                    </div>

                    {/* Assign Provider */}
                    <div className="flex flex-col items-end ml-auto">
                      {/* Icon + Label in same line */}
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <UserRound className="w-4 h-4 text-red-300" />
                        <span>Assign Provider</span>
                      </div>

                      {/* Provider Name */}
                      <div className="text-sm font-medium">
                        Dr. {patient?.doctor?.firstName || "N/A"}{" "}
                        {patient?.doctor?.lastName || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Visit Reason & Emergency Contact */}
                  <div className="flex justify-between gap-4">
                    {/* Visit Reason */}
                    <div className="flex items-start gap-1">
                      <NotebookPen className="w-4 h-4 text-pink-300" />

                      <div>
                        <div className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                          Visit Reason
                        </div>
                        <div className="text-sm">
                          {patient?.reason || "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="flex flex-col items-end ml-auto">
                      {/* Icon + Label in same row */}
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <AlertTriangle className="w-4 h-4 text-yellow-300" />
                        <span>Emergency Contact</span>
                      </div>

                      {/* Contact Info */}
                      {patient?.patient?.emergencyName ? (
                        <>
                          <div className="text-sm">
                            {patient.patient.emergencyName} (
                            {patient.patient.emergencyRelation || "N/A"})
                          </div>
                          <div className="text-sm">
                            {patient.patient.emergencyContact || "N/A"}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-sm">N/A</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-2" />

            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="font-mono"
            >
              <TabsList
                className="mb-2 rounded-xl p-1 text-black"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(34, 211, 238, 0.35) 0%, rgba(129, 140, 248, 0.15) 100%)",
                }}
              >
                <TabsTrigger
                  value="vitals"
                  className="relative z-10 px-4 py-2 data-[state=active]:text-[#22E0D4]"
                >
                  Vitals
                </TabsTrigger>
                <TabsTrigger
                  value="consultation"
                  className="relative z-10 px-4 py-2 data-[state=active]:text-[#22E0D4]"
                >
                  Consultation
                </TabsTrigger>
                <TabsTrigger
                  value="medications"
                  className="relative z-10 px-4 py-2 data-[state=active]:text-[#22E0D4]"
                >
                  Medications
                </TabsTrigger>
                {/* <TabsTrigger
                  value="labTests"
                  className="relative z-10 px-4 py-2 data-[state=active]:text-[#22E0D4]"
                >
                  Lab Test Results
                </TabsTrigger> */}
                {/* <TabsTrigger value="appointmentHistory">Appointment History</TabsTrigger> */}
              </TabsList>
              <AnimatePresence mode="wait">
                {selectedTab === "vitals" && (
                  <motion.div
                    key="vitals"
                    variants={tabVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent value="vitals">
                      {vitalsLoading ? (
                        <VitalsSkeleton />
                      ) : (
                        <>
                          <ScrollArea className="w-full font-sans">
                            <div className="w-full flex justify-end pr-4 mb-2 cursor-pointer">
                              <Button
                                variant="outline"
                                className="text-sm font-medium border-gray-300 rounded-3xl cursor-pointer hover:bg-teal-100 transition-colors "
                                onClick={() => {
                                  setVitalsData(vitalsHistory); // Set vitals data
                                  setVitalsHistoryOpen(true); // Open dialog
                                }}
                              >
                                {" "}
                                <History className="w-4 h-4" />
                                Vitals History
                              </Button>
                            </div>
                            <form
                              onSubmit={handleSubmit(handleSaveVitals)}
                              className="w-full"
                            >
                              <div
                                className={
                                  fullScreen
                                    ? "w-full  flex flex-wrap justify-center gap-4 p-4"
                                    : "w-full"
                                }
                              >
                                <>
                                  <Toast ref={toast} position="top-right" />
                                  <div
                                    className={`grid gap-6 p-2 transition-all duration-300 ${
                                      fullScreen
                                        ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 max-w-[1400px] mx-auto"
                                        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
                                    }`}
                                  >
                                    {/* VitalCardInput components here */}
                                    <VitalCardInput
                                      icon={<Droplet size={18} />}
                                      label="Blood Pressure"
                                      unit="mmHg"
                                      customField={
                                        <div className="flex items-center justify-center w-full gap-1">
                                          <input
                                            type="text"
                                            maxLength={3}
                                            name="systolic"
                                            placeholder="SBP"
                                            value={form.systolic}
                                            onChange={handleChange}
                                            className="w-10 text-center border border-gray-300 rounded px-1 py-1 text-sm focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:outline-none transition-all"
                                          />
                                          <span className="text-gray-500 text-sm">
                                            /
                                          </span>
                                          <input
                                            type="text"
                                            maxLength={3}
                                            name="diastolic"
                                            placeholder="DBP"
                                            value={form.diastolic}
                                            onChange={handleChange}
                                            className="w-10 text-center border border-gray-300 rounded px-1 py-1 text-sm focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:outline-none transition-all"
                                          />
                                        </div>
                                      }
                                      value={""}
                                      name={""}
                                    />
                                    <VitalCardInput
                                      icon={<Weight size={18} />}
                                      label="Weight"
                                      value={form.weight}
                                      name="weight"
                                      unit="Kg"
                                      onChange={handleChange}
                                    />
                                    <VitalCardInput
                                      icon={<Thermometer size={18} />}
                                      label="Temperature"
                                      value={form.temperature}
                                      name="temperature"
                                      unit="°F"
                                      onChange={handleChange}
                                    />
                                    <VitalCardInput
                                      icon={<HeartPulse size={18} />}
                                      label="Heart Rate"
                                      value={form.heartRate}
                                      name="heartRate"
                                      unit="bpm"
                                      onChange={handleChange}
                                    />
                                    <VitalCardInput
                                      icon={<Activity size={18} />}
                                      label="SpO2"
                                      value={form.oxygen}
                                      name="oxygen"
                                      unit="%"
                                      onChange={handleChange}
                                    />
                                    <VitalCardInput
                                      icon={<Ruler size={18} />}
                                      label="Height"
                                      value={form.height}
                                      name="height"
                                      unit="Cm"
                                      onChange={handleChange}
                                    />
                                    <VitalCardInput
                                      icon={<Droplets size={18} />}
                                      label="Blood Group"
                                      value={form.bloodgroup}
                                      name="bloodgroup"
                                      customField={
                                        <Controller
                                          control={control}
                                          name="bloodgroup"
                                          render={({ field }) => (
                                            <Select
                                              value={form.bloodgroup}
                                              onValueChange={(val) =>
                                                setForm((prev) => ({
                                                  ...prev,
                                                  bloodgroup: val,
                                                }))
                                              }
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                              </SelectTrigger>
                                              <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                                                {" "}
                                                <SelectItem value="O_POS">
                                                  O+
                                                </SelectItem>
                                                <SelectItem value="O_NEG">
                                                  O-
                                                </SelectItem>
                                                <SelectItem value="A_POS">
                                                  A+
                                                </SelectItem>
                                                <SelectItem value="A_NEG">
                                                  A-
                                                </SelectItem>
                                                <SelectItem value="B_POS">
                                                  B+
                                                </SelectItem>
                                                <SelectItem value="B_NEG">
                                                  B-
                                                </SelectItem>
                                                <SelectItem value="AB_POS">
                                                  AB+
                                                </SelectItem>
                                                <SelectItem value="AB_NEG">
                                                  AB-
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                          )}
                                        />
                                      }
                                    />

                                    <VitalCardInput
                                      icon={<Scale size={18} />}
                                      label="BMI"
                                      value={form.BMI}
                                      name="bmi"
                                      unit="kg/m²"
                                      onChange={handleChange}
                                      description={
                                        form.BMI ? (
                                          <div className="flex justify-items-start mx-0 text-sm text-gray-600">
                                            {/* <span className="font-medium ">BMI: </span>{" "}
              {form.BMI} */}
                                            {form.BMIStatus && (
                                              <>
                                                <span className="ml-4 font-medium">
                                                  Status:
                                                </span>
                                                <span className="text-teal-600 ml-1">
                                                  {form.BMIStatus}
                                                </span>
                                              </>
                                            )}
                                          </div>
                                        ) : null
                                      }
                                    />
                                  </div>

                                  {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-4">
                                    
                                  </div> */}
                                </>

                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    ease: "easeOut",
                                  }}
                                  className="w-full flex justify-center mt-6"
                                >
                                  <Button
                                    type="submit"
                                    // onClick={handleSaveVitals}
                                    className="px-6 py-2 text-base font-semibold rounded-2xl shadow-md cursor-pointer  hover:bg-[#22E0D4] transition-colors duration-200 bg-[#6ce9e3] text-white"
                                  >
                                    {isSubmitting ? (
                                      <Loader2Icon className="animate-spin" />
                                    ) : (
                                      "Save Vitals"
                                    )}
                                  </Button>
                                </motion.div>
                              </div>
                            </form>
                          </ScrollArea>
                          <VitalsHistoryDialog
                            open={vitalsHistoryOpen}
                            onOpenChange={setVitalsHistoryOpen}
                            vitalsData={vitalsData}
                          />
                        </>
                      )}
                    </TabsContent>
                  </motion.div>
                )}
                {selectedTab === "consultation" && (
                  <motion.div
                    key="consultation"
                    variants={tabVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent value="consultation">
                      {consultationComleted && (
                        <AnimatePresence>
                          <motion.div
                            className="fixed inset-0 z-[9999] bg-white/90 flex items-center justify-center overflow-auto"
                            style={{ pointerEvents: "auto" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <motion.div
                              className="flex flex-col items-center justify-center text-center p-6 max-w-md w-full mx-auto"
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.9, opacity: 0 }}
                              transition={{ duration: 0.5 }}
                            >
                              <div className="mb-2">
                                <Lottie
                                  animationData={successAnimation}
                                  loop={false}
                                  autoplay
                                  style={{ width: 150, height: 150 }}
                                  onComplete={() => {
                                    // Automatically hide after animation ends
                                    setTimeout(
                                      () => SetConsultationComlete(false),
                                      500
                                    );
                                  }}
                                />
                              </div>
                              <p className="text-2xl mt-4 font-semibold text-green-600">
                                Consultation saved successfully!
                              </p>
                            </motion.div>
                          </motion.div>
                        </AnimatePresence>
                      )}
                      <div>
                        <Toast ref={toast} />
                        <SpeedDial
                          model={items}
                          radius={120}
                          type="quarter-circle"
                          direction="up-left"
                          // title="consultation Action controller"
                          style={{
                            position: "fixed",
                            bottom: "1.5rem",
                            right: "1.5rem",
                            zIndex: 1000,
                          }}
                          className="[&_.p-speeddial-button]:!bg-[#22E0D4] [&_.p-speeddial-button]:!rounded-full [&_.p-speeddial-button]:!w-14 [&_.p-speeddial-button]:!h-14"
                          buttonTemplate={(options) => (
                            <button
                              type="button"
                              className={`p-speeddial-button flex items-center justify-center ${options.className}`}
                              onClick={options.onClick}
                            >
                              {isSaving ? (
                                <Loader2Icon className="animate-spin text-white w-7 h-7" />
                              ) : (
                                <Plus className="text-white w-7 h-7" />
                              )}
                            </button>
                          )}
                        />
                      </div>
                      <ScrollArea className="w-full font-sans">
                        <div
                          className={
                            fullScreen
                              ? "grid grid-cols-1 md:grid-cols-2 gap-4 p-4 px-48 border-gray-300"
                              : "w-full"
                          }
                        >
                          <ChiefComplaintCard
                            disabled={isDisabled}
                            selectedChiefComplaints={selectedChiefComplaints}
                            setSelectedChiefComplaints={
                              setSelectedChiefComplaints
                            }
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            complaintText={complaintText}
                            setComplaintText={setComplaintText}
                            handleChiefComplaintMicClick={
                              handleChiefComplaintMicClick
                            }
                            listening={listeningChiefComplaint}
                            customsStyles={customsStyles}
                          />
                          <ClinicalNotesCard
                            disabled={isDisabled}
                            clinicalnotesText={clinicalnotesText}
                            setClinicalnotesText={setClinicalnotesText}
                            handleClinicalNoteMicClick={
                              handleClinicalNoteMicClick
                            }
                            listening={listeningClinicalNote}
                          />
                          <InvestigationCard
                            disabled={isDisabled}
                            investigationCategories={investigationCategories}
                            setInvestigationCategories={
                              setInvestigationCategories
                            }
                            setCustomCategory={setCustomCategory}
                            customCategory={customCategory}
                            setCustomInvestigation={setCustomInvestigation}
                            InvestigationSubTypename={InvestigationSubTypename} // ✅ CORRECT
                            form={form}
                            setForm={setForm}
                            customStyles={customStyles}
                            // handleInvestigationMicClick={
                            //   handleInvestigationMicClick
                            // }
                            listening={listeningInvestigation} // ✅ FIXED HERE
                          />
                          <DiagnosisInputCard
                            disabled={isDisabled}
                            diagnoses={diagnoses}
                            setDiagnoses={setDiagnoses}
                            // handleDiagnosisMicClick={handleDiagnosisMicClick}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            remarkMap={remarkMap}
                            setRemarkMap={setRemarkMap}
                            // listenings={listeningDiagnosis}
                          />
                          <ProcedureInputCard
                            disabled={isDisabled}
                            procedures={procedures}
                            setProcedures={setProcedures}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            procedureremarkMap={procedureremarkMap}
                            setProcedureremarkMap={setProcedureremarkMap}
                          />
                          <TreatmentInstructionsCard
                            disabled={isDisabled}
                            form={form}
                            setForm={setForm}
                            handleTreatmentMicClick={handleTreatmentMicClick}
                            isListening={listeningTreatment}
                          />
                          <MedicationCard
                            disabled={isDisabled}
                            medications={form.medications}
                            handleMedicationChange={handleMedicationChange}
                            handleAddMedication={handleAddMedication}
                            handleRemoveMedication={handleRemoveMedication}
                          />
                          <FollowUpPlanCard
                            disabled={isDisabled}
                            form={form}
                            setForm={setForm}
                            handleChange={handleChange}
                            handleFollowUpShortcut={handleFollowUpShortcut}
                          />
                          <PatientCaseHistory
                            visible={isCaseHistoryOpen}
                            onHide={() => setIsCaseHistoryOpen(false)}
                            patient={patient}
                          />
                          ;
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </motion.div>
                )}
                {selectedTab === "medications" && (
                  <motion.div
                    key="medications"
                    variants={tabVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent value="medications">
                      <ScrollArea className="h-72 pr-3">
                        <div className="relative">
                          {/* Vertical timeline line */}
                          <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-teal-400 via-blue-400 to-purple-400 rounded-full" />

                          <div className="space-y-8">
                            {patientMedicineHistory?.history?.length ? (
                              patientMedicineHistory.history?.map((h: any) => (
                                <div
                                  key={h.consultationId}
                                  className="relative pl-12"
                                >
                                  {/* Circle marker */}
                                  <div className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 shadow-md border border-white dark:border-zinc-800" />

                                  {/* Date */}
                                  <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 mb-2">
                                    {new Date(h.date).toLocaleDateString(
                                      "en-IN",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      }
                                    )}
                                  </p>

                                  {/* Medications */}
                                  <div className="grid gap-3">
                                    {h.medications.map((m: any) => (
                                      <motion.div
                                        key={m.id}
                                        whileHover={{ scale: 1.02 }}
                                        className="rounded-2xl bg-gradient-to-r from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 shadow-md border border-zinc-200 dark:border-zinc-700 p-4 transition"
                                      >
                                        <div className="flex justify-between items-center">
                                          <p className="text-base font-semibold text-zinc-800 dark:text-zinc-100 capitalize">
                                            {m.name}
                                          </p>
                                          <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-sm">
                                            {m.dosage} • {m.frequency}
                                          </span>
                                        </div>
                                        {m.instructions && (
                                          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                            {m.instructions}
                                          </p>
                                        )}
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-center text-zinc-500 dark:text-zinc-400 mt-6">
                                No medication history available
                              </p>
                            )}
                          </div>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </motion.div>
                )}

                {selectedTab === "labTests" && (
                  <motion.div
                    key="labTests"
                    variants={tabVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent value="labTests">
                      <ScrollArea className="h-60">
                        Lab Tests content here
                      </ScrollArea>
                    </TabsContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Tabs>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
