"use client";

import { useEffect } from "react";
import SearchBar from "./ui/searchpatient";
import NavbarDropdown from "./ui/NavbarDropdown";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "@/store/authSlice";

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

  console.log("AppBar User:", user);
  console.log("AppBar Profile:", profile);
  console.log("AppBar Selected Hospital:", selectedHospital);

  // ⛔ Only block if user or hospital missing
  if (!user || !selectedHospital) return null;

  // 🟢 Prefer profile values if available
  const firstName = profile?.firstName ?? "";
  const lastName = profile?.lastName ?? "";
  const fullName =
    firstName || lastName
      ? `${firstName} ${lastName}`
      : "User"; // fallback if profile still loading

  const roleId = user.roleId ?? user.RoleId ?? null;
  const roleLabel = user?.RoleName || (roleId === 1 ? "Admin" : "User");

  // const userImage = profile?.imageUrl ?? "";

  return (
    <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white flex items-center justify-between px-4 py-4 h-14 relative">
      {/* Logo */}
      <div className="absolute left-0 top-0 h-14 flex items-center z-50">
        <Image
          src="/NavBarLogo.png"
          alt="Logo"
          width={400}
          height={400}
          className="h-14 w-20 object-contain cursor-pointer"
          priority={false}
        />
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
        <p className="font-sans text-1xl text-white whitespace-nowrap">
          {fullName} ({roleLabel})
        </p>
        <NavbarDropdown profile={profile} />
      </div>
    </div>
  );
};

export default AppBar;
