"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Maximize2, X } from "lucide-react";
import { TabPanel, TabView } from "primereact/tabview";
import { useState } from "react";

interface ConsultationDrawerProps {
  open: boolean;
  onClose: () => void;
  patient: any;
}

export default function ConsultationDrawer({
  open,
  onClose,
  patient,
}: ConsultationDrawerProps) {
  const [fullScreen, setFullScreen] = useState(false);

  const scrollableTabs = [
    { title: "Vitals", content: "Vitals form here..." },
    { title: "Records", content: "Records form here..." },
    { title: "Medications", content: "Medications form here..." },
    { title: "Test Results", content: "Test results component..." },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="drawer"
          initial={{ x: "100%" }}
          animate={{ x: 0, width: fullScreen ? "100vw" : "40vw" }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-0 right-0 z-50 h-full bg-white shadow-xl"
        >
          <div className="flex justify-between items-center px-4 pt-4">
            <h2 className="text-lg font-semibold">
              {patient?.patient?.name} - {patient?.patient?.mrn}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFullScreen(!fullScreen)}
              >
                <Maximize2 className="w-6 h-6 text-blue-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose} // ✅ Now using external callback
                className="w-10 h-10"
              >
                <X className="w-10 h-10 text-red-600" />
              </Button>
            </div>
          </div>

          <div className="px-4 pb-6 overflow-y-auto h-[calc(100%-4rem)]">
            <TabView scrollable>
              {scrollableTabs.map((tab) => (
                <TabPanel key={tab.title} header={tab.title}>
                  <p className="m-0">{tab.content}</p>
                </TabPanel>
              ))}
            </TabView>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
