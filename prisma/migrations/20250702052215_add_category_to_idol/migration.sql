-- AlterTable
ALTER TABLE "Idol" ADD COLUMN     "categoryId" INTEGER;

-- AddForeignKey
ALTER TABLE "Idol" ADD CONSTRAINT "Idol_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
