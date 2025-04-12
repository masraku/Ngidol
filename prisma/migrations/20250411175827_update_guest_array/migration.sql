/*
  Warnings:

  - The `guest` column on the `event` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "event" DROP COLUMN "guest",
ADD COLUMN     "guest" TEXT[];
