-- CreateTable
CREATE TABLE "Idol" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Idol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instagram" TEXT,
    "X" TEXT,
    "idolId" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "spotifyUrl" TEXT NOT NULL,
    "idolId" TEXT NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Idol_name_key" ON "Idol"("name");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_idolId_fkey" FOREIGN KEY ("idolId") REFERENCES "Idol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_idolId_fkey" FOREIGN KEY ("idolId") REFERENCES "Idol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
