export const DoctorSlotSkeleton = () => {
    return (
      <div className="p-4 space-y-6">
        {/* Title */}
        <div className="h-6 w-1/3 bg-gray-300 rounded-md animate-pulse" />
  
        {/* Day Buttons */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div
              key={idx}
              className="h-10 rounded-full bg-gray-200 animate-pulse"
            />
          ))}
        </div>
  
        {/* Slots for only 1 day */}
        <div className="border rounded-3xl p-4 space-y-4 bg-white drop-shadow-md border-gray-300">
          {/* Day Header */}
          <div className="h-5 w-1/4 bg-gray-200 rounded-md animate-pulse" />
  
          {/* Morning Slot */}
          <div className="flex justify-center gap-4">
            <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mt-2" />
          </div>
  
          {/* Evening Slot */}
          <div className="flex justify-center gap-4">
            <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mt-2" />
          </div>
  
          {/* Consult Time */}
          <div className="h-10 w-1/4 bg-gray-200 rounded-md animate-pulse" />
        </div>
  
        {/* Hospital Dropdown */}
        <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
  
        {/* Accept Appointments Switch */}
        <div className="flex items-center gap-2 mt-4">
          <div className="h-5 w-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-60 bg-gray-200 rounded animate-pulse" />
        </div>
  
        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>
    );
  };
  