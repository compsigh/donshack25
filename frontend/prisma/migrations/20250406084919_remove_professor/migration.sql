/*
  Warnings:

  - You are about to drop the column `prerequisiteId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `professorId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `Professor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_prerequisiteId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_professorId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "prerequisiteId",
DROP COLUMN "professorId",
ADD COLUMN     "prerequisitesId" INTEGER;

-- DropTable
DROP TABLE "Professor";

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_prerequisitesId_fkey" FOREIGN KEY ("prerequisitesId") REFERENCES "Expression"("id") ON DELETE SET NULL ON UPDATE CASCADE;
