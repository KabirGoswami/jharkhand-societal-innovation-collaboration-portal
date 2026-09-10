-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CITIZEN',
    "phone" TEXT,
    "organization" TEXT,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" TEXT NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "blockOrPanchayat" TEXT NOT NULL DEFAULT 'District Headquarter Zone',
    "locationLat" DOUBLE PRECISION,
    "locationLng" DOUBLE PRECISION,
    "locationAddress" TEXT,
    "urgency" TEXT NOT NULL DEFAULT 'High',
    "affectedPopulation" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "socialImpactMetric" TEXT,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "upvotesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedById" TEXT,
    "submitterName" TEXT NOT NULL DEFAULT 'Concerned Citizen',
    "submitterType" TEXT NOT NULL DEFAULT 'citizen',
    "submitterContact" TEXT,
    "submitterEmail" TEXT,
    "submitterOrg" TEXT,
    "assignedHeiId" TEXT,
    "assignedHeiName" TEXT,
    "assignedDepartment" TEXT,
    "partnerIndustryId" TEXT,
    "partnerIndustryName" TEXT,
    "fundingAmount" DOUBLE PRECISION,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIAnalysis" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subCategory" TEXT NOT NULL,
    "priorityScore" INTEGER NOT NULL,
    "urgencyLevel" TEXT NOT NULL,
    "thematicTags" JSONB NOT NULL,
    "recommendedTech" JSONB NOT NULL,
    "nepRelevance" TEXT,
    "estimatedBudgetBand" TEXT,
    "socialImpactPotential" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchedHEI" (
    "id" TEXT NOT NULL,
    "aiAnalysisId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "matchScore" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "MatchedHEI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DuplicateMatch" (
    "id" TEXT NOT NULL,
    "aiAnalysisId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "similarity" INTEGER NOT NULL,
    "district" TEXT NOT NULL,

    CONSTRAINT "DuplicateMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "establishedYear" INTEGER NOT NULL,
    "specializationDomains" JSONB NOT NULL,
    "departments" JSONB NOT NULL,
    "incubationCenter" TEXT,
    "website" TEXT,
    "activeProjectsCount" INTEGER NOT NULL DEFAULT 0,
    "studentResearchersCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacultyMentor" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,

    CONSTRAINT "FacultyMentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndustryPartner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "focusDomains" JSONB NOT NULL,
    "headquarters" TEXT NOT NULL,
    "csrBudgetCommitted" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "availableMentors" INTEGER NOT NULL DEFAULT 0,
    "activeCollaborations" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "pilotTestSites" JSONB NOT NULL,
    "contactPerson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndustryPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolutionProposal" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "problemTitle" TEXT NOT NULL,
    "heiId" TEXT NOT NULL,
    "heiName" TEXT NOT NULL,
    "projectTitle" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "technologyMethodology" TEXT NOT NULL,
    "nepExperientialCredits" INTEGER NOT NULL DEFAULT 6,
    "ipPotential" TEXT NOT NULL DEFAULT 'PATENTABLE_TECHNOLOGY',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mentorName" TEXT,
    "mentorDepartment" TEXT,
    "mentorEmail" TEXT,
    "teamLeadName" TEXT,
    "teamLeadEmail" TEXT,
    "teamMembersCount" INTEGER NOT NULL DEFAULT 4,
    "teamDepartments" JSONB NOT NULL,
    "budgetHardware" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "budgetPrototyping" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "budgetFieldTesting" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "budgetTravel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "budgetContingency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "budgetTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "industryPartnerId" TEXT,
    "industryPartnerName" TEXT,

    CONSTRAINT "SolutionProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMilestone" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "durationWeeks" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "deliverable" TEXT NOT NULL,
    "verificationEvidence" TEXT,
    "completedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discussion" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "senderId" TEXT,
    "senderName" TEXT NOT NULL,
    "senderRole" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "avatarColor" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Discussion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAttachment" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'image',
    "filename" TEXT,
    "sizeBytes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'info',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "targetRole" TEXT NOT NULL DEFAULT 'All',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "actionUrl" TEXT,
    "recipientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "problemId" TEXT,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_trackingCode_key" ON "Problem"("trackingCode");

