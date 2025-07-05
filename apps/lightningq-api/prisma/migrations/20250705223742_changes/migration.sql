-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('WHATSAPP', 'SMS', 'EMAIL');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'RETRYING');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "sendEmailMessage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sendSmsMessage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sendWhatsappMessage" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "AppointmentNotification" (
    "id" SERIAL NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "channel" "NotificationType" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "response" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentNotification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AppointmentNotification" ADD CONSTRAINT "AppointmentNotification_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("AppointmentId") ON DELETE RESTRICT ON UPDATE CASCADE;
