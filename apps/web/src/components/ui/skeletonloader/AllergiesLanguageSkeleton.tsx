"use client";

import React from "react";

const shimmer = "animate-pulse bg-gray-200";

export default function AllergiesLanguageSkeleton() {
  return (
    <div className="space-y-4">
      {/* Input search skeleton */}
      <div className={`h-10 w-full rounded-xl ${shimmer}`} />

      {/* Pills skeleton - 8 buttons */}
      <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`h-8 w-24 rounded-2xl ${shimmer}`} />
        ))}
      </div>
    </div>
  );
}
