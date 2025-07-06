/*
  Warnings:

  - You are about to drop the column `userId` on the `practitioners` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "practitioners" DROP CONSTRAINT "practitioners_userId_fkey";

-- DropIndex
DROP INDEX "practitioners_userId_key";

-- AlterTable
ALTER TABLE "practitioners" DROP COLUMN "userId",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "practitioners_id_seq";

-- AddForeignKey
ALTER TABLE "practitioners" ADD CONSTRAINT "practitioners_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
