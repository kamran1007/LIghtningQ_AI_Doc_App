// components/RedirectWithLoader.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks"; // <- custom typed hook
import { startLoading } from "@/store/globalLoaderSlice";

export default function RedirectWithLoader({ to }: { to: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(startLoading());
    router.push(to);
  }, [dispatch, router, to]);

  return null;
}
