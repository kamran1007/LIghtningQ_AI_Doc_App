export const ProfileSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Avatar Skeleton */}
      <div className="flex justify-center my-4">
        <div className="h-20 w-20 rounded-full bg-gray-200 animate-pulse"></div>
      </div>

      {/* First and Last Name Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
      </div>

      {/* Mobile and DOB Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
      </div>

      {/* Button Skeleton */}
      <div className="flex justify-end pt-4">
        <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
      </div>
    </div>
  );
};
