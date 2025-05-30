"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { ReduxProvider } from "@/providers/ReduxProvider";
import RouteLoader from "@/hooks/RouteLoader";
import GlobalLoader from "@/hooks/GlobalLoader";

const ClientLayout = dynamic(() => import("@/hooks/ClientLayout"), {
  ssr: false,
});

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <RouteLoader />
      <GlobalLoader />
      <ClientLayout>{children}</ClientLayout>
    </ReduxProvider>
  );
}
