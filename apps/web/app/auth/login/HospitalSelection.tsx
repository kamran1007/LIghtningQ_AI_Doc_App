"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch } from "@/store/hooks";
import { setSelectedHospital } from "@/store/HospitalBranchSelectionSlice";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/action"; // your existing API call
import { Button } from "@/components/ui/button";

const HospitalSelection = () => {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchHospitals = async () => {
      const profile = await getProfile();
      if (profile?.user?.AssignHospital?.length) {
        const list = profile.user.AssignHospital;
        setHospitals(list);

        // Auto-select if only one hospital
        if (list.length === 1) {
          dispatch(setSelectedHospital(list[0]));
          router.push("/dashboard");
        }
      }
    };
    fetchHospitals();
  }, [dispatch, router]);

  const handleSelect = (hospital: any) => {
    dispatch(setSelectedHospital(hospital));
    router.push("/dashboard");
  };

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % hospitals.length);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + hospitals.length) % hospitals.length);

  if (!hospitals.length) return null;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Select Your Hospital
      </h1>

      <div className="relative w-[350px] h-[220px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={hospitals[currentIndex].HospitalId}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white shadow-xl rounded-2xl border"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {hospitals[currentIndex].HospitalName}
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Hospital ID: {hospitals[currentIndex].HospitalId}
            </p>
            <Button
              className="px-6 py-2 rounded-xl shadow-md bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => handleSelect(hospitals[currentIndex])}
            >
              Select Hospital
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      {hospitals.length > 1 && (
        <div className="flex gap-6 mt-6">
          <button
            onClick={prevSlide}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full"
          >
            ◀
          </button>
          <button
            onClick={nextSlide}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default HospitalSelection;
