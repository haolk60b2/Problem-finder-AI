-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'TEAM');

-- CreateEnum
CREATE TYPE "ProjectLanguage" AS ENUM ('en', 'vi', 'mixed');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('reddit', 'facebook_group', 'forum', 'app_review', 'youtube', 'csv');

-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('pending', 'fetching', 'processing', 'clustering', 'generating', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "InsightCategory" AS ENUM ('pain_point', 'feature_request', 'complaint', 'workaround', 'buying_intent');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "language" "ProjectLanguage" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "SourceType" NOT NULL,
    "configJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawPost" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "sourceType" "SourceType" NOT NULL,
    "sourcePostId" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "author" TEXT,
    "url" TEXT,
    "publishedAt" TIMESTAMP(3),
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RawPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawComment" (
    "id" TEXT NOT NULL,
    "rawPostId" TEXT NOT NULL,
    "sourceType" "SourceType" NOT NULL,
    "sourcePostId" TEXT,
    "content" TEXT NOT NULL,
    "author" TEXT,
    "publishedAt" TIMESTAMP(3),
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RawComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PainPoint" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "InsightCategory" NOT NULL,
    "urgencyScore" INTEGER NOT NULL,
    "frequencyScore" INTEGER NOT NULL,
    "commercialScore" INTEGER NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PainPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PainEvidence" (
    "id" TEXT NOT NULL,
    "painPointId" TEXT NOT NULL,
    "rawPostId" TEXT,
    "rawCommentId" TEXT,
    "excerpt" TEXT NOT NULL,
    "sentiment" INTEGER NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PainEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdeaSuggestion" (
    "id" TEXT NOT NULL,
    "painPointId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "businessModel" TEXT NOT NULL,
    "mvpFeaturesJson" JSONB NOT NULL,
    "difficulty" TEXT NOT NULL,
    "monetization" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdeaSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisRun" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'pending',
    "filtersJson" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "totalDocuments" INTEGER NOT NULL DEFAULT 0,
    "totalPainPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalysisRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "RawPost_projectId_sourceType_idx" ON "RawPost"("projectId", "sourceType");

-- CreateIndex
CREATE UNIQUE INDEX "RawPost_projectId_sourcePostId_key" ON "RawPost"("projectId", "sourcePostId");

-- CreateIndex
CREATE INDEX "RawComment_rawPostId_idx" ON "RawComment"("rawPostId");

-- CreateIndex
CREATE INDEX "PainPoint_projectId_totalScore_idx" ON "PainPoint"("projectId", "totalScore");

-- CreateIndex
CREATE INDEX "PainEvidence_painPointId_idx" ON "PainEvidence"("painPointId");

-- CreateIndex
CREATE INDEX "IdeaSuggestion_painPointId_idx" ON "IdeaSuggestion"("painPointId");

-- CreateIndex
CREATE INDEX "AnalysisRun_projectId_status_idx" ON "AnalysisRun"("projectId", "status");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawPost" ADD CONSTRAINT "RawPost_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawComment" ADD CONSTRAINT "RawComment_rawPostId_fkey" FOREIGN KEY ("rawPostId") REFERENCES "RawPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PainPoint" ADD CONSTRAINT "PainPoint_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PainEvidence" ADD CONSTRAINT "PainEvidence_painPointId_fkey" FOREIGN KEY ("painPointId") REFERENCES "PainPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PainEvidence" ADD CONSTRAINT "PainEvidence_rawPostId_fkey" FOREIGN KEY ("rawPostId") REFERENCES "RawPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PainEvidence" ADD CONSTRAINT "PainEvidence_rawCommentId_fkey" FOREIGN KEY ("rawCommentId") REFERENCES "RawComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdeaSuggestion" ADD CONSTRAINT "IdeaSuggestion_painPointId_fkey" FOREIGN KEY ("painPointId") REFERENCES "PainPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisRun" ADD CONSTRAINT "AnalysisRun_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
