"use client";

import { EventsProvider } from "@/context/events-context";
import { RegisterPatient } from "./PatientRegister";
import AppointmentLookupList from "./AppointmentLookupList";
import AllRegisterPatientList from "./AllRegisterPatientList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarCheck, CalendarClock, Users } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EventAddForm } from "@/components/event-add-form";

export default function PatientClientWrapper() {
  const [activeTab, setActiveTab] = useState("appointments");
  const [indicatorX, setIndicatorX] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(0);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({
    appointments: null,
    registered: null,
  });

  useEffect(() => {
    const currentRef = tabRefs.current[activeTab];
    if (currentRef) {
      const { offsetLeft, offsetWidth } = currentRef;
      setIndicatorX(offsetLeft);
      setIndicatorWidth(offsetWidth);
    }
  }, [activeTab]);

  return (
    <EventsProvider>
      <div className="flex w-full px-0 py-0">
        <div className="flex w-full flex-col space-y-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Top right: Tabs + Register */}
            <div className="flex justify-end items-center  w-full gap-0">
              <div className="relative">
                <TabsList className="relative flex bg-white border border-gray-200 rounded-full p-1 shadow-sm cursor-pointer">
                  {/* 🟦 Animated background behind the active tab */}
                  <motion.div
                    layout
                    className="absolute top-0 left-0 h-full bg-gray-100 rounded-full z-1"
                    animate={{
                      x: indicatorX,
                      width: indicatorWidth,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />

                  <TabsTrigger
                    ref={(el) => (tabRefs.current.appointments = el)}
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
                    ref={(el) => (tabRefs.current.registered = el)}
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

              {/* <div className="w-full flex justify-end items-center gap-2 pr-2">
                <EventAddForm />
                <RegisterPatient />
              </div> */}
              <RegisterPatient />
              <EventAddForm />

              {/* Buttons with tighter spacing */}
              {/* <div className="flex items-center gap-2">
                <RegisterPatient />
                <EventAddForm />
              </div> */}
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
    </EventsProvider>
  );
}
