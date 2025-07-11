-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favoriteMemberOrder" TEXT[] DEFAULT ARRAY[]::TEXT[];
