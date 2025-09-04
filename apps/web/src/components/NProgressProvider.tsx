// app/components/NProgressProvider.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

export default function NProgressProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.start();

    // Give a small delay so it's visible before finishing
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);
    console.log("CLIENT: Navigated to", pathname); // 👈 shows in browser console
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] CLIENT: Navigated to ${pathname}`);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname, searchParams]);

  return null;
}
