-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "fasttrackpatient" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "PaymentHistory" ADD COLUMN     "TotalAppointmentCharges" DOUBLE PRECISION;
