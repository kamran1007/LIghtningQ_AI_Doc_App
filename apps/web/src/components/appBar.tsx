"use client";

import { useEffect } from "react";
import SearchBar from "./ui/searchpatient";
import NavbarDropdown from "./ui/NavbarDropdown";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "@/store/authSlice";
import { Bell, FileText } from "lucide-react";
import ReleaseNotes from "./ReleaseNote";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

const AppBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const profile = useSelector((state: any) => state.auth.profile);
  const selectedHospital = useSelector(
    (state: any) => state.hospitalSelection?.selectedHospital
  );

  // Load profile once when user exists but no profile yet
  useEffect(() => {
    if (user && !profile) {
      dispatch(fetchUserProfile() as any);
    }
  }, [user, profile, dispatch]);

  // console.log("AppBar User:", user);
  // console.log("AppBar Profile:", profile);
  // console.log("AppBar Selected Hospital:", selectedHospital);

  // ⛔ Only block if user or hospital missing
  if (!user || !selectedHospital) return null;

  // 🟢 Prefer profile values if available
  const userProfile = profile?.user ?? {};

  const firstName = userProfile.firstName ?? "";
  const lastName = userProfile.lastName ?? "";
  const fullName = firstName || lastName ? `${firstName} ${lastName}` : "User";

  const roleLabel =
    userProfile.RoleName ||
    (userProfile.RoleId ? `Role ${userProfile.RoleId}` : "No Role");

  // const userImage = profile?.imageUrl ?? "";

  return (
    <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white flex items-center justify-between px-4 py-4 h-14 relative">
      {/* Logo */}
      {/* <div className="absolute p-0 left-0 top-0 h-14 flex items-center z-50">
        <Image
          src="/NavBarLogo.png"
          alt="Logo"
          width={350}
          height={350}
          className="h-14 w-18 object-contain cursor-pointer"
          priority={false}
        />
      </div> */}
      {/* Notifications */}
      <div className="flex items-center gap-2 relative z-50">
        {/* Notification Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="relative p-2 text-white-800 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Bell className="w-5 h-5" />
              {/* <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </span> */}
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            sideOffset={6}
            className="bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg z-[9999]"
          >
            Notifications
          </TooltipContent>
        </Tooltip>

        {/* Release Notes Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ReleaseNotes />
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            sideOffset={6}
            className="bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg z-[9999]"
          >
            Release Notes
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Search */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
        <SearchBar />
      </div>
      {/* User info */}
      <div className="absolute right-4 top-0 h-14 flex items-center gap-2 z-50">
        {/* <Image
          src={userImage}

          alt=""
          width={36}
          height={36}
          className="rounded-full object-cover"
        /> */}

        {/* User Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <div className="flex flex-col leading-tight truncate">
              {/* Name */}
              <p className="text-white font-semibold text-md truncate font-sans">
                {userProfile?.gender === "MALE" ? "Mr." : "Mrs."} {fullName}
              </p>

              {/* Specialization */}
              {userProfile?.Specialization?.SpecializationName && (
                <p className="text-white/80 text-xs truncate font-sans">
                  {userProfile.Specialization.SpecializationName}
                </p>
              )}
            </div>

            {/* Role Badge */}
            <span className="bg-white/100 text-black text-sm px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
              {roleLabel}
            </span>
          </div>
          {selectedHospital && (
            <p className="text-white/80 text-xs truncate mt-0.5">
              {selectedHospital.HospitalName}
            </p>
          )}
        </div>

        <NavbarDropdown profile={profile} />
      </div>
    </div>
  );
};

export default AppBar;
