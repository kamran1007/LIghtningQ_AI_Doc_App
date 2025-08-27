"use client";

import ProfileModal from "@/components/ProfileModel";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LogOut,
  User,
  CreditCard,
  Briefcase,
  Gem,
  BadgeCheck,
  PhoneCall,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "react-hot-toast";
import { useAppDispatch } from "@/store/hooks";
import { startLoading } from "@/store/globalLoaderSlice";
import { clearUser } from "@/store/authSlice";
import { clearSelectedHospital } from "@/store/HospitalBranchSelectionSlice";
import { useSelector } from "react-redux";
import { persistor } from "@/store";

type ProfileProps = {
  profile: {
    title?: string;
    firstName: string;
    lastName: string;
    RoleName?: string;
    mobile?: string;
    email?: string;

    // add other fields if needed
  };
};

function NavbarDropdown({ profile }: ProfileProps) {
  const userProfile = profile?.user ?? {}; // 🟢 unwrap here

  const [userHospital, setUserHospital] = useState<any>(null);
  const selectedHospital = useSelector(
    (state: any) => state.hospitalSelection?.selectedHospital
  );
  const [profileOpen, setProfileOpen] = useState(false);
  const dispatch = useAppDispatch();
  // console.log("Profile in NavbarDropdown:", profile);
  // console.log("Selected Hospital in NavbarDropdown:", selectedHospital);

  useEffect(() => {
    if (selectedHospital) {
      setUserHospital(selectedHospital);
    }
  }, [selectedHospital]);
  const handleLogout = () => {
    console.log("Logout clicked");
    dispatch(startLoading());

    // Clear redux state
    dispatch(clearUser());
    dispatch(clearSelectedHospital());

    // 🔑 Clear ALL persisted redux slices
    persistor.purge().then(() => {
      console.log("✅ Redux Persist cleared");
      // Also clear localStorage/sessionStorage completely if needed
      localStorage.clear();
      sessionStorage.clear();

      // Redirect
      setTimeout(() => {
        window.location.href = "/api/auth/logout";
      }, 300);
    });
  };
  if (!profile) return null; // ⛔️ avoid accessing null

  return (
    <>
      <ProfileModal open={profileOpen} setOpen={setProfileOpen} />
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none focus:ring-0 focus:shadow-none cursor-pointer">
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="User avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="min-w-[250px] max-w-[300px]">
          <DropdownMenuLabel>
            <div className="text-base text-gray-800 space-y-1 font-sans">
              <p className="font-semibold text-lg text-gray-900">
                {userProfile.title}. {userProfile.firstName}{" "}
                {userProfile.lastName}
                <span className="ml-1 text-gray-500 font-medium">
                  ({userProfile.RoleName || "User"})
                </span>
              </p>

              <p className="text-gray-700">
                {userHospital?.hospital?.HospitalName}{" "}
                <span className="text-gray-500 font-medium">
                  ({userHospital?.hospital?.HospitalCode}) |
                </span>{" "}
                <span className="capitalize">
                  {userHospital?.hospital?.city},{" "}
                  {userHospital?.hospital?.state}
                </span>
              </p>

              <p className="flex items-center gap-2 text-gray-700 font-medium tracking-wide">
                <PhoneCall className="w-4 h-4 text-black-300" />
                {userProfile.mobile}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setProfileOpen(true)}
            className="hover:bg-teal-50"
          >
            <div className="flex items-center w-full text-gray-700 hover:bg-teal-50 rounded-md cursor-pointer">
              <User className="mr-2 h-4 w-4 text-teal-300" />
              Profile
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="hover:bg-teal-50">
            <div className="flex items-center w-full text-gray-700 hover:bg-teal-50  rounded-md cursor-pointer">
              <BadgeCheck className="mr-2 h-4 w-4 text-teal-300" />
              Subscription
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-50">
            <div className="flex items-center w-full text-red-600 hover:bg-red-50 rounded-md cursor-pointer">
              <LogOut className="mr-2 h-4 w-4 text-red-600" />
              Logout
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default NavbarDropdown;
