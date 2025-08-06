import { useEvents } from "@/context/events-context";
import { PencilIcon, CalendarPlusIcon } from "lucide-react"; // or any icons you prefer

export function ActionButtons() {
  const { setRegisterPatientOpen, setEventAddOpen } = useEvents(); // your modal control

  return (
    <div className="flex gap-4 mt-4">
      {/* ✏️ Edit Patient Button */}
      <button
        onClick={() => setRegisterPatientOpen(true)}
        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 hover:text-blue-600"
      >
        <PencilIcon className="w-4 h-4" />
        Edit Patient
      </button>

      {/* 📅 Book Appointment Button */}
      <button
        onClick={() => setEventAddOpen(true)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300"
      >
        <CalendarPlusIcon className="w-4 h-4" />
        Book Appointment
      </button>
    </div>
  );
}
