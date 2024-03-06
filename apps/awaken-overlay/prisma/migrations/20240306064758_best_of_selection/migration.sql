/*
  Warnings:

  - A unique constraint covering the columns `[bestOfId]` on the table `CurrentMatch` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bestOfId` to the `CurrentMatch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CurrentMatch" ADD COLUMN     "bestOfId" TEXT;

-- CreateTable
CREATE TABLE "BestOf" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nbOfMatch" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BestOf_pkey" PRIMARY KEY ("id")
);

INSERT INTO "BestOf" ("id", "name", "nbOfMatch", "updatedAt") VALUES (gen_random_uuid(),'bo3', 3, CURRENT_TIMESTAMP);

UPDATE "CurrentMatch" SET "bestOfId"=(SELECT id FROM "BestOf" LIMIT 1);

ALTER TABLE "CurrentMatch" ALTER COLUMN "bestOfId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BestOf_name_key" ON "BestOf"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BestOf_nbOfMatch_key" ON "BestOf"("nbOfMatch");

-- CreateIndex
CREATE UNIQUE INDEX "CurrentMatch_bestOfId_key" ON "CurrentMatch"("bestOfId");

-- AddForeignKey
ALTER TABLE "CurrentMatch" ADD CONSTRAINT "CurrentMatch_bestOfId_fkey" FOREIGN KEY ("bestOfId") REFERENCES "BestOf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
