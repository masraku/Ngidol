/*
  Warnings:

  - You are about to drop the column `sosmed` on the `Idol` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Idol" DROP COLUMN "sosmed",
ADD COLUMN     "sosmeds" TEXT[];
