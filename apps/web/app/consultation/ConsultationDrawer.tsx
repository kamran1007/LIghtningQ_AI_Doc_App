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

import {
  Phone,
  Mail,
  CalendarClock,
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
  Barcode,
  ClipboardPlus,
  Languages,
  MilkOff,
  BriefcaseMedical,
  CalendarDays,
  User,
  UserRound,
  NotebookPen,
  StickyNote,
  ClipboardList,
  SearchCheck,
  CalendarCheck,
  Pill,
  Microscope,
  PlusCircle,
  Mic,
  MicOff,
  Plus,
  Trash2,
  Loader2Icon,
  History,

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabPanel, TabView } from "primereact/tabview";
import { Maximize2, X } from "lucide-react";
import { useState } from "react";
import { BACKEND_URL } from "@/lib/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";

import { Label, Separator } from "@radix-ui/react-dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VitalCardInput } from "./VitalCardInput";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
interface ConsultationDrawerProps {
  open: boolean;
  onClose: () => void;
  patient: any;
}

// import { MultiSelect } from "@/components/multi-select";

import { useForm } from "react-hook-form";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import CreatableSelect from "react-select/creatable";
import { useEffect } from "react";
import TreatmentInstructionsCard from "./TreatmentInstructions";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { AddUpdateVitals, getVitalsWithHistory } from "@/lib/consultation";
import { is, tr } from "date-fns/locale";
import VitalsSkeleton from "@/components/ui/skeletonloader/VitalsSkeleton";
import setVitalsHistoryOpen from "./VitalsHistoryDialog";
import VitalsHistoryDialog from "./VitalsHistoryDialog";
export default function ConsultationDrawer({
  open,
  onClose,
  patient,
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

  const [form, setForm] = useState<{
    // followUp: "",
    followUpDuration: string;
    followUpUnit: string;
    Clinicalnotes: string;
    // bloodPressure: string;
    systolic: string;
    diastolic: string;
    weight: string;
    temperature: string;
    heartRate: string;
    oxygen: string;
    height: string;
    bloodgroup: string;
    BMI: string;
    BMIStatus: string;
    complaint: string;
    notes: string;
    investigations: string[];
    investigationRemarks: string;
    diagnosis: string;
    treatment: string;
    followUp: string;
    complaints: any[]; // Added complaints property
    medications: {
      drug: string;
      dosage: string;
      frequency: string;
      duration: string;
      notes: string;
    }[];
  }>({
    // followUp: "",
    followUpDuration: "",
    followUpUnit: "",
    Clinicalnotes: "",
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
    investigationRemarks: "",
    diagnosis: "",
    treatment: "",
    followUp: "",
    complaints: [], // Changed to array to match usage

    medications: [
      {
        drug: "",
        dosage: "",
        frequency: "",
        duration: "",
        notes: "",
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
    field: string,
    value: string
  ) => {
    const updated = [...form.medications];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, medications: updated }));
  };

  const handleAddMedication = () => {
    setForm((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        { drug: "", dosage: "", frequency: "", duration: "", notes: "" },
      ],
    }));
  };
  const [selectedTab, setSelectedTab] = useState("vitals");
  const investigationOptions = [
    {
      label: "Laboratory",
      options: [
        { label: "CBC", value: "cbc", color: "#7fcdff" }, // light blue
        { label: "LFT", value: "lft", color: "#7fcdff" },
        { label: "RFT", value: "rft", color: "#7fcdff" },
        { label: "Blood Sugar", value: "blood_sugar", color: "#7fcdff" },
        { label: "Thyroid Profile", value: "thyroid", color: "#7fcdff" },
      ],
    },
    {
      label: "Imaging",
      options: [
        { label: "Chest X-Ray", value: "xray_chest", color: "#ffc1ea" }, // light pink
        { label: "Ultrasound Abdomen", value: "usg_abdomen", color: "#ffc1ea" },
        { label: "CT Scan Brain", value: "ct_brain", color: "#ffc1ea" },
        { label: "MRI Spine", value: "mri_spine", color: "#ffc1ea" },
      ],
    },
    {
      label: "Others",
      options: [
        { label: "ECG", value: "ecg", color: "#66bf9b" }, // light green
        { label: "Echo", value: "echo", color: "#66bf9b" },
      ],
    },
  ];
  const investigationCategories = [
    { label: "Laboratory", value: "Laboratory" },
    { label: "Imaging", value: "Imaging" },
    { label: "Others", value: "Others" },
  ];

  const [notes, setNotes] = useState("");

  interface ChiefComplaint {
    id: string;
    patientId: string;
    tags: string[]; // Multi-select tags
    freeText: string | null;
    createdAt: Date;
  }
  const [customInvestigation, setCustomInvestigation] = useState("");
  const [customCategory, setCustomCategory] = useState("Others"); // default
  const [chiefComplaints, setChiefComplaints] = useState<string[]>([]); // for tags
  const [complaintText, setComplaintText] = useState<string>(""); // for speech
  const [clinicalnotesText, setClinicalnotesText] = useState<string>(""); // for clinical notes
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [diagnoses, setDiagnoses] = useState<string[]>([]);
  const [listenings, setListenings] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [vitalsLoading, setVitalsLoading] = useState(false);
  const [vitalsHistory, setVitalsHistory] = useState<any[]>([]);
  const [vitalsHistoryOpen, setVitalsHistoryOpen] = useState(false);
  const [vitalsData, setVitalsData] = useState<any[]>([]);

  const handleAddCustom = () => {
    if (!customInvestigation.trim()) return;

    const colorMap = {
      Laboratory: "#7fcdff",
      Imaging: "#ffc1ea",
      Others: "#66bf9b",
    };

    const newOption = {
      label: customInvestigation,
      value: customInvestigation.toLowerCase().replace(/\s+/g, "_"),
      color: colorMap[customCategory] || "#ccc", // Fallback gray
    };

    const updatedOptions = investigationOptions.map((group) => {
      if (group.label === customCategory) {
        return {
          ...group,
          options: [...group.options, newOption],
        };
      }
      return group;
    });

    setInvestigationOptions(updatedOptions);
    setForm((prev) => ({
      ...prev,
      investigations: [...(prev.investigations || []), newOption],
    }));
    setCustomInvestigation("");
  };

  // const handleAddCustom = () => {
  //   if (customInvestigation.trim() === "") return;
  //   setForm((prev) => ({
  //     ...prev,
  //     investigations: [...(prev.investigations || []), customInvestigation],
  //   }));
  //   setCustomInvestigation("");
  // };

  const groupStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
  const groupBadgeStyles: CSSProperties = {
    backgroundColor: "#c0f9f6",
    borderRadius: "2em",
    color: "#172B4D",
    display: "inline-block",
    fontSize: 12,
    fontWeight: "normal",
    lineHeight: "1",
    minWidth: 1,
    padding: "0.16666666666667em 0.5em",
    textAlign: "center",
  };

  const formatGroupLabel = (data: any) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

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

  const commonComplaints = [
    { value: "Fever", label: "Fever" },
    { value: "Cough", label: "Cough" },
    { value: "Headache", label: "Headache" },
    { value: "Chest pain", label: "Chest pain" },
    { value: "Abdominal pain", label: "Abdominal pain" },
  ];
  const [inputValue, setInputValue] = useState("");

  // const [complaintText, setComplaintText] = useState("");
  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: false });
    }
  };
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // On stop listening, update input
  useEffect(() => {
    if (!listening && transcript) {
      setComplaintText((prev) =>
        prev ? `${prev}, ${transcript}` : transcript
      );
      resetTranscript();
    }
  }, [listening]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  const handleClinicalNoteMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  useEffect(() => {
    if (!listening && transcript) {
      setClinicalnotesText((prev) =>
        prev ? `${prev}, ${transcript}` : transcript
      );
      resetTranscript();
    }
  }, [listening]);

  const icdSuggestions = [
    "Acute Pharyngitis",
    "Fever NOS",
    "COVID-19",
    "Migraine",
    "Type 2 Diabetes",
    "Chronic Obstructive Pulmonary Disease",
    "Hypertension",
    "Gastritis",
    "UTI",
    "Asthma",
  ];

  const filteredSuggestions = diagnosisInput
    ? icdSuggestions.filter((item) =>
        item.toLowerCase().includes(diagnosisInput.toLowerCase())
      )
    : [];
  const noMatch = diagnosisInput && filteredSuggestions.length === 0;

  const handleAddDiagnosis = () => {
    if (diagnosisInput.trim()) {
      setDiagnoses([...diagnoses, diagnosisInput.trim()]);
      setDiagnosisInput("");
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (value: string) => {
    setDiagnosisInput(value);
    setShowSuggestions(false);
  };

  const handleRemoveDiagnosis = (index: number) => {
    setDiagnoses(diagnoses.filter((_, i) => i !== index));
  };

  // Optional: voice recognition
  const handleDiagnosisMicClick = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN"; // Better for Indian English
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListenings(true);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setListenings(false);
    };
    recognition.onend = () => setListenings(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setDiagnosisInput((prev) => `${prev} ${transcript}`.trim());
    };

    recognition.start();
  };

  const handleCheifComplaintChange = (selectedOptions) => {
    setForm((prev) => ({
      ...prev,
      complaints: selectedOptions,
    }));
  };

  const chiefComplaintOptions = [
    { label: "Fever", value: "fever" },
    { label: "Cough", value: "cough" },
    { label: "Headache", value: "headache" },
    { label: "Stomach Pain", value: "stomach_pain" },
    // Add more common complaints
  ];
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

  const handleTreatmentMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript(); // Start fresh each time
      SpeechRecognition.startListening({
        continuous: false,
        language: "en-IN",
      });
    }
  };

  useEffect(() => {
    if (!listening && transcript) {
      setForm((prev: any) => ({
        ...prev,
        treatment: prev.treatment
          ? prev.treatment + " " + transcript
          : transcript,
      }));
      resetTranscript();
    }
  }, [listening]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  const handleRemoveMedication = (index: number) => {
    setForm((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };
  const handleFollowUpMicClick = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setForm((prev) => ({
        ...prev,
        followUp: prev.followUp + " " + speechResult,
      }));
    };

    recognition.start();
  };

  const handleFollowUpShortcut = (code: string) => {
    const match = code.match(/^(\d+)([DWMY])$/);
    if (!match) return;

    const value = match[1];
    const unit = match[2];

    const mappedUnit = {
      D: "Days",
      W: "Weeks",
      M: "Months",
      Y: "Years",
    }[unit];

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
  const items = [
    {
      label: "Add",
      icon: "pi pi-pencil",
      command: () =>
        toast.current?.show({
          severity: "info",
          summary: "Add",
          detail: "Data Added",
        }),
    },
    {
      label: "Update",
      icon: "pi pi-refresh",
      command: () =>
        toast.current?.show({
          severity: "success",
          summary: "Update",
          detail: "Data Updated",
        }),
    },
    {
      label: "Save",
      icon: "pi pi-save",
      command: () =>
        toast.current?.show({
          severity: "success",
          summary: "Save",
          detail: "Data Save",
        }),
    },
    {
      label: "Upload",
      icon: "pi pi-upload",
      command: () => router.push("/fileupload"),
    },
    {
      label: "React Website",
      icon: "pi pi-external-link",
      command: () => (window.location.href = "https://react.dev/"),
    },
  ];

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

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Vitals saved successfully",
        life: 4000,
        // className: "custom-toast-container",
      });
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
  } = useForm({
    defaultValues: {
      bloodgroup: undefined, // ✅ don't use ""
    },
  });

  // useEffect(() => {
  //   if (patient?.patient?.bloodGroup) {
  //     setValue("bloodgroup", patient.patient.bloodGroup);
  //   }
  // }, [patient?.patient?.bloodGroup, setValue]);
  const appointmentId = patient?.AppointmentId;
  useEffect(() => {
    const fetchVitals = async () => {
      try {
        setVitalsLoading(true);
        const data = await getVitalsWithHistory(appointmentId); // pass appointmentId from props/context
        console.log("Fetched vitals data:", data);
        setVitalsHistory(data?.data?.history || []); // store history if needed
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
            bloodgroup: current.BloodGroup || "", // match backend key
            BMI: current.BMI || "",
            BMIStatus: current.BMIStatus || "",
          }));
        }
        setVitalsLoading(false);
      } catch (err) {
        console.error("Failed to fetch vitals:", err);
      }
    };

    if (appointmentId) {
      fetchVitals();
    }
  }, [appointmentId]);

  useEffect(() => {
    if (form.bloodgroup) {
      setValue("bloodgroup", form.bloodgroup); // set react-hook-form value
    }
  }, [form.bloodgroup, setValue]);

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

            <div className="w-full px-1 py-1 border border-[#22E0D4] rounded-tr-md shadow-sm sticky top-0 z-50 bg-white">
              <div className="flex items-center gap-4">
                {/* Avatar */}
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

                {/* Patient Details */}
                <div className="flex flex-col w-full text-sm text-gray-700 font-mono">
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

                        <span className="text-[12px] text-shadow-muted-foreground">
                          Allergy:
                        </span>
                        {patient?.patient?.allergies || "None"}
                      </div>
                      <div className="flex items-center col-span-1 gap-0.5">
                        <Languages className="w-4 h-4 text-[#22E0D4]" />

                        <span className="text-[12px] text-shadow-muted-foreground">
                          Language Spoken:
                        </span>
                        {patient?.patient?.language || "N/A"}
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
                        <ClipboardPlus className="w-4 h-4 text-[#22E0D4]" />

                        <span className="text-[12px] text-shadow-muted-foreground">
                          Past Medical Record:
                        </span>
                        {patient?.patient?.medicalHistory || "N/A"}
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
                  <div className="flex flex-col ">
                    <div className="flex items-center justify-items-center gap-1 text-[12px] text-muted-foreground">
                      <NotebookPen className="w-4 h-4 text-red-300" />
                      <span>Visit Reason</span>
                    </div>

                    <div className="flex flex-wrap   gap-1">
                      {patient?.reason || "N/A"}

                      {/* Optional Tag Mapping (if needed later)
  {patient?.patient?.TagPatientId?.map((tag: string, idx: number) => (
    <span
      key={idx}
      className="bg-orange-100 text-orange-600 text-[11px] px-2 py-[2px] rounded-md"
    >
      {tag}
    </span>
  ))} */}
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
                      <span className="text-sm">Fast Track Patient</span>
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
              <TabsList className="mb-2">
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
                <TabsTrigger
                  value="labTests"
                  className="relative z-10 px-4 py-2 data-[state=active]:text-[#22E0D4]"
                >
                  Lab Test Results
                </TabsTrigger>
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
                      <><ScrollArea className="w-full font-sans">
                            <div className="w-full flex justify-end pr-4 mb-2 cursor-pointer">
                              <Button
                                variant="outline"
                                className="text-sm font-medium border-gray-300 rounded-2xl cursor-pointer hover:bg-teal-100 transition-colors "
                                onClick={() => {
                                  setVitalsData(vitalsHistory); // Set vitals data
                                  setVitalsHistoryOpen(true); // Open dialog
                                } }
                              >     <History className="w-4 h-4"/>

                                Vitals History
                              </Button>
                            </div>
                            <form
                              onSubmit={handleSubmit(handleSaveVitals)}
                              className="w-full"
                            >

                              <div
                                className={fullScreen
                                  ? "w-full  flex flex-wrap justify-center gap-4 p-4"
                                  : "w-full"}
                              >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-4">
                                  <Toast ref={toast} />

                                  <VitalCardInput
                                    icon={<Droplet size={18} />}
                                    label="Blood Pressure"
                                    unit="mmHg"
                                    customField={<div className="flex items-center justify-center w-full gap-1">
                                      <input
                                        type="text"
                                        name="systolic"
                                        placeholder="SBP"
                                        value={form.systolic}
                                        onChange={handleChange}
                                        className="w-10 text-center border border-gray-300 rounded px-1 py-1 text-sm focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:outline-none transition-all" />
                                      <span className="text-gray-500 text-sm">
                                        /
                                      </span>
                                      <input
                                        type="text"
                                        name="diastolic"
                                        placeholder="DBP"
                                        value={form.diastolic}
                                        onChange={handleChange}
                                        className="w-10 text-center border border-gray-300 rounded px-1 py-1 text-sm focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:outline-none transition-all" />
                                    </div>}
                                    value={""}
                                    name={""} />
                                  <VitalCardInput
                                    icon={<Weight size={18} />}
                                    label="Weight"
                                    value={form.weight}
                                    name="weight"
                                    unit="Kg"
                                    onChange={handleChange} />
                                  <VitalCardInput
                                    icon={<Thermometer size={18} />}
                                    label="Temperature"
                                    value={form.temperature}
                                    name="temperature"
                                    unit="°F"
                                    onChange={handleChange} />
                                  <VitalCardInput
                                    icon={<HeartPulse size={18} />}
                                    label="Heart Rate"
                                    value={form.heartRate}
                                    name="heartRate"
                                    unit="bpm"
                                    onChange={handleChange} />
                                  <VitalCardInput
                                    icon={<Activity size={18} />}
                                    label="SpO2"
                                    value={form.oxygen}
                                    name="oxygen"
                                    unit="%"
                                    onChange={handleChange} />
                                  <VitalCardInput
                                    icon={<Ruler size={18} />}
                                    label="Height"
                                    value={form.height}
                                    name="height"
                                    unit="Cm"
                                    onChange={handleChange} />
                                  <VitalCardInput
                                    icon={<Ruler size={18} />}
                                    label="Blood Group"
                                    value={form.bloodgroup}
                                    name="bloodgroup"
                                    customField={<Controller
                                      control={control}
                                      name="bloodgroup"
                                      render={({ field }) => (
                                        <Select
                                          value={form.bloodgroup}
                                          onValueChange={(val) => setForm((prev) => ({
                                            ...prev,
                                            bloodgroup: val,
                                          }))}
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
                                      )} />} />

                                  <VitalCardInput
                                    icon={<Droplet size={18} />}
                                    label="BMI"
                                    value={form.BMI}
                                    name="bmi"
                                    unit="kg/m²"
                                    onChange={handleChange}
                                    description={form.BMI ? (
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
                                    ) : null} />
                                </div>

                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, ease: "easeOut" }}
                                  className="w-full flex justify-center mt-6"
                                >
                                  <Button
                                    type="submit"
                                    // onClick={handleSaveVitals}
                                    className="px-6 py-2 text-base font-semibold rounded-2xl shadow-md  hover:bg-[#22E0D4] transition-colors duration-200 bg-[#6ce9e3] text-white"
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
                          </ScrollArea><VitalsHistoryDialog
                              open={vitalsHistoryOpen}
                              onOpenChange={setVitalsHistoryOpen}
                              vitalsData={vitalsData} />
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
                      <div>
                        <Toast ref={toast} />
                        <SpeedDial
                          model={items}
                          radius={70}
                          type="semi-circle"
                          direction="left"
                          style={{
                            position: "fixed",
                            top: "50%",
                            right: "1.5rem",
                            transform: "translateY(-50%)",
                            zIndex: 1000,
                          }}
                          className="[&_.p-speeddial-button]:!bg-[#22E0D4] [&_.p-speeddial-button]:!rounded-full [&_.p-speeddial-button]:!w-14 [&_.p-speeddial-button]:!h-14 [&_.p-speeddial-button_.p-button-icon]:!text-white"
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
                          <Card className="p-4 rounded-xl shadow-sm border bg-white border-gray-300 hover:shadow-xl hover:border-blue-300">
                            <div className="flex items-center gap-2 mb-2 font-semibold text-gray-800">
                              <Stethoscope
                                size={18}
                                className="text-blue-500"
                              />
                              Chief Complaint
                            </div>
                            <CreatableSelect
                              isMulti
                              options={chiefComplaintOptions}
                              styles={customsStyles}
                              value={chiefComplaints.map((c) => ({
                                label: c,
                                value: c,
                              }))}
                              onChange={(selected) =>
                                setChiefComplaints(selected.map((s) => s.value))
                              }
                              inputValue={inputValue}
                              onInputChange={(val) => setInputValue(val)}
                              placeholder="Type or select chief complaint..."
                              classNamePrefix="react-select"
                            />
                            <div className="relative flex items-center gap-2 py-1 mt-2 ">
                              <textarea
                                value={complaintText}
                                onChange={(e) =>
                                  setComplaintText(e.target.value)
                                }
                                placeholder="Enter or speak your complaint..."
                                className="text-sm px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 pr-10"
                                name="notes"
                                rows={6}
                              />
                              <button
                                type="button"
                                onClick={handleMicClick}
                                className={`absolute right-2 bottom-4 p-2 rounded-full transition ${
                                  listening
                                    ? "bg-red-100 hover:bg-red-200"
                                    : "bg-blue-100 hover:bg-blue-200"
                                }`}
                              >
                                {listening ? (
                                  <MicOff className="w-5 h-5 text-red-600 animate-pulse" />
                                ) : (
                                  <Mic className="w-5 h-5 text-[#22E0D4]" />
                                )}
                              </button>
                            </div>
                            <p className="text-xs text-gray-500">
                              {listening
                                ? "Listening..."
                                : "Click the mic to speak"}
                            </p>
                          </Card>

                          <Card className="p-4 rounded-xl shadow-sm border bg-white hover:shadow-xl hover:border-purple-300">
                            {/* Header */}
                            <div className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
                              <StickyNote
                                size={18}
                                className="text-purple-500"
                              />
                              Clinical Notes
                            </div>

                            {/* Textarea with Mic */}
                            <div className="relative w-full">
                              <textarea
                                value={clinicalnotesText}
                                onChange={(e) =>
                                  setClinicalnotesText(e.target.value)
                                }
                                placeholder="Enter or speak your clinical notes..."
                                rows={8}
                                className="text-sm px-3 py-2 w-full rounded-md border border-gray-300 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-300"
                              />
                              <button
                                type="button"
                                onClick={handleClinicalNoteMicClick}
                                className={`absolute right-2 bottom-4 p-2 rounded-full transition ${
                                  listening
                                    ? "bg-red-100 hover:bg-red-200"
                                    : "bg-blue-100 hover:bg-blue-200"
                                }`}
                              >
                                {listening ? (
                                  <MicOff className="w-5 h-5 text-red-600 animate-pulse" />
                                ) : (
                                  <Mic className="w-5 h-5 text-[#22E0D4]" />
                                )}
                              </button>
                            </div>

                            {/* Status Message */}
                            <p className="text-xs text-gray-500 mt-1">
                              {listening
                                ? "Listening..."
                                : "Click the mic to speak"}
                            </p>
                          </Card>

                          {/* <ClinicalNotesEditor value={notes} onChange={setNotes} /> */}

                          <Card className="p-4 rounded-xl shadow-sm border bg-white w-full hover:shadow-xl hover:border-pink-300">
                            <div className="flex items-center gap-2 mb-2 font-semibold text-gray-800">
                              <Microscope size={18} className="text-pink-600" />
                              Investigations
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm block mb-1">
                                Select Investigations
                              </Label>
                              <CreatableSelect
                                isMulti
                                options={investigationOptions}
                                value={form.investigations}
                                onChange={(selectedOptions) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    investigations: selectedOptions,
                                  }))
                                }
                                placeholder="Select or search investigations..."
                                className="text-sm w-full no-underline no-scrollbar"
                                classNamePrefix="react-select"
                                styles={customStyles}
                              />
                            </div>

                            <div className="mt-3 flex items-center gap-2">
                              <CreatableSelect
                                options={investigationCategories}
                                value={investigationCategories.find(
                                  (c) => c.value === customCategory
                                )}
                                onChange={(selectedOption) =>
                                  setCustomCategory(selectedOption?.value || "")
                                }
                                classNamePrefix="react-select"
                                className="text-sm w-[220px]"
                                isSearchable={false}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                  menu: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                    position: "absolute",
                                  }),
                                  menuList: (base) => ({
                                    ...base,
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                  }),
                                }}
                              />

                              <Input
                                placeholder="Add custom investigation..."
                                value={customInvestigation}
                                onChange={(e) =>
                                  setCustomInvestigation(e.target.value)
                                }
                                className="text-sm"
                              />
                              <Button
                                type="button"
                                onClick={handleAddCustom}
                                size="icon"
                              >
                                <PlusCircle className="w-5 h-5" />
                              </Button>
                            </div>

                            <div className="mt-4">
                              <Label className="text-sm mb-1 block">
                                Notes / Remarks
                              </Label>
                              <Textarea
                                placeholder="Enter remarks, urgency or clinical justification..."
                                value={form.investigationRemarks}
                                name="investigationRemarks"
                                onChange={(e) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    investigationRemarks: e.target.value,
                                  }))
                                }
                                className="text-sm"
                              />
                            </div>
                          </Card>

                          <Card className="p-4 rounded-xl shadow-sm border bg-white relative hover:shadow-xl hover:border-green-300">
                            <div className="flex items-center gap-2 mb-3 font-semibold text-gray-800">
                              <SearchCheck
                                size={18}
                                className="text-green-600"
                              />
                              Diagnosis
                            </div>

                            <div className="relative mb-2">
                              <Input
                                placeholder="e.g. Acute Pharyngitis, ICD Code..."
                                value={diagnosisInput}
                                onChange={(e) => {
                                  setDiagnosisInput(e.target.value);
                                  setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() =>
                                  setTimeout(
                                    () => setShowSuggestions(false),
                                    150
                                  )
                                }
                                className="text-sm pr-10"
                              />

                              {/* 🎤 Mic Button */}
                              <button
                                type="button"
                                onClick={handleDiagnosisMicClick}
                                className="absolute right-2 top-2 text-gray-500 hover:text-purple-600"
                              >
                                {listenings ? (
                                  <MicOff className="w-4 h-4" />
                                ) : (
                                  <Mic className="w-4 h-4" />
                                )}
                              </button>
                              <p className="text-xs text-gray-500 mt-1 mb-2">
                                {listenings
                                  ? "Listening..."
                                  : "Click the mic to dictate"}
                              </p>

                              {showSuggestions &&
                                filteredSuggestions.length > 0 && (
                                  <ul className="absolute z-10 bg-white  border-gray-300 w-full max-h-48 overflow-y-auto rounded shadow-md mt-1 text-sm">
                                    {filteredSuggestions.map(
                                      (suggestion, index) => (
                                        <li
                                          key={index}
                                          onClick={() => {
                                            setDiagnosisInput(suggestion);
                                            setShowSuggestions(false);
                                          }}
                                          className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                        >
                                          {suggestion}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                )}
                              {noMatch && (
                                <div className="flex items-center justify-between px-3 py-2 bg-yellow-50 text-sm text-gray-700">
                                  <span>No match found.</span>
                                  <button
                                    onMouseDown={() => {
                                      // handle your create logic here
                                      alert(`Create "${diagnosisInput}"`);
                                    }}
                                    className="text-blue-600 hover:underline font-medium"
                                  >
                                    + Create
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="flex justify-end mb-2">
                              <Button
                                size="sm"
                                onClick={handleAddDiagnosis}
                                className="text-xs px-3"
                              >
                                <Plus className="w-4 h-4 mr-1" /> Add
                              </Button>
                            </div>

                            {diagnoses.length > 0 && (
                              <ul className="space-y-2">
                                {diagnoses.map((item, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center justify-between border-gray-300 bg-gray-50 p-2 rounded border text-sm"
                                  >
                                    <span>{item}</span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setDiagnoses(
                                          diagnoses.filter(
                                            (_, i) => i !== index
                                          )
                                        )
                                      }
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </Card>

                          {/* <Card className="p-4 rounded-xl shadow-sm border bg-white">
                <div className="flex items-center gap-2 mb-2 font-semibold text-gray-800">
                  <ClipboardList size={18} className="text-yellow-600" />
                  Treatment & Instructions
                </div>
                <Textarea
                  placeholder="Enter treatment plan or advice to patient..."
                  value={form.treatment}
                  name="treatment"
                  onChange={handleChange}
                  className="text-sm"
                />
              </Card> */}
                          <TreatmentInstructionsCard
                            form={form}
                            setForm={setForm}
                            handleTreatmentMicClick={handleTreatmentMicClick}
                            isListening={listening}
                          />
                          <Card className="p-4 rounded-xl shadow-sm border bg-white md:col-span-2 hover:shadow-xl hover:border-indigo-300">
                            <div className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
                              <Pill size={18} className="text-indigo-600" />
                              Prescription & Medication
                            </div>

                            {form.medications.map((med, index) => (
                              <div
                                key={index}
                                className="relative grid grid-cols-6 gap-2 mb-2 p-4 rounded-lg border border-gray-200 bg-gray-50"
                              >
                                <Input
                                  placeholder="Drug Name"
                                  value={med.drug}
                                  onChange={(e) =>
                                    handleMedicationChange(
                                      index,
                                      "drug",
                                      e.target.value
                                    )
                                  }
                                  className="col-span-1"
                                />

                                <Select
                                  value={med.dosage}
                                  onValueChange={(value) =>
                                    handleMedicationChange(
                                      index,
                                      "dosage",
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger className="col-span-1">
                                    <SelectValue placeholder="Dosage" />
                                  </SelectTrigger>
                                  <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                                    <SelectItem value="0.5">0.5</SelectItem>
                                    <SelectItem value="1">1</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="5">5</SelectItem>
                                  </SelectContent>
                                </Select>

                                <Select
                                  value={med.frequency}
                                  onValueChange={(value) =>
                                    handleMedicationChange(
                                      index,
                                      "frequency",
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger className="col-span-1">
                                    <SelectValue placeholder="Frequency" />
                                  </SelectTrigger>
                                  <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                                    <SelectItem value="Once a day">
                                      Once a day
                                    </SelectItem>
                                    <SelectItem value="Twice a day">
                                      Twice a day
                                    </SelectItem>
                                    <SelectItem value="Three times a day">
                                      Three times a day
                                    </SelectItem>
                                    <SelectItem value="0-1-0">0-1-0</SelectItem>
                                    <SelectItem value="1-0-1">1-0-1</SelectItem>
                                    <SelectItem value="1-1-1">1-1-1</SelectItem>
                                    <SelectItem value="At Night">
                                      At Night
                                    </SelectItem>
                                    <SelectItem value="SOS">SOS</SelectItem>
                                  </SelectContent>
                                </Select>

                                <div className="flex gap-2 col-span-2">
                                  <div className="!w-60">
                                    <Input
                                      type="number"
                                      placeholder="Duration"
                                      value={med.duration}
                                      onChange={(e) =>
                                        handleMedicationChange(
                                          index,
                                          "duration",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>

                                  <Select
                                    value={med.durationUnit || "Days"}
                                    onValueChange={(value) =>
                                      handleMedicationChange(
                                        index,
                                        "durationUnit",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger className="min-w-[80px]">
                                      <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                    <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                                      <SelectItem value="Days">Days</SelectItem>
                                      <SelectItem value="Weeks">
                                        Weeks
                                      </SelectItem>
                                      <SelectItem value="Months">
                                        Months
                                      </SelectItem>
                                      <SelectItem value="Years">
                                        Years
                                      </SelectItem>
                                      <SelectItem value="Life Time">
                                        Life Time
                                      </SelectItem>
                                      <SelectItem value="To Be Continued">
                                        To Be Continued
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <Input
                                  placeholder="Notes"
                                  value={med.notes}
                                  onChange={(e) =>
                                    handleMedicationChange(
                                      index,
                                      "notes",
                                      e.target.value
                                    )
                                  }
                                  className="col-span-1"
                                />

                                <button
                                  type="button"
                                  onClick={() => handleRemoveMedication(index)}
                                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}

                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleAddMedication}
                                className="border-[#22E0D4] text-gray-700 hover:bg-gray-100"
                              >
                                + Add Medication
                              </Button>
                            </div>
                          </Card>

                          <Card className="p-4 rounded-xl shadow-sm border bg-white md:col-span-2 hover:shadow-xl hover:border-red-300">
                            <div className="flex items-center gap-2 mb-2 font-semibold text-gray-800">
                              <CalendarCheck
                                size={18}
                                className="text-red-500"
                              />
                              Follow-up Plan
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Textarea with mic */}
                              <div className="relative">
                                <Textarea
                                  placeholder="e.g. Review in 7 days, next appointment date..."
                                  value={form.followUp}
                                  name="followUp"
                                  onChange={handleChange}
                                  className="text-sm pr-10"
                                />
                                <button
                                  type="button"
                                  onClick={handleFollowUpMicClick}
                                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                >
                                  <Mic size={18} />
                                </button>
                              </div>

                              {/* Duration Picker */}
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={form.followUpDuration}
                                  onChange={(e) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      followUpDuration: e.target.value,
                                    }))
                                  }
                                  className="w-1/2"
                                />

                                <Select
                                  value={form.followUpUnit}
                                  onValueChange={(val) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      followUpUnit: val,
                                    }))
                                  }
                                >
                                  <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder="Day(s)" />
                                  </SelectTrigger>
                                  <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                                    {" "}
                                    <SelectItem value="Days">Day(s)</SelectItem>
                                    <SelectItem value="Weeks">
                                      Week(s)
                                    </SelectItem>
                                    <SelectItem value="Months">
                                      Month(s)
                                    </SelectItem>
                                    <SelectItem value="Years">
                                      Year(s)
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Optional Shortcut Presets */}
                              <div className="md:col-span-2 flex flex-wrap gap-2 mt-2">
                                {[
                                  "1D",
                                  "2D",
                                  "3D",
                                  "4D",
                                  "5D",
                                  "1W",
                                  "2W",
                                  "3W",
                                  "6W",
                                  "1M",
                                  "2M",
                                  "3M",
                                  "6M",
                                  "1Y",
                                ].map((item) => (
                                  <button
                                    key={item}
                                    onClick={() => handleFollowUpShortcut(item)}
                                    className="text-xs px-3 py-1 rounded-md bg-yellow-100 hover:bg-yellow-200"
                                  >
                                    {item}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </Card>
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
                      <ScrollArea className="h-60">
                        Medications content here
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
