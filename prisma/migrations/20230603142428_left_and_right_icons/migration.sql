/*
  Warnings:

  - You are about to drop the column `icon` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "icon",
ADD COLUMN     "leftIcon" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "rightIcon" TEXT NOT NULL DEFAULT '';
