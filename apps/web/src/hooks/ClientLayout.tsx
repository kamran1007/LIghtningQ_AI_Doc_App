// components/ClientLayout.tsx
"use client";

import GlobalLoader from "@/hooks/GlobalLoader";
import { ReactNode } from "react";

const ClientLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <GlobalLoader />
      {children}
    </>
  );
};

export default ClientLayout;
