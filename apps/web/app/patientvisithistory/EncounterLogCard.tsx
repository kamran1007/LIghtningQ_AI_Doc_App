import {
  CalendarDays,
  Stethoscope,
  User,
  ClipboardList,
  ArrowRightCircle,
} from "lucide-react";
import clsx from "clsx";

const statusColors = {
  Completed: "bg-green-100 text-green-700",
  InCompleted: "bg-yellow-100 text-yellow-800",
  Cancelled: "bg-red-100 text-red-700",
  Rescheduled: "bg-blue-100 text-blue-700",
} as const;
type StatusKey = keyof typeof statusColors;

export default function EncounterLogCard({
  appointmentcasesheet,
}: {
  appointmentcasesheet: any;
}) {
  const DoctorData = appointmentcasesheet?.appointment?.doctor;
  const encounterType =
    appointmentcasesheet?.appointment?.visitType?.AppointmentTypeName || "—";
  const providerName = DoctorData
    ? `${DoctorData?.firstName} ${DoctorData?.lastName}`
    : "—";
  const specialization = DoctorData?.Specialization?.SpecializationName || "—";
  // const encounterId = consultation?.ConsultationId || "—";
  const notes =
    appointmentcasesheet?.CheifcomplaintNotes || "No summary provided.";
  const nextAction =
    appointmentcasesheet?.ConsultationFollowUpPlan?.[0]?.followUpText || "—";
  const displayStatus: StatusKey = appointmentcasesheet?.consultationStatus ===
  "Completed"
    ? "Completed"
    : "InCompleted";
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 mb-4">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            {encounterType}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            {new Date(
              appointmentcasesheet?.appointment?.appointmentDate
            ).toLocaleString()}
          </p>

          <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-1">
            <User className="w-4 h-4" />
            Dr. {providerName} ({specialization})
          </p>
        </div>

        {/* Status Badge & Encounter ID */}
        <div className="flex flex-col items-end gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span
            className={clsx(
              "text-xs font-semibold px-3 py-1 rounded-full",
              statusColors[displayStatus] || "bg-gray-100 text-gray-700"
            )}
          >
            {displayStatus}
          </span>
          <div className="flex flex-col items-end">
            {/* <ClipboardList className="w-4 h-4 text-blue-500 mb-1" /> */}
            {/* <span className="text-xs">Encounter ID</span> */}
            {/* <span className="font-medium">{encounterId}</span> */}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-zinc-700 my-4" />

      {/* Encounter Details */}
      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
        <p>
          <strong className="text-gray-800 dark:text-white">Reason:</strong>{" "}
          {appointmentcasesheet?.appointment?.reason || "—"}
        </p>
        <p>
          <strong className="text-gray-800 dark:text-white">
            Next Action:
          </strong>{" "}
          {nextAction}
        </p>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white mb-1">
            Clinical Summary:
          </p>
          <p className="whitespace-pre-line">{notes}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-right">
        <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
          View Full Details <ArrowRightCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
