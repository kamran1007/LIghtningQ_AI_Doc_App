"use client";

import ProfileModal from "@/components/ProfileModel";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function NavbarDropdown() {
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logout clicked");
    window.location.href = "/api/auth/logout";
  };

  return (
    <>
      <ProfileModal open={profileOpen} setOpen={setProfileOpen} />
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none focus:ring-0 focus:shadow-none">
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="User avatar"
              className="h-10 w-10 rounded-full object-cover cursor-pointer"
              // onClick={() => setProfileOpen(true)}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setProfileOpen(true)} className="cursor-pointer bg-white">
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
            <LogOut className="cursor-pointer mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default NavbarDropdown;
