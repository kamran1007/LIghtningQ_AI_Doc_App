import { z } from "zod";

export const profileSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    mobile: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^[\d+ ]+$/, "Invalid phone number"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    image: z
      .any()
      .optional()
      .refine(
        (files) => !files || files.length <= 1,
        "Only one image can be uploaded"
      ),
  })
  .partial();

export type ProfileSchema = z.infer<typeof profileSchema>;
