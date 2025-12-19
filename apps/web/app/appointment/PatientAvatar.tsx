// components/PatientAvatar.tsx
"use client";
import Image from "next/image";
import { useState } from "react";

type Props = {
  src?: string | null;
  alt: string;
  initials: string;
  colorClass: string;
};

export function PatientAvatar({ src, alt, initials, colorClass }: Props) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${colorClass}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="w-10 h-10 rounded-full object-cover border"
      onError={() => setImageError(true)}
    />
  );
}
