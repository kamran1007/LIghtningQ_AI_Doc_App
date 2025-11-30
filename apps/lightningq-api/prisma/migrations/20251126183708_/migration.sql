/*
  Warnings:

  - You are about to drop the column `Description` on the `ConsultationProcedure` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ConsultationProcedure" DROP COLUMN "Description",
ADD COLUMN     "ConsultationProcedureRemark" TEXT;
