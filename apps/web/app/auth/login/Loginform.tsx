"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/submitButton";
import { getProfile } from "@/lib/action";
import { login } from "@/lib/auth";
import { FormState } from "@/lib/types";
import { useSelector } from "react-redux";

import { startLoading, stopLoading } from "@/store/globalLoaderSlice";
import { useAppDispatch } from "@/store/hooks";
import {
  loadHospitalFromStorage,
  setSelectedHospital,
} from "@/store/HospitalBranchSelectionSlice";
import React, { useEffect, useRef, useState } from "react";
import { useActionState } from "react"; // not react-dom
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getSession } from "@/lib/session";
import { fetchAccessRight } from "@/store/LoginAccessRightSlice";
import { setProfile } from "@/store/authSlice";
import { RootState } from "@/store";
import { Toast } from "primereact/toast";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

const LoginInForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const selectedHospital = useSelector(
    (state: any) => state.hospital.selectedHospital
  );
  const profile = useSelector((state: RootState) => state.auth.profile);

  const [hospitals, setHospitals] = React.useState<any[]>([]);

  const [stage, setStage] = useState<"login" | "hospital">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const [sessionProfile, setSessionProfile] = useState<any>(null);
  const toast = useRef<Toast>(null);

  const [state, action] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      try {
        dispatch(startLoading());
        const result = await login(prevState, formData);

        // if login successful → fetch hospitals
        const profile = await getProfile();
        if (profile) {
          dispatch(setProfile(profile)); // <-- You need this in authSlice
        }
        const session = await getSession();
        console.log("Session in login page:", session);
        const UserSession = session?.user;
        setSessionProfile(UserSession);
        // ✅ Check if user is active
        if (!profile?.user?.isActive) {
          toast.current?.show({
            severity: "error",
            summary: "Access Denied",
            detail: "Your account is inactive. Please contact admin.",
            life: 4000,
            className: "custom-toast-container",
          });
          return result; // stop login flow
        }

        if (profile?.user?.AssignHospital?.length) {
          const list = profile.user.AssignHospital;
          setHospitals(list);

          if (list.length === 1) {
            const hospital = list[0]?.hospital; // ✅ correctly reference first hospital

            if (!hospital?.isActive || hospital?.status !== "ACTIVE") {
              toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "This hospital is inactive. Please contact admin.",
                life: 4000,
                className: "custom-toast-container", // for blur
              });
              return;
            }

            dispatch(setSelectedHospital(list[0]));
            dispatch(fetchAccessRight());

            router.push("/dashboard");
          } else {
            setStage("hospital");
          }
        }

        return result;
      } finally {
        dispatch(stopLoading());
      }
    },
    undefined
  );

  const handleHospitalSelect = async (hospital: any) => {
    if (
      !hospital.hospital?.isActive ||
      hospital.hospital?.status !== "ACTIVE"
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "This hospital is inactive. Please contact admin.",
        life: 4000,
        className: "custom-toast-container", // for blur
      });
      return;
    }

    dispatch(startLoading()); // 🚀 Start loading
    dispatch(setSelectedHospital(hospital));
    localStorage.setItem("selectedHospital", JSON.stringify(hospital));
    console.log("Hospital selected and saved:", hospital);

    // 🚀 fetch access rights immediately after hospital is set
    dispatch(fetchAccessRight());

    router.push("/dashboard"); // ⬅️ redirect
    // Wait until navigation is "done"
    setTimeout(() => {
      dispatch(stopLoading()); // ✅ stop after redirect
    }, 1000); // small delay (enough for navigation to complete)
  };

  useEffect(() => {
    const fetchHospitals = async () => {
      const profile = await getProfile();
      if (profile?.user?.AssignHospital?.length) {
        const list = profile.user.AssignHospital;
        setHospitals(list);
        console.log("Assigned Hospitals:", hospitals);

        const session = await getSession();
        console.log("Session in login page:", session);
        const UserSession = session?.user;
        setSessionProfile(UserSession);

        if (list.length > 0) {
          setStage("hospital"); // 👈 correctly shows selection
        } else if (list.length === 1) {
          dispatch(setSelectedHospital(list[0]));
          router.push("/dashboard"); // 👈 forces redirect immediately
        }
      }
    };

    // Only run if no hospital is selected and stage is still login
    if (stage === "hospital") {
      fetchHospitals();
    }
  }, [dispatch, router, stage]);

  useEffect(() => {
    const stored = localStorage.getItem("selectedHospital");
    if (stored) {
      dispatch(loadHospitalFromStorage());
    }
    if (selectedHospital) {
      dispatch(fetchAccessRight());
    }
  }, [dispatch, selectedHospital, profile]);

  return (
    <>
      <Toast ref={toast} />
      {stage === "login" && (
        <form
          action={action}
          autoComplete="on"
          className="flex flex-col items-center justify-center gap-6"
        >
          {/* Hidden input to stop autofill guesses */}
          {/* <input
          type="text"
          name="fakeUsername"
          autoComplete="username"
          style={{ display: "none" }}
          tabIndex={-1}
        /> */}

          <div className="flex flex-col gap-4 w-full max-w-[400px]">
            {state?.message && (
              <p className="text-sm text-red-500 text-center">
                {state.message}
              </p>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-200" />
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 w-5 h-5 text-teal-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="User@Lightningq.com"
                    // autoComplete="new-email"
                    autoComplete="email"
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent 
                    transition-all duration-200"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-200" />

                <div className="relative flex items-center">
                  <Lock className="absolute left-4 w-5 h-5 text-teal-400" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent 
                    transition-all duration-200"
                    placeholder="********"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-teal-300" />
                    ) : (
                      <Eye className="w-5 h-5 text-teal-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-self-end-safe items-center ">
              <Button className="submit-button shadow-2xl px-6 py-2 cursor-pointer  rounded-4xl">
                Login
              </Button>
            </div>
          </div>
        </form>
      )}
      {stage === "hospital" && (
        <motion.div
          key="hospital"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-8 p-6 w-full max-w-2lg max-h-xl mx-auto bg-white/70 backdrop-blur-md shadow-lg rounded-2xl"
        >
          {/* Greeting with gradient */}
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent font-sans animate-ocean-flow">
            Welcome back, {sessionProfile?.name}!{/* 🎉 */}
          </h2>

          <p className="text-gray-600 text-lg font-medium font-sans text-center">
            Please select your hospital to continue:
          </p>

          {/* Hospital Buttons */}
          <div className="flex flex-col items-center gap-4 w-full">
            {hospitals.map((h) => (
              <motion.button
                key={h.hospitalId}
                type="button"
                onClick={() => handleHospitalSelect(h)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative sm:w-90 w-84 py-3 px-6 rounded-xl font-semibold font-sans
          bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-400
          text-white shadow-md hover:shadow-xl 
          overflow-hidden transition-all duration-300 cursor-pointer"
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />

                {/* Button label */}
                <span className="relative z-10">
                  {h.hospital?.HospitalName ?? `Hospital ${h.hospitalId}`} –{" "}
                  {h.hospital?.city}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        //bg-gradient-to-r from-cyan-500 to-teal-500
        // text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent
        //bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400
      )}
    </>
  );
};

export default LoginInForm;
