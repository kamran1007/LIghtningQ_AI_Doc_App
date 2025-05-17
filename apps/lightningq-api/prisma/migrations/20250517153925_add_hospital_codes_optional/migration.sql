/*
  Warnings:

  - You are about to drop the column `name` on the `Role` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Rolename]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Role_name_key";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "name",
ADD COLUMN     "Rolename" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Role_Rolename_key" ON "Role"("Rolename");
