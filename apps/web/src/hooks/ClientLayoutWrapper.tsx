// ClientLayoutWrapper.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import ReduxProvider from "@/providers/ReduxProvider";
import { loadHospitalFromStorage } from "@/store/HospitalBranchSelectionSlice";
import RouteLoader from "@/hooks/RouteLoader";
import GlobalLoader from "@/hooks/GlobalLoader";
import dynamic from "next/dynamic";
import { loadAuthFromStorage } from "@/store/authSlice";
import { persistor, store, type AppDispatch } from "@/store"; // ⬅️ from your store.ts
import { PersistGate } from "redux-persist/integration/react";
import { startLoading, stopLoading } from "@/store/globalLoaderSlice";

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

const ClientLayout = dynamic(() => import("@/hooks/ClientLayout"), {
  ssr: false,
});

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<GlobalLoader />}>
        <ClientLayout>
          {children}
        </ClientLayout>
        {/* Always mounted global loader (overlay triggered by slice) */}
        <GlobalLoader />
      </PersistGate>
    </Provider>
  );
}

export function Initializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const init = async () => {
      try {
        dispatch(startLoading()); // 🔵 Start global loader
        // restore persisted parts of state
        dispatch(loadAuthFromStorage());
        dispatch(loadHospitalFromStorage());
      } finally {
        dispatch(stopLoading()); // 🔴 Stop global loader
      }
    };
    init();
  }, [dispatch]);

  return null;
}
