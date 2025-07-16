import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

const PatientAvatar = ({ profileImageUrl, firstName, lastName }: any) => {
  const initials = getInitials(firstName, lastName);
  const fallbackColor = getColorByInitials(initials);

  const [isImageBroken, setIsImageBroken] = useState(false);

  const fullImageUrl = profileImageUrl ? `${BACKEND_URL}${profileImageUrl}` : null;

  return (
    <a href={fullImageUrl} target="_blank" rel="noopener noreferrer">
      <Avatar className="w-10 h-10 cursor-pointer">
        {!isImageBroken && profileImageUrl ? (
          <AvatarImage
            src={fullImageUrl}
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
