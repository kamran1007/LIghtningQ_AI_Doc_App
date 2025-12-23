"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import ClientAppBarWrapper from "@/hooks/ClientAppBarWrapper";

export default function LayoutVisibility({
  session,
  children,
}: {
  session: any;
  children: ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith("/auth");
  const isFullscreen = pathname.endsWith("/fullscreen");

  return (
    <>
      {!isAuthPage && !isFullscreen && (
        <ClientAppBarWrapper session={session} />
      )}

      <div className="flex flex-1 overflow-hidden">
        {!isAuthPage && !isFullscreen && session?.user && (
          <AppSidebar />
        )}

        <main
          className={`flex-1 overflow-y-auto ${
            isFullscreen ? "p-0" : "p-4"
          }`}
        >
          {children}
        </main>
      </div>
    </>
  );
}
