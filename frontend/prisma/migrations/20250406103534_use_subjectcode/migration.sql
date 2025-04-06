/*
  Warnings:

  - You are about to drop the column `subjectId` on the `Course` table. All the data in the column will be lost.
  - Added the required column `subjectCode` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_subjectId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "subjectId",
ADD COLUMN     "subjectCode" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_subjectCode_fkey" FOREIGN KEY ("subjectCode") REFERENCES "Subject"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
