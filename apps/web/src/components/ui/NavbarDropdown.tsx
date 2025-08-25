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
import { clearHospital } from "@/store/HospitalBranchSelectionSlice";
import { useSelector } from "react-redux";

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
  const [userHospital, setUserHospital] = useState<any>(null);
  const selectedHospital = useSelector(
    (state: any) => state.hospitalSelection?.selectedHospital
  );
  const [profileOpen, setProfileOpen] = useState(false);
  const dispatch = useAppDispatch();
  console.log("Profile in NavbarDropdown:", profile);
  console.log("Selected Hospital in NavbarDropdown:", selectedHospital);

  useEffect(() => {
    if (selectedHospital) {
      setUserHospital(selectedHospital);
    }
  }, [selectedHospital]);
  const handleLogout = () => {
    console.log("Logout clicked");
    dispatch(startLoading());
    //  dispatch(clearHospital());
    dispatch(clearUser());

    // Add a short delay to show the loader
    setTimeout(() => {
      window.location.href = "/api/auth/logout";
    }, 300);
    // window.location.href = "/api/auth/logout";
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
                {profile.title}. {profile.firstName} {profile.lastName}
                <span className="ml-1 text-gray-500 font-medium">
                  ({profile.RoleName || "User"})
                </span>
              </p>

              <p className="text-gray-700">
                {userHospital?.hospital?.HospitalName}{" "}
                <span className="text-gray-500 font-medium">
                  ({userHospital?.hospital?.HospitalCode}) |
                </span>
                {" "}
                <span className="capitalize">
                  {userHospital?.hospital?.city},{" "}
                  {userHospital?.hospital?.state}
                </span>
              </p>

              <p className="flex items-center gap-2 text-gray-600 font-medium tracking-wide">
                <PhoneCall className="w-4 h-4 text-teal-300" />
                {profile.mobile}
                
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
