"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  Activity,
  CalendarClock,
  MonitorSmartphone,
  Shuffle,
  Sliders,
  UserCog,
  Stethoscope,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Patient Care", icon: Stethoscope, path: "/patientcare" },
  { name: "Appointments", icon: CalendarClock, path: "/appointment" },
  { name: "Display Boards", icon: MonitorSmartphone, path: "/displays" },
  { name: "Flow Optimization", icon: Shuffle, path: "/flow" },
  { name: "Admin", icon: UserCog, path: "/admin" },
  { name: "Settings", icon: Sliders, path: "/settings" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative h-full">
      {!isExpanded && (
        <div
          className="absolute top-0 left-0 h-full w-[20px] z-10"
          onMouseEnter={() => setIsExpanded(true)}
        />
      )}
      <aside
        className={`h-full shadow-md flex bg-gradient-to-b from-teal-50 to-teal-100 flex-col transition-all duration-300 bg-white ${
          isExpanded ? "w-60" : "w-20"
        }`}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path); // ✅ highlight sub-routes too
            const Icon = item.icon;
            return (
              <div key={item.name} className="relative group">
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    router.push(item.path);
                  }}
                  className={`cursor-pointer flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition 
                    ${
                      isExpanded
                        ? isActive
                          ? "bg-teal-100 text-teal-700"
                          : "hover:bg-gray-100 text-teal-600"
                        : isActive
                        ? "bg-teal-100"
                        : "text-teal-600"
                    }
                    shadow hover:shadow-2xl transition-shadow duration-300 ease-in-out`}
                >
                  <Icon
                    className={`min-w-[20px] transition-all transform duration-300 group-hover:scale-110 group-hover:text-teal-400 ${
                      isExpanded ? "mr-3" : "mx-auto"
                    }`}
                  />
                  <span
                    className={`transition-opacity duration-300 ${
                      isExpanded ? "opacity-100" : "opacity-0"
                    } whitespace-nowrap`}
                  >
                    {item.name}
                  </span>
                </button>
                {!isExpanded && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 px-3 py-1 bg-teal-400 text-white text-xs rounded-md shadow-lg whitespace-nowrap transition-all duration-300 ease-in-out">
                    {item.name}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
