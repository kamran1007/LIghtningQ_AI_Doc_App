"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

import { Toast } from "primereact/toast";

import {
  Stethoscope,
  HeartPulse,
  BrainCircuit,
  Eye,
  Droplet,
  Baby,
  Bone,
  Syringe,
  FlaskConical,
  ScanLine,
  Smile,
  Ear,
  ChevronLeft,
  ChevronUp,
  ChevronRight,
  ChevronDown,
  CircleX,
  PrinterCheck,
  Mail,
  MessageCircle,
  MessageSquare,
  Loader2Icon,
} from "lucide-react";
import { useMemo, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import image from "/fast-time";
import { CalendarClock, Plus, X } from "lucide-react";
import Lottie from "lottie-react";
import successAnimation from "@/assets/success-animation.json";
import swipeRightArrows from "@/assets/SwipeRightArrows.json";
import { Player } from "@lottiefiles/react-lottie-player";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z, { boolean } from "zod";
import { useEvents } from "@/context/events-context";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { PatientSearchDrawer } from "app/appointment/patientSearchDrawer";
import { getSession } from "@/lib/session";
import { getProfile } from "@/lib/action";
import {
  BookAppointment,
  FetchDoctorRole,
  FetchDoctorSpecialization,
  getAllAppointmentType,
  getAllPaymentMode,
  getAllTagPatientType,
  UpdateAppointment,
} from "@/lib/bookappointment";
import { BACKEND_URL } from "@/lib/constants";
import dayjs from "dayjs";
import { quickAppointmentSchema } from "@/helper/quickAppointmentSchema";
import toast from "react-hot-toast";
import { Checkbox } from "./ui/checkbox";
import { format } from "date-fns";
import AppointmentBookingSkeleton from "./ui/skeletonloader/AppointmentBookingSkeleton";

const messages = [
  "Search patient by Phone No.",
  "Search patient by Name",
  "Search patient by MR No.",
];
const inputbox =
  "pl-4 pr-2 py-2 text-sm h-10 border border-gray-300 rounded-4xl  border-[#22E0D4] focus:!border-[#c0f9f6] focus:!ring-2 focus:!ring-[#c0f9f6] focus:!ring-offset-2 focus:!ring-offset-white transition-all duration-300 ease-in-out hover:shadow-md focus:shadow-2xl";
interface EventAddFormProps {
  start: Date;
  end: Date;
}

const getInitials = (firstName: string = "", lastName: string = "") => {
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
    "bg-cyan-100 text-cyan-600",
  ];
  return colors[code % colors.length];
};

const InfoColumn = ({ title, value }: { title: string; value: string }) => (
  <div className="flex items-center gap-4">
    <div className="h-12 w-px bg-[#22E0D4]" />
    <div className="flex flex-col items-center">
      <h1 className="text-sm text-gray-500 font-medium">{title}</h1>
      <p className="text-sm font-semibold text-black mt-1">{value}</p>
    </div>
  </div>
);

type EventAddForm = z.infer<typeof quickAppointmentSchema>;

