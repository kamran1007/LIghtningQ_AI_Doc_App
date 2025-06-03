-- AlterTable
ALTER TABLE "Hospital" ALTER COLUMN "website" DROP NOT NULL,
ALTER COLUMN "logoUrl" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_UserHospitals" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserHospitals_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserHospitals_B_index" ON "_UserHospitals"("B");

-- AddForeignKey
ALTER TABLE "_UserHospitals" ADD CONSTRAINT "_UserHospitals_A_fkey" FOREIGN KEY ("A") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserHospitals" ADD CONSTRAINT "_UserHospitals_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
