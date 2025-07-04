/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Idol` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Idol` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Idol" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Idol_slug_key" ON "Idol"("slug");