-- CreateIndex
CREATE INDEX "Problem_domain_idx" ON "Problem"("domain");

-- CreateIndex
CREATE INDEX "Problem_district_idx" ON "Problem"("district");

-- CreateIndex
CREATE INDEX "Problem_status_idx" ON "Problem"("status");

-- CreateIndex
CREATE INDEX "Problem_trackingCode_idx" ON "Problem"("trackingCode");

-- CreateIndex
CREATE INDEX "Problem_createdAt_idx" ON "Problem"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AIAnalysis_problemId_key" ON "AIAnalysis"("problemId");

-- CreateIndex
CREATE INDEX "MatchedHEI_aiAnalysisId_idx" ON "MatchedHEI"("aiAnalysisId");

-- CreateIndex
CREATE INDEX "DuplicateMatch_aiAnalysisId_idx" ON "DuplicateMatch"("aiAnalysisId");

-- CreateIndex
CREATE INDEX "University_district_idx" ON "University"("district");

-- CreateIndex
CREATE INDEX "FacultyMentor_universityId_idx" ON "FacultyMentor"("universityId");

-- CreateIndex
CREATE INDEX "IndustryPartner_type_idx" ON "IndustryPartner"("type");

-- CreateIndex
CREATE INDEX "SolutionProposal_problemId_idx" ON "SolutionProposal"("problemId");

-- CreateIndex
CREATE INDEX "SolutionProposal_heiId_idx" ON "SolutionProposal"("heiId");

-- CreateIndex
CREATE INDEX "SolutionProposal_status_idx" ON "SolutionProposal"("status");

-- CreateIndex
CREATE INDEX "ProjectMilestone_proposalId_idx" ON "ProjectMilestone"("proposalId");

-- CreateIndex
CREATE INDEX "Discussion_problemId_idx" ON "Discussion"("problemId");

-- CreateIndex
CREATE INDEX "Discussion_timestamp_idx" ON "Discussion"("timestamp");

-- CreateIndex
CREATE INDEX "MediaAttachment_problemId_idx" ON "MediaAttachment"("problemId");

-- CreateIndex
CREATE INDEX "Notification_recipientId_idx" ON "Notification"("recipientId");

-- CreateIndex
CREATE INDEX "Notification_targetRole_idx" ON "Notification"("targetRole");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_problemId_idx" ON "AuditLog"("problemId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_assignedHeiId_fkey" FOREIGN KEY ("assignedHeiId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_partnerIndustryId_fkey" FOREIGN KEY ("partnerIndustryId") REFERENCES "IndustryPartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIAnalysis" ADD CONSTRAINT "AIAnalysis_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchedHEI" ADD CONSTRAINT "MatchedHEI_aiAnalysisId_fkey" FOREIGN KEY ("aiAnalysisId") REFERENCES "AIAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DuplicateMatch" ADD CONSTRAINT "DuplicateMatch_aiAnalysisId_fkey" FOREIGN KEY ("aiAnalysisId") REFERENCES "AIAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacultyMentor" ADD CONSTRAINT "FacultyMentor_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionProposal" ADD CONSTRAINT "SolutionProposal_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionProposal" ADD CONSTRAINT "SolutionProposal_heiId_fkey" FOREIGN KEY ("heiId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionProposal" ADD CONSTRAINT "SolutionProposal_industryPartnerId_fkey" FOREIGN KEY ("industryPartnerId") REFERENCES "IndustryPartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMilestone" ADD CONSTRAINT "ProjectMilestone_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "SolutionProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAttachment" ADD CONSTRAINT "MediaAttachment_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
