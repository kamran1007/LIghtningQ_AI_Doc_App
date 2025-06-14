import * as z from "zod";

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

    gender: z.string().nonempty("Gender is required"),
    dateOfBirth: z.string().nonempty("Date of birth is required"),

    email: z.string().email("Invalid email"),

    passwordHash: isResetPassword
        ? z.string().min(6, "Password must be at least 6 characters")
        : z.string().optional(),

      confirmPassword: isResetPassword
        ? z.string().min(6, "Confirm password is required")
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

    // userBranchArray: z
    //   .array(
    //     z.object({
    //       HospitalId: z.number(),
    //       RoleId: z.number(),
    //       RoleName: z.string(),
    //       OrganizationId: z.number(),
    //       BranchName: z.string(),
    //       ActiveInd: z.string(),
    //       DeleteInd: z.string(),
    //     })
    //   )
    //   .min(1, "At least one hospital must be selected"),
  })
  .superRefine((data, ctx) => {
    if (isResetPassword && data.passwordHash !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: "custom",
      });
    }
  });
