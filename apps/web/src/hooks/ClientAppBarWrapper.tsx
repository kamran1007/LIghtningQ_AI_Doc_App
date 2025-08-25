"use client";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/authSlice";
import AppBar from "@/components/appBar";

export default function ClientAppBarWrapper({ session }: { session: any }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth) || {};
  const selectedHospital = useSelector(
    (state: any) => state.hospitalSelection?.selectedHospital
  );
    const isLoading = useSelector((state: any) => state.globalLoader.isLoading);

  useEffect(() => {
    if (session?.user && !user) {
      dispatch(setUser(session.user));
    }
  }, [session, user, dispatch]);

  console.log("Redux Auth User:", user);
  console.log("Redux Selected Hospital:", selectedHospital);
  console.log("Session loading:", isLoading);

  // 🔑 Normalize user object so casing doesn’t matter
  const finalUser = useMemo(() => {
    const raw = user || session?.user;
    if (!raw) return null;
    return {
      ...raw,
      roleId: raw.roleId ?? raw.RoleId ?? null, // normalize casing
    };
  }, [user, session]);

  console.log("Final Normalized User:", finalUser);

  return (
    <>
      {!isLoading && finalUser?.roleId && selectedHospital?.hospitalId ? (
        <AppBar />
      ) : (
        <></>
      )}
    </>
  );
}
