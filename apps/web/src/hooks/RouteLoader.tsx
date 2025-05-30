"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { startLoading, stopLoading } from "@/store/globalLoaderSlice";

export default function RouteLoader() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      dispatch(startLoading());

      // Simulate brief delay to see loader (optional, remove in prod)
      const timer = setTimeout(() => {
        dispatch(stopLoading());
      }, 300); // adjust delay as needed

      prevPathRef.current = pathname;
      return () => clearTimeout(timer);
    }
  }, [pathname, dispatch]);

  return null;
}
