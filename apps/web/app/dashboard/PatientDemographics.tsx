// components/dashboard/PatientDemographics.tsx
"use client";
import { ApexOptions } from "apexcharts";

import React from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Clock, UserPlus } from "lucide-react";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface PatientDemographicsProps {
  data: {
    male: number;
    female: number;
    other: number;
    fastTrack: number;
    highAcuity: number;
    newPatients: number;
    newAppointments: number;
  };
}

export default function PatientDemographics({ data }: PatientDemographicsProps) {
  const chartOptions: ApexOptions = {
    chart: { type: "pie" }, // 👈 must match actual chart type
    labels: ["Male", "Female", "Other"],
    colors: ["#87dbeb", "#df78ec", "#FEB019"],
    legend: { position: "bottom" },
  };

  const chartSeries = [data.male, data.female, data.other];

  const summaryCards = [
    { title: "Fast Track", value: data.fastTrack, icon: <Clock className="text-blue-500" /> },
    { title: "High Acuity", value: data.highAcuity, icon: <Activity className="text-red-500" /> },
    { title: "New Patients", value: data.newPatients, icon: <UserPlus className="text-green-500" /> },
    { title: "New Appointments", value: data.newAppointments, icon: <Users className="text-purple-500" /> },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Patient Demographics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender Distribution Chart */}
          <div className="flex justify-center">
            <ApexChart options={chartOptions} series={chartSeries} type="pie" height={250} />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            {summaryCards.map((card, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg shadow-sm flex items-center gap-3">
                <div className="p-2 bg-white rounded-full shadow">{card.icon}</div>
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-lg font-semibold">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
