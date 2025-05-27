"use client";
import {
  Home,
  Activity,
  CalendarClock,
  MonitorSmartphone,
  Shuffle,
  Cloud,
  Sliders,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Queue Monitor", icon: Activity, path: "/profile" },
  { name: "Appointments", icon: CalendarClock, path: "/appointments" },
  { name: "Display Boards", icon: MonitorSmartphone, path: "/displays" },
  { name: "Flow Optimization", icon: Shuffle, path: "/flow" },
  { name: "Cloud Access", icon: Cloud, path: "/cloud" },
  { name: "Settings", icon: Sliders, path: "/settings" },
];

export function AppSidebar() {
  const [active, setActive] = useState("Dashboard");
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <aside
      className={`h-full shadow-md flex flex-col transition-all duration-300 bg-white ${
        isHovered ? "w-64" : "w-20"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = active === item.name;
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => {
                setActive(item.name);
                setIsHovered(false);
                router.push(item.path);
              }}
              className={`cursor-pointer flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition 
                ${isHovered
                  ? isActive
                    ? "bg-white text-blue-900"
                    : "hover:bg-gray-100 text-blue-900"
                  : isActive
                  ? "bg-blue-100"
                  : "text-blue-900"}
                shadow hover:shadow-2xl transition-shadow duration-300 ease-in-out`}
            >
              <Icon className={`mr-3 min-w-[20px] ${isHovered ? "" : "mx-auto"} transition-all`} />
              <span
                className={`transition-opacity duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                } whitespace-nowrap`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
