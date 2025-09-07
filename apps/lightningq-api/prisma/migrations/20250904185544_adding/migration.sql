-- AlterTable
ALTER TABLE "PaymentHistory" ADD COLUMN     "ActualAppointmentCharges" DOUBLE PRECISION,
ADD COLUMN     "DiscountOnAppointment" DOUBLE PRECISION,
ADD COLUMN     "FastTrackFee" DOUBLE PRECISION;
