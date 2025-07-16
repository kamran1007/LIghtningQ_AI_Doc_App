import { z } from "zod";

export const eventAddPatientRegistrationFormSchema = z.object({
  Title: z
    .string({ required_error: "Please enter a title." })
    .min(1, { message: "Must provide a title for this event." }),

  firstName: z
    .string({ required_error: "Please enter first name." })
    .min(1, { message: "First name is required." }),

  lastName: z
    .string({ required_error: "Please enter last name." })
    .min(1, { message: "Last name is required." })
    .optional(),

    DateofBirth: z
    .preprocess((val) => {
      if (typeof val === "string" || val instanceof Date) return new Date(val);
      return undefined;
    }, z.date({ required_error: "Date of Birth is required." })),
  gender: z.string().min(1, { message: "Gender is required." }),
  mobilenumber: z.string().min(10, { message: "Mobile number is required." }),
  alternativemobilenumber: z.string().optional(),
  Email: z.string().email({ message: "Invalid email address." }).optional(),
  ReferralSource: z.string().optional(),
  doorNumber: z.string().optional(),
  street: z.string().optional(),
  Area: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  bloodgroup: z.string().optional(),
  Landmark: z.string().optional(),
  Taluka: z.string().optional(),
  EmergencyContactNumber: z.string().optional(),
  EmergencyContactName: z.string().optional(),
  KinName: z.string().optional(),
  KinContactName: z.string().optional(),
});


export type PasswordForm = z.infer<typeof eventAddPatientRegistrationFormSchema>;
