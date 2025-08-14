// app/dashboard/ScheduledReports.tsx
import React, { useState } from "react";
import { Calendar, CalendarSync, Mail } from "lucide-react";

const ScheduledReports = () => {
  const [frequency, setFrequency] = useState("Weekly");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  const reportTypes = [
    "Monthly Summary",
    "Top Doctors",
    "No-show Risk (AI)",
    "Revenue Breakdown",
    "Patient Demographics",
  ];

  const toggleReport = (report: string) => {
    setSelectedReports((prev) =>
      prev.includes(report)
        ? prev.filter((r) => r !== report)
        : [...prev, report]
    );
  };

  return (
    <div className="p-[1px] rounded-2xl bg-transparent hover:bg-gradient-to-r hover:from-cyan-500 hover:to-teal-500 mt-6 transition-all duration-300">
      <div className="bg-white p-4 rounded-2xl shadow-sm  transition-all duration-300">
        <h2 className="text-lg font-semibold mb-4">
          {" "}
          <div className="flex items-center gap-2">
            <CalendarSync className="h-5 w-5 text-teal-300" />
            <span className="font-mono">Scheduled Reports</span>
          </div>
        </h2>

        {/* Frequency Selector */}
        <div className="flex gap-4 mb-4">
          {["Weekly", "Monthly"].map((freq) => (
            <button
              key={freq}
              onClick={() => setFrequency(freq)}
              className={`px-4 py-2 rounded-lg border-gray-300 transition ${
                frequency === freq
                  ? "bg-teal-300 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {freq}
            </button>
          ))}
        </div>

        {/* Report Types */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {reportTypes.map((report) => (
            <label
              key={report}
              className={`cursor-pointer p-3 border-gray-100 rounded-lg flex items-center gap-2 transition ${
                selectedReports.includes(report)
                  ? "bg-teal-50 border-green-400"
                  : "hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedReports.includes(report)}
                onChange={() => toggleReport(report)}
              />
              {report}
            </label>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button className="flex items-center gap-2 bg-teal-300 text-white px-4 py-2 rounded-lg hover:bg-teal-400">
            <Mail size={16} /> Schedule {frequency} Report
          </button>
          <span className="text-gray-500 text-sm flex items-center gap-1">
            <Calendar size={14} /> Next report:{" "}
            {frequency === "Weekly" ? "Monday" : "1st of Month"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScheduledReports;
