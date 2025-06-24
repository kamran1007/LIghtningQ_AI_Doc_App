export const DoctorCostingSkeleton = () => {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="h-6 w-1/3 bg-gray-200 rounded-md animate-pulse" />
          {/* <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" /> */}
        </div>
  
        {/* Hospital Dropdown */}
        <div className="w-[40%]">
          <div className="h-5 w-1/2 bg-gray-200 mb-2 rounded-md animate-pulse" />
          <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
        </div>
  
        {/* Fee Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx}>
              <div className="h-5 w-2/3 bg-gray-200 mb-2 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
            </div>
          ))}
        </div>
  
        {/* Additional Costing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx}>
              <div className="h-5 w-2/3 bg-gray-200 mb-2 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
            </div>
          ))}
        </div>
  
        {/* Tax & Discount & Insurance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx}>
              <div className="h-5 w-2/3 bg-gray-200 mb-2 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
            </div>
          ))}
          {/* Insurance Switch */}
          <div className="flex items-end gap-2 mt-6">
            <div className="h-5 w-5 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
  
        {/* Footer Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>
    );
  };
  