"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Dashboard from "./Dashboardreporting";
import Advancereporting from "./Advancereporting";
import AdditionalReport from "./AdditionalReport";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function Page() {
  // --- Type Definitions ---
  type AccessRight = {
    ModuleName: string;
    Submodules?: {
      SubModuleName: string;
      Permissions?: { CanView?: boolean }[];
      [key: string]: any;
    }[];
  };

  type TabId = "dashboard" | "advanced" | "additional";
  type Tab = { id: TabId; label: string; canView: boolean };

  // --- Redux Access Rights ---
  const accessRights = useSelector(
    (state: RootState) => state.hospitalAccessRight.data
  ) as AccessRight[];

  // --- Find the Dashboard module ---
  const dashboardModule = accessRights?.find(
    (m) => m.ModuleName === "Dashboard"
  );
  const submodules = dashboardModule?.Submodules ?? [];

  // --- Extract Permissions for Each Submodule ---
  const getPermission = (subModuleName: string) =>
    submodules.find((s) => s.SubModuleName === subModuleName)?.Permissions?.[0];

  const canViewDashboard = getPermission("Dashboard Report")?.CanView ?? false;
  const canViewAdvanced = getPermission("Advance Dashboard")?.CanView ?? false;
  const canViewAdditional =
    getPermission("Additional Report")?.CanView ?? false;

  // --- Define Tabs Dynamically ---
  const rawTabs: Tab[] = [
    { id: "dashboard", label: "Dashboard Report", canView: canViewDashboard },
    { id: "advanced", label: "Advanced Report", canView: canViewAdvanced },
    {
      id: "additional",
      label: "Additional Report",
      canView: canViewAdditional,
    },
  ];

  // Only keep allowed tabs
  const tabs = rawTabs.filter((t) => t.canView);

  // --- Active Tab State ---
  const [activeTab, setActiveTab] = useState<TabId>(
    (tabs[0]?.id as TabId) || "dashboard"
  );

  // --- Keep activeTab valid when permissions change ---
  useEffect(() => {
    const exists = tabs.some((t) => t.id === activeTab);
    if (!exists) {
      const newTab = (tabs[0]?.id as TabId) || "dashboard";
      if (newTab !== activeTab) {
        setActiveTab(newTab);
      }
    }
  }, [tabs]);

  // --- Moving Pill Animation Setup ---
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      requestAnimationFrame(() => {
        setPillStyle({ left: el.offsetLeft, width: el.offsetWidth });
      });
    }
  }, [activeTab]);

  // --- Handle case when no tab has permission ---
  if (!tabs.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-600 font-medium">
        You don’t have permission to view any Dashboard reports.
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="p-4">
      {/* Tabs Header */}
      <div className="flex justify-center space-x-2 mb-6 bg-gray-100 rounded-full p-1 relative w-fit mx-auto">
        {/* Animated Pill */}
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

      {/* Tab Content */}
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

          {activeTab === "advanced" && canViewAdvanced && (
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

          {activeTab === "additional" && canViewAdditional && (
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
