"use client";

import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarClock, Users } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { RegisterPatient } from "./PatientRegister";
import AppointmentLookupList from "./AppointmentLookupList";
import AllRegisterPatientList from "./AllRegisterPatientList";
import { EventAddForm } from "@/components/event-add-form";

type TabId = "appointments" | "registered";

export default function PatientClientWrapper() {
  const [activeTab, setActiveTab] = useState<TabId>("appointments");

  // wrapper around the TabsList so we can measure children relative to it
  const tabsListContainerRef = useRef<HTMLDivElement | null>(null);

  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const updatePill = () => {
      const container = tabsListContainerRef.current;
      if (!container) return;

      // find the element that corresponds to the active tab
      // we set data-tab attribute on the Tab triggers below
      const el = container.querySelector<HTMLElement>(
        `[data-tab="${activeTab}"]`
      );
      if (!el) {
        setPillStyle({ left: 0, width: 0 });
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      // left relative to container
      const left = elRect.left - containerRect.left;
      const width = elRect.width;

      setPillStyle({ left, width });
    };

    // update immediately and on window resize (keeps pill in sync)
    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [activeTab]);

  return (
    <div className="p-0">
      <div className="flex w-full px-0 py-0">
        <div className="flex w-full flex-col space-y-2">
          <Tabs
            value={activeTab}
            // Tabs.onValueChange gives a string — assert it to TabId here
            onValueChange={(v) => setActiveTab(v as TabId)}
            className="w-full"
          >
            <div className="flex justify-end items-center w-full gap-0">
              <div className="relative">
                {/* Container we measure against */}
                <div ref={tabsListContainerRef} className="relative">
                  <TabsList className="relative flex bg-white border border-gray-200 rounded-full p-1 shadow-sm cursor-pointer">
                    {/* Animated pill - we position it with transform (x) and width */}
                    <motion.div
                      layout
                      initial={false}
                      animate={{ x: pillStyle.left, width: pillStyle.width }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="absolute top-1 bottom-1 rounded-full bg-[#22E0D4]"
                      // leave fallback styles so SSR won't break layout badly
                      style={{ left: 0, width: 0 }}
                    />

                    {/* NOTE: We add data-tab attributes instead of refs */}
                    <TabsTrigger
                      data-tab="appointments"
                      value="appointments"
                      className="relative z-10 flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 cursor-pointer
                        data-[state=active]:bg-[linear-gradient(135deg,#5eead4_0%,#818cf8_100%)]
                        data-[state=active]:text-white
                        data-[state=inactive]:text-gray-600"
                    >
                      <CalendarClock className="w-4 h-4" />
                      Appointments
                    </TabsTrigger>

                    <TabsTrigger
                      data-tab="registered"
                      value="registered"
                      className="relative z-10 flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 cursor-pointer
                        data-[state=active]:bg-[linear-gradient(135deg,#22d3ee_0%,#818cf8_100%)]
                        data-[state=active]:text-white
                        data-[state=inactive]:text-gray-600"
                    >
                      <Users className="w-4 h-4" /> All Patients
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              {/* your actions */}
              <RegisterPatient />
              <EventAddForm
                start={new Date()}
                end={new Date()}
                selectedPatient={undefined}
              />
            </div>

            {/* Tabs Content Section */}
            <div className="mt-2 w-full min-h-[200px]">
              <AnimatePresence mode="wait">
                {activeTab === "appointments" && (
                  <motion.div
                    key="appointments"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AppointmentLookupList />
                  </motion.div>
                )}
                {activeTab === "registered" && (
                  <motion.div
                    key="registered"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AllRegisterPatientList />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
