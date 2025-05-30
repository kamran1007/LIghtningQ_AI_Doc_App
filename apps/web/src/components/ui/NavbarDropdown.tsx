"use client";

import ProfileModal from "@/components/ProfileModel";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, CreditCard,Briefcase,Gem ,BadgeCheck} from "lucide-react";
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

function NavbarDropdown() {
  const [profileOpen, setProfileOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    console.log("Logout clicked");
    dispatch(startLoading());

    // Add a short delay to show the loader
    setTimeout(() => {
      window.location.href = "/api/auth/logout";
    }, 300);
    // window.location.href = "/api/auth/logout";
  };

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

    <DropdownMenuContent>
    <DropdownMenuLabel>
  <div className="text-sm font-medium text-gray-700 leading-snug">
    Dr. Shahbaz Quamar (Doctor)<br />
    Al Shifa Hospital(AL554Q) | Dubai<br />
    91434545
  </div>
</DropdownMenuLabel>
  <DropdownMenuSeparator />

  <DropdownMenuItem onClick={() => setProfileOpen(true)} className="hover:bg-blue-50">
  <div className="flex items-center w-full text-gray-700 hover:bg-blue-50 rounded-md cursor-pointer">
    <User className="mr-2 h-4 w-4 text-blue-500" />
    Profile
  </div>
</DropdownMenuItem>

<DropdownMenuItem className="hover:bg-blue-50">
  <div className="flex items-center w-full text-gray-700 hover:bg-blue-50  rounded-md cursor-pointer">
    <BadgeCheck className="mr-2 h-4 w-4 text-blue-500" />
    Subscription
  </div>
</DropdownMenuItem>

<DropdownMenuSeparator />

<DropdownMenuItem onClick={handleLogout} className="hover:bg-red-50">
  <div className="flex items-center w-full text-red-600 hover:bg-red-50 rounded-md cursor-pointer">
    <LogOut className="mr-2 h-4 w-4 text-red-600"/>
    Logout
  </div>
</DropdownMenuItem>
</DropdownMenuContent>
  </DropdownMenu>
</>

  );
}

export default NavbarDropdown;
