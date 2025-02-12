/*
  Warnings:

  - You are about to drop the column `website` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Alternative` table. All the data in the column will be lost.
  - You are about to drop the column `repository` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Tool` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[websiteUrl]` on the table `Alternative` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[websiteUrl]` on the table `Tool` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[repositoryUrl]` on the table `Tool` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `websiteUrl` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `websiteUrl` to the `Alternative` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repositoryUrl` to the `Tool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `websiteUrl` to the `Tool` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Alternative_website_key";

-- DropIndex
DROP INDEX "Tool_repository_key";

-- DropIndex
DROP INDEX "Tool_website_key";

-- AlterTable
ALTER TABLE "Ad" DROP COLUMN "website",
ADD COLUMN     "websiteUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Alternative" DROP COLUMN "website",
ADD COLUMN     "websiteUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "repository",
DROP COLUMN "website",
ADD COLUMN     "affiliateUrl" TEXT,
ADD COLUMN     "repositoryUrl" TEXT NOT NULL,
ADD COLUMN     "websiteUrl" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Alternative_websiteUrl_key" ON "Alternative"("websiteUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_websiteUrl_key" ON "Tool"("websiteUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_repositoryUrl_key" ON "Tool"("repositoryUrl");
