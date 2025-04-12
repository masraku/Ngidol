/*
  Warnings:

  - You are about to drop the column `photo` on the `event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event" DROP COLUMN "photo",
ADD COLUMN     "photos" TEXT[];
