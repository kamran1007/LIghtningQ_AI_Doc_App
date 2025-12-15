-- CreateTable
CREATE TABLE "RoleSpecialization" (
    "RoleSpecializationId" SERIAL NOT NULL,
    "RoleId" INTEGER NOT NULL,
    "SpecializationId" INTEGER NOT NULL,

    CONSTRAINT "RoleSpecialization_pkey" PRIMARY KEY ("RoleSpecializationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoleSpecialization_RoleId_SpecializationId_key" ON "RoleSpecialization"("RoleId", "SpecializationId");

-- AddForeignKey
ALTER TABLE "RoleSpecialization" ADD CONSTRAINT "RoleSpecialization_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES "Role"("RoleId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleSpecialization" ADD CONSTRAINT "RoleSpecialization_SpecializationId_fkey" FOREIGN KEY ("SpecializationId") REFERENCES "Specialization"("SpecializationId") ON DELETE CASCADE ON UPDATE CASCADE;
