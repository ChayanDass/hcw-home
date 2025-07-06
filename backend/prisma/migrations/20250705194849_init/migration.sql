/*
  Warnings:

  - You are about to drop the column `termsVersion` on the `practitioners` table. All the data in the column will be lost.
  - Added the required column `termsId` to the `practitioners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "practitioners" DROP COLUMN "termsVersion",
ADD COLUMN     "termsId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "practitioners" ADD CONSTRAINT "practitioners_termsId_fkey" FOREIGN KEY ("termsId") REFERENCES "terms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
