// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/router"; // must use next/router for router events
// import { motion, AnimatePresence } from "framer-motion";

// const GlobalLoader = () => {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const handleStart = () => setLoading(true);
//     const handleStop = () => setLoading(false);

//     router.events.on("routeChangeStart", handleStart);
//     router.events.on("routeChangeComplete", handleStop);
//     router.events.on("routeChangeError", handleStop);

//     return () => {
//       router.events.off("routeChangeStart", handleStart);
//       router.events.off("routeChangeComplete", handleStop);
//       router.events.off("routeChangeError", handleStop);
//     };
//   }, [router]);

//   return (
//     <AnimatePresence>
//       {loading && (
//         <motion.div
//           className="fixed inset-0 z-[9999] flex items-center justify-center bg-blue-900/40 shadow-[0_0_60px_20px_rgba(59,130,246,0.6)]"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >
//           <div className="h-16 w-16 border-4 border-b-blue-500 border-t-transparent rounded-full animate-spin" />
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default GlobalLoader;

// hooks/GlobalLoader.tsx
"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/index"; // adjust to your store path

export default function GlobalLoader() {
  const loading = useSelector((state: RootState) => state.globalLoader.isLoading); // adjust slice name

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-500/30">
      <div className="animate-spin rounded-full h-14 w-14 border-8 border-t-transparent border-blue-50" />
    </div>
  );
}
