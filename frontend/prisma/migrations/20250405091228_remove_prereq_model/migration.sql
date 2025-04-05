/*
  Warnings:

  - You are about to drop the `CoursePrereq` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CoursePrereq" DROP CONSTRAINT "CoursePrereq_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CoursePrereq" DROP CONSTRAINT "CoursePrereq_prerequisiteId_fkey";

-- DropTable
DROP TABLE "CoursePrereq";

-- CreateTable
CREATE TABLE "_CourseToCourse" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CourseToCourse_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CourseToCourse_B_index" ON "_CourseToCourse"("B");

-- AddForeignKey
ALTER TABLE "_CourseToCourse" ADD CONSTRAINT "_CourseToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourse" ADD CONSTRAINT "_CourseToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
