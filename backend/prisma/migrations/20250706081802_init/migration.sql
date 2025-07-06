/*
  Warnings:

  - You are about to drop the column `termsId` on the `practitioners` table. All the data in the column will be lost.
  - Added the required column `termId` to the `practitioners` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "practitioners" DROP CONSTRAINT "practitioners_termsId_fkey";

-- AlterTable
ALTER TABLE "practitioners" DROP COLUMN "termsId",
ADD COLUMN     "termId" INTEGER NOT NULL,
ADD COLUMN     "termVersion" DOUBLE PRECISION NOT NULL DEFAULT 0.00;

-- AddForeignKey
ALTER TABLE "practitioners" ADD CONSTRAINT "practitioners_termId_fkey" FOREIGN KEY ("termId") REFERENCES "terms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
