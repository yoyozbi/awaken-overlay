/*
  Warnings:

  - Added the required column `team1Score` to the `CurrentMatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team2Score` to the `CurrentMatch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CurrentMatch" ADD COLUMN     "team1Score" INTEGER NOT NULL,
ADD COLUMN     "team2Score" INTEGER NOT NULL;
