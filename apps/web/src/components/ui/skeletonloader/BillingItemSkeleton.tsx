import React from "react";

const shimmer = "animate-pulse bg-gray-200";

export default function BillingtemSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 p-3 bg-white shadow-sm animate-pulse"
        >
          {/* Title */}
          <div className="h-4 w-32 rounded-md bg-gray-300 mb-1" />

          {/* Category */}
          <div className="h-3 w-24 rounded-md bg-gray-200 mb-2" />

          {/* Divider */}
          <div className="border-t my-2 border-teal-300" />

          {/* Subcharge rows */}
          <div className="flex flex-col gap-2 pl-2">
            <div className="flex justify-between">
              <div className="h-3 w-20 rounded-md bg-gray-200" />
              <div className="h-3 w-10 rounded-md bg-gray-200" />
            </div>

            <div className="flex justify-between">
              <div className="h-3 w-28 rounded-md bg-gray-200" />
              <div className="h-3 w-12 rounded-md bg-gray-200" />
            </div>

            <div className="flex justify-between">
              <div className="h-3 w-24 rounded-md bg-gray-200" />
              <div className="h-3 w-10 rounded-md bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
