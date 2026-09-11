/*
  Warnings:

  - You are about to drop the column `partnerIndustryId` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `partnerIndustryName` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `industryPartnerId` on the `SolutionProposal` table. All the data in the column will be lost.
  - You are about to drop the column `industryPartnerName` on the `SolutionProposal` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `organization` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `FacultyMentor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IndustryPartner` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CITIZEN', 'STUDENT', 'FACULTY', 'INDUSTRY_REP', 'UNIVERSITY_ADMIN', 'GOVERNMENT_ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OrgType" AS ENUM ('STARTUP', 'MSME', 'CSR', 'RESEARCH_LAB', 'CORPORATE');

-- DropForeignKey
ALTER TABLE "FacultyMentor" DROP CONSTRAINT "FacultyMentor_universityId_fkey";

-- DropForeignKey
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_partnerIndustryId_fkey";

-- DropForeignKey
ALTER TABLE "SolutionProposal" DROP CONSTRAINT "SolutionProposal_industryPartnerId_fkey";

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "partnerIndustryId",
DROP COLUMN "partnerIndustryName",
ADD COLUMN     "partnerOrgId" TEXT,
ADD COLUMN     "partnerOrgName" TEXT;

-- AlterTable
ALTER TABLE "SolutionProposal" DROP COLUMN "industryPartnerId",
DROP COLUMN "industryPartnerName",
ADD COLUMN     "partnerOrgId" TEXT,
ADD COLUMN     "partnerOrgName" TEXT;

-- AlterTable
ALTER TABLE "University" ADD COLUMN     "domains" TEXT[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "organization",
DROP COLUMN "passwordHash",
ADD COLUMN     "district" TEXT,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'NOT_REQUIRED',
ALTER COLUMN "email" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;

-- DropTable
DROP TABLE "FacultyMentor";

-- DropTable
DROP TABLE "IndustryPartner";

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "OrgType" NOT NULL,
    "registrationNumber" TEXT,
    "website" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "focusDomains" JSONB,
    "headquarters" TEXT,
    "csrBudgetCommitted" DOUBLE PRECISION DEFAULT 0,
    "availableMentors" INTEGER DEFAULT 0,
    "activeCollaborations" INTEGER DEFAULT 0,
    "description" TEXT,
    "pilotTestSites" JSONB,
    "contactPerson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "userId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "studentIdNumber" TEXT,
    "department" TEXT,
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "FacultyProfile" (
    "userId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "employeeId" TEXT,
    "designation" TEXT,
    "department" TEXT,
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "FacultyProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "IndustryProfile" (
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "designation" TEXT,
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "IndustryProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "VerificationRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "documentUrls" TEXT[],
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewerNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Organization_type_idx" ON "Organization"("type");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_partnerOrgId_fkey" FOREIGN KEY ("partnerOrgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacultyProfile" ADD CONSTRAINT "FacultyProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacultyProfile" ADD CONSTRAINT "FacultyProfile_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndustryProfile" ADD CONSTRAINT "IndustryProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndustryProfile" ADD CONSTRAINT "IndustryProfile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionProposal" ADD CONSTRAINT "SolutionProposal_partnerOrgId_fkey" FOREIGN KEY ("partnerOrgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
