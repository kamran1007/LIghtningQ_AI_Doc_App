import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BACKEND_URL } from "@/lib/constants";
import { useState } from "react";

const PatientAvatar = ({ profileImageUrl, firstName, lastName }: any) => {
  const getInitials = (firstName: string = "", lastName: string = "") => {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  };

  const getColorByInitials = (initials: string) => {
    const code = initials.charCodeAt(0);
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-pink-100 text-pink-600",
      "bg-green-100 text-green-600",
      "bg-yellow-100 text-yellow-600",
      "bg-purple-100 text-purple-600",
      "bg-orange-100 text-orange-600",
      "bg-red-100 text-red-600",
      "bg-teal-100 text-teal-600",
      "bg-indigo-100 text-indigo-600",
      "bg-cyan-100 text-cyan-600",
    ];
    return colors[code % colors.length];
  };

  const initials = getInitials(firstName, lastName);
  const fallbackColor = getColorByInitials(initials);

  const [isImageBroken, setIsImageBroken] = useState(false);

  const fullImageUrl = profileImageUrl
    ? `${BACKEND_URL}${profileImageUrl}`
    : null;

  return (
    <a
      href={fullImageUrl ?? undefined} // 👈 normalize null to undefined
      target="_blank"
      rel="noopener noreferrer"
    >
      <Avatar className="w-10 h-10 cursor-pointer">
        {!isImageBroken && profileImageUrl ? (
          <AvatarImage
            src={fullImageUrl ?? undefined} // 👈 same here
            alt={`${firstName} ${lastName}`}
            onError={() => setIsImageBroken(true)}
          />
        ) : (
          <AvatarFallback className={`text-xs font-semibold ${fallbackColor}`}>
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </a>
  );
};
