"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Minimize } from "lucide-react";

export default function OPDQueueFullscreenPage() {
  const router = useRouter();

  // 🔥 Enter fullscreen on mount
  useEffect(() => {
    if (document.fullscreenElement === null) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    // Exit fullscreen when leaving page
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  const handleExitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    router.push("/patientcare");
  };

  return (
    <div className="h-screen w-screen bg-white flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-teal-600 text-white">
        <h1 className="text-lg font-semibold">
          OPD Queue – Live View
        </h1>

        <Minimize
          className="w-6 h-6 cursor-pointer hover:text-yellow-300"
          onClick={handleExitFullscreen}
        />
      </div>

      {/* Queue Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* 🔥 OPD Queue Table goes here */}
      </div>
    </div>
  );
}
