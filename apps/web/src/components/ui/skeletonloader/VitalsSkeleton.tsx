import React from "react";

const shimmer = "animate-pulse bg-gray-200";

const VitalSkeletonBox = ({ lines = 1 }: { lines?: number }) => (
  <div className="flex flex-col gap-2 w-full">
    <div className={`w-24 h-4 rounded-md ${shimmer}`} />
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className={`w-full h-10 rounded-md ${shimmer}`} />
    ))}
  </div>
);

const VitalCardSkeleton = () => (
  <div className="flex flex-col sm:flex-row items-start gap-3 p-4 rounded-2xl bg-white/70 shadow-lg border border-gray-200 backdrop-blur-sm w-full max-w-md animate-pulse">
    <div className="w-10 h-10 rounded-full bg-teal-100 shadow-inner" />
    <div className="flex flex-col gap-2 w-full">
      <div className="h-4 w-24 rounded-md bg-gray-300" />
      <div className="h-10 w-full rounded-md bg-gray-200" />
    </div>
  </div>
);

export default function VitalsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Vitals History Button Skeleton */}
      <div className="w-full flex justify-end pr-4 mb-2 max-w-4xl">
        <div className="h-9 w-40 rounded-2xl bg-gray-200 animate-pulse" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-4 w-full max-w-4xl">
        {Array.from({ length: count }).map((_, i) => (
          <VitalCardSkeleton key={i} />
        ))}

        {/* Submit button skeleton */}
        <div className="col-span-full flex justify-center">
          <div className="h-10 w-40 rounded-2xl bg-teal-200 animate-pulse shadow-md" />
        </div>
      </div>
    </div>
  );
}

