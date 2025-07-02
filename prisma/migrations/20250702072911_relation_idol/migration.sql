/*
  Warnings:

  - You are about to drop the column `guest` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "guest";

-- CreateTable
CREATE TABLE "_EventGuests" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventGuests_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EventGuests_B_index" ON "_EventGuests"("B");

-- AddForeignKey
ALTER TABLE "_EventGuests" ADD CONSTRAINT "_EventGuests_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventGuests" ADD CONSTRAINT "_EventGuests_B_fkey" FOREIGN KEY ("B") REFERENCES "Idol"("id") ON DELETE CASCADE ON UPDATE CASCADE;
