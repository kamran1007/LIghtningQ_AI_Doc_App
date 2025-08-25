// ClientLayoutWrapper.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { loadHospitalFromStorage } from "@/store/HospitalBranchSelectionSlice"; 
import RouteLoader from "@/hooks/RouteLoader";
import GlobalLoader from "@/hooks/GlobalLoader";
import dynamic from "next/dynamic";
import { loadAuthFromStorage } from "@/store/authSlice";
import type { AppDispatch } from "@/store"; // ⬅️ from your store.ts


const ClientLayout = dynamic(() => import("@/hooks/ClientLayout"), { ssr: false });

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <Initializer />  {/* ⬅️ runs once after Redux mounts */}
      <RouteLoader />
      <GlobalLoader />
      <ClientLayout>{children}</ClientLayout>
    </ReduxProvider>
  );
}

function Initializer() {
  const dispatch = useDispatch<AppDispatch>(); // ✅ correct typing

  useEffect(() => {
    dispatch(loadHospitalFromStorage());
    dispatch(loadAuthFromStorage());
  }, [dispatch]);

  return null;
}

