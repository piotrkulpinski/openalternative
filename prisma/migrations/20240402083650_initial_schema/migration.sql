-- CreateTable
CREATE TABLE "Tool" (
    "id" TEXT NOT NULL,
    "prevId" INTEGER NOT NULL,
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
    "lastCommitDate" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alternative" (
    "id" TEXT NOT NULL,
    "prevId" INTEGER NOT NULL,
    "description" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "website" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alternative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "prevId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Topic" (
    "slug" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "AlternativeToTool" (
    "toolId" TEXT NOT NULL,
    "alternativeId" TEXT NOT NULL,

    CONSTRAINT "AlternativeToTool_pkey" PRIMARY KEY ("toolId","alternativeId")
);

-- CreateTable
CREATE TABLE "CategoryToTools" (
    "toolId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "CategoryToTools_pkey" PRIMARY KEY ("toolId","categoryId")
);

-- CreateTable
CREATE TABLE "LanguageToTool" (
    "toolId" TEXT NOT NULL,
    "languageSlug" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION,

    CONSTRAINT "LanguageToTool_pkey" PRIMARY KEY ("toolId","languageSlug")
);

-- CreateTable
CREATE TABLE "TopicToTool" (
    "toolId" TEXT NOT NULL,
    "topicSlug" TEXT NOT NULL,

    CONSTRAINT "TopicToTool_pkey" PRIMARY KEY ("toolId","topicSlug")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tool_prevId_key" ON "Tool"("prevId");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_slug_key" ON "Tool"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_website_key" ON "Tool"("website");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_repository_key" ON "Tool"("repository");

-- CreateIndex
CREATE UNIQUE INDEX "Alternative_prevId_key" ON "Alternative"("prevId");

-- CreateIndex
CREATE UNIQUE INDEX "Alternative_slug_key" ON "Alternative"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_prevId_key" ON "Category"("prevId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Language_slug_key" ON "Language"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_slug_key" ON "Topic"("slug");

-- AddForeignKey
ALTER TABLE "AlternativeToTool" ADD CONSTRAINT "AlternativeToTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlternativeToTool" ADD CONSTRAINT "AlternativeToTool_alternativeId_fkey" FOREIGN KEY ("alternativeId") REFERENCES "Alternative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryToTools" ADD CONSTRAINT "CategoryToTools_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryToTools" ADD CONSTRAINT "CategoryToTools_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageToTool" ADD CONSTRAINT "LanguageToTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageToTool" ADD CONSTRAINT "LanguageToTool_languageSlug_fkey" FOREIGN KEY ("languageSlug") REFERENCES "Language"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicToTool" ADD CONSTRAINT "TopicToTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicToTool" ADD CONSTRAINT "TopicToTool_topicSlug_fkey" FOREIGN KEY ("topicSlug") REFERENCES "Topic"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
