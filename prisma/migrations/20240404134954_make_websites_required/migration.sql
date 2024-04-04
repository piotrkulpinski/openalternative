/*
  Warnings:

  - A unique constraint covering the columns `[website]` on the table `Alternative` will be added. If there are existing duplicate values, this will fail.
  - Made the column `website` on table `Alternative` required. This step will fail if there are existing NULL values in that column.
  - Made the column `website` on table `Tool` required. This step will fail if there are existing NULL values in that column.
  - Made the column `repository` on table `Tool` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Alternative" ALTER COLUMN "website" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tool" ALTER COLUMN "website" SET NOT NULL,
ALTER COLUMN "repository" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Alternative_website_key" ON "Alternative"("website");