export function EventAddForm({ start, end }: EventAddFormProps) {
  const { editingEvent, setEditingEvent, setEventAddOpen, eventAddOpen } =
    useEvents();

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [booked, setBooked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [displayText, setDisplayText] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [userprofiledata, setUserprofiledata] = useState<any>(null);
  const [userdata, setUserdata] = useState<any>(null);
  const [selectedSpecializationId, setSelectedSpecializationId] = useState<
    string | null
  >(null);
  const toast = useRef<Toast>(null);

  const DoctorIcons: Record<string, JSX.Element> = {
    general: <Stethoscope className="w-5 h-5 text-blue-500" />,
    cardiologist: <HeartPulse className="w-5 h-5 text-red-500" />,
    neurologist: <BrainCircuit className="w-5 h-5 text-purple-500" />,
    // dentist: <Tooth className="w-5 h-5 text-gray-500" />,
    ophthalmologist: <Eye className="w-5 h-5 text-blue-600" />,
    urologist: <Droplet className="w-5 h-5 text-blue-400" />,
    pediatrician: <Baby className="w-5 h-5 text-pink-400" />,
    orthopedicsurgeon: <Bone className="w-5 h-5 text-yellow-600" />,
    anesthesiologist: <Syringe className="w-5 h-5 text-emerald-500" />,
    pathologist: <FlaskConical className="w-5 h-5 text-indigo-500" />,
    radiologist: <ScanLine className="w-5 h-5 text-cyan-500" />,
    // dermatologist: <Smile className="w-5 h-5 text-rose-400" />,
    dermatology: <Smile className="w-5 h-5 text-blue-300" />,

    entspecialist: <Ear className="w-5 h-5 text-amber-500" />,
  };
  function calculateAge(dob: string): string {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const isBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());
    if (!isBirthdayPassed) age--;
    return `${age} Years`;
  }
  type Specialization = {
    SpecializationId: string;
    SpecializationName: string;
  };
  const [doctorSpecializationData, setDoctorSpecializationData] = useState<
    Specialization[]
  >([]);

  type PaymentType = {
    PaymentTypeId: number;
    PaymentTypeName: string;
  };
  const [paymentType, setPaymentType] = useState<PaymentType[]>([]);

  type AppointmentType = {
    AppointmentTypeId: number;
    AppointmentTypeName: string;
  };
  const [appointmentType, setAppointmentType] = useState<AppointmentType[]>([]);

  type TagPatientType = {
    TagPatientId: number;
    TagPatientName: string;
  };
  const [tagpatientType, setTagpatientType] = useState<TagPatientType[]>([]);

  const [selectedSlotDate, setSelectedSlotDate] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  type DoctorData = {
    UserId: string;
    firstName: string;
    lastName: string;
    imageUrl?: string;
    Specialization?: {
      SpecializationName: string;
      SpecializationId: number;
    };
    Experience?: string;
    DoctorCosting: [];
    DoctorTimeSlot: [];
  };
  const [doctorData, setDoctorData] = useState<DoctorData[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorData[]>([]);

  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedDoctorData, setSelectedDoctorData] = useState<any>(null);

  const [isLoadingQuickBook, setIsLoadingQuickBook] = useState(true);

  const costing = selectedDoctorData?.DoctorCosting?.[0];
  const walkInFee = costing?.walkInFee || 0;
  const discountPercent = costing?.discount || 0;
  const discountedFee = costing?.discountedFee || 0;

  useEffect(() => {
    const current = messages[msgIndex];
    if (current && charIndex < current.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + current.charAt(charIndex));
        setCharIndex((prev) => prev + 1);
      }, 70);
      return () => clearTimeout(timeout);
    } else if (current) {
      const timeout = setTimeout(() => {
        setCharIndex(0);
        setDisplayText("");
        setMsgIndex((prev) => (prev + 1) % messages.length);
      }, 1500); // wait before switching message
      return () => clearTimeout(timeout);
    }
  }, [charIndex, msgIndex]);

  useEffect(() => {
    if (!eventAddOpen) {
      setSearchQuery("");
      setValue("start", start);
      setValue("end", end);
    }
  }, [eventAddOpen]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const session = await getSession();
        const resp = await getProfile();
        setUserprofiledata(resp);

        const [
          SpecializationData,
          AllDoctorData,
          AllPaymentMode,
          AllAppointmentType,
          AllTagPatientType,
        ] = await Promise.all([
          FetchDoctorSpecialization(),
          FetchDoctorRole(),
          getAllPaymentMode(),
          getAllAppointmentType(),
          getAllTagPatientType(),
        ]);

        setIsLoadingQuickBook(true);

        setDoctorSpecializationData(
          SpecializationData?.return?.map((a: any) => ({
            id: a.SpecializationId.toString(),
            name: a.SpecializationName,
          })) || []
        );
        setIsLoadingQuickBook(false);

        setPaymentType(
          AllPaymentMode?.return?.map((a: any) => ({
            id: a.PaymentTypeId?.toString(), // ✅ Safe check
            name: a.PaymentTypeName ?? "",
          })) || []
        );
        setAppointmentType(
          AllAppointmentType?.return?.map((a: any) => ({
            id: a.AppointmentTypeId?.toString(), // ✅ Safe check
            name: a.AppointmentTypeName ?? "",
          })) || []
        );

        setTagpatientType(
          AllTagPatientType?.return?.map((a: any) => ({
            id: a.TagPatientId?.toString(), // ✅ Safe check
            name: a.TagPatientName ?? "",
          })) || []
        );

        setDoctorData(
          AllDoctorData?.return?.map((doc: any) => ({
            firstName: doc.firstName,
            lastName: doc.lastName,
            DoctorId: doc.UserId.toString(),
            DoctorName: `Dr. ${doc.firstName} ${doc.lastName}`,
            imageUrl: doc.imageUrl,
            SpecializationId: doc.SpecializationId,
            Specialization: doc.Specialization,
            Experience: doc.Experience,
            DoctorTimeSlot: doc.DoctorTimeSlot,
            DoctorCosting: doc.DoctorCosting,
            DoctorSlot: doc.DoctorSlot,
            email: doc.email,
            Appointment: doc.Appointment,
          })) || []
        );
        console.log("Doctor Type", AllDoctorData);
      } catch (error) {
        console.error("❌ Error fetching initial Doctor data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (selectedSpecializationId) {
      const filtered = doctorData.filter(
        (doc) => doc.SpecializationId.toString() === selectedSpecializationId
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors([]); // or set to all doctors if needed
    }
  }, [selectedSpecializationId, doctorData]);

  function formatToDateInput(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // for input type="date"
  }
  type AppointmentLight = {
    appointmentDate: string;
  };
  const getLastVisitDate = (appointments: AppointmentLight[]) => {
    if (!appointments?.length) return null;

    const sorted = appointments
      .filter((a) => !!a.appointmentDate)
      .sort(
        (a, b) =>
          new Date(b.appointmentDate).getTime() -
          new Date(a.appointmentDate).getTime()
      );

    return sorted[0]?.appointmentDate ?? null;
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(quickAppointmentSchema), // ✅ Add this line

    defaultValues: {
      Prefix: "",
      firstName: "",
      lastName: "",
      gender: "",
      mobile: "",
      dateOfBirth: "",
      visitTypeId: "",
      paymentTypeId: "",
      email: "",
      reason: "",
      AppointmentCharges: 0,
      isAmountPaid: true,
      sendEmailMessage: false,
      sendSmsMessage: false,
      sendWhatsappMessage: false,
    },
  });

  const watchedFields = watch([
    "firstName",
    "lastName",
    "mobile",
    "dateOfBirth",
    "gender",
    "email",
    "visitTypeId",
    "reason",
    "paymentTypeId",
    // "appointmentTime",
    // "AppointmentCharges",
  ]);

  const isFormValid = Boolean(
    watchedFields[0]?.trim() && // firstName
      watchedFields[1]?.trim() && // lastName
      watchedFields[2]?.length === 10 && // mobile
      watchedFields[3]?.trim() && // dateOfBirth
      watchedFields[4] && // gender
      watchedFields[5]?.includes("@") && // email
      watchedFields[6] != null && // visitTypeId (number)
      watchedFields[7]?.trim().length >= 5 && // reason
      watchedFields[8] != null // paymentTypeId (number)
  );

  const [lastVisitFormatted, setLastVisitFormatted] = useState("-");
  useEffect(() => {
    if (errors.appointmentTime) {
      toast.current?.show({
        severity: "error",
        summary: "Validation Error",
        detail: errors.appointmentTime.message,
        life: 4000,
        className: "custom-toast-container", // for blur
      });
    }
  }, [errors.appointmentTime]);

  useEffect(() => {
    if (selectedPatient) {
      const formattedDOB = selectedPatient.dateOfBirth
        ? formatToDateInput(selectedPatient.dateOfBirth)
        : "";

      reset({
        firstName: selectedPatient.firstName || "",
        lastName: selectedPatient.lastName || "",
        dateOfBirth: formattedDOB,
        gender: selectedPatient.gender || "",
        mobile: selectedPatient.mobile || "",
        Prefix: selectedPatient.Prefix || "",
        email: selectedPatient.email || "",
      });

      // ✅ Format Last Visit Date and set state
      const lastVisitDate = getLastVisitDate(
        selectedPatient?.Appointment || []
      );
      console.log(lastVisitDate);

      const formattedDate = lastVisitDate
        ? dayjs(lastVisitDate).format("D MMMM YYYY")
        : "-";
      setLastVisitFormatted(formattedDate);
    }
  }, [selectedPatient, reset]);

  const getFirstVisitWithinValidityWindow = (
    appointments: any[],
    doctorId: number,
    maxValidityDays: number,
    refDate: string
  ) => {
    const sorted = appointments
      .filter((a) => a.DoctorId === doctorId)
      .sort(
        (a, b) =>
          new Date(a.appointmentDate).getTime() -
          new Date(b.appointmentDate).getTime()
      );

    const ref = new Date(refDate);

    return sorted?.find((a) => {
      const visitDate = new Date(a.appointmentDate);
      const daysDiff =
        (ref.getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff >= 0 && daysDiff <= maxValidityDays;
    })?.appointmentDate;
  };

  const watchVisitTypeId = watch("visitTypeId");
  const appointmentDate = watch("appointmentDate");
  useEffect(() => {
    if (
      !selectedPatient ||
      !appointmentDate ||
      !selectedDoctorData?.DoctorCosting?.[0]
    )
      return;

    const costing = selectedDoctorData.DoctorCosting[0];
    const doctorId = selectedDoctorData.DoctorId;

    const firstVisitDate = getFirstVisitWithinValidityWindow(
      selectedPatient.Appointment || [],
      Number(doctorId),
      costing.followupValidityDays,
      appointmentDate
    );

    if (!firstVisitDate) {
      setValue("visitTypeId", "1"); // New Appointment
      return;
    }

    const freeFollowupCount = (selectedPatient.Appointment || []).filter(
      (a) =>
        a.DoctorId === Number(doctorId) &&
        new Date(a.appointmentDate) >= new Date(firstVisitDate) &&
        new Date(a.appointmentDate) <= new Date(appointmentDate) &&
        a.visitTypeId === 2
    ).length;

    if (freeFollowupCount < costing.freeFollowupCount) {
      setValue("visitTypeId", "2"); // Free Follow-up
    } else {
      setValue("visitTypeId", "3"); // Paid Follow-up
    }
  }, [selectedPatient, appointmentDate, selectedDoctorData, setValue]);

  const [totalToPay, setTotalToPay] = useState<number>(0);

  useEffect(() => {
    if (!costing || !watchVisitTypeId) return;

    const walkInFee = costing.walkInFee || 0;
    const discountedFee =
      costing.discountedFee !== undefined && costing.discountedFee > 0
        ? costing.discountedFee
        : walkInFee;

    if (watchVisitTypeId === "2") {
      const freeAllowed = costing.freeFollowupCount > 0;
      const validitySet = costing.followupValidityDays > 0;

      if (freeAllowed && validitySet) {
        setTotalToPay(0); // ✅ Free Follow-up
      } else {
        setTotalToPay(discountedFee); // 🛑 Fallback Paid if config is invalid
      }
    } else {
      setTotalToPay(discountedFee); // ✅ Paid Follow-up or New Appointment
    }
  }, [watchVisitTypeId, costing]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -250 : 250,
        behavior: "smooth",
      });
      setTimeout(updateScrollButtons, 300); // update after scroll ends
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons);
    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [filteredDoctors]);

  const onSubmit = async (form: quickAppointmentSchema) => {
    if (!selectedDoctorId || !selectedSlotDate || !selectedTime) {
      // toast.error("Select doctor, date, and time");

      return;
    }
    const isUpdate = !!editingEvent?.AppointmentId; // ✅ Determine if update

    const payload = {
      ...form,
      PatientId: selectedPatient?.PatientId || null,
      appointmentTime: selectedTime.time,
      DoctorTimeSlotId: selectedTime.slotId,
      organizationId: 1,
      DoctorId: Number(selectedDoctorId),
      visitTypeId: Number(form.visitTypeId),
      paymentTypeId: Number(form.paymentTypeId),
      TagPatientId: Number(form.TagPatientId) || 0,
      hospitalId: Number(selectedDoctorData?.HospitalId || 1),
      bloodGroup: null,
      acuity: form.acuity || "moderate",
      sendWhatsappMessage: Boolean(form.sendWhatsappMessage),
      sendSmsMessage: Boolean(form.sendSmsMessage),
      sendEmailMessage: Boolean(form.sendEmailMessage),
      AppointmentCharges: String(discountedFee), // fixed
      VisitReason: form.reason || "", // fixed
      // status: editingEvent.mode || 'SCHEDULED',
    };
    const updatePayload = {
      AppointmentId: editingEvent?.AppointmentId,
      DoctorTimeSlotId: selectedTime.slotId,
      appointmentTime: selectedTime.time,
      appointmentDate: selectedSlotDate,
      DoctorId: Number(selectedDoctorId),
      RescheduleReason: form.reason || "",
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      mobile: form.mobile,
      status: editingEvent?.mode,
      updatedBy: Number(userprofiledata?.user?.UserId) || 0,
      updatedAt: Date.now(), // ✅ fixed
      sendWhatsappMessage: Boolean(form.sendWhatsappMessage),
      sendSmsMessage: Boolean(form.sendSmsMessage),
      sendEmailMessage: Boolean(form.sendEmailMessage),
    };

    try {
      setIsLoading(true);
      const res = isUpdate
        ? await UpdateAppointment(updatePayload) // call update
        : await BookAppointment(payload); // call add
      if (res?.return?.STATUS_CODES === 200) {
        setTimeout(() => {
          setBooked(true);

          setTimeout(() => {
            reset();
            setBooked(false);
            setEventAddOpen(false);
            // clear selections if needed
          }, 2000);
        }, 800);
      }
    } catch (err: any) {
      // console.error("❌ Error:", err);
      // toast.error(err.message || "Booking failed");
      const errorMessage =
        err?.response?.data?.message || err?.message || "Booking failed";

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 4000,
        className: "custom-toast-container", // 👈 this attaches the blur effect
      });
    } finally {
      setIsLoading(false);
    }
  };

  function generateTimeSlots(
    from: string,
    to: string,
    slotId: number,
    interval: number,
    day: string,
    date: string | null
  ): { time: string; slotId: number; day: string; date: string | null }[] {
    const slots = [];

    const start = dayjs(`2000-01-01T${from}`);
    const end = dayjs(`2000-01-01T${to}`);

    let current = start;
    while (current.isBefore(end)) {
      slots.push({
        time: current.format("HH:mm"),
        slotId,
        day,
        date, // 🟢 include date here
      });
      current = current.add(interval, "minute");
    }

    return slots;
  }

  const dayMap: Record<string, string> = {
    MONDAY: "MON",
    TUESDAY: "TUE",
    WEDNESDAY: "WED",
    THURSDAY: "THU",
    FRIDAY: "FRI",
    SATURDAY: "SAT",
    SUNDAY: "SUN",
  };

  const [selectedSlotDay, setSelectedSlotDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<{
    time: string;
    slotId: number;
  } | null>(null);

  const slotContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollSlotUp, setCanScrollSlotUp] = useState(false);
  const [canScrollSlotDown, setCanScrollSlotDown] = useState(false);

  const updateSlotScrollButtons = () => {
    const el = slotContainerRef.current;
    if (!el) return;

    setCanScrollSlotUp(el.scrollTop > 0);
    setCanScrollSlotDown(el.scrollTop + el.clientHeight < el.scrollHeight);
  };

  const scrollSlot = (direction: "up" | "down") => {
    const el = slotContainerRef.current;
    if (!el) return;

    const scrollAmount = 120; // ~height of 1-2 rows depending on button padding
    el.scrollBy({
      top: direction === "down" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
    setTimeout(updateSlotScrollButtons, 300); // update after scroll
  };

  useEffect(() => {
    const el = slotContainerRef.current;
    if (!el) return;

    updateSlotScrollButtons();
    el.addEventListener("scroll", updateSlotScrollButtons);
    return () => el.removeEventListener("scroll", updateSlotScrollButtons);
  }, [selectedSlotDay, selectedDoctorData]);

  const getWeekDates = () => {
    const today = new Date();
    const result = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayLabel = date.toLocaleDateString("en-US", {
        weekday: "short",
      }); // Sun, Mon...
      const dateLabel = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      }); // 14 Jul

      const dayOfWeek = date
        .toLocaleDateString("en-US", {
          weekday: "long",
        })
        .toUpperCase(); // SUNDAY, MONDAY...

      result.push({
        index: i,
        date,
        dayLabel,
        dateLabel,
        dayOfWeek,
      });
    }

    return result;
  };

  const weekDays = getWeekDates();

  const getTimeSlotsForDay = (doctor: any, day: string) => {
    if (!doctor) return [];

    const slot = doctor.DoctorTimeSlot?.find(
      (s: any) => s.DayOfWeek === day && s.isAvailable && !s.is_SlotCancelled
    );

    const slots: { time: string; slotId: number }[] = [];

    const pushTimes = (from: string, to: string, interval: number) => {
      if (!from || !to) return;
      let start = from;
      while (start < to) {
        slots.push(start);
        const [h, m] = start.split(":").map(Number);
        const newMinutes = m + interval;
        const newH = h + Math.floor(newMinutes / 60);
        const newM = newMinutes % 60;
        start = `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
        if (start >= to) break;
      }
    };

    const consultMin = Number(slot?.consult_Time_InMin || 15);
    pushTimes(slot.Morning_From, slot.Morning_To, consultMin);
    pushTimes(slot.Evening_From, slot.Evening_To, consultMin);

    return slots;
  };
  const selectedDateStr = selectedSlotDate;

  const bookedSet = new Set(
    (selectedDoctorData?.DoctorSlot ?? [])
      .filter(
        (s: any) =>
          s.isBooked &&
          new Date(s.slotDate).toISOString().split("T")[0] === selectedDateStr
      )
      .map((s: any) => `${selectedDateStr}|${s.slotTime}`)
  );

  const appendSlots = (from: string, to: string) => {
    const generated = generateTimeSlots(
      from,
      to,
      slot.DoctorTimeSlotId,
      interval,
      selectedSlotDay,
      selectedSlotDate
    ).map((s) => ({
      ...s,
      isBooked: bookedSet.has(`${selectedDateStr}|${s.time}`),
    }));
    slots.push(...generated);
  };

  const ACUITY_OPTIONS = [
    {
      id: "HIGH",
      name: "HIGH",
      color: "bg-red-100 text-red-700 border-red-300",
    },
    {
      id: "MODERATE",
      name: "MODERATE",
      color: "bg-yellow-100 text-yellow-700 border-yellow-300",
    },
    {
      id: "LOW",
      name: "LOW",
      color: "bg-green-100 text-green-700 border-green-300",
    },
  ];
  const ACUITY_BORDER_COLORS: Record<string, string> = {
    HIGH: "border-red-100",
    MODERATE: "border-yellow-100",
    LOW: "border-green-100",
  };

  const selectedAcuity = watch("acuity");
  const inputBorderColor =
    ACUITY_BORDER_COLORS[selectedAcuity] || "border-gray-300";

  useEffect(() => {
    if (!eventAddOpen) {
      // Reset form fields
      reset({
        Title: "",
        firstName: "",
        lastName: "",
        mobilenumber: "",
        Email: "",
        DateofBirth: "",
        country: "",
        Taluka: "",
        gender: "",
      });

      // Reset editingEvent and any local state
      setTotalToPay(null);
      setSelectedPatient(null);
      setEditingEvent(null);
      setSelectedDoctorData(null);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  }, [eventAddOpen]);

  useEffect(() => {
    if (editingEvent) {
      const appointmentDate = new Date(editingEvent.appointmentDate);
      const slotDate = appointmentDate.toISOString().split("T")[0];
      const timeString = appointmentDate.toTimeString().slice(0, 5);
      const weekday = appointmentDate
        .toLocaleDateString("en-US", { weekday: "long" })
        .toUpperCase();

      // 1. Pre-fill form fields
      reset({
        Prefix: editingEvent?.patient?.Prefix || "",
        firstName: editingEvent?.patient?.firstName || "",
        lastName: editingEvent?.patient?.lastName || "",
        dateOfBirth: editingEvent?.patient?.dateOfBirth?.split("T")[0] || "",
        gender: editingEvent?.patient?.gender || "",
        mobile: editingEvent?.patient?.mobile || "",
        email: editingEvent?.patient?.email || "",
        reason: editingEvent?.reason || "",
        acuity: editingEvent?.acuity || "",
        appointmentDate: slotDate,
        appointmentTime: timeString,
        TagPatientId: editingEvent?.TagPatientId?.toString() || "",
        visitTypeId: editingEvent?.visitTypeId?.toString() || "",
        paymentTypeId: editingEvent?.paymentTypeId?.toString() || "",
      });
      const matchedSlot = editingEvent.doctor?.DoctorSlot?.find(
        (slot) => slot.appointmentId === editingEvent.AppointmentId
      );

      const slotId = matchedSlot?.DoctorSlotId ?? null;
      // 2. Set state for UI
      setUserdata(editingEvent.patient);
      setSelectedSpecializationId(
        editingEvent.doctor?.SpecializationId?.toString() ?? null
      );
      setSelectedDoctorId(editingEvent.DoctorId?.toString() ?? null);
      setSelectedDoctorData(editingEvent.doctor);
      setSelectedSlotDate(slotDate);
      setSelectedSlotDay(weekday);
      setSelectedPatient(editingEvent?.patient);

      // 3. Also set selected time slot
      setSelectedTime({
        time: timeString,
        slotId: slotId ?? null,
      });
    }
  }, [editingEvent, selectedDoctorData]);

  useEffect(() => {
    if (!editingEvent || !selectedDoctorData?.DoctorSlot) return;

    const appointmentDate = new Date(editingEvent.appointmentDate);
    const slotDate = appointmentDate.toISOString().split("T")[0];
    const timeString = appointmentDate.toTimeString().slice(0, 5);
    const weekday = appointmentDate
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    const matchedSlot = editingEvent.doctor?.DoctorSlot?.find(
      (slot) => slot.appointmentId === editingEvent.AppointmentId
    );

    const slotId = matchedSlot?.DoctorTimeSlotId ?? null;

    setSelectedSlotDate(slotDate);
    setSelectedSlotDay(weekday);
    setSelectedDate(appointmentDate); // helpful for day button highlighting
    setSelectedTime({
      time: timeString,
      slotId: slotId ?? null,
    });

    // Also update form again (if needed)
  }, [editingEvent, selectedDoctorData]);

  return (
    <>
      <Toast ref={toast} />

      <AlertDialog open={eventAddOpen} onOpenChange={setEventAddOpen}>
        {!eventAddOpen && (
          <AlertDialogTrigger asChild>
            <Button
              className="glow-button bg-white text-white text-[1rem] md:text-sm cursor-pointer border-e-black"
              onClick={() => setEventAddOpen(true)}
            >
              <CalendarClock className="w-5 h-5 text-grey-500" />
              Book Appointment
            </Button>
          </AlertDialogTrigger>
        )}

        <div className="relative">
          {booked && (
            <div
              className="fixed inset-0 z-[9999] bg-white/90 flex items-center justify-center overflow-auto"
              style={{ pointerEvents: "auto" }}
            >
              <div className="flex flex-col items-center justify-center text-center p-6 max-w-md w-full mx-auto">
                <div className="animate-floatUp mb-2">
                  <Lottie
                    animationData={successAnimation}
                    className="w-100 h-100 md:w-100 md:h-100"
                    loop={false}
                  />
                </div>
                <p className="text-2xl mt-4 font-semibold text-green-600">
                  Appointment Booked Successfully!
                </p>
              </div>
            </div>
          )}
          <AlertDialogContent className="max-w-310 h-[95vh] overflow-y-auto p-0 rounded-2xl shadow-2xl bg-white no-scrollbar">
            {/* Header with search and close */}
            {/* Header with dark background */}
            <div className="font-sans  bg-[#ffffff] text-white px-4 h-8 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-semibold text-gray-700 -mb-0.5 font-sans">
                Make Appointment
              </h2>
              <AlertDialogCancel
                className="p-0 text-red-500 hover:text-red-600 cursor-pointer  h-4 w-4 bg-white border-gray-50"
                onClick={() => setEventAddOpen(false)}
              >
                <CircleX className="!w-8 !h-6" />
              </AlertDialogCancel>
            </div>

            {/* Pull input box upward using negative margin */}
            {/* <div className="bg-[#f7f5fe] h-16 px-4 py-0 rounded-tr-xs shadow-xl"> */}

            <div className="bg-gradient-to-br from-[#c0f9f6] to-[#dbf7f6] border-2 border-[#22E0D4] h-16 px-4 flex items-center rounded-tr-xl shadow-md ">
              <div className="flex items-center">
                {/* Input Box */}

                <div className="mr-6 mt-1 w-80 rounded-2xl group border-2 border-[#22E0D4] focus:outline-none focus:ring-2 focus:ring-[#22E0D4] transition-all duration-300">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={displayText}
                    className="w-full p-2 bg-white text-black placeholder-[#FFFDF9] placeholder-opacity-70 font-medium text-center rounded-2xl focus:outline-none border-none"
                  />
                </div>

                {/* Patient Name */}
                <div className="flex items-center h-full gap-6 mt-1 font-sans">
                  {/* Patient Name */}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-px bg-[#22E0D4]" />
                    <div className="flex flex-col items-center">
                      <h1 className="text-sm text-gray-500 font-medium">
                        Patient Name
                      </h1>
                      <p className="text-sm font-semibold text-black mt-1">
                        {selectedPatient?.firstName || selectedPatient?.lastName
                          ? `${selectedPatient?.firstName || ""} ${selectedPatient?.lastName || ""}`
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {/* Mobile No */}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-px bg-[#22E0D4]" />
                    <div className="flex flex-col items-center">
                      <h1 className="text-sm text-gray-500 font-medium">
                        Mobile No
                      </h1>
                      <p className="text-sm font-semibold text-black mt-1">
                        {selectedPatient?.mobile || "-"}
                      </p>
                    </div>
                  </div>
                  {/* Medical Record */}

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-px bg-[#22E0D4]" />
                    <div className="flex flex-col items-center">
                      <h1 className="text-sm text-gray-500 font-medium">
                        MRN.
                      </h1>
                      <p className="text-sm font-semibold text-black mt-1">
                        {selectedPatient?.Patient_Medical_Record_No || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Age */}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-px bg-[#22E0D4]" />
                    <div className="flex flex-col items-center">
                      <h1 className="text-sm text-gray-500 font-medium">Age</h1>
                      <p className="text-sm font-semibold text-black mt-1">
                        {selectedPatient?.dateOfBirth
                          ? calculateAge(selectedPatient.dateOfBirth)
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    {/* ✅ Now you can use it below */}
                    <InfoColumn title="Last Visit" value={lastVisitFormatted} />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-px bg-[#22E0D4]" />
                    <div className="flex flex-col items-center">
                      {/* <h1 className="text-sm text-gray-500 font-medium">Last Visit</h1>
                  <p className="text-sm font-semibold text-black mt-1">31-March-2025</p> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 px-4 py-1 "
            >
              {isLoadingQuickBook ? (
                <AppointmentBookingSkeleton />
              ) : (
                <div className="space-y-1 bg-gradient-to-br from-[#FFFDF9] to-[#FDFAF6] border-2 border-[#fcdcdc] shadow-md rounded-2xl p-2 transition-all duration-200">
                  <div className="px-2 py-1 ">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Choose Specialist
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {doctorSpecializationData.map((specialization, idx) => {
                        const key = specialization.name
                          .toLowerCase()
                          .replace(/\s+/g, "");
                        const icon = DoctorIcons[key] || (
                          <Stethoscope className="w-5 h-5 text-gray-400" />
                        );

                        const isSelected =
                          selectedSpecializationId ===
                          specialization.id.toString();

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              setSelectedSpecializationId(specialization.id)
                            }
                            className={`flex items-center gap-2 px-4 py-2 text-sm flex-shrink-0 border rounded-3xl p-4 shadow cursor-pointer transition
          ${
            isSelected
              ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
              : "bg-white text-gray-600 border-gray-300 hover:bg-green-50"
          }
        `}
                          >
                            <span>{icon}</span> {specialization.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="px-2 py-0">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Choose doctor
                    </h3>
                    <div className="relative">
                      {/* Show buttons only if more than 2 doctors */}
                      {filteredDoctors.length > 2 && canScrollLeft && (
                        <button
                          onClick={() => scroll("left")}
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-1 hover:bg-gray-100"
                          type="button"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                      )}

                      <div
                        ref={scrollRef}
                        onScroll={updateScrollButtons}
                        className="flex gap-4 overflow-x-hidden scroll-smooth px-8"
                      >
                        {filteredDoctors.map((doc) => {
                          const imageUrl = doc.imageUrl
                            ? `${BACKEND_URL}${doc.imageUrl}`
                            : null;
                          const initials = getInitials(
                            doc.firstName,
                            doc.lastName
                          );
                          const colorClass = getColorByInitials(initials);
                          const isSelected = selectedDoctorId === doc.DoctorId;

                          return (
                            <div
                              key={doc.DoctorId}
                              onClick={() => {
                                setSelectedDoctorId(doc.DoctorId);
                                setSelectedDoctorData(doc);
                              }}
                              className={`w-40 flex-shrink-0 border rounded-xl p-4 shadow cursor-pointer transition ${
                                isSelected
                                  ? "bg-green-100 border-green-300 hover:bg-green-200"
                                  : "bg-white border-gray-300 hover:shadow-2xl"
                              }`}
                            >
                              <Avatar className="h-10 w-10 rounded-full">
                                {imageUrl ? (
                                  <AvatarImage
                                    src={imageUrl}
                                    alt={doc.DoctorName}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div
                                    className={`h-10 w-10 flex items-center justify-center rounded-full text-sm font-semibold ${colorClass}`}
                                  >
                                    {initials}
                                  </div>
                                )}
                              </Avatar>
                              <h4 className="text-md font-semibold">
                                {doc.DoctorName}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {doc.Specialization?.SpecializationName || "—"}
                              </p>
                              {doc.Experience && (
                                <p className="text-blue-600 text-sm mt-1">
                                  {doc.Experience} Years Exp.
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {filteredDoctors.length > 2 && canScrollRight && (
                        <button
                          onClick={() => scroll("right")}
                          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-1 hover:bg-gray-100"
                          type="button"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="px-2 py-0">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Choose date and time
                    </h3>

                    <TooltipProvider>
                      <div className="grid grid-cols-7 gap-2 text-center text-sm border-gray-300">
                        {weekDays.map((day, idx) => {
                          const slot = selectedDoctorData?.DoctorTimeSlot?.find(
                            (s: any) => s.DayOfWeek === day.dayOfWeek
                          );

                          const isSelected = selectedSlotDay === day.dayOfWeek;

                          const hasValidSlot =
                            slot &&
                            (slot.Morning_From ||
                              slot.Morning_To ||
                              slot.Evening_From ||
                              slot.Evening_To);

                          let bgColor = "bg-white";
                          let textColor = "text-gray-800";

                          if (isSelected) {
                            bgColor = "bg-green-100";
                            textColor = "text-green-800";
                          } else if (slot?.is_SlotCancelled) {
                            bgColor = "bg-red-100";
                            textColor = "text-red-700";
                          } else if (slot?.is_DND) {
                            bgColor = "bg-yellow-100";
                            textColor = "text-yellow-700";
                          }

                          const status = slot?.is_SlotCancelled
                            ? "Cancelled"
                            : slot?.is_DND
                              ? "Do Not Disturb (DND)"
                              : hasValidSlot
                                ? "Available"
                                : "No Slots";

                          const baseClass = `rounded-lg p-2 transition ${bgColor} ${textColor} ${
                            hasValidSlot
                              ? "cursor-pointer hover:bg-green-200"
                              : "opacity-50 cursor-not-allowed"
                          }`;
                          function getLocalDateStr(date: Date): string {
                            const yyyy = date.getFullYear();
                            const mm = String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const dd = String(date.getDate()).padStart(2, "0");
                            return `${yyyy}-${mm}-${dd}`;
                          }

                          return (
                            <Tooltip key={idx}>
                              <TooltipTrigger asChild>
                                <div
                                  onClick={() => {
                                    if (!hasValidSlot) return;

                                    const dateObj = day.date;

                                    const isoDate = dateObj
                                      ? getLocalDateStr(dateObj)
                                      : null; // ✅ FIXED

                                    setSelectedSlotDay(day.dayOfWeek);
                                    setSelectedSlotDate(isoDate ?? null); // ✅ FIXED
                                    setSelectedDate(dateObj ?? null);
                                    setValue("appointmentDate", isoDate ?? ""); // ✅ FIXED
                                  }}
                                  className={baseClass}
                                >
                                  <p className="text-xs font-medium mb-1">
                                    {day.dateLabel}
                                  </p>
                                  <p className="font-medium">{day.dayLabel}</p>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="text-xs font-medium capitalize">
                                {status}
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </TooltipProvider>

                    <div className="flex gap-1 flex-wrap mt-2 border-gray-300">
                      {selectedDoctorData &&
                        selectedSlotDay &&
                        (() => {
                          const slot = selectedDoctorData.DoctorTimeSlot?.find(
                            (s: any) => s.DayOfWeek === selectedSlotDay
                          );
                          if (!slot || slot.is_SlotCancelled) return null;

                          const interval =
                            Number(slot.consult_Time_InMin) || 15;
                          const slots: {
                            time: string;
                            slotId: number;
                            isBooked?: boolean;
                          }[] = [];

                          function getLocalDateString(date: Date) {
                            const yyyy = date.getFullYear();
                            const mm = String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const dd = String(date.getDate()).padStart(2, "0");
                            return `${yyyy}-${mm}-${dd}`;
                          }

                          function normalizeTime(time: string) {
                            const [hh, mm] = time.split(":");
                            return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
                          }

                          const selectedDateStr = selectedSlotDate
                            ? getLocalDateString(new Date(selectedSlotDate))
                            : "";

                          // ✅ Enhanced logging
                          // console.log("📅 selectedSlotDate:", selectedSlotDate);
                          // console.log("🧾 selectedDateStr:", selectedDateStr);

                          // ✅ Fix bookedSet: compare normalized dates and log
                          const bookedSet = new Set(
                            (selectedDoctorData?.DoctorSlot ?? []).flatMap(
                              (s) => {
                                const slotDateStr = getLocalDateString(
                                  new Date(s.slotDate)
                                );

                                const slotTimeStr =
                                  typeof s.slotTime === "string"
                                    ? s.slotTime.padStart(5, "0")
                                    : "";

                                const key = `${slotDateStr}|${slotTimeStr}`;

                                if (
                                  s.isBooked &&
                                  slotDateStr === selectedDateStr
                                ) {
                                  return [key];
                                }
                                return [];
                              }
                            )
                          );
                          // console.log("✅ Final bookedSet keys:", [...bookedSet]);

                          // ✅ Generate slots for morning/evening
                          const appendSlots = (from: string, to: string) => {
                            const generated = generateTimeSlots(
                              from,
                              to,
                              slot.DoctorTimeSlotId,
                              interval,
                              selectedSlotDay,
                              selectedSlotDate
                            ).map((s) => {
                              const key = `${selectedDateStr}|${s.time.padStart(5, "0")}`;
                              return {
                                ...s,
                                isBooked: bookedSet.has(key),
                              };
                            });
                            slots.push(...generated);
                          };

                          if (slot.Morning_From && slot.Morning_To) {
                            appendSlots(slot.Morning_From, slot.Morning_To);
                          }
                          if (slot.Evening_From && slot.Evening_To) {
                            appendSlots(slot.Evening_From, slot.Evening_To);
                          }

                          return (
                            <div className="relative">
                              {canScrollSlotUp && (
                                <button
                                  onClick={() => scrollSlot("up")}
                                  className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white shadow-md rounded-full p-1 hover:bg-gray-100 z-10 cursor-pointer"
                                  type="button"
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </button>
                              )}

                              <div
                                ref={slotContainerRef}
                                className="max-h-[9.5rem] overflow-y-auto grid grid-cols-5 gap-2 px-1 py-2 scroll-smooth"
                                style={{ scrollbarWidth: "none" }}
                              >
                                {slots.map((timeObj, idx) => {
                                  const isSelected =
                                    selectedTime?.time === timeObj.time &&
                                    selectedTime?.slotId === timeObj.slotId;

                                  return (
                                    <Tooltip key={idx}>
                                      <TooltipTrigger asChild>
                                        <button
                                          disabled={timeObj.isBooked}
                                          onClick={() => {
                                            if (timeObj.isBooked) return;
                                            setSelectedTime(timeObj);
                                            setValue(
                                              "appointmentTime",
                                              timeObj.time
                                            );
                                          }}
                                          className={`px-4 py-2 border rounded-full text-sm transition ${
                                            timeObj.isBooked
                                              ? "bg-blue-100 text-blue-600 cursor-not-allowed border-blue-300"
                                              : isSelected
                                                ? "bg-green-100 text-green-700 border-green-300"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
                                          }`}
                                          type="button"
                                        >
                                          {timeObj.time}
                                        </button>
                                      </TooltipTrigger>
                                      {timeObj.isBooked && (
                                        <TooltipContent className="text-xs font-medium capitalize">
                                          Booked
                                        </TooltipContent>
                                      )}
                                    </Tooltip>
                                  );
                                })}
                              </div>

                              {canScrollSlotDown && (
                                <button
                                  onClick={() => scrollSlot("down")}
                                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-md rounded-full p-1 hover:bg-gray-100 z-10 cursor-pointer"
                                  type="button"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          );
                        })()}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 bg-white border-2 border-[#84fcf4] rounded-2xl shadow-md p-2 w-full max-w-md mx-auto text-gray-700">
                {/* Row 1: Title + First Name */}
                <div className="flex gap-2">
                  {/* Title */}
                  <div className="w-1/2">
                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Title
                    </Label>
                    <Controller
                      control={control}
                      name="Prefix"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className={inputbox}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none">
                            <SelectItem value="Mr">Mr</SelectItem>
                            <SelectItem value="Mrs">Mrs</SelectItem>
                            <SelectItem value="Miss">Miss</SelectItem>
                            <SelectItem value="Ms">Ms</SelectItem>
                            <SelectItem value="Prof">Prof</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.Prefix && (
                      <p className="text-sm text-red-500">
                        {errors.Prefix.message}
                      </p>
                    )}
                  </div>

                  {/* First Name */}
                  <div className="w-1/2">
                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("firstName")}
                      placeholder="John"
                      className={inputbox}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Last Name + DOB */}
                <div className="flex gap-4">
                  {/* Last Name - 50% */}
                  <div className="w-1/2">
                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("lastName")}
                      placeholder="Doe"
                      className={inputbox}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  {/* Date of Birth - 50% */}
                  <div className="w-1/2">
                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("dateOfBirth")}
                      type="date"
                      className={inputbox}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-red-500">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 3: Gender + Mobile */}
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="gender"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className={inputbox}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.gender && (
                      <p className="text-sm text-red-500">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Mobile Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("mobile")}
                      placeholder="9988776655"
                      maxLength={10}
                      className={inputbox}
                    />
                    {errors.mobile && (
                      <p className="text-sm text-red-500">
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 4: Address */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("email")}
                    placeholder="Enter Address"
                    className={inputbox}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    visit Reason <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("reason")}
                    placeholder="Enter visit Reason"
                    className={inputbox}
                  />
                  {errors.reason && (
                    <p className="text-sm text-red-500">
                      {errors.reason.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Tag Patient <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="TagPatientId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className={inputbox}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                            {" "}
                            {tagpatientType.map((item) => (
                              <SelectItem
                                key={item.id}
                                value={item.id.toString()}
                              >
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />

                    {errors.TagPatientId && (
                      <p className="text-sm text-red-500">
                        {errors.TagPatientId.message}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                      Acuity <span className="text-red-500">*</span>
                    </Label>

                    <Controller
                      name="acuity"
                      control={control}
                      render={({ field }) => (
                        <div className="flex gap-2">
                          {ACUITY_OPTIONS.map((option) => {
                            const isSelected = field.value === option.id;

                            // Extract border color for unselected state
                            const unselectedBorder = option.color
                              .split(" ")
                              .find((cls) => cls.startsWith("border-"));

                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => field.onChange(option.id)}
                                className={`
              px-4 py-2 rounded-full text-sm transition shadow-md
              ${
                isSelected
                  ? `${option.color} border`
                  : `bg-white text-gray-700 ${unselectedBorder} border hover:bg-gray-100`
              }
            `}
                              >
                                {option.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    />

                    {errors.acuity && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.acuity.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 5: Visit Type + Payment Mode */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Visit Type <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="visitTypeId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className={inputbox}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                            {" "}
                            {appointmentType.map((item) => (
                              <SelectItem
                                key={item.id}
                                value={item.id.toString()}
                              >
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />

                    {errors.visitTypeId && (
                      <p className="text-sm text-red-500">
                        {errors.visitTypeId.message}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Payment Mode <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="paymentTypeId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className={inputbox}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                            {paymentType.map((item) => (
                              <SelectItem
                                key={item.id}
                                value={item.id.toString()}
                              >
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.paymentTypeId && (
                      <p className="text-sm text-red-500">
                        {errors.paymentTypeId.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                {/* <pre className="text-xs text-red-500">
                {JSON.stringify(errors, null, 2)}
              </pre> */}
              </div>

              <div className="space-y-4 bg-white border-2  border-blue-200 rounded-2xl shadow-md p-4 w-full max-w-md mx-auto text-gray-700">
                <h3 className="text-xl font-semibold text-center text-blue-400 font-sans">
                  Appointment Summary
                </h3>

                {/* Doctor Details */}
                <div className="flex items-center justify-between border-b border-blue-300 pb-2 font-sans">
                  <div>
                    <p className="text-sm font-medium">Doctor</p>
                    <p className="text-base font-semibold text-blue-600">
                      {selectedDoctorData?.firstName
                        ? `${selectedDoctorData.firstName} ${selectedDoctorData.lastName ?? ""}`
                        : "—"}
                    </p>

                    <p className="text-sm text-gray-600">
                      {selectedDoctorData?.Specialization?.SpecializationName ||
                        "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Date & Time</p>
                    <p className="text-base font-semibold text-blue-900">
                      {format(selectedDate || new Date(), "PPP")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedTime?.time || "—"}
                    </p>
                  </div>
                </div>

                <Controller
                  name="fastTrackPatient"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <label
                      htmlFor="fastTrackPatient"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id="fastTrackPatient"
                        {...field}
                        checked={field.value}
                        className="h-4 w-4 accent-green-600 border-gray-300 rounded focus:ring-green-300"
                      />
                      <span className="flex items-center gap-1 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Image
                            src="/fast-time.png"
                            alt="Fast Track"
                            width={20} // or 40 for slightly larger
                            height={20}
                            className="object-contain"
                            priority={false}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Fast Track
                          </span>
                        </div>
                      </span>
                    </label>
                  )}
                />

                {/* Payment Details */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Appointment Fee</p>
                    <p className="text-base font-semibold text-gray-900">
                      {/* ₹{walkInFee} */}₹
                      {editingEvent?.AppointmentId
                        ? editingEvent?.doctor?.DoctorCosting[0]?.walkInFee
                        : walkInFee}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Discount (
                      {(editingEvent?.AppointmentId
                        ? editingEvent?.doctor?.DoctorCosting[0]?.discount
                        : discountPercent) ?? 0}
                      %)
                    </p>
                    <p className="text-base font-semibold text-green-700">
                      -₹
                      {(
                        (walkInFee *
                          ((editingEvent?.AppointmentId
                            ? editingEvent?.doctor?.DoctorCosting[0]?.discount
                            : discountPercent) ?? 0)) /
                        100
                      ).toFixed(0)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-2 border-blue-300">
                  <p className="text-sm font-semibold text-gray-800">
                    Total to Pay
                  </p>
                  <p className="text-lg font-bold text-blue-900">
                    ₹
                    {editingEvent?.AppointmentId
                      ? Math.round(
                          (editingEvent?.doctor?.DoctorCosting[0]?.walkInFee ||
                            0) -
                            ((editingEvent?.doctor?.DoctorCosting[0]
                              ?.walkInFee || 0) *
                              (editingEvent?.doctor?.DoctorCosting[0]
                                ?.discount || 0)) /
                              100
                        )
                      : totalToPay}
                  </p>
                </div>
                {/* Notifications */}
                <div className="space-y-2 text-gray-800">
                  <p className="text-sm font-medium mb-1">
                    Send Notification To:
                  </p>
                  <Controller
                    name="sendSmsMessage"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <label
                        htmlFor="sendSmsMessage"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          id="sendSmsMessage"
                          {...field}
                          checked={field.value}
                          className="h-4 w-4 accent-green-600 border-gray-300 rounded focus:ring-green-300"
                        />
                        <span className="flex items-center gap-1 text-sm font-medium">
                          <MessageSquare className="w-4 h-4" />
                          SMS
                        </span>
                      </label>
                    )}
                  />
                  <Controller
                    name="sendWhatsappMessage"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <label
                        htmlFor="sendWhatsappMessage"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          id="sendWhatsappMessage"
                          {...field}
                          checked={field.value}
                          className="h-4 w-4 accent-green-600 border-gray-300 rounded focus:ring-green-300"
                        />
                        <span className="flex items-center gap-1 text-sm font-medium">
                          <i className="pi pi-whatsapp w-4 h-4" />
                          whatsapp
                        </span>
                      </label>
                    )}
                  />

                  <Controller
                    name="sendEmailMessage"
                    control={control}
                    defaultValue={true}
                    render={({ field }) => (
                      <label
                        htmlFor="sendEmailMessage"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          id="sendEmailMessage"
                          {...field}
                          checked={field.value}
                          className="h-4 w-4 accent-green-600 border-gray-300 rounded focus:ring-green-300"
                        />
                        <span className="flex items-center gap-1 text-sm font-medium">
                          <i className="pi pi-envelope w-4 h-4" />
                          Email
                        </span>
                      </label>
                    )}
                  />
                </div>
                <div className="border-t border-blue-200 pt-3">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    print Summary
                  </p>

                  <div className="space-y-2">
                    {[
                      {
                        id: "print",
                        label: "Print",
                        icon: <PrinterCheck className="w-4 h-4" />,
                        color: "text-gray-700",
                      },
                    ].map((item) => (
                      <label
                        key={item.id}
                        htmlFor={item.id}
                        className="flex items-center gap-2 cursor-pointer "
                      >
                        <input
                          type="checkbox"
                          id={item.id}
                          className="h-4 w-4 accent-green-600 border-gray-300 rounded focus:ring-green-300"
                          defaultChecked
                        />
                        <span className="flex items-center gap-1 text-sm font-medium">
                          <span className={item.color}>{item.icon}</span>
                          <span className={item.color}>{item.label}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full text-black font-semibold rounded-full py-3 text-lg transition font-sans flex items-center justify-center gap-2 shadow-lg ${
                      isFormValid
                        ? "bg-lime-400 hover:bg-lime-500 cursor-pointer"
                        : "bg-lime-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isFormValid ? (
                      <Player
                        autoplay
                        loop
                        src={swipeRightArrows}
                        speed={1.5}
                        style={{
                          height: "50px",
                          width: "50px",
                          marginTop: "2px",
                        }}
                      />
                    ) : (
                      <span className="w-[50px]" />
                    )}

                    {isSubmitting ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      "Book Appointment"
                    )}

                    {isFormValid ? (
                      <Player
                        autoplay
                        loop
                        src={swipeRightArrows}
                        speed={1.5}
                        style={{
                          height: "50px",
                          width: "50px",
                          marginTop: "2px",
                        }}
                      />
                    ) : (
                      <span className="w-[50px]" />
                    )}
                  </Button>
                </div>
              </div>

              {/* ✅ Success Animation */}
            </form>

            <PatientSearchDrawer
              query={searchQuery}
              onSelect={(patient) => {
                setSelectedPatient(patient);
                setSearchQuery(""); // reset input
                console.log("✅ Selected Patient", patient);
              }}
              onQuickAppointment={() => {
                console.log("⚡ Quick appointment triggered");
              }}
              onRegisterNew={() => {
                console.log("🚀 Redirecting to register screen");
              }}
            />
          </AlertDialogContent>
        </div>
      </AlertDialog>
    </>
  );
}
