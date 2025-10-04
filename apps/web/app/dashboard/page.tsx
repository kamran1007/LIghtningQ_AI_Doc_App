"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Dashboard from "./Dashboardreporting";
import Advancereporting from "./Advancereporting";
import AdditionalReport from "./AdditionalReport";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function Page() {
  // Define the type for access rights
  type AccessRight = {
    ModuleName: string;
    Submodules?: { SubModuleName: string; [key: string]: any }[];
    [key: string]: any;
  };

  const accessRights = useSelector(
    (state: RootState) => state.hospitalAccessRight.data
  ) as AccessRight[];
  // console.log("Access Rights from Redux:", accessRights);

  // Extract permissions for Dashboard
  const dashboardPerm = accessRights.find((m) => m.ModuleName === "Dashboard");
  // console.log("Dashboard Permissions:", dashboardPerm);
  const submodules = dashboardPerm?.Submodules ?? [];

  // Example: find "Dashboard Report" submodule permissions
  const dashboardReportPerm = submodules.find(
    (s: any) => s.SubModuleName === "Dashboard Report"
  );
  // console.log("Dashboard Report Permissions:", dashboardReportPerm);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "advanced" | "additional"
  >("dashboard");

  const canViewDashboard = dashboardReportPerm?.Permissions?.CanView ?? false;
  type TabId = "dashboard" | "advanced" | "additional";
  type Tab = { id: TabId; label: string; canView: boolean };

  // const tabs = [
  //   { id: "dashboard", label: "Dashboard Report" },
  //   { id: "advanced", label: "Advanced Report" },
  //   { id: "additional", label: "Additional Report" },
  // ] as const;
  const rawTabs = [
  { id: "dashboard", label: "Dashboard Report", canView: canViewDashboard },
  { id: "advanced", label: "Advanced Report", canView: true },
  { id: "additional", label: "Additional Report", canView: true },
] as const;

const tabs: Tab[] = rawTabs.filter((t) => t.canView) as Tab[];

  useEffect(() => {
    if (!tabs.find((t) => t.id === activeTab)) {
      setActiveTab((tabs[0]?.id as typeof activeTab) ?? "dashboard");
    }
  }, [tabs, activeTab]);

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      setPillStyle({ left: el.offsetLeft ?? 0, width: el.offsetWidth ?? 0 });
    }
  }, [activeTab]);

  return (
    <div className="p-4">
      {/* Toggle style tab buttons */}
      <div className="flex justify-center space-x-2 mb-6 bg-gray-100 rounded-full p-1 relative w-fit mx-auto">
        {/* Moving pill */}
        <motion.div
          layout
          className="absolute top-1 bottom-1 rounded-full bg-[#22E0D4]"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{
            left: pillStyle.left,
            width: pillStyle.width,
          }}
        />
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            onClick={() => setActiveTab(tab.id)}
            className={`relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id ? "text-white" : "text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content with animation */}
      <div className="relative min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && canViewDashboard && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute w-full"
            >
              <Dashboard initialFilter={null} />
            </motion.div>
          )}

          {activeTab === "advanced" && (
            <motion.div
              key="advanced"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute w-full"
            >
              <Advancereporting />
            </motion.div>
          )}

          {activeTab === "additional" && (
            <motion.div
              key="additional"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute w-full"
            >
              <AdditionalReport />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
