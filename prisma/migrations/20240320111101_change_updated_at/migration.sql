/*
  Warnings:

  - You are about to drop the column `lastModifiedAt` on the `Tool` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Tool` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tool" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "airtableId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "website" TEXT,
    "repository" TEXT,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "issues" INTEGER NOT NULL,
    "license" TEXT,
    "score" INTEGER NOT NULL,
    "bump" INTEGER NOT NULL,
    "faviconUrl" TEXT,
    "screenshotUrl" TEXT,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "lastCommitDate" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Tool" ("airtableId", "bump", "createdAt", "description", "faviconUrl", "forks", "id", "isDraft", "isFeatured", "issues", "lastCommitDate", "license", "name", "repository", "score", "screenshotUrl", "slug", "stars", "website") SELECT "airtableId", "bump", "createdAt", "description", "faviconUrl", "forks", "id", "isDraft", "isFeatured", "issues", "lastCommitDate", "license", "name", "repository", "score", "screenshotUrl", "slug", "stars", "website" FROM "Tool";
DROP TABLE "Tool";
ALTER TABLE "new_Tool" RENAME TO "Tool";
CREATE UNIQUE INDEX "Tool_airtableId_key" ON "Tool"("airtableId");
CREATE UNIQUE INDEX "Tool_slug_key" ON "Tool"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
