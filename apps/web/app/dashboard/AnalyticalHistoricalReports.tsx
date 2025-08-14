//app/dashboard/AnalyticalHistoricalReports.tsx
import React from "react";
import Chart from "react-apexcharts";

const AnalyticalHistoricalReports = () => {
  const revenueTrendOptions = {
    chart: { type: "line", toolbar: { show: false } },
    stroke: { curve: "smooth", width: 3 },
    colors: ["#00C49F"],
    xaxis: { categories: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"] },
    yaxis: { labels: { formatter: (val) => `₹${val}K` } },
    dataLabels: { enabled: false },
  };
  const revenueTrendSeries = [
    { name: "Monthly Revenue", data: [120, 150, 170, 140, 200, 230] },
  ];

  const doctorPerformanceOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#22E0D4"],
    plotOptions: { bar: { borderRadius: 6, horizontal: false } },
    xaxis: { categories: ["Dr. Smith", "Dr. Johnson", "Dr. Patel", "Dr. Lee"] },
    yaxis: { title: { text: "Appointments" } },
  };
  const doctorPerformanceSeries = [
    { name: "Appointments", data: [320, 280, 300, 250] },
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
