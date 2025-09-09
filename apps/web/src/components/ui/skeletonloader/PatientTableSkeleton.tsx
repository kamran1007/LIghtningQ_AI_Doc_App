// PatientTableSkeleton.tsx
import React from "react";
import { cn } from "@/lib/utils";

const shimmer = "animate-pulse bg-zinc-200";

export default function PatientTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-md shadow-sm bg-blue-200">
      <table className="w-full text-sm text-left border-b border-blue-200">
        <thead
          className="text-zinc-600 text-xs font-sans border-b"
          style={{
            background:
              "linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(129, 140, 248, 0.15) 100%)",
            borderColor: "rgba(129, 140, 248, 0.3)", // subtle gradient-like border
          }}
        >
          {" "}
          <tr className="divide-x divide-zinc-200">
            <th className="px-4 py-3 border-b border-blue-200">Name</th>
            <th className="px-4 py-3 border-b border-blue-200">MRN</th>
            <th className="px-4 py-3 border-b border-blue-200">Contact Info</th>
            <th className="px-4 py-3 border-b border-blue-200">Age</th>
            <th className="px-4 py-3 border-b border-blue-200">Last Visit</th>
            <th className="px-2 py-3 w-16 text-center border-b border-blue-400">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, idx) => (
            <tr key={idx} className="hover:bg-[#EFFFFD]">
              {/* Name with avatar */}
              <td className="flex items-center gap-3 px-4 py-3">
                <div className={`w-10 h-10 rounded-full ${shimmer}`} />
                <div className={`h-4 w-24 rounded ${shimmer}`} />
              </td>
              {/* MRN */}
              <td className="px-4 py-3">
                <div className={`h-4 w-20 rounded ${shimmer}`} />
              </td>
              {/* Contact Info */}
              <td className="px-4 py-3">
                <div className={`h-4 w-24 rounded ${shimmer} mb-1`} />
                <div className={`h-3 w-28 rounded ${shimmer}`} />
              </td>
              {/* Age */}
              <td className="px-4 py-3">
                <div className={`h-4 w-16 rounded ${shimmer}`} />
              </td>
              {/* Last Visit */}
              <td className="px-4 py-3">
                <div className={`h-4 w-12 rounded ${shimmer}`} />
              </td>
              {/* Action (3-dot icon mimic) */}
              <td className="px-2 py-3 w-16 text-center">
                <div className="flex justify-center">
                  <div className="w-5 h-5 rounded-full bg-zinc-300 animate-pulse" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
