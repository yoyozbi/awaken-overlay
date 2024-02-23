/*
  Warnings:

  - You are about to drop the column `active_expires` on the `auth_session` table. All the data in the column will be lost.
  - You are about to drop the column `idle_expires` on the `auth_session` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `auth_session` table. All the data in the column will be lost.
  - You are about to drop the `auth_key` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `expiresAt` to the `auth_session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `auth_session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashedPassword` to the `auth_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "auth_key" DROP CONSTRAINT "auth_key_user_id_fkey";

-- DropForeignKey
ALTER TABLE "auth_session" DROP CONSTRAINT "auth_session_user_id_fkey";

-- DropIndex
DROP INDEX "auth_session_user_id_idx";

-- AlterTable
ALTER TABLE "auth_session" DROP COLUMN "active_expires",
DROP COLUMN "idle_expires",
DROP COLUMN "user_id",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "auth_user" ADD COLUMN     "hashedPassword" TEXT NOT NULL;

-- DropTable
DROP TABLE "auth_key";

-- CreateIndex
CREATE INDEX "auth_session_userId_idx" ON "auth_session"("userId");

-- AddForeignKey
ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
