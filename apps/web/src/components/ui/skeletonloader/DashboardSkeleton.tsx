import React from "react";

const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Top summary cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`${shimmer} bg-gradient-to-br from-gray-100 to-gray-200 
              rounded-2xl p-5 border border-gray-200 shadow-sm relative`}
          >
            <div className="h-4 w-28 bg-gray-300 rounded mb-3" />
            <div className="h-8 w-16 bg-gray-300 rounded mb-2" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="absolute right-4 top-4 h-12 w-20 bg-gray-300 rounded-md" />
          </div>
        ))}
      </section>

      {/* Appointment Trends (chart skeleton + controls) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow border border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-40 bg-gray-300 rounded" />
            <div className="flex gap-2">
              <div className="h-8 w-28 bg-gray-200 rounded-full" />
              <div className="h-8 w-20 bg-gray-200 rounded-full" />
            </div>
          </div>

          {/* Chart area */}
          <div className="h-64 w-full bg-gray-100 rounded-xl" />

          {/* Specializations & Revenue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
              <div className="h-4 w-28 bg-gray-300 rounded" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-gray-300 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 bg-gray-200 rounded" />
                    <div className="h-2 w-full bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
              <div className="h-4 w-32 bg-gray-300 rounded" />
              <div className="flex items-center gap-4">
                <div className="h-24 w-28 rounded-full bg-gray-200" />
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-3 w-28 bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Performance */}
        <aside className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow border border-gray-200">
          <div className="h-5 w-40 bg-gray-300 rounded mb-4" />
          <div className="divide-y divide-gray-200">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-gray-200 rounded" />
                  <div className="h-3 w-20 bg-gray-100 rounded" />
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-4 w-10 bg-gray-200 rounded ml-auto" />
                  <div className="h-3 w-16 bg-gray-100 rounded ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

function PatientDemographicsSkeleton() {
  return (
    <div
      className={`${shimmer} bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4`}
    >
      <div className="h-5 w-40 bg-gray-300 rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-28 bg-gray-200 rounded" />
            <div className="h-8 w-full bg-gray-300 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CombinedSkeleton() {
  return (
    <div className="space-y-8">
      <DashboardSkeleton />
      <PatientDemographicsSkeleton />
    </div>
  );
}
