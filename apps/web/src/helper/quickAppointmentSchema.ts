import { z } from "zod";

export const quickAppointmentSchema = z.object({
  Prefix: z.enum(["Mr", "Mrs", "Miss", "Ms", "Prof", "Other"]).optional(),
  // start: z.date({}),
  //   end: z.date({}),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "DOB is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  mobile: z.string().length(10, "Mobile number must be 10 digits"),
  addressLine1: z.string().optional(),
  visitTypeId: z.string().min(1, "Visit Type is required"), // if you're
  // using string IDs
  VisitReason: z.string().min(5, "Please Enter Visit Reason"),
  cancellationReason: z.string().optional(),
  TagPatientIds: z
    .array(z.union([z.string(), z.number()]))
    .transform((arr) => arr.map((id) => Number(id)))
    .optional(),
  acuity: z.string().optional(),
  paymentTypeId: z.string().min(1, "Payment Type is required"),
  appointmentDate: z.string().optional(),
  appointmentTime: z
    .string({ required_error: "Appointment time is required" })
    .nonempty("Time is required"),
  email: z.string().min(1, "email required"),
  sendEmailMessage: z.boolean().optional(),
  sendSmsMessage: z.boolean().optional(),
  sendWhatsappMessage: z.boolean().optional(),
  AppointmentChargesPaid: z.number().optional(),
  ActualAppointmentCharges: z.number().optional(),
  DiscountOnAppointment: z.number().optional(),
  FastTrackCharges: z.number().optional(),
  TotalAppointmentCharges: z.number().optional(),

  isAmountPaid: z.boolean().optional(),
  fasttrackpatient: z.boolean().optional(),
});

export type quickAppointmentSchema = z.infer<typeof quickAppointmentSchema>;
