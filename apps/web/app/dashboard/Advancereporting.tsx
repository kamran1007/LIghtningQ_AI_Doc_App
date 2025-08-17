"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Dialog } from "@headlessui/react";
import {
  Building,
  CalendarSearch,
  FlaskConical,
  Hospital,
  Stethoscope,
  X,
} from "lucide-react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AnalyticalHistoricalReports from "./AnalyticalHistoricalReports";
import ScheduledReports from "./ScheduledReports";
import { getUserSpecialization } from "@/lib/admin";
import { FetchDoctorRole } from "@/lib/bookappointment";
import { FetchAdvancedReport, FetchHospital } from "@/lib/dashboard";
import toast from "react-hot-toast";
import ReportExport from "./ReportExport";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Advancereporting() {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [revenueTrend, setRevenueTrend] = useState<{
    categories: any[];
    series: any[];
  }>({ categories: [], series: [] });
  const [doctorPerformance, setDoctorPerformance] = useState<{
    categories: any[];
    series: any[];
  }>({ categories: [], series: [] });

  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [hospitalData, setHospitalData] = useState([]);

  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [dashboardCards, setDashboardCards] = useState<any[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [chartOptions, setChartOptions] = useState<any>({});
  const [chartSeries, setChartSeries] = useState<any>([]);

  const [reportData, setReportData] = useState<any>(null);

  // const chartOptions = {
  //   chart: { type: "bar" },
  //   xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  // };
  // const chartSeries = [
  //   { name: "Appointments", data: [30, 40, 35, 50, 49, 60, 70] },
  // ];

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

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);

        const startDate = dateRange[0]?.startDate
          ? dateRange[0].startDate.toISOString().split("T")[0]
          : undefined;

        const endDate = dateRange[0]?.endDate
          ? dateRange[0].endDate.toISOString().split("T")[0]
          : undefined;

        const data = await FetchAdvancedReport(
          startDate,
          endDate,
          selectedDoctor || "",
          selectedHospital || "",
          selectedSpecialization || ""
        );

        setReportData(data);

        // ✅ Trends: Month vs Revenue
        setRevenueTrend({
          categories: data.revenueTrend.map((t: any) => t.month),
          series: data.revenueTrend.map((t: any) => t.revenue),
        });

        // ✅ Doctor Performance: Doctor Name vs Appointments
        setDoctorPerformance({
          categories: data.doctorPerformance.map((d: any) => d.doctorName),
          series: data.doctorPerformance.map((d: any) => d.appointments),
        });

        // Summary Cards
        setDashboardCards(data.summaryCards || []);
      } catch (err) {
        console.error("Failed to fetch report:", err);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [
    dateRange, // re-fetch when date changes
    selectedDoctor, // re-fetch when doctor changes
    selectedHospital, // re-fetch when hospital changes
    selectedSpecialization, // re-fetch when specialization changes
  ]);

  // 👇 Auto re-render chart when reportData updates
  useEffect(() => {
    if (selectedCard && reportData) {
      handleCardClick(selectedCard, reportData);
    }
  }, [reportData, selectedCard]);

  const handleCardClick = (card: any, data: any) => {
    setSelectedCard(card);

    if (card.id === "appointments") {
      const appointmentTrend = data?.appointmentTrend ?? [];

      setChartOptions({
        chart: { type: "line", toolbar: { show: false } },
        stroke: { curve: "smooth", width: 3 },
        xaxis: { categories: appointmentTrend.map((t: any) => t.time) },
        yaxis: { title: { text: "Appointments" } },
      });

      setChartSeries([
        {
          name: "Appointments",
          data: appointmentTrend.map((t: any) => t.appointments),
        },
      ]);
    }

    if (card.id === "revenue") {
      // ✅ Revenue Trend
      setChartOptions({
        chart: { type: "line", toolbar: { show: false } },
        stroke: { curve: "smooth", width: 3 },
        xaxis: { categories: data.revenueTrend.map((t: any) => t.month) },
        yaxis: {
          labels: {
            formatter: (val: number) => `₹${val.toFixed(2)}`,
          },
          title: { text: "Revenue (₹)" },
        },
      });

      setChartSeries([
        {
          name: "Revenue",
          data: data.revenueTrend.map((t: any) =>
            Number(String(t.revenue).replace(/[^0-9.-]+/g, ""))
          ),
        },
      ]);
    }

    if (card.id === "doctors") {
      // ✅ Doctor Performance
      setChartOptions({
        chart: { type: "bar", toolbar: { show: false } },
        xaxis: {
          categories: data.doctorPerformance.map((d: any) => d.doctorName),
        },
        yaxis: { title: { text: "Appointments" } },
      });

      setChartSeries([
        {
          name: "Appointments",
          data: data.doctorPerformance.map((d: any) => d.appointments),
        },
      ]);
    }
    if (card.id === "specialization") {
      // ✅ Specialization Performance
      const specializationData = data.specializationPerformance || [];
      setChartOptions({
        chart: { type: "bar", toolbar: { show: false } },
        xaxis: {
          categories: specializationData.map((s: any) => s.specializationName),
        },
        yaxis: { title: { text: "Appointments" } },
      });

      setChartSeries([
        {
          name: "Appointments",
          data: specializationData.map((s: any) => s.appointments),
        },
      ]);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Reporting</h2>
          {/* <p className="text-sm text-slate-500">Dashboard / Reports</p> */}
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            {/* <span className="text-sm font-medium">Welcome back</span>
              <span className="text-xs text-slate-500">Kamran</span> */}
          </div>
          <div className="relative inline-block">
            {/* Calendar Icon */}
            <CalendarSearch
              className="w-6 h-6 text-teal-300 cursor-pointer"
              onClick={() => setShowPicker((prev) => !prev)}
            />

            {/* Date Range Picker aligned LEFT of the icon */}
            {showPicker && (
              <div className="absolute z-50 mt-2 shadow-lg bg-white rounded-lg p-2 right-full mr-2">
                <DateRangePicker
                  ranges={dateRange}
                  onChange={(item) => setDateRange([item.selection])}
                  rangeColors={["#22E0D4"]}
                />
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono hover:border-[#22E0D4]">
        {dashboardCards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card, reportData)} // 🔹 now passes API data
            className="  bg-white 
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
  w-full"
          >
            <h2 className="text-gray-500 text-sm">{card.title}</h2>
            <p className="text-2xl font-semibold mt-2">{card.value}</p>
          </div>
        ))}
      </div>
      {/* Advanced Reporting Modal */}
      <Dialog
        open={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg max-h-screen overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
              <Dialog.Title className="text-xl font-sans">
                Advanced Reporting - {selectedCard?.title}
              </Dialog.Title>
              <button
                className="text-teal-600 hover:bg-teal-100 p-2 rounded-full transition cursor-pointer"
                title="Close"
                onClick={() => setSelectedCard(null)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full">
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                {/* Doctor Filter */}
                <Select
                  value={selectedDoctor}
                  onValueChange={setSelectedDoctor}
                >
                  <SelectTrigger className="w-56 border border-gray-300 rounded-lg shadow-sm focus:border-[#22E0D4] focus:ring-2 focus:ring-[#22E0D4] transition flex items-center gap-2">
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
                  <SelectTrigger className="w-56 border border-gray-300 rounded-lg shadow-sm focus:border-[#22E0D4] focus:ring-2 focus:ring-[#22E0D4] transition flex items-center gap-2">
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
                  <SelectTrigger className="w-56 border border-gray-300 rounded-lg shadow-sm focus:border-[#22E0D4] focus:ring-2 focus:ring-[#22E0D4] transition flex items-center gap-2">
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

              {/* Date Range Picker */}
              <div className="ml-8 mt-6 justify-center-safe">
                <DateRangePicker
                  ranges={dateRange}
                  onChange={(item: any) => setDateRange([item.selection])}
                  rangeColors={["#22E0D4"]}
                />
              </div>
            </div>

            {/* Chart */}
            <div className="mt-6">
              <ApexChart
                options={{
                  ...chartOptions,
                  colors: ["#22E0D4"], // ✅ set chart color here
                }}
                series={chartSeries}
                type={selectedCard?.id === "doctors" ? "bar" : "line"} // bar for doctors, line for others
                height={300}
              />
            </div>

            {/* Appointment Trend Table */}
            {reportData?.appointmentTrend?.length > 0 && (
              <div className="mt-6 overflow-x-auto">
                <h2 className="text-lg font-semibold mb-2">
                  Appointment Trend
                </h2>
                <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-left">
                      <th className="p-4 text-sm font-semibold">Date</th>
                      <th className="p-4 text-sm font-semibold">
                        No. of Appointments
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.appointmentTrend.map((t: any, idx: number) => (
                      <tr
                        key={idx}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 text-gray-700">{t.time}</td>
                        <td className="p-4 font-semibold text-cyan-600">
                          {t.appointments}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* -------------------- Revenue Trend Table -------------------- */}
            {reportData?.revenueTrend?.length > 0 && (
              <div className="mt-6 overflow-x-auto">
                <h2 className="text-lg font-semibold mb-2">Revenue Trend</h2>
                <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-left">
                      <th className="p-4 text-sm font-semibold">Date</th>
                      <th className="p-4 text-sm font-semibold">Month</th>
                      <th className="p-4 text-sm font-semibold">
                        Amount (INR)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.revenueTrend?.map((t: any, idx: number) => (
                      <tr
                        key={idx}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 text-gray-700">{t.time}</td>
                        <td className="p-4 text-gray-700">{t.month}</td>
                        <td className="p-4 font-semibold text-green-600">
                          {t.revenue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* -------------------- Doctor Performance Table -------------------- */}
            {reportData?.doctorPerformance?.length > 0 && (
              <div className="mt-6 overflow-x-auto">
                <h2 className="text-lg font-semibold mb-2">
                  Doctor Performance
                </h2>
                <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-left">
                      <th className="p-4 text-sm font-semibold">Date</th>
                      <th className="p-4 text-sm font-semibold">Doctor Name</th>
                      <th className="p-4 text-sm font-semibold">
                        No. of Appointments
                      </th>
                      <th className="p-4 text-sm font-semibold">
                        Revenue (INR)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.doctorPerformance?.map(
                      (d: any, idx: number) => (
                        <tr
                          key={idx}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4 text-gray-700">{d.date}</td>
                          <td className="p-4 font-medium text-gray-900">
                            {d.doctorName}
                          </td>
                          <td className="p-4 font-semibold text-cyan-600">
                            {d.appointments}
                          </td>
                          <td className="p-4 font-semibold text-green-600">
                            {d.revenue}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* -------------------- Specialization Performance Table -------------------- */}
            {reportData?.appointmentTrend?.length > 0 && (
              <div className="mt-6 overflow-x-auto">
                <h2 className="text-lg font-semibold mb-2">
                  Specialization Performance
                </h2>
                <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-left">
                      <th className="p-4 text-sm font-semibold">Date</th>
                      <th className="p-4 text-sm font-semibold">Specialist</th>
                      <th className="p-4 text-sm font-semibold">
                        No. of Appointments
                      </th>
                      <th className="p-4 text-sm font-semibold">
                        Revenue (INR)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.specializationPerformance?.map(
                      (s: any, idx: number) => (
                        <tr
                          key={idx}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4 text-gray-700">{s.date}</td>
                          <td className="p-4 font-medium text-gray-900">
                            {s.specializationName}
                          </td>
                          <td className="p-4 font-semibold text-cyan-600">
                            {s.appointments}
                          </td>
                          <td className="p-4 font-semibold text-green-600">
                            {s.revenue}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Export Buttons */}
            <ReportExport
              reportData={reportData}
              hospitalInfo={{
                name: hospitalData[0]?.HospitalName || "City Hospital",
                address: hospitalData[0]?.address,
                code: hospitalData[0]?.HospitalCode,
                email: hospitalData[0]?.email,
                contact: hospitalData[0]?.contactNumber
              }}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
      <AnalyticalHistoricalReports
        revenueTrend={revenueTrend}
        doctorPerformance={doctorPerformance}
      />{" "}
      <ScheduledReports />
    </div>
  );
}
