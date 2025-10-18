"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatLocalDate } from "@/utils/dateUtils";

// Charts: install recharts (npm i recharts) or replace with your chart lib of choice
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import DashboardPage from "./Advancereporting";
import PatientDemographics from "./PatientDemographics";
import {
  FetchDashboardsummary,
  FetchHospital,
  FetchPatientDemographics,
} from "@/lib/dashboard";
import {
  FlaskConical,
  FunnelPlus,
  Hospital,
  Stethoscope,
  X,
} from "lucide-react";
import { getOrganizationByUser, getUserSpecialization } from "@/lib/admin";
import { DateRangePicker } from "react-date-range";
import { FetchDoctorRole } from "@/lib/bookappointment";
import toast from "react-hot-toast";
import CombinedSkeleton from "@/components/ui/skeletonloader/DashboardSkeleton";
import { DateRange } from "react-date-range";

/*
  AIHealthDashboard.tsx

  A single-file, production-ready React component (client) for a modern, interactive
  healthtech dashboard. Features:
  - Top KPI cards (clickable)
  - Interactive charts (line, bar, pie) using recharts
  - Click a card to open a modal 'report' with drilldown
  - Filter + drilldown interactions (card click filters charts)
  - Accessible, responsive layout using TailwindCSS

  Required installs:
    npm i recharts framer-motion
    (If using shadcn or radix dialog for production replace the modal with Radix)

  Integration (Next.js App Router):
  - Keep your server-side data fetching in the page (async) and pass props into this
    client component. Example: <Dashboard initialData={data} profile={profile} />
  - This file is a client component ("use client") so any server fetch must come from
    props or client-side fetches.
*/

// ----- Mock data (replace with real API data) -----
const kpiMock = [
  {
    id: "appointments",
    title: "Today's Appointments",
    value: 32,
    subtitle: "Booked 12 · Cancelled 5 · Completed 15",
  },
  {
    id: "revenue",
    title: "Monthly Revenue",
    value: "$26,500",
    subtitle: "+10.5% vs last month",
  },
  {
    id: "completion",
    title: "Avg Consultation Completion",
    value: "84%",
    subtitle: "Trend: +3%",
  },
  {
    id: "satisfaction",
    title: "Patient Satisfaction",
    value: "92%",
    subtitle: "AI Sentiment",
  },
];

const colors = ["#2563eb", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];
interface RevenueBreakdownItem {
  paymentTypePaymentTypeId: 1 | 2 | 3; // restrict to known values
  _sum?: {
    AppointmentChargesPaid?: number;
  };
}
interface AppointmentTrend {
  date: string; // ISO date string from backend
  count: number; // number of appointments
}

// Summary card type
interface SummaryCard {
  id: string;
  title: string;
  value: number | string;
  subtitle?: string;
}

// Top specialization type
interface TopSpecialization {
  name: string;
  count: number;
}

