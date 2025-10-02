/*
  Warnings:

  - You are about to drop the column `jobId` on the `Chat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[adminId,userId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_jobId_fkey";

-- DropIndex
DROP INDEX "Chat_jobId_adminId_userId_idx";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "jobId";

-- CreateIndex
CREATE UNIQUE INDEX "Chat_adminId_userId_key" ON "Chat"("adminId", "userId");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
