/*
  Warnings:

  - Added the required column `sosmed` to the `Idol` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Idol" ADD COLUMN     "sosmed" TEXT NOT NULL;
