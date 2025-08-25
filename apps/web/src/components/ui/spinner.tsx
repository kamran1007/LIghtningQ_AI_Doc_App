import React from "react";

type SpinnerProps = {
  className?: string;
};

export const Spinner: React.FC<SpinnerProps> = ({ className = "" }) => (
  <div className={`animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-teal-500 ${className}`} />
);
