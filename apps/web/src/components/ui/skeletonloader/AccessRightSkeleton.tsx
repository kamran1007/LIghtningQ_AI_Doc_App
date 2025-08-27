// import React from "react";

// const shimmer =
//   "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent";

// export default function AccessRightSkeleton({ gridSize = 2 }: { gridSize?: number }) {
//   return (
//     <div className={`grid gap-4 grid-cols-1 sm:grid-cols-${gridSize}`}>
//       {Array.from({ length: gridSize * 2 }).map((_, i) => (
//         <div
//           key={i}
//           className={`${shimmer} bg-gradient-to-br from-gray-100 to-gray-200 
//             rounded-2xl p-4 border border-gray-200 shadow-sm`}
//         >
//           {/* Header */}
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2">
//               <div className="h-5 w-5 bg-gray-300 rounded" />
//               <div className="h-4 w-32 bg-gray-300 rounded" />
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="h-4 w-12 bg-gray-200 rounded" />
//               <div className="h-6 w-12 bg-gray-300 rounded-full" />
//             </div>
//           </div>

//           {/* Submodule rows */}
//           <div className="space-y-3">
//             {Array.from({ length: 3 }).map((_, j) => (
//               <div
//                 key={j}
//                 className="grid grid-cols-7 items-center gap-2 border-t border-gray-200 pt-2"
//               >
//                 <div className="col-span-2 flex items-center gap-2">
//                   <div className="h-4 w-28 bg-gray-200 rounded" />
//                   <div className="h-5 w-10 bg-gray-300 rounded-full" />
//                 </div>

//                 {Array.from({ length: 5 }).map((_, k) => (
//                   <div
//                     key={k}
//                     className="flex items-center justify-center"
//                   >
//                     <div className="h-5 w-10 bg-gray-300 rounded-full" />
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


import React from "react";

const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent";

// Pick a random teal shade class
const tealShades = [
  "bg-teal-100",
  "bg-teal-200",
  "bg-teal-100",
  "bg-teal-50",
  "bg-teal-100",
];
const getRandomTeal = () =>
  tealShades[Math.floor(Math.random() * tealShades.length)];

export default function AccessRightSkeleton({ gridSize = 2 }: { gridSize?: number }) {
  return (
    <div className={`grid gap-4 grid-cols-1 sm:grid-cols-${gridSize}`}>
      {Array.from({ length: gridSize * 2 }).map((_, i) => (
        <div
          key={i}
          className={`${shimmer} animate-pulse bg-gradient-to-br from-gray-100 to-gray-200 
            rounded-2xl p-4 border border-gray-200 shadow-sm`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-300 rounded" />
              <div className="h-4 w-32 bg-gray-300 rounded" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-12 bg-gray-200 rounded" />
              <div className={`h-6 w-12 rounded-full ${getRandomTeal()}`} />
            </div>
          </div>

          {/* Submodule rows */}
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={j}
                className="grid grid-cols-7 items-center gap-2 border-t border-gray-200 pt-2"
              >
                <div className="col-span-2 flex items-center gap-2">
                  <div className="h-4 w-28 bg-gray-200 rounded" />
                  <div
                    className={`h-5 w-10 rounded-full ${getRandomTeal()}`}
                  />
                </div>

                {Array.from({ length: 5 }).map((_, k) => (
                  <div key={k} className="flex items-center justify-center">
                    <div
                      className={`h-5 w-10 rounded-full ${getRandomTeal()}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
