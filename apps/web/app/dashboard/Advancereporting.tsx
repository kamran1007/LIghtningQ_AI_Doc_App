"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
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

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const dashboardCards = [
  { id: "appointments", title: "Total Appointments", value: "1,245" },
  { id: "revenue", title: "Total Revenue", value: "₹2,50,000" },
  { id: "specialization", title: "Top Specialization", value: "Cardiology" },
  { id: "doctors", title: "Top Performing Doctor", value: "Dr. Smith" },
];

export default function Advancereporting() {
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const chartOptions = {
    chart: { type: "bar" },
    xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  };
  const chartSeries = [
    { name: "Appointments", data: [30, 40, 35, 50, 49, 60, 70] },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Reporting</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono hover:border-[#22E0D4]">
        {dashboardCards.map((card) => (
          <div
            key={card.id}
            onClick={() => setSelectedCard(card)}
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
          <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-4xl shadow-lg max-h-screen overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
              <Dialog.Title className="text-xl font-sans">
                Advanced Reporting - {selectedCard?.title}
              </Dialog.Title>
              <button onClick={() => setSelectedCard(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Doctor Filter */}
              <Select defaultValue="all-doctors">
                <SelectTrigger className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-[#22E0D4] focus:ring-2 focus:ring-[#22E0D4] transition">
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                  <SelectItem value="all-doctors">All Doctors</SelectItem>
                  <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                  <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                </SelectContent>
              </Select>

              {/* Specialization Filter */}
              <Select defaultValue="all-specializations">
                <SelectTrigger className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-[#22E0D4] focus:ring-2 focus:ring-[#22E0D4] transition">
                  <SelectValue placeholder="Select Specialization" />
                </SelectTrigger>
                <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                  <SelectItem value="all-specializations">
                    All Specializations
                  </SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="dermatology">Dermatology</SelectItem>
                </SelectContent>
              </Select>

              {/* Hospital Filter */}
              <Select defaultValue="all-hospitals">
                <SelectTrigger className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-[#22E0D4] focus:ring-2 focus:ring-[#22E0D4] transition">
                  <SelectValue placeholder="Select Hospital" />
                </SelectTrigger>
                <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                  <SelectItem value="all-hospitals">All Hospitals</SelectItem>
                  <SelectItem value="city-hospital">City Hospital</SelectItem>
                  <SelectItem value="green-clinic">Green Clinic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Picker */}
            <DateRangePicker
              ranges={dateRange}
              onChange={(item: any) => setDateRange([item.selection])}
              rangeColors={["#22E0D4"]}
            />

            {/* Chart */}
            <div className="mt-6">
              <ApexChart
                options={{
                  ...chartOptions,
                  colors: ["#22E0D4"], // ✅ set chart color here
                }}
                series={chartSeries}
                type="radar"
                height={300}
              />
            </div>

            {/* Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-left">
                    <th className="p-4 text-sm font-semibold">Date</th>
                    <th className="p-4 text-sm font-semibold">Doctor</th>
                    <th className="p-4 text-sm font-semibold">
                      Specialization
                    </th>
                    <th className="p-4 text-sm font-semibold">Appointments</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-700">2025-08-01</td>
                    <td className="p-4 font-medium text-gray-900">Dr. Smith</td>
                    <td className="p-4 text-gray-700">Cardiology</td>
                    <td className="p-4 font-semibold text-cyan-600">15</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-700">2025-08-02</td>
                    <td className="p-4 font-medium text-gray-900">
                      Dr. Johnson
                    </td>
                    <td className="p-4 text-gray-700">Dermatology</td>
                    <td className="p-4 font-semibold text-cyan-600">8</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-4 mt-6">
              <button className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500">
                Export PDF
              </button>
              <button className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500">
                Export Excel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <AnalyticalHistoricalReports/>
      <ScheduledReports/>
    </div>
  );
}
