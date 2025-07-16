import React from "react";
import { cn } from "@/lib/utils";

const shimmer = "animate-pulse bg-zinc-200";

export default function AppointmentBookingSkeleton() {
  return (
    <div className="space-y-6 bg-gradient-to-br from-[#FFFDF9] to-[#FDFAF6] border border-[#fcdcdc] shadow-md rounded-2xl p-4">
      {/* Specialist buttons */}
      <div className="space-y-2">
        <div className="h-4 w-40 bg-zinc-300 rounded"></div>
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-40 rounded-3xl bg-zinc-200 animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Doctor cards */}
      <div className="space-y-2">
        <div className="h-4 w-32 bg-zinc-300 rounded"></div>
        <div className="flex gap-4 overflow-hidden px-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-40 h-32 p-4 rounded-xl bg-white border border-gray-300 shadow animate-pulse space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-zinc-300" />
                <div className="h-4 w-20 bg-zinc-200 rounded" />
              </div>
              <div className="h-3 w-24 bg-zinc-200 rounded" />
              <div className="h-3 w-20 bg-blue-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Date selection */}
      <div className="space-y-2">
        <div className="h-4 w-44 bg-zinc-300 rounded"></div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-14 rounded-lg bg-zinc-200 animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Time slots */}
      <div className="grid grid-cols-5 gap-2 mt-2">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="h-9 rounded-full bg-zinc-200 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
