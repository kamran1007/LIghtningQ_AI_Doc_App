"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Minimize } from "lucide-react";

export default function OPDQueueFullscreenPage() {
  const router = useRouter();

  useEffect(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        router.push("/patientcare");
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [router]);

  const handleExitFullscreen = () => {
    document.exitFullscreen().catch(() => {});
    router.push("/patientcare");
  };

  return (
    <div className="h-screen w-screen bg-white-400 text-gray-500 relative overflow-hidden">
      {/* Minimize Button */}
      <div className="fixed top-4 right-4 z-[9999]">
        <Minimize
          className="w-4 h-4 cursor-pointer hover:text-teal-300"
          onClick={handleExitFullscreen}
        />
      </div>

      {/* Header */}
      <div className="px-6 py-4 border-b border-white/20">
        <h1 className="text-xl font-semibold">
          OPD Queue – Live View
        </h1>
      </div>

      {/* Queue Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* OPD Queue Table */}
      </div>
    </div>
  );
}
