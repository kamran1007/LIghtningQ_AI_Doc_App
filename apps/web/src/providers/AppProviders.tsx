"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import GlobalLoader from "@/hooks/GlobalLoader";
import RouteLoader from "@/hooks/RouteLoader";
import { Initializer } from "@/hooks/ClientLayoutWrapper";

const ClientLayout = dynamic(() => import("@/hooks/ClientLayout"), {
  ssr: false,
});

const queryClient = new QueryClient();

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<GlobalLoader />}>
        <QueryClientProvider client={queryClient}>
          <Initializer />
          <RouteLoader />
          <ClientLayout>{children}</ClientLayout>
          <GlobalLoader />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
