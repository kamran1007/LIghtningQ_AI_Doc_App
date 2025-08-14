"use client";

import React, { useState } from "react";
import Dashboard from "./Dashboardreporting";
import Advancereporting from "./Advancereporting";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "advanced">(
    "dashboard"
  );

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex justify-center space-x-5 mb-2">
        <button
          className={`pb-2 transition-colors ${
            activeTab === "dashboard"
              ? "border-b-2 border-[#22E0D4] font-semibold text-black"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard Reporting
        </button>
        <button
          className={`pb-2 transition-colors ${
            activeTab === "advanced"
              ? "border-b-2 border-[#22E0D4] font-semibold text-black"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => setActiveTab("advanced")}
        >
          Advanced Reporting
        </button>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "dashboard" ? (
          <Dashboard initialFilter={null} />
        ) : (
          <Advancereporting />
        )}
      </div>
    </div>
  );
}
