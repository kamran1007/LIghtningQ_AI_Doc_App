"use client";

import React, { useState } from "react";
import Dashboard from "./Dashboardreporting";
import Advancereporting from "./Advancereporting";
import AdditionalReport from "./AdditionalReport"; // 👈 create this component

export default function Page() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "advanced" | "additional"
  >("dashboard");

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex justify-center space-x-5 mb-2">
        <button
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === "dashboard"
              ? "border-b-2 border-[#22E0D4] font-semibold text-black"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard Reporting
        </button>

        <button
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === "advanced"
              ? "border-b-2 border-[#22E0D4] font-semibold text-black"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => setActiveTab("advanced")}
        >
          Advanced Reporting
        </button>

        <button
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === "additional"
              ? "border-b-2 border-[#22E0D4] font-semibold text-black"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => setActiveTab("additional")}
        >
          Additional Report
        </button>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "dashboard" && <Dashboard initialFilter={null} />}
        {activeTab === "advanced" && <Advancereporting />}
        {activeTab === "additional" && <AdditionalReport />}
      </div>
    </div>
  );
}
