"use client";

import { usePathname } from "next/navigation";
import {
  CalendarClock,
  Sliders,
  UserCog,
  Stethoscope,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// mapping ModuleName → Sidebar info
const moduleNavMap: Record<
  string,
  { icon: React.ElementType; path: string }
> = {
  Dashboard: { icon: LayoutDashboard, path: "/dashboard" },
  "Patient Care": { icon: Stethoscope, path: "/patientcare" },
  Appointments: { icon: CalendarClock, path: "/appointment" },
  Admin: { icon: UserCog, path: "/admin" },
  Settings: { icon: Sliders, path: "/settings" },
};

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  type AccessRight = {
    ModuleId: number;
    ModuleName: string;
    enabled: boolean;
    Submodules?: { SubModuleName: string; [key: string]: any }[];
  };

  const accessRights = useSelector(
    (state: RootState) => state.hospitalAccessRight.data
  ) as AccessRight[];

  // console.log("Access Rights from Redux AppBar:", accessRights);

  // ✅ filter only enabled modules
  const enabledNavItems = accessRights
    ?.filter((m) => m.enabled && moduleNavMap[m.ModuleName])
    .map((m) => ({
      name: m.ModuleName,
      icon: moduleNavMap[m.ModuleName]?.icon,
      path: moduleNavMap[m.ModuleName]?.path,
    }));

  return (
    <div className="relative h-full">
      {!isExpanded && (
        <div
          className="absolute top-5 left-0 h-full w-[18px] z-10"
          onMouseEnter={() => setIsExpanded(true)}
        />
      )}
      <aside
        className={`h-full shadow-md flex bg-white flex-col transition-all duration-300 ${
          isExpanded ? "w-60" : "w-18"
        }`}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <nav className="flex-1 p-3 space-y-5">
          {enabledNavItems?.map((item) => {
            const isActive = pathname.startsWith(item.path);
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
                          ? "bg-teal-100 text-teal-400"
                          : "hover:bg-gray-100 text-teal-400"
                        : isActive
                        ? "bg-teal-100"
                        : "text-teal-500"
                    }
                    shadow hover:shadow-2xl transition-shadow duration-300 ease-in-out`}
                >
                    <Icon
                      className={`min-w-[18px] transition-all transform duration-300 group-hover:scale-110 group-hover:text-teal-400 ${
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
