import { z } from "zod";

export type FormState =
  | {
      error?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;



export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(1, {
      message: "Password field must not be empty.",
    }),
});

export enum Role {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  USER = "USER",
}