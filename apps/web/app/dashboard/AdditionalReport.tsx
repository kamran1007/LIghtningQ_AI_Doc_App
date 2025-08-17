import React from "react";

export default function AdditionalReport() {
  return (
    <div>
      <section className="bg-white p-4 rounded-2xl border shadow-sm border-gray-300 mt-2">
        <h4 className="text-sm font-medium">Latest Reports</h4>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 border-gray-300">
          <div className="p-3 border rounded-lg border-gray-300">
            Monthly Summary · July 2025
          </div>
          <div className="p-3 border rounded-lg border-gray-300">
            Top Doctors · Last 30 days
          </div>
          <div className="p-3 border rounded-lg border-gray-300">
            No-show Risk · AI Predictions
          </div>
        </div>
      </section>
    </div>
  );
}
