/*
  Warnings:

  - Added the required column `userId` to the `HandConceptLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ReviewLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HandConceptLink" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ReviewLog" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "HandConceptLink_userId_idx" ON "HandConceptLink"("userId");

-- CreateIndex
CREATE INDEX "ReviewLog_userId_idx" ON "ReviewLog"("userId");

-- CreateIndex
CREATE INDEX "ReviewLog_flashcardId_idx" ON "ReviewLog"("flashcardId");

-- AddForeignKey
ALTER TABLE "ReviewLog" ADD CONSTRAINT "ReviewLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HandConceptLink" ADD CONSTRAINT "HandConceptLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
