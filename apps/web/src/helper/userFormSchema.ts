import * as z from "zod";

// Password strength validation function
const validatePasswordStrength = (password: string) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const score = [minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
  
  return {
    isValid: score >= 4 && minLength,
    score,
    requirements: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    }
  };
};

export const userFormSchema = (isResetPassword: boolean) => z
  .object({
    Prefix: z.string().nonempty("Prefix is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    Employee_ID: z.string().optional(),
    mobile: z
      .string()
      .min(10, "Mobile must be at least 10 digits")
      .regex(/^\d+$/, "Mobile must contain only numbers"),
    gender: z.string().nonempty("Gender is required").min(1),
    dateOfBirth: z.string().nonempty("Date of birth is required"),
    email: z.string().email("Invalid email"),
    passwordHash: isResetPassword
      ? z.string()
          .min(8, "Password must be at least 8 characters")
          .refine((password) => {
            const validation = validatePasswordStrength(password);
            return validation.isValid;
          }, {
            message: "Password must contain at least 8 characters with uppercase, lowercase, numbers, and special characters"
          })
      : z.string().optional(),
    confirmPassword: isResetPassword
      ? z.string().min(1, "Please confirm your password")
      : z.string().optional(),
    roleId: z.coerce
      .number({
        required_error: "Role is required",
        invalid_type_error: "Role must be a number",
      })
      .min(1, "Role is required"),
    SpecializationId: z.coerce
      .number({
        required_error: "Specialization is required",
        invalid_type_error: "Specialization must be a number",
      })
      .min(1, "Specialization is required"),
    Experience: z.string().optional(),
    imageUrl: z.any().optional(),
    SignatureOfUser: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    if (isResetPassword) {
      if (data.passwordHash !== data.confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          message: "Passwords do not match",
          code: "custom",
        });
      }
    }
  });