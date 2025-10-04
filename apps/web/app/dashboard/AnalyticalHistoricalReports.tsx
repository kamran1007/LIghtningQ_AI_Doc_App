import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface AnalyticalHistoricalReportsProps {
  revenueTrend: { month: string; revenue: number }[];
  doctorPerformance: { doctorName: string; appointments: number }[];
}

const AnalyticalHistoricalReports = ({
  revenueTrend,
  doctorPerformance,
}: AnalyticalHistoricalReportsProps) => {
  // 🔹 Revenue chart config
  const revenueTrendOptions: ApexOptions = {
    chart: { type: "line", toolbar: { show: false } },
    stroke: { curve: "smooth", width: 3 },
    colors: ["#00C49F"],
    xaxis: {
      categories: revenueTrend.map((r) => r.month), // ✅ extract months
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `₹${val.toFixed(2)}`, // format in UI
      },
    },
    dataLabels: { enabled: false },
  };

  const revenueTrendSeries = [
    { name: "Monthly Revenue", data: revenueTrend.map((r) => r.revenue) }, // ✅ extract revenue
  ];

  // 🔹 Doctor performance chart config
  const doctorPerformanceOptions: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#22E0D4"],
    plotOptions: { bar: { borderRadius: 6, horizontal: false } },
    xaxis: {
      categories: doctorPerformance.map((d) => d.doctorName), // ✅ doctor names
    },
    yaxis: { title: { text: "Appointments" } },
  };

  const doctorPerformanceSeries = [
    { name: "Appointments", data: doctorPerformance.map((d) => d.appointments) }, // ✅ appointments
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      {/* Monthly Revenue Trend */}
      <div className="p-[1px] rounded-2xl bg-transparent hover:bg-gradient-to-r from-cyan-500 to-teal-500 transition-all">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-lg font-mono mb-3">Monthly Revenue Trend</h2>
          <Chart
            options={revenueTrendOptions}
            series={revenueTrendSeries}
            type="line" // ✅ valid ApexCharts type
            height={250}
          />
        </div>
      </div>

      {/* Doctor Performance */}
      <div className="p-[1px] rounded-2xl bg-transparent hover:bg-gradient-to-r from-cyan-500 to-teal-500 transition-all">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-lg font-mono mb-3">Doctor Performance</h2>
          <Chart
            options={doctorPerformanceOptions}
            series={doctorPerformanceSeries}
            type="bar" // ✅ valid ApexCharts type
            height={250}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticalHistoricalReports;
