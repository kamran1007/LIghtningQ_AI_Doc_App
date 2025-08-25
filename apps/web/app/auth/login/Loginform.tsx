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
import React, { useEffect, useState } from "react";
import { useActionState } from "react"; // not react-dom
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getSession } from "@/lib/session";

const LoginInForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const selectedHospital = useSelector(
    (state: any) => state.hospital.selectedHospital
  );

  const [hospitals, setHospitals] = React.useState<any[]>([]);

  const [stage, setStage] = useState<"login" | "hospital">("login");
  const [sessionProfile, setSessionProfile] = useState<any>(null);

  const [state, action] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      try {
        dispatch(startLoading());
        const result = await login(prevState, formData);

        // if login successful → fetch hospitals
        const profile = await getProfile();
        const session = await getSession();
        console.log("Session in login page:", session);
        const UserSession = session?.user;
        setSessionProfile(UserSession);

        if (profile?.user?.AssignHospital?.length) {
          const list = profile.user.AssignHospital;
          setHospitals(list);

          if (list.length === 1) {
            dispatch(setSelectedHospital(list[0]));
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
    dispatch(startLoading()); // 🚀 Start loading
    dispatch(setSelectedHospital(hospital));
    localStorage.setItem("selectedHospital", JSON.stringify(hospital));
    console.log("Hospital selected and saved:", hospital);

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
    if (stage === "login") {
      fetchHospitals();
    }
  }, [dispatch, router, stage]);

  useEffect(() => {
    const stored = localStorage.getItem("selectedHospital");
    if (stored) {
      dispatch(loadHospitalFromStorage());
    }
  }, [dispatch]);

  return (
    <>
      {stage === "login" && (
        <form
          action={action}
          autoComplete="off"
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

          <div className="flex flex-col gap-4 w-82">
            {state?.message && (
              <p className="text-sm text-red-500 text-center">
                {state.message}
              </p>
            )}

            <div className="flex flex-col gap-2 w-full max-w-md">
              <Label htmlFor="email">Email</Label>

              <div className="group relative w-full rounded-md">
                {/* Gradient border wrapper */}
                <div className="absolute -inset-[2px] rounded-md bg-transparent transition-all duration-300 group-focus-within:bg-[radial-gradient(circle,_rgba(0,36,34,1)_0%,_rgba(25,138,224,1)_30%,_rgba(34,224,212,1)_97%)]"></div>

                {/* Input */}
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="User@Lightningq.com"
                  autoComplete="new-email"
                  required
                  className="relative z-10 w-full h-12 px-4 py-2 bg-white rounded-md border-none ring-0 focus:ring-0 focus:border-none outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="group relative w-full rounded-md">
                {/* Gradient border wrapper */}
                <div className="absolute -inset-[2px] rounded-md bg-transparent transition-all duration-300 group-focus-within:bg-[radial-gradient(circle,_rgba(0,36,34,1)_0%,_rgba(25,138,224,1)_30%,_rgba(34,224,212,1)_97%)]"></div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  autoComplete="new-password"
                  required
                  className="relative z-10 w-full h-12 px-4 py-2 bg-white rounded-md border-none ring-0 focus:ring-0 focus:border-none outline-none"
                />
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
          className="flex flex-col items-center gap-8 p-6 w-full max-w-2lg max-h-xl mx-auto bg-white/70 backdrop-blur-md shadow-lg rounded-2xl "
        >
          {/* Greeting with gradient */}
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent font-sans animate-ocean-flow">
            Welcome back, {sessionProfile?.name}!{/* 🎉 */}
          </h2>

          <p className="text-gray-600 text-lg font-medium font-sans text-center">
            Please select your hospital to continue:
          </p>

          {/* Hospital Buttons */}
          {/* Hospital Buttons */}
          <div className="flex flex-col items-center gap-4 w-full">
            {hospitals.map((h) => (
              <motion.div
                key={h.hospitalId}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex justify-center"
              >
                <Button
                  onClick={() => handleHospitalSelect(h)}
                  className="sm:w-90 w-84 text-center py-3 rounded-lg font-semibold font-sans 
                 bg-gradient-to-r from-cyan-400 to-teal-400
                 text-white shadow-md transition-all duration-300
                 hover:shadow-xl hover:from-teal-400 hover:via-blue-400 hover:to-purple-500 cursor-pointer"
                >
                  {h.hospital?.HospitalName ?? `Hospital ${h.hospitalId}`} -{" "}
                  {h.hospital?.city}
                </Button>
              </motion.div>
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
