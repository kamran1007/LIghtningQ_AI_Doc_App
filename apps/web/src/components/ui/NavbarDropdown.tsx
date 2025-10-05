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
  Settings,
  MapPin,
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
import Image from "next/image";

type ProfileProps = {
  profile: {
    message?: string;
    include?: any;
    user: {
      imageUrl?: string | null;
      title?: string;
      firstName: string;
      lastName: string;
      RoleName?: string;
      mobile?: string;
      email?: string;
      // ...other user fields
    };
  };
};

function NavbarDropdown({ profile }: ProfileProps) {
  const userProfile = profile.user ?? {};
  // console.log("NavbarDropdown UserProfile:", userProfile);

  const [userHospital, setUserHospital] = useState<any>(null);
  const selectedHospital = useSelector(
    (state: any) => state.hospitalSelection?.selectedHospital
  );
  const [profileOpen, setProfileOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [imageUrl, setImageUrl] = useState<string>("");
  // console.log("Profile in NavbarDropdown:", profile);
  // console.log("Selected Hospital in NavbarDropdown:", selectedHospital);

  useEffect(() => {
    if (selectedHospital) {
      setUserHospital(selectedHospital);
    }
    setImageUrl(
      userProfile.imageUrl ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${userProfile.imageUrl}` : ""
    );
  }, [selectedHospital, userProfile.imageUrl]);
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
          <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-teal-300 flex items-center justify-center">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="User avatar"
                width={48}
                height={48}
                className="object-cover h-full w-full transition-transform duration-300 hover:scale-105"
              />
            ) : (
              // <div className="flex items-center justify-center h-full w-full bg-teal-100">
              //   <svg
              //     xmlns="http://www.w3.org/2000/svg"
              //     className="h-6 w-6 text-teal-400"
              //     viewBox="0 0 24 24"
              //     fill="currentColor"
              //   >
              //     <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4Zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              //   </svg>
              // </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="w-6 h-6 text-teal-300" />
              </div>
            )}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="min-w-[300px] max-w-[320px] p-0 border-0 shadow-xl bg-white rounded-xl overflow-hidden">
          {/* User Profile Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-3 text-white font-sans">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-teal-300 flex items-center justify-center">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="User avatar"
                    width={48}
                    height={48}
                    className="object-cover h-full w-full transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <User className="w-6 h-6 text-teal-300" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg leading-tight">
                  {userProfile.title}. {userProfile.firstName}{" "}
                  {userProfile.lastName}
                </h3>
                <p className="text-teal-100 text-sm font-medium">
                  {userProfile.RoleName || "User"}
                </p>
              </div>
            </div>
          </div>

          {/* Hospital Information */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-800">
                  {userHospital?.hospital?.HospitalName}
                </span>
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                  {userHospital?.hospital?.HospitalCode}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span className="capitalize">
                  {userHospital?.hospital?.city},{" "}
                  {userHospital?.hospital?.state}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <PhoneCall className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-medium">{userProfile.mobile}</span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <DropdownMenuItem
              onClick={() => setProfileOpen(true)}
              className="mx-2 mb-1 rounded-lg hover:bg-teal-50 focus:bg-teal-50 transition-all duration-200"
            >
              <div className="flex items-center w-full py-2 px-2">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-teal-600" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">
                    Profile Settings
                  </span>
                  <p className="text-xs text-gray-500">Manage your account</p>
                </div>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className="mx-2 mb-1 rounded-lg hover:bg-teal-50 focus:bg-teal-50 transition-all duration-200">
              <div className="flex items-center w-full py-2 px-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <BadgeCheck className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">
                    Subscription
                  </span>
                  <p className="text-xs text-gray-500">View billing & plans</p>
                </div>
              </div>
            </DropdownMenuItem>

            {/* <DropdownMenuItem className="mx-2 mb-1 rounded-lg hover:bg-gray-50 focus:bg-gray-50 transition-all duration-200">
              <div className="flex items-center w-full py-2 px-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <Settings className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">
                    Settings
                  </span>
                  <p className="text-xs text-gray-500">Preferences & privacy</p>
                </div>
              </div>
            </DropdownMenuItem> */}
          </div>

          {/* Logout Section */}
          <div className="border-t border-gray-100 p-1">
            <DropdownMenuItem
              onClick={handleLogout}
              className="mx-0 rounded-lg hover:bg-red-50 focus:bg-red-50 transition-all duration-200"
            >
              <div className="flex items-center w-full py-2 px-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <LogOut className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-red-600">
                    Sign Out
                  </span>
                  <p className="text-xs text-red-400">
                    Logout from your account
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default NavbarDropdown;
