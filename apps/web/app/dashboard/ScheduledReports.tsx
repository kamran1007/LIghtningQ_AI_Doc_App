import React, { useEffect, useState } from "react";
import { Calendar, CalendarSync, Mail } from "lucide-react";
import {
  AddReportSchedular,
  FetchHospital,
  getReportsSchedularByUser,
  UpdateReportSchedular,
} from "@/lib/dashboard"; // ⭐ import
import toast from "react-hot-toast";
import { FetchDoctorRole } from "@/lib/bookappointment";
import { getProfile } from "@/lib/action";

const ScheduledReports = () => {
  const [frequency, setFrequency] = useState<"Weekly" | "Monthly">("Weekly");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [hospitalData, setHospitalData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userprofiledata, setUserprofiledata] = useState<any>(null);

  const reportTypes = [
    "Total Appointments",
    "Top Doctors",
    "Top Specializations",
    "Revenue Breakdown",
    "Patient Demographics",
  ];

  const toggleReport = (report: string) => {
    setSelectedReports((prev) =>
      prev.includes(report)
        ? prev.filter((r) => r !== report)
        : [...prev, report]
    );
  };

  // ⭐ New function to fetch reports
  const fetchReports = async (adminId: number, hospitalId: number) => {
    try {
      const res = await getReportsSchedularByUser(adminId, hospitalId);
      console.log("Fetched Reports:", res);

      if (res?.reports?.length > 0) {
        const found = res.reports.find((r: any) => r.frequency === frequency);
        if (found) {
          setSelectedReports(found.reportTypes || []);
        } else {
          setSelectedReports([]); // nothing scheduled for this frequency
        }
      }
    } catch (err) {
      console.error("Error fetching reports", err);
      toast.error("Failed to fetch scheduled reports");
    }
  };

  // Initial load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const resp = await getProfile();
        setUserprofiledata(resp);
        setIsLoading(true);

        const [docRes, hosRes] = await Promise.all([
          FetchDoctorRole(),
          FetchHospital(),
        ]);

        setDoctors(docRes?.return ?? []);
        setHospitalData(hosRes ?? []);

        // ⭐ fetch existing schedules (once we have ids)
        if (resp?.user?.UserId && hosRes?.[0]?.HospitalId) {
          await fetchReports(resp.user.UserId, hosRes[0].HospitalId);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to fetch initial data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // ⭐ Refetch reports whenever frequency changes
  useEffect(() => {
    if (userprofiledata?.user?.UserId && hospitalData?.[0]?.HospitalId) {
      fetchReports(userprofiledata.user.UserId, hospitalData[0].HospitalId);
    }
  }, [frequency]);

  const handleSchedule = async () => {
    if (selectedReports.length === 0) {
      toast.error("Please select at least one report type.");
      return;
    }

    try {
      setLoading(true);

      // find if a report already exists for this frequency
      const existing = await getReportsSchedularByUser(
        userprofiledata?.user?.UserId,
        hospitalData[0]?.HospitalId
      );

      const found = existing?.reports?.find(
        (r: any) => r.frequency === frequency
      );

      const payload = {
        frequency,
        reportTypes: selectedReports,
        // nextRunAt:
        //   frequency === "Weekly"
        //     ? new Date().toISOString() // example: today, backend will adjust
        //     : new Date().toISOString(),
      };

      let res;
      if (found) {
        // ✅ Update existing schedule
        res = await UpdateReportSchedular(found.ScheduledReportId, payload);
        toast.success(`${frequency} report updated successfully!`);
      } else {
        // ✅ Create new one
        res = await AddReportSchedular({
          hospitalId: hospitalData[0]?.HospitalId,
          adminId: userprofiledata?.user?.UserId,
          ...payload,
        });
        toast.success(`${frequency} report scheduled successfully!`);
      }

      console.log("Scheduled Report Response:", res);
    } catch (err: any) {
      toast.error(err.message || "Failed to schedule/update report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-[1px] rounded-2xl bg-transparent hover:bg-gradient-to-r hover:from-cyan-500 hover:to-teal-500 mt-6 transition-all duration-300">
      <div className="bg-white p-4 rounded-2xl shadow-sm transition-all duration-300">
        <h2 className="text-lg font-mono mb-4">
          <div className="flex items-center gap-2">
            <CalendarSync className="h-6 w-6 text-teal-300" />
            <span className="font-mono">Scheduled Reports</span>
          </div>
        </h2>

        {/* Frequency Selector */}
        <div className="flex gap-4 mb-4">
          {["Weekly", "Monthly"].map((freq) => (
            <button
              key={freq}
              onClick={() => setFrequency(freq as "Weekly" | "Monthly")}
              className={`px-4 py-2 rounded-lg border-gray-300 transition ${
                frequency === freq
                  ? "bg-teal-300 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {freq}
            </button>
          ))}
        </div>

        {/* Report Types */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {reportTypes.map((report) => (
            <label
              key={report}
              className={`cursor-pointer p-3 border-gray-100 rounded-lg flex items-center gap-2 transition ${
                selectedReports.includes(report)
                  ? "bg-teal-50 border-green-400"
                  : "hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedReports.includes(report)}
                onChange={() => toggleReport(report)}
              />
              {report}
            </label>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleSchedule}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition ${
              loading ? "bg-gray-400" : "bg-teal-300 hover:bg-teal-400"
            }`}
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Mail size={16} /> Schedule {frequency} Report
              </>
            )}
          </button>
          <span className="text-gray-500 text-sm flex items-center gap-1">
            <Calendar size={14} /> Next report:{" "}
            {frequency === "Weekly" ? "Monday" : "1st of Month"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScheduledReports;
