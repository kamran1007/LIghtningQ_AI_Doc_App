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
import { ChevronRight, Eye, EyeOff, Lock, Mail, MapPin } from "lucide-react";
import { fetchHospitalPrintSettings } from "@/store/HospitalPrintSettingsSlice";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  const [state, action] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      try {
        dispatch(startLoading());
        const result = await login(prevState, formData);

        // if login successful → fetch profile
        const profile = await getProfile();
        if (profile) {
          dispatch(setProfile(profile));
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

        // ✅ Check hospital assignment
        const hospitalAssignments = profile?.user?.AssignHospital ?? [];

        if (hospitalAssignments.length === 0) {
          toast.current?.show({
            severity: "warn",
            summary: "No Access",
            detail:
              "You do not have access to any hospital. Please contact the admin.",
            life: 4000,
            className: "custom-toast-container",
          });
          return result; // stop login flow
        }

        // ✅ Continue if hospitals exist
        setHospitals(hospitalAssignments);

        if (hospitalAssignments.length === 1) {
          const hospital = hospitalAssignments[0]?.hospital;

          if (!hospital?.isActive || hospital?.status !== "ACTIVE") {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "This hospital is inactive. Please contact admin.",
              life: 4000,
              className: "custom-toast-container",
            });
            return;
          }

          dispatch(setSelectedHospital(hospitalAssignments[0]));
          dispatch(fetchAccessRight());
          dispatch(fetchHospitalPrintSettings());

          router.push("/dashboard");
        } else {
          setStage("hospital"); // multiple hospitals, ask user to choose
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
    dispatch(fetchHospitalPrintSettings());

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

  // Check if scrollbar is needed for hospital list
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && hospitals.length > 0) {
      setShowScrollIndicator(container.scrollHeight > container.clientHeight);
    }
  }, [hospitals]);

  const isScrollable = hospitals.length > 2;
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-700 via-teal-500 px-4 py-2 text-white font-sans p-0 text-center">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white mb-0"
            >
              Welcome back, {sessionProfile?.name}!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/90 text-lg"
            >
              Please select your hospital to continue
            </motion.p>
          </div>

          {/* Hospital List Container */}
          <div className="p-2">
            <div className="relative">
              {/* Scrollable Container */}
              <div
                ref={scrollContainerRef}
                className={`space-y-4 ${
                  isScrollable ? "max-h-[300px] overflow-y-auto pr-2" : ""
                }`}
                style={{
                  scrollBehavior: "smooth",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#22d3ee #f3f4f6",
                }}
              >
                {hospitals.map((hospital, index) => (
                  <motion.button
                    key={hospital.hospitalId}
                    onClick={() => handleHospitalSelect(hospital)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group w-full p-5 rounded-xl border-2 border-gray-200 
                      hover:border-teal-500 hover:shadow-lg 
                      transition-all duration-300 ease-out
                      bg-white hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50
                      text-left relative overflow-hidden"
                  >
                    {/* Subtle shine effect on hover */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                      -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out font-sans"
                    />

                    <div className="relative z-10 flex items-center justify-between font-sans h-10">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-cyan-600 transition-colors mb-1">
                          {hospital.hospital?.HospitalName ??
                            `Hospital ${hospital.hospitalId}`}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">
                            {hospital.hospital?.city}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Scroll Indicator */}
              {showScrollIndicator && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none flex items-end justify-center pb-1">
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronRight className="w-5 h-5 text-cyan-500 rotate-90" />
                  </motion.div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Info */}
          {/* <div className="px-8 pb-6">
            <p className="text-sm text-gray-500 text-center">
              Having trouble? Contact support at{" "}
              <a
                href="mailto:support@lightningq.com"
                className="text-cyan-600 hover:underline font-medium"
              >
                support@lightningq.com
              </a>
            </p>
          </div> */}
        </motion.div>
      )}
    </>
  );
};

export default LoginInForm;
