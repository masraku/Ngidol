/*
  Warnings:

  - The `sosmed` column on the `Idol` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Idol" DROP COLUMN "sosmed",
ADD COLUMN     "sosmed" TEXT[];
