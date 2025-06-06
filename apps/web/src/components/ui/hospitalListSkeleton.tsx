import React from "react";

export const HospitalTableSkeleton = () => {
  const rows = [1, 2, 3,4,5,6,7,8,9]; // You can change the number of skeleton rows here

  return (
    <div className="rounded-xl border overflow-hidden shadow-sm animate-pulse">
      {/* Header */}
      <div className="grid grid-cols-6 gap-4 bg-gray-100 px-6 py-3  text-sm font-medium text-gray-500">
        <div>Hospital Name</div>
        <div>Hospital Code</div>
        <div>Address</div>
        <div>Contact Number</div>
        <div>Email</div>
        <div>Status</div>
      </div>

      {/* Rows */}
      {rows.map((_, idx) => (
        <div
          key={idx}
          className={`grid grid-cols-6 gap-4 items-center px-6 py-4 ${
            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
          }`}
        >
          <div className="h-4 w-28 bg-gray-200 rounded-md" />
          <div className="h-4 w-20 bg-gray-200 rounded-md" />
          <div className="h-4 w-36 bg-gray-200 rounded-md" />
          <div className="h-4 w-24 bg-gray-200 rounded-md" />
          <div className="h-4 w-28 bg-gray-200 rounded-md" />
          <div className="h-4 w-16 bg-gray-200 rounded-md" />
        </div>
      ))}
    </div>
  );
};
