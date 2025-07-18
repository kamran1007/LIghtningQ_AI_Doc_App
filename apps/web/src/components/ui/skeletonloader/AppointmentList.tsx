// AppointmentListSkeleton.tsx
import React from "react";

const shimmer = "animate-pulse bg-zinc-200";

export default function AppointmentListSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-md shadow-sm bg-white">
      <table className="w-full text-sm text-left">
        <thead className="bg-purple-100 text-zinc-600 text-xs font-sans">
          <tr className="divide-x divide-zinc-200">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">MRN</th>
            <th className="px-4 py-3">Contact Info</th>
            <th className="px-4 py-3">Age</th>
            <th className="px-4 py-3">Specialist</th>
            <th className="px-4 py-3">Reason</th>
            <th className="px-4 py-3">Acuity</th>
            <th className="px-4 py-3">Assigned Provider</th>
            <th className="px-4 py-3">Last Visit</th>
            <th className="px-2 py-3 w-16 text-center">Action</th>
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
              {/* Specialist */}
              <td className="px-4 py-3">
                <div className={`h-4 w-24 rounded ${shimmer}`} />
              </td>
              {/* Reason */}
              <td className="px-4 py-3">
                <div className={`h-4 w-20 rounded ${shimmer}`} />
              </td>
              {/* Acuity */}
              <td className="px-4 py-3">
                <div className={`h-4 w-16 rounded ${shimmer}`} />
              </td>
              {/* Assigned Provider */}
              <td className="px-4 py-3">
                <div className={`h-4 w-24 rounded ${shimmer}`} />
              </td>
              {/* Last Visit */}
              <td className="px-4 py-3">
                <div className={`h-4 w-16 rounded ${shimmer}`} />
              </td>
              {/* Action */}
              <td className="px-2 py-3 text-center">
                <div className="w-5 h-5 rounded-full bg-zinc-300 animate-pulse mx-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
