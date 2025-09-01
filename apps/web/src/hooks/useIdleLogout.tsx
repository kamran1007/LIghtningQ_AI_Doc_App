"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
// import Cookies from "js-cookie"; // npm i js-cookie
import { startLoading } from "@/store/globalLoaderSlice";
import { clearUser } from "@/store/authSlice";
import { clearSelectedHospital } from "@/store/HospitalBranchSelectionSlice";
import { persistor } from "@/store";
import { useAppDispatch } from "@/store/hooks";

export function useIdleLogout(timeout = 10 * 60 * 1000) {
  // default 10 min
  const dispatch = useAppDispatch();

  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const logout = () => {
    // ✅ clear cookies
    // Cookies.remove("access_token");
    // Cookies.remove("refresh_token");

    dispatch(startLoading());

    // Clear redux state
    dispatch(clearUser());
    dispatch(clearSelectedHospital());

    // 🔑 Clear ALL persisted redux slices
    persistor.purge().then(() => {
      console.log("✅ Redux Persist cleared");
      // Also clear localStorage/sessionStorage completely if needed
      localStorage.clear();
      sessionStorage.clear();

      // Redirect
      setTimeout(() => {
        window.location.href = "/api/auth/logout";
      }, 300);
    });


  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, timeout);
  };

  useEffect(() => {
    // user activity events
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // start timer initially

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeout]);
}
