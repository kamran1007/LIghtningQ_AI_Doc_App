"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { X } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";

interface ProfileModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, setOpen }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  const imageUrl = ""; // or your state value

  const firstName = "John";
  const lastName = "Doe";
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent size="md" className="max-h-[95vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-2 shadow-2xl rounded-lg p-1 bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-700">
              Edit Profile
            </DialogTitle>
            <DialogDescription>
              Update your profile or credentials
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition">
              <X className="w-6 h-6" />
            </button>
          </DialogClose>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-2 border-b w-full flex gap-2">
            <TabsTrigger
              value="profile"
              className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
            >
              Profile Info
            </TabsTrigger>
            <TabsTrigger
              value="credentials"
              className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
            >
              Credentials
            </TabsTrigger>
          </TabsList>

          {/* Profile Info Tab */}
          <TabsContent value="profile">
            <form className="space-y-4">
              {/* Profile Image */}
              {/* <div className="flex items-center gap-4">
                <Avatar className="h-13 w-13 rounded-full">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="User avatar"
                    className="object-cover rounded-full"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="text-sm text-blue-600 underline"
                  >
                    Change Photo
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" />
                </div>
              </div> */}
              <div className="flex flex-col items-center justify-center relative w-fit group mx-auto my-4">
                <div className="relative h-20 w-20 rounded-full overflow-hidden group">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt="User avatar"
                      width={80}
                      height={80}
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-blue-500 text-white text-xl font-bold">
                      {initials}
                    </div>
                  )}

                  {/* Edit icon on hover */}
                  <div
                    onClick={handleImageClick}
                    className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536M9 11l6-6 3.536 3.536a2 2 0 010 2.828l-6 6H9v-2.828a2 2 0 01.586-1.414z"
                      />
                    </svg>
                  </div>
                </div>

                <input type="file" ref={fileInputRef} className="hidden" />
              </div>

              {/* First Row: First Name and Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="ModelFont text-sm block  font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-md placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-md placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                  />
                </div>
              </div>

              {/* Second Row: Phone Number and DOB */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 234 567 890"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-md placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                  />
                </div>
              </div>

              <DialogFooter className="pt-4">
                <button
                  type="submit"
                  className="bg-green-400 hover:bg-green-500 text-white px-5 py-2 rounded-4xl shadow-2xl transition"
                >
                  Save Changes
                </button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* Credentials Tab */}
          <TabsContent value="credentials">
            <form className="space-y-2">
              {/* Email (Disabled) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  defaultValue="user@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-500 shadow-inner cursor-not-allowed"
                />
              </div>

              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your current password"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-md placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your new password"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-md placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                />
              </div>

              {/* Submit Button */}
              <DialogFooter className="pt-4">
                <button
                  type="submit"
                  className="bg-green-400 hover:bg-green-500 text-white px-5 py-2 rounded-4xl shadow-2xl transition"
                >
                  Update Password
                </button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
