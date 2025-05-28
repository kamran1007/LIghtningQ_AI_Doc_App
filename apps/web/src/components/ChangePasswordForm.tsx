"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { PasswordForm, passwordSchema } from "@/helper/profilepasswordschema";
import { getProfile } from "@/lib/action";

// Validation Schema

export default function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const [email, setEmail] = useState("");

  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const newPassword = watch("newPassword");
  useEffect(() => {
    const fetchProfile = async () => {
      const result = await getProfile();
      if (result) {
        setEmail(result.user.email || "");
      }
    };
  }, []);
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

  const onSubmit = async (data: PasswordForm) => {
    try {
      setApiError("");
      setApiSuccess("");
      await axios.patch("/auth/changepassword", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      setApiSuccess("Password changed successfully!");
    } catch (error: any) {
      setApiError(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
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
      <div>
        <label className="block font-medium">Old Password</label>
        <input
          type="password"
          {...register("oldPassword")}
          className="input input-bordered w-full mt-1"
        />
        {errors.oldPassword && (
          <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">New Password</label>
        <input
          type="password"
          {...register("newPassword")}
          className="input input-bordered w-full mt-1"
        />
        {errors.newPassword && (
          <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
        )}

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
                ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"][
                  passwordStrength - 1
                ]
              }
            </p>
          </div>
        )}
      </div>

      {apiError && <p className="text-red-600">{apiError}</p>}
      {apiSuccess && <p className="text-green-600">{apiSuccess}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full"
      >
        {isSubmitting ? "Updating..." : "Change Password"}
      </button>
    </form>
  );
}
