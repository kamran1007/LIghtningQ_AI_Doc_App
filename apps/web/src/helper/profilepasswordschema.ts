import { optional, z } from "zod";

export const passwordSchema = z
  .object({
    currentPassword: z.string({
      required_error: "Current password is required",
      invalid_type_error: "Current password must be a string",
    })
    .min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
      .regex(/[a-z]/, "New password must contain at least one lowercase letter")
      .regex(/[0-9]/, "New password must contain at least one number")
      .regex(/[\W_]/, "New password must contain at least one special character"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from old password",
    path: ["newPassword"],
  });
export type PasswordForm = z.infer<typeof passwordSchema>;
