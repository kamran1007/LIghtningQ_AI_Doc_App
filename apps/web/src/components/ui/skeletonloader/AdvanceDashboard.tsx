import React from "react";

const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent";

export default function ReportingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <div className={`${shimmer} h-6 w-32 bg-gray-200 rounded`} />
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <div className={`${shimmer} h-4 w-20 bg-gray-200 rounded mb-1`} />
            <div className={`${shimmer} h-3 w-16 bg-gray-100 rounded`} />
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded-full" />
        </div>
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`${shimmer} bg-gray-100 rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3`}
          >
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-6 w-16 bg-gray-300 rounded" />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className={`${shimmer} bg-white rounded-2xl p-4 shadow-sm border border-gray-200 space-y-4`}
          >
            <div className="h-5 w-48 bg-gray-200 rounded" />
            <div className="h-48 w-full bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Scheduled Reports */}
      <div
        className={`${shimmer} bg-white p-4 rounded-2xl shadow-sm border border-gray-200 space-y-4`}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-6 bg-gray-200 rounded-full" />
          <div className="h-5 w-40 bg-gray-200 rounded" />
        </div>

        {/* Frequency Buttons */}
        <div className="flex gap-4 mb-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 bg-gray-200 rounded-lg"
            />
          ))}
        </div>

        {/* Report Types */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-3 rounded-lg bg-gray-100"
            >
              <div className="h-4 w-4 bg-gray-300 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>

        {/* Action Buttons + Next Report */}
        <div className="flex justify-between items-center">
          <div className="h-9 w-40 bg-gray-300 rounded-lg" />
          <div className="h-4 w-28 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
