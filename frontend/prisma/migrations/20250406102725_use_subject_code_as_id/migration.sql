/*
  Warnings:

  - The primary key for the `Subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Subject` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_subjectId_fkey";

-- DropIndex
DROP INDEX "Subject_code_key";

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "subjectId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Subject_pkey" PRIMARY KEY ("code");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
