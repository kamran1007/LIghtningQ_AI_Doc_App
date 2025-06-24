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
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { getProfile } from "@/lib/action";
import { profileSchema } from "@/helper/profileschema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast"; // or from "sonner"
import type { AxiosError } from "axios";
import { updatePassword, updateProfile } from "@/lib/profile";
import { PasswordForm, passwordSchema } from "@/helper/profilepasswordschema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { ProfileSkeleton } from "./ui/skeletonloader/ProfileSkeleton";
import { Label } from "@/components/ui/label";

interface ProfileModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, setOpen }) => {
  const mutation = useMutation({ mutationFn: updateProfile });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imageUrl, setImageUrl] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<{
    firstName?: string;
    lastName?: string;
    mobile?: string;
    dateOfBirth?: string;
  }>({});
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const result = await getProfile();
      if (result) {
        console.log("ProfileModel working", result);
        setImageUrl(
          result.user.imageUrl
            ? `http://localhost:8000${result.user.imageUrl}`
            : ""
        );
        setFirstName(result.user.firstName || "");
        setLastName(result.user.lastName || "");
        setMobile(result.user.mobile || "");
        setDateOfBirth(
          result.user.dateOfBirth ? result.user.dateOfBirth.split("T")[0] : ""
        );
        setEmail(result.user.email || "");
      }
      setLoading(false);
    };

    if (open) {
      fetchProfile();
    } else {
      setError({});
    }
  }, [open]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  //handle submit
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      firstName,
      lastName,
      mobile,
      dateOfBirth,
      image: fileInputRef.current?.files || null,
    };

    // Optional: Validate using zod
    const parsed = profileSchema.safeParse(data);
    if (!parsed.success) {
      const formatted = parsed.error.format();
      console.log("Validation Errors:", formatted);

      setError({
        firstName: formatted.firstName?._errors?.[0],
        lastName: formatted.lastName?._errors?.[0],
        mobile: formatted.mobile?._errors?.[0],
        dateOfBirth: formatted.dateOfBirth?._errors?.[0],
      });

      toast.error("Please correct the errors and try again.");
      return;
    } else {
      setError({}); // Clear errors on successful validation
    }

    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("mobile", data.mobile);
    formData.append("dateOfBirth", data.dateOfBirth);
    if (data.image && data.image[0]) {
      // formData.append("image", data.image[0]);
      formData.append("file", data.image[0]);
    }

    try {
      await mutation.mutateAsync(formData);
      toast.success("Profile updated successfully");
      setOpen(false);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const initials =
    (firstName?.[0]?.toUpperCase() || "") +
    (lastName?.[0]?.toUpperCase() || "");

  // change password for User Profile

  const {
    register,
    handleSubmit: handlePasswordSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const newPassword = watch("newPassword");

  // Password strength logic
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[\W_]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(newPassword || "");

  const onSubmits = async (data: PasswordForm) => {
    try {
      setApiError("");
      setApiSuccess("");
      const passwordUpdate = await updatePassword(
        data.currentPassword,
        data.newPassword
      );
      setApiSuccess("Password changed successfully!");
      toast.success("Password changed successfully");
    } catch (error: any) {
      setApiError(error.response?.data?.message || "Something went wrong.");
      toast.error(error.response?.data?.message);
    }
  };
  // const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      reset(); // ✅ Clear form fields and validation errors
      setApiError(""); // ✅ Clear custom API error messages
      setApiSuccess(""); // ✅ Clear success messages if needed
    }
  }, [open, reset]);
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

        <Tabs defaultValue="profile" className="w-full ">
          <TabsList className="mb-2 border-b w-full flex gap-2">
            <TabsTrigger
              value="profile"
              className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 cursor-pointer"
            >
              Profile Info
            </TabsTrigger>
            <TabsTrigger
              value="credentials"
              className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 cursor-pointer"
            >
              Credentials
            </TabsTrigger>
          </TabsList>

          {/* Profile Info Tab */}

          <TabsContent value="profile">
            {loading ? (
              <ProfileSkeleton />
            ) : (
              <div>
                <form className="space-y-4" onSubmit={handleProfileSubmit}>
                  {/* Profile Image */}
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

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>

                  {/* First Row: First Name and Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <Label className="mb-2">First Name</Label>
                      <input
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-md placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                    <Label className="mb-2">Last Name</Label>

                      <input
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-md placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                      />
                    </div>
                  </div>

                  {/* Second Row: Phone Number and DOB */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Phone Number */}
                    <div>
                    <Label className="mb-2">Phone Number</Label>

                      <input
                        type="tel"
                        placeholder="+1 234 567 890"
                        value={mobile}
                        maxLength={10}
                        onChange={(e) => setMobile(e.target.value)}
                        className={`w-full rounded-xl px-4 py-2 text-sm shadow-md transition duration-200 
      ${error.mobile ? "border-red-500 ring-2 ring-red-300" : "border-gray-300 focus:border-blue-500 focus:ring-blue-300"} 
      bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none`}
                      />
                      {error.mobile && (
                        <p className="text-red-500 text-xs mt-1">
                          {error.mobile}
                        </p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                    <Label className="mb-2">Date Of Birth</Label>

                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        maxLength={10}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                      />
                    </div>
                  </div>

                  <DialogFooter className="pt-4">
                    {/* {mutation.isLoading && <p>Loading...</p>} */}

                    <button
                      type="submit"
                      disabled={mutation.status === "pending"}
                      className="bg-green-400 hover:bg-green-500 text-white px-5 py-2 rounded-4xl shadow-2xl transition disabled:opacity-50 cursor-pointer"
                      // onClick={() => mutation.mutate(data)}
                    >
                      {mutation.status === "pending"
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </DialogFooter>
                </form>
              </div>
            )}
          </TabsContent>

          {/* Credentials Tab */}
          <TabsContent value="credentials">
            <form
              onSubmit={handlePasswordSubmit(onSubmits)}
              className="space-y-2"
            >
              {/* Email (Disabled) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-500 shadow-inner cursor-not-allowed"
                />
              </div>

              {/* Current Password */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  {...register("currentPassword")}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-md placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                />
                <span
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </span>
                {/* {errors.oldPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.oldPassword.message}
                  </p>
                )} */}
              </div>

              {/* New Password */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  {...register("newPassword")}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-md placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.newPassword.message}
                  </p>
                )}
                <span
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
                {/* Password strength bar */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="h-2 rounded bg-gray-300 w-full">
                      <div
                        className={`h-2 rounded transition-all duration-300 ${
                          passwordStrength <= 2
                            ? "bg-red-500 w-1/4"
                            : passwordStrength === 3
                              ? "bg-yellow-500 w-1/2"
                              : passwordStrength === 4
                                ? "bg-blue-500 w-3/4"
                                : "bg-green-500 w-full"
                        }`}
                      ></div>
                    </div>
                    <p className="text-xs mt-1 text-gray-500">
                      Strength:{" "}
                      {
                        [
                          "Very Weak",
                          "Weak",
                          "Moderate",
                          "Strong",
                          "Very Strong",
                        ][passwordStrength - 1]
                      }
                    </p>
                  </div>
                )}
              </div>
              {apiError && <p className="text-red-600">{apiError}</p>}
              {apiSuccess && <p className="text-green-600">{apiSuccess}</p>}

              {/* Submit Button */}
              <DialogFooter className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-400 hover:bg-green-500 text-white px-5 py-2 rounded-4xl shadow-2xl transition cursor-pointer"
                >
                  {isSubmitting ? "updating Password..." : "Update Password"}
                </button>
              </DialogFooter>

              {/* Success/Error Messages */}
              {apiSuccess && (
                <p className="text-green-600 text-sm">{apiSuccess}</p>
              )}
              {apiError && <p className="text-red-600 text-sm">{apiError}</p>}
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
