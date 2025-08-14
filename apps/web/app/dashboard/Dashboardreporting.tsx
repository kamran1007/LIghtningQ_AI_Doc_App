"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Controller, useForm } from "react-hook-form";
import DashboardPage from "./Advancereporting";
import PatientDemographics from "./PatientDemographics";
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

const lineData = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  appointments: Math.round(40 + Math.sin(i / 2) * 10 + Math.random() * 8),
}));

const topSpecs = [
  { name: "Cardiology", value: 27 },
  { name: "Orthopedics", value: 14 },
  { name: "Neurology", value: 12 },
  { name: "General Medicine", value: 12 },
  { name: "Dermatology", value: 9 },
];

const doctors = [
  { name: "Dr. James Smith", completed: 150, avgMin: 20 },
  { name: "Dr. Emily Johnson", completed: 130, avgMin: 19 },
  { name: "Dr. Michael Brown", completed: 125, avgMin: 22 },
  { name: "Dr. Sarah Wilson", completed: 115, avgMin: 19 },
];

const colors = ["#2563eb", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

// ----- Dashboard component -----
export default function Dashboard({
  initialFilter = null,
}: {
  initialFilter?: string | null;
}) {
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(initialFilter);
  const [modalOpen, setModalOpen] = useState(false);

  // derived filtered data example
  const filteredLineData = useMemo(() => {
    if (!filter) return lineData;
    // fake filter: reduce values when 'low' filter set
    if (filter === "low")
      return lineData.map((d) => ({
        ...d,
        appointments: Math.round(d.appointments * 0.7),
      }));
    return lineData.map((d) => ({
      ...d,
      appointments: Math.round(d.appointments * 1.1),
    }));
  }, [filter]);

  function handleCardClick(kpiId: string) {
    setSelectedKpi(kpiId);
    setModalOpen(true);
  }

  const {
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({});

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
              <span className="text-sm font-medium">Welcome back</span>
              <span className="text-xs text-slate-500">Kamran</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-white font-semibold">
              KQ
            </div>
          </div>
        </header>

        {/* KPI Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpiMock.map((k) => (
            <motion.button
              key={k.id}
              onClick={() => handleCardClick(k.id)}
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
                    <Select value={field.value} onValueChange={field.onChange}>
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
                  {topSpecs.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-8 rounded-full"
                        style={{ background: colors[i % colors.length] }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>{s.name}</span>
                          <span className="font-medium">{s.value}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded mt-2 overflow-hidden">
                          <div
                            style={{ width: `${s.value}%` }}
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
                          data={[
                            { name: "Cash", value: 40 },
                            { name: "Card", value: 30 },
                            { name: "Online", value: 30 },
                          ]}
                          dataKey="value"
                          innerRadius={24}
                          outerRadius={36}
                        >
                          <Cell fill="#a78bfa" />
                          <Cell fill="#60a5fa" />
                          <Cell fill="#34d399" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-300 rounded" />{" "}
                      <span>Cash - 40%</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-sky-300 rounded" />{" "}
                      <span>Card - 30%</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-emerald-300 rounded" />{" "}
                      <span>Online - 30%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-300">
              <h4 className="text-lg font-medium">Doctor Performance</h4>
              <div className="mt-3 divide-y">
                {doctors.map((d) => (
                  <div
                    key={d.name}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{d.name}</div>
                      <div className="text-xs text-slate-400">
                        Avg {d.avgMin} min
                      </div>
                    </div>
                    <div className="text-right ">
                      <div className="font-semibold">{d.completed}</div>
                      <div className="text-xs text-slate-400">Completed</div>
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

        <PatientDemographics data={{
          male: 50,
          female: 35,
          other: 4,
          fastTrack: 20,
          highAcuity: 2,
          newPatients: 4,
          newAppointments: 2
        }}/>

        {/* Footer / small report summary */}
        <section className="bg-white p-4 rounded-2xl border shadow-sm border-gray-300 mt-2">
          <h4 className="text-sm font-medium">Latest Reports</h4>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 border-gray-300">
            <div className="p-3 border rounded-lg border-gray-300">
              Monthly Summary · July 2025
            </div>
            <div className="p-3 border rounded-lg border-gray-300">
              Top Doctors · Last 30 days
            </div>
            <div className="p-3 border rounded-lg border-gray-300">
              No-show Risk · AI Predictions
            </div>
          </div>
        </section>
      </div>

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
