-- DropForeignKey
ALTER TABLE "Hospital" DROP CONSTRAINT "Hospital_parentHospitalId_fkey";

-- AlterTable
ALTER TABLE "Hospital" ALTER COLUMN "parentHospitalId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_parentHospitalId_fkey" FOREIGN KEY ("parentHospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;