interface DoctorPerformance {
  name: string;
  avgMin: number;
  completed: number;
}
interface Specialization {
  SpecializationId: number;
  SpecializationName: string;
}
interface Hospital {
  HospitalId: number;
  HospitalName: string;
}
interface Doctor {
  UserId: number;
  firstName: string;
  lastName: string;
}
// ----- Dashboard component -----
export default function Dashboard({
  initialFilter = null,
}: {
  initialFilter?: string | null;
}) {
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(initialFilter);
  const [modalOpen, setModalOpen] = useState(false);
  const [summaryCards, setSummaryCards] = useState<SummaryCard[]>([]);
  const [topSpecializations, setTopSpecializations] = useState<
    TopSpecialization[]
  >([]);
  const [revenueBreakdown, setRevenueBreakdown] = useState<
    RevenueBreakdownItem[]
  >([]);
  const [appointmentTrends, setAppointmentTrends] = useState<
    AppointmentTrend[]
  >([]);

  const [topDoctor, setTopDoctor] = useState<DoctorPerformance[]>([]);

  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [patientData, setPatientData] = useState({
    male: 0,
    female: 0,
    other: 0,
    fastTrack: 0,
    highAcuity: 0,
    newPatients: 0,
    newAppointments: 0,
  });
  // dropdown values

  // derived filtered data example
  const lineData = useMemo(() => {
    return appointmentTrends.map((item) => ({
      day: new Date(item.date).toLocaleDateString("en-GB"), // "dd/MM/yyyy"
      appointments: item.count,
    }));
  }, [appointmentTrends]);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [hospitalData, setHospitalData] = useState<Hospital[]>([]);

  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>("");
  const [selectedHospital, setSelectedHospital] = useState<string>("");

  const filteredLineData = useMemo(() => {
    if (!filter) return lineData;
    if (filter === "low") {
      return lineData.map((d) => ({
        ...d,
        appointments: Math.round(d.appointments * 0.7),
      }));
    }
    return lineData.map((d) => ({
      ...d,
      appointments: Math.round(d.appointments * 1.1),
    }));
  }, [filter, lineData]);

  const paymentTypeMap = {
    1: { name: "Cash", color: "#a78bfa" },
    2: { name: "Online", color: "#34d399" },
    3: { name: "Card", color: "#60a5fa" },
  };

  const pieData = useMemo(() => {
    const total = revenueBreakdown.reduce(
      (sum, item) => sum + (item._sum?.AppointmentChargesPaid || 0),
      0
    );

    return revenueBreakdown.map((item) => {
      const typeInfo = paymentTypeMap[item.paymentTypePaymentTypeId];
      const value = item._sum?.AppointmentChargesPaid || 0;
      const percentage = total ? ((value / total) * 100).toFixed(0) : 0;

      return {
        name: typeInfo.name,
        value: Number(percentage),
        color: typeInfo.color,
      };
    });
  }, [revenueBreakdown]);

  const doctorId =
    selectedDoctor && selectedDoctor !== "all-doctors"
      ? Number(selectedDoctor)
      : undefined;

  const specializationId =
    selectedSpecialization && selectedSpecialization !== "all-specializations"
      ? Number(selectedSpecialization)
      : undefined;

  const hospitalId =
    selectedHospital && selectedHospital !== "all-hospitals"
      ? Number(selectedHospital)
      : undefined;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const startDate = dateRange[0]?.startDate
          ? dateRange[0].startDate.toISOString().split("T")[0]
          : undefined;

        const endDate = dateRange[0]?.endDate
          ? dateRange[0].endDate.toISOString().split("T")[0]
          : undefined;
        const data = await FetchDashboardsummary(
          startDate,
          endDate,
          doctorId,
          hospitalId,
          specializationId
        );

        setSummaryCards(data.summaryCards || []);
        setAppointmentTrends(data.appointmentTrends || []);
        setTopSpecializations(data.topSpecializations || []);
        setRevenueBreakdown(data.revenueBreakdown || []);
        setTopDoctor(data.DoctorPerformance || []);
      } catch (err) {
        console.error("Error fetching dashboard summary", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const startDate = dateRange[0]?.startDate
        ? formatLocalDate(dateRange[0].startDate)
        : undefined;

      const endDate = dateRange[0]?.endDate
        ? formatLocalDate(dateRange[0].endDate)
        : undefined;

      const data = await FetchDashboardsummary(
        startDate,
        endDate,
        doctorId,
        hospitalId,
        specializationId
      );
      console.log("API response for DashboardSummary:", data);
      setSummaryCards(data.summaryCards || []);
      setAppointmentTrends(data.appointmentTrends || []);
      setTopSpecializations(data.topSpecializations || []);
      setRevenueBreakdown(data.revenueBreakdown || []);
      setTopDoctor(data.DoctorPerformance || []);
    } catch (err) {
      console.error("Error fetching dashboard summary", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  function handleCardClick(kpiId: string) {
    setSelectedKpi(kpiId);
    setModalOpen(true);
  }
  const [dateRange, setDateRange] = useState<DateRange[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  console.log("Selected date range:", dateRange);
  const {
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        const [specRes, docRes, hosRes] = await Promise.all([
          getUserSpecialization(),
          FetchDoctorRole(),
          FetchHospital(),
        ]);

        setSpecializations(specRes?.return?.data ?? []);
        setDoctors(docRes?.return ?? []);
        setHospitalData(hosRes ?? []);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to fetch initial data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);
  const fetchDashboardDemographyData = async () => {
    try {
      const startDate = dateRange[0]?.startDate
        ? formatLocalDate(dateRange[0].startDate)
        : undefined;

      const endDate = dateRange[0]?.endDate
        ? formatLocalDate(dateRange[0].endDate)
        : undefined;

      const res = await FetchPatientDemographics(
        startDate,
        endDate,
        doctorId,
        hospitalId,
        specializationId
      );
      console.log("API response:", res);

      setPatientData({
        male: res.genderStats.find((g: any) => g.label === "Male")?.value || 0,
        female:
          res.genderStats.find((g: any) => g.label === "Female")?.value || 0,
        other:
          res.genderStats.find(
            (g: any) => g.label !== "Male" && g.label !== "Female"
          )?.value || 0,
        fastTrack: res.summary.fastTrack || 0,
        highAcuity: res.summary.highAcuity || 0,
        newPatients: res.summary.newPatients || 0,
        newAppointments: res.summary.newAppointments || 0,
      });
      // console.log("Patient data:", res);
      console.log("Processed patient data:", patientData);
      setLoading(true);
    } catch (err) {
      console.error("Error fetching dashboard summary", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardDemographyData();
  }, []);

  // useEffect(() => {
  //   const fetchHospitals = async () => {
  //     try {
  //       const response = await getOrganizationByUser();
  //       const data = response?.return?.data?.[0];

  //       console.log("API response:", response);
  //       console.log("Setting hospital data:", data);

  //       setHospitalData(data);
  //     } catch (error) {
  //       console.error("Failed to fetch hospitals:", error);
  //     }
  //   };

  //   fetchHospitals();
  // }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <>
        {loading ? (
          <CombinedSkeleton />
        ) : (
          <div className="max-w-7xl mx-auto">
            <header className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-800">
                  Dashboard
                </h2>
                {/* <p className="text-sm text-slate-500">Dashboard / Reports</p> */}
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col text-right">
                  {/* <span className="text-sm font-medium">Welcome back</span>
              <span className="text-xs text-slate-500">Kamran</span> */}
                </div>
                <FunnelPlus
                  className="w-6 h-6 text-teal-300 cursor-pointer"
                  onClick={() => setIsDialogOpen(true)}
                />
              </div>
            </header>

            {/* KPI Row */}

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {summaryCards.map((k) => (
                <motion.button
                  key={k?.id}
                  onClick={() => handleCardClick(k?.id)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="
  bg-white 
  rounded-2xl 
  p-5 
  border 
  border-transparent
  shadow-sm 
  hover:shadow-lg 
  hover:border-[#22E0D4]
  transition-all 
  duration-300 
  ease-in-out
  text-left 
  w-full
"
                  aria-label={`Open report for ${k.title}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-slate-600">
                        {k.title}
                      </h3>
                      <div className="mt-2 text-2xl font-bold text-slate-900">
                        {k.value}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {k.subtitle}
                      </div>
                    </div>
                    <div className="w-20 h-12 flex items-center justify-center opacity-60">
                      {/* small sparkline using SVG */}
                      <svg
                        width="60"
                        height="36"
                        viewBox="0 0 60 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 28 L12 20 L22 22 L32 12 L42 14 L52 8 L58 6"
                          stroke="#22E0D4"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.button>
              ))}
            </section>

            {/* Controls + charts */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white border-gray-300 rounded-2xl p-4 shadow-sm border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-medium">Appointment Trends</h4>

                  <div className="flex items-center gap-2">
                    <Controller
                      control={control}
                      name="Title"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                            {" "}
                            <SelectItem value="low">Lower Volume</SelectItem>
                            <SelectItem value="high">Higher Volume</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />

                    <button
                      onClick={() => {
                        // quick export hook example
                        const csv = filteredLineData
                          .map((d) => `${d.day},${d.appointments}`)
                          .join("\n");
                        const blob = new Blob(["day,appointments\n" + csv], {
                          type: "text/csv",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "appointments.csv";
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="text-sm px-3 py-1 border rounded border-gray-300"
                    >
                      Export
                    </button>
                  </div>
                </div>

                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredLineData}>
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="appointments"
                        stroke="#22E0D4"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3 border shadow-sm border-gray-300">
                    <h5 className="text-sm font-medium text-slate-700">
                      Top Specializations
                    </h5>
                    <div className="mt-3 space-y-3">
                      {topSpecializations.map((s, i) => (
                        <div key={s.name} className="flex items-center gap-3">
                          <div
                            className="w-2.5 h-8 rounded-full"
                            style={{ background: colors[i % colors.length] }}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between text-sm">
                              <span>{s.name}</span>
                              <span className="font-medium">{s.count}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded mt-2 overflow-hidden">
                              <div
                                style={{ width: `${s.count}%` }}
                                className="h-2 rounded bg-gradient-to-r from-sky-500 to-emerald-400"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border shadow-sm border-gray-300">
                    <h5 className="text-sm font-medium text-slate-700">
                      Revenue Breakdown
                    </h5>
                    <div className="mt-2 flex items-center gap-4">
                      <div style={{ width: 140, height: 120 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              dataKey="value"
                              innerRadius={24}
                              outerRadius={36}
                            >
                              {pieData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="text-sm">
                        {pieData.map((item, index) => (
                          <div
                            className="flex items-center gap-2 mt-2"
                            key={index}
                          >
                            <div
                              className="w-2 h-2 rounded"
                              style={{ backgroundColor: item.color }}
                            />
                            <span>
                              {item.name} - {item.value}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="space-y-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-300">
                  <h4 className="text-lg font-medium">Doctor Performance</h4>
                  <div className="mt-3 divide-y">
                    {topDoctor.map((d) => (
                      <div
                        key={d.name}
                        className="py-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">Dr. {d.name}</div>
                          <div className="text-xs text-slate-400">
                            Avg {d.avgMin} min
                          </div>
                        </div>
                        <div className="text-right ">
                          <div className="font-semibold">{d.completed}</div>
                          <div className="text-xs text-slate-400">
                            Completed
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-300">
                  <h4 className="text-lg font-medium">Quick Actions</h4>
                  <div className="mt-3 grid grid-cols-2 gap-2 border-gray-300">
                    <button className="px-3 py-2 rounded text-sm border border-gray-300">
                      New Appointment
                    </button>
                    <button className="px-3 py-2 rounded text-sm border border-gray-300">
                      Export
                    </button>
                    <button className="px-3 py-2 rounded text-sm border border-gray-300">
                      Reports
                    </button>
                    <button className="px-3 py-2 rounded text-sm border border-gray-300">
                      Settings
                    </button>
                  </div>
                </div>
              </aside>
            </section>

            {/* {Patient demography} */}

            <PatientDemographics data={patientData} />
          </div>
        )}
      </>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[95vh] overflow-y-auto p-6 max-w-2xl rounded-xl no-scrollbar">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="font-sans">Filter</DialogTitle>

              <DialogClose asChild>
                <button
                  className="text-teal-600 hover:bg-teal-100 p-2 rounded-full transition cursor-pointer"
                  title="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </DialogClose>
            </div>
          </DialogHeader>

          {/* Date Picker */}
          <div className="mb-4">
            <DateRangePicker
              ranges={dateRange}
              onChange={(item) => setDateRange([item.selection])}
              {...({ rangeColors: ["#22E0D4"] } as any)}
            />
          </div>

          {/* Doctor & Specialization Row */}
          <div className="flex flex-wrap gap-4">
            {/* Doctor Filter */}
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger className="w-50 border border-gray-300 rounded-lg shadow-sm focus:border-[#22E0D4] focus:ring-2 focus:ring-[#22E0D4] transition flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-gray-500" />
                <SelectValue placeholder="Select Doctor" />
              </SelectTrigger>
              <SelectContent className="border-gray-300 shadow-2xl rounded-2xl">
                <SelectItem value="all-doctors">All Doctors</SelectItem>
                {doctors.map((doc) => (
                  <SelectItem key={doc.UserId} value={String(doc.UserId)}>
                    Dr. {doc.firstName} {doc.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Specialization Filter */}
            <Select
              value={selectedSpecialization}
              onValueChange={setSelectedSpecialization}
            >
              <SelectTrigger className="w-52 border border-gray-300 rounded-lg shadow-sm focus:border-[#22E0D4] focus:ring-2 focus:ring-[#22E0D4] transition flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-gray-500" />
                <SelectValue placeholder="Select Specialization" />
              </SelectTrigger>
              <SelectContent className="border-gray-300 shadow-2xl rounded-2xl">
                <SelectItem value="all-specializations">
                  All Specializations
                </SelectItem>
                {specializations.map((spec) => (
                  <SelectItem
                    key={spec.SpecializationId}
                    value={String(spec.SpecializationId)}
                  >
                    {spec.SpecializationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Hospital Filter */}
            <Select
              value={selectedHospital}
              onValueChange={setSelectedHospital}
            >
              <SelectTrigger className="w-52 border border-gray-300 rounded-lg shadow-sm focus:border-[#22E0D4] focus:ring-2 focus:ring-[#22E0D4] transition flex items-center gap-2">
                <Hospital className="w-4 h-4 text-gray-500" />
                <SelectValue placeholder="Select Hospital" />
              </SelectTrigger>
              <SelectContent className="border-gray-300 shadow-2xl rounded-2xl">
                <SelectItem value="all-hospitals">All Hospitals</SelectItem>
                {hospitalData.map((hospital) => (
                  <SelectItem
                    key={hospital.HospitalId}
                    value={String(hospital.HospitalId)}
                  >
                    {hospital.HospitalName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Apply Button */}
          <button
            className="bg-teal-300 hover:bg-teal-400 text-white px-4 py-2 rounded"
            onClick={() => {
              console.log({
                startDate: dateRange[0]?.startDate ?? null,
                endDate: dateRange[0]?.endDate ?? null,
                doctor: selectedDoctor,
                specialization: selectedSpecialization,
              });

              fetchDashboardData(); // ✅ Manually trigger
              fetchDashboardDemographyData();
              setIsDialogOpen(false);
            }}
          >
            Apply Filters
          </button>
        </DialogContent>
      </Dialog>

      {/* Modal: Drilldown Report when KPI card clicked */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              exit={{ y: 30 }}
              className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedKpi
                      ? `Report: ${kpiMock.find((k) => k.id === selectedKpi)?.title}`
                      : "Report"}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Drill-down, export or schedule this report.
                  </p>
                </div>
                <div className="flex items-center gap-2 border-gray-300">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                    }}
                    className="text-sm px-3 py-1 border rounded border-gray-300"
                  >
                    Copy link
                  </button>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-sm px-3 py-1 border rounded border-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded p-3">
                  <h5 className="text-sm font-medium">Trend</h5>
                  <div style={{ height: 180 }} className="mt-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={filteredLineData}>
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="appointments"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-slate-50 rounded p-3">
                  <h5 className="text-sm font-medium">Breakdown</h5>
                  <div className="mt-3 text-sm text-slate-700">
                    <p>
                      <strong>Filter:</strong> {filter ?? "All"}
                    </p>
                    <p className="mt-2">
                      This view shows the detailed breakdown of the selected
                      KPI. You can export CSV or schedule this report via API.
                    </p>

                    <div className="mt-3">
                      <button
                        className="px-3 py-1 border rounded mr-2 border-gray-300"
                        onClick={() => {
                          // simulate scheduling
                          alert(
                            "Report scheduled — integrate with your jobs service (e.g. Celery/Sidekiq)"
                          );
                        }}
                      >
                        Schedule
                      </button>
                      <button
                        className="px-3 py-1 border rounded border-gray-300"
                        onClick={() => {
                          // export visible data
                          const csv = filteredLineData
                            .map((d) => `${d.day},${d.appointments}`)
                            .join("\n");
                          const blob = new Blob(["day,appointments\n" + csv], {
                            type: "text/csv",
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${selectedKpi || "report"}.csv`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
