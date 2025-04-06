/*
  Warnings:

  - You are about to drop the `_CourseToCourse` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ExprType" AS ENUM ('AND', 'OR', 'COURSE');

-- DropForeignKey
ALTER TABLE "_CourseToCourse" DROP CONSTRAINT "_CourseToCourse_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToCourse" DROP CONSTRAINT "_CourseToCourse_B_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "prerequisiteId" INTEGER;

-- DropTable
DROP TABLE "_CourseToCourse";

-- CreateTable
CREATE TABLE "Expression" (
    "id" SERIAL NOT NULL,
    "type" "ExprType" NOT NULL,
    "courseId" INTEGER,
    "parentId" INTEGER,

    CONSTRAINT "Expression_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "Expression"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expression" ADD CONSTRAINT "Expression_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expression" ADD CONSTRAINT "Expression_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Expression"("id") ON DELETE SET NULL ON UPDATE CASCADE;
