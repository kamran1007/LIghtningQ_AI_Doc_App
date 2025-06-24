"use client";

import React from "react";
import { UserCheck, LockKeyholeOpen, Hospital, Signature } from "lucide-react";
// import Aside from './Aside'; // adjust path as needed

const shimmer = "animate-pulse bg-gray-200";

export default function AddUserSkeleton() {
  return (
    <div className="flex h-full">
      <aside className="w-full max-w-[260px] border-r border-gray-200 px-4 py-6 bg-white h-full">
        {/* Back Button Skeleton */}
        <div className="flex mb-6">
          <div className={`${shimmer} h-8 w-24`} />
        </div>

        {/* Section Title */}
        <div className="px-2 flex flex-col items-center mt-6 mb-4">
          <div className={`${shimmer} h-5 w-32 mb-2`} />
          <div className="h-1 w-40 bg-blue-100 rounded-full" />
        </div>

        {/* Navigation Items */}
        <ul className="space-y-2 text-sm">
          {Array.from({ length: 5 }).map((_, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-50"
            >
              <div className={`${shimmer} h-4 w-4 rounded-full`} />
              <div className={`${shimmer} h-4 w-24`} />
            </li>
          ))}
        </ul>
      </aside>
      {/* <Aside user={null} /> */}

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center gap-x-4 mb-4">
          <UserCheck className="w-5 h-5 text-blue-500" />
          <div className={`w-36 h-6 rounded ${shimmer}`} />
        </div>

        {/* Image and Prefix */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`h-20 w-20 rounded-full ${shimmer}`} />
          <div className={`w-32 h-10 rounded ${shimmer}`} />
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className={`w-24 h-4 rounded ${shimmer}`} />
              <div className={`w-full h-10 rounded ${shimmer}`} />
            </div>
          ))}
        </div>

        {/* Credentials */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center gap-x-4 mb-2">
            <LockKeyholeOpen className="w-5 h-5 text-blue-500" />
            <div className={`w-32 h-6 rounded ${shimmer}`} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className={`w-full h-10 rounded ${shimmer}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Signature Section */}
        <div className="space-y-6 mb-10">
          <div className="flex items-center gap-x-4">
            <Signature className="w-5 h-5 text-blue-500" />
            <div className={`w-36 h-6 rounded ${shimmer}`} />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className={`w-72 h-32 rounded ${shimmer}`} />
            <div className={`w-72 h-32 rounded ${shimmer}`} />
          </div>
        </div>

        {/* Hospital Assignment */}
        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-x-4 mb-2">
            <Hospital className="w-5 h-5 text-blue-500" />
            <div className={`w-36 h-6 rounded ${shimmer}`} />
          </div>

          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-sm ${shimmer}`} />
                <div className={`w-28 h-4 rounded ${shimmer}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`w-36 h-10 rounded-full ${shimmer}`} />
          ))}
        </div>
      </main>
    </div>
  );
}
