//app/dashboard/AnalyticalHistoricalReports.tsx
import React from "react";
import Chart from "react-apexcharts";

interface AnalyticalHistoricalReportsProps {
  revenueTrend: { month: string; revenue: number }[];
  doctorPerformance: { doctorName: string; appointments: number }[];
}
const AnalyticalHistoricalReports = ({
  revenueTrend,
  doctorPerformance,
}: AnalyticalHistoricalReportsProps) => {
  console.log("Revenue Trend:", revenueTrend);
  console.log("Doctor Performance:", doctorPerformance);

  const revenueTrendOptions = {
    chart: { type: "line", toolbar: { show: false } },
    stroke: { curve: "smooth", width: 3 },
    colors: ["#00C49F"],
    xaxis: { categories: revenueTrend.categories },
    yaxis: {
      labels: {
        formatter: (val: number) => `₹${val.toFixed(2)}`, // format only in UI
      },
    },
    dataLabels: { enabled: false },
  };

  const revenueTrendSeries = [
    { name: "Monthly Revenue", data: revenueTrend.series },
  ];

  const doctorPerformanceOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#22E0D4"],
    plotOptions: { bar: { borderRadius: 6, horizontal: false } },
    xaxis: { categories: doctorPerformance.categories },
    yaxis: { title: { text: "Appointments" } },
  };

  const doctorPerformanceSeries = [
    { name: "Appointments", data: doctorPerformance.series },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      {/* Monthly Revenue Trend */}
      <div className="p-[1px] rounded-2xl bg-transparent hover:bg-gradient-to-r from-cyan-500 to-teal-500 transition-all">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-lg font-mono mb-3">
            Monthly Revenue Trend (6 months)
          </h2>
          <Chart
            options={revenueTrendOptions}
            series={revenueTrendSeries}
            type="line"
            height={250}
          />
        </div>
      </div>

      {/* Doctor Performance */}
      <div className="p-[1px] rounded-2xl bg-transparent hover:bg-gradient-to-r from-cyan-500 to-teal-500 transition-all">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-lg font-mono mb-3">
            Doctor Performance (6 months)
          </h2>
          <Chart
            options={doctorPerformanceOptions}
            series={doctorPerformanceSeries}
            type="bar"
            height={250}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticalHistoricalReports;
