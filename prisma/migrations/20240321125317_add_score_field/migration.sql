/*
  Warnings:

  - You are about to drop the column `issues` on the `Tool` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tool" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "website" TEXT,
    "repository" TEXT,
    "description" TEXT,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "forks" INTEGER NOT NULL DEFAULT 0,
    "license" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "bump" INTEGER,
    "faviconUrl" TEXT,
    "screenshotUrl" TEXT,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "lastCommitDate" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Tool" ("bump", "createdAt", "description", "faviconUrl", "forks", "id", "isDraft", "isFeatured", "lastCommitDate", "license", "name", "repository", "screenshotUrl", "slug", "stars", "updatedAt", "website") SELECT "bump", "createdAt", "description", "faviconUrl", "forks", "id", "isDraft", "isFeatured", "lastCommitDate", "license", "name", "repository", "screenshotUrl", "slug", "stars", "updatedAt", "website" FROM "Tool";
DROP TABLE "Tool";
ALTER TABLE "new_Tool" RENAME TO "Tool";
CREATE UNIQUE INDEX "Tool_slug_key" ON "Tool"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
