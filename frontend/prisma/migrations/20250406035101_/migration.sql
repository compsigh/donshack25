/*
  Warnings:

  - You are about to drop the column `firstName` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Professor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Professor" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '';
