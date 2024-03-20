/*
  Warnings:

  - You are about to drop the column `airtableId` on the `Language` table. All the data in the column will be lost.
  - You are about to drop the column `airtableId` on the `Alternative` table. All the data in the column will be lost.
  - You are about to drop the column `airtableId` on the `Topic` table. All the data in the column will be lost.
  - You are about to drop the column `airtableId` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the column `airtableId` on the `Category` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Language" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);
INSERT INTO "new_Language" ("id", "name", "slug") SELECT "id", "name", "slug" FROM "Language";
DROP TABLE "Language";
ALTER TABLE "new_Language" RENAME TO "Language";
CREATE UNIQUE INDEX "Language_slug_key" ON "Language"("slug");
CREATE TABLE "new_Alternative" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "website" TEXT
);
INSERT INTO "new_Alternative" ("description", "id", "name", "slug", "website") SELECT "description", "id", "name", "slug", "website" FROM "Alternative";
DROP TABLE "Alternative";
ALTER TABLE "new_Alternative" RENAME TO "Alternative";
CREATE UNIQUE INDEX "Alternative_slug_key" ON "Alternative"("slug");
CREATE TABLE "new_Topic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);
INSERT INTO "new_Topic" ("id", "name", "slug") SELECT "id", "name", "slug" FROM "Topic";
DROP TABLE "Topic";
ALTER TABLE "new_Topic" RENAME TO "Topic";
CREATE UNIQUE INDEX "Topic_slug_key" ON "Topic"("slug");
CREATE TABLE "new_Tool" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "website" TEXT,
    "repository" TEXT,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "issues" INTEGER NOT NULL,
    "license" TEXT,
    "bump" INTEGER,
    "faviconUrl" TEXT,
    "screenshotUrl" TEXT,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "lastCommitDate" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Tool" ("bump", "createdAt", "description", "faviconUrl", "forks", "id", "isDraft", "isFeatured", "issues", "lastCommitDate", "license", "name", "repository", "screenshotUrl", "slug", "stars", "updatedAt", "website") SELECT "bump", "createdAt", "description", "faviconUrl", "forks", "id", "isDraft", "isFeatured", "issues", "lastCommitDate", "license", "name", "repository", "screenshotUrl", "slug", "stars", "updatedAt", "website" FROM "Tool";
DROP TABLE "Tool";
ALTER TABLE "new_Tool" RENAME TO "Tool";
CREATE UNIQUE INDEX "Tool_slug_key" ON "Tool"("slug");
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);
INSERT INTO "new_Category" ("id", "name", "slug") SELECT "id", "name", "slug" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
