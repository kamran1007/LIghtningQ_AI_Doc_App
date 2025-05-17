-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "hospitalCode" TEXT,
ADD COLUMN     "levelId" INTEGER,
ADD COLUMN     "superHospitalCode" TEXT;

-- CreateTable
CREATE TABLE "Hospitaltype" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Hospitaltype_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hospitaltype_name_key" ON "Hospitaltype"("name");

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Hospitaltype"("id") ON DELETE SET NULL ON UPDATE CASCADE;
