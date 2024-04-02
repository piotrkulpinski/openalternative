/*
  Warnings:

  - You are about to drop the column `prevId` on the `Alternative` table. All the data in the column will be lost.
  - You are about to drop the column `prevId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `prevId` on the `Tool` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Alternative_prevId_key";

-- DropIndex
DROP INDEX "Category_prevId_key";

-- DropIndex
DROP INDEX "Tool_prevId_key";

-- AlterTable
ALTER TABLE "Alternative" DROP COLUMN "prevId";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "prevId";

-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "prevId";
