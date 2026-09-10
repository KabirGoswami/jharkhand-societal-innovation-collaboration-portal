# Implementation Plan: Migrate to SQLite with Prisma

## Overview
The goal is to transition the Jharkhand Societal Innovation Portal from in-memory mock storage to a persistent SQLite database using Prisma. This involves fixing version mismatches, initializing the database, migrating mock services, handling complex data transformations, and seeding the database.

## 1. Version Alignment & DB Initialization
The current environment has a mismatch between `prisma` CLI and `@prisma/client`.

### Steps:
- **Align Versions**: Update `package.json` to use a stable version for both.
  - `@prisma/client`: `^5.22.0`
  - `prisma`: `^5.22.0`
- **Install Dependencies**: Run `npm install`.
- **Generate Client**: Run `npx prisma generate`.
- **Push Schema**: Run `npx prisma db push` to create the SQLite database file and apply the schema.

## 2. Core Infrastructure
Create a centralized Prisma client instance to avoid multiple connection pools.

### File: `server/lib/prisma.ts`
- Export a singleton instance of `PrismaClient`.

## 3. Service Migration Strategy
Migrate all services in `server/modules/` from in-memory arrays to Prisma calls.

### A. University Service (`universities.service.ts`)
- **`getAll`**: `prisma.university.findMany()`.
- **`getById`**: `prisma.university.findUnique({ where: { id } })`.
- **Data Transformation**:
  - `specializationDomains` $\rightarrow$ `JSON.stringify()` on write, `JSON.parse()` on read.
  - `departments` $\rightarrow$ `JSON.stringify()` on write, `JSON.parse()` on read.

### B. Industry Service (`industry.service.ts`)
- **`getAll`**: `prisma.industryPartner.findMany()`.
- **`getById`**: `prisma.industryPartner.findUnique({ where: { id } })`.
- **Data Transformation**:
  - `focusDomains` $\rightarrow$ `JSON.stringify()` on write, `JSON.parse()` on read.
  - `pilotTestSites` $\rightarrow$ `JSON.stringify()` on write, `JSON.parse()` on read.

### C. Problems Service (`problems.service.ts`)
- **`getAllProblems`**: 
  - Use `prisma.problem.findMany` with `where`.
  - For `query`, use `OR` with `contains` and `mode: 'insensitive'`.
- **`getProblemById`**: Use `prisma.problem.findFirst` to check both `id` and `trackingCode`.
- **`upvoteProblem`**: `prisma.problem.update({ where: { id }, data: { upvotesCount: { increment: 1 } } })`.
- **`createProblem`**:
  - **Coordinate Transformation**: Map `locationCoords` object to `locationLat`, `locationLng`, `locationAddress`.
  - **Submitter Transformation**: Map `submittedBy` object to `submitterName`, `submitterType`, `submitterContact`, `submitterEmail`.
  - **Nested Writes**:
    - `mediaAttachments`: Create multiple `MediaAttachment` records.
    - `aiAnalysis`: Create one `AIAnalysis` record.
  - **AI Analysis Arrays**: `thematicTags` and `recommendedTech` $\rightarrow$ `JSON.stringify()`.
- **`assignToHei`**: `prisma.problem.update`.
- **`updateStatus`**: `prisma.problem.update`.

### D. Other Services
- **AI Service**: Update analysis generation logic to save to `AIAnalysis` model.
- **Discussions Service**: Replace `INITIAL_DISCUSSIONS` record with `prisma.discussion.findMany` and `prisma.discussion.create`.
- **Proposals Service**: 
  - Use `prisma.solutionProposal.create` and `findMany`.
  - `teamDepartments` $\rightarrow$ `JSON.stringify()`.
- **Auth Service**: Use `prisma.user.create` and `prisma.user.findUnique`.

## 4. Data Seeding
Create a seed script to populate the DB with `jharkhandData.ts`.

### Steps:
- **Create `prisma/seed.ts`**:
  - Import `INITIAL_UNIVERSITIES`, `INITIAL_INDUSTRY_PARTNERS`, `INITIAL_PROBLEM_STATEMENTS`, `INITIAL_DISCUSSIONS`, `INITIAL_NOTIFICATIONS`.
  - Implement sequential insertion:
    1. Universities & Industry Partners.
    2. Users (create users for every submitter and mentor found in the data).
    3. Problems (with nested AIAnalysis and MediaAttachments).
    4. Discussions & Notifications.
- **Configure `package.json`**:
  - Add `"prisma": { "seed": "tsx prisma/seed.ts" }`.
- **Run Seed**: `npx prisma db seed`.

## 5. Detailed Data Transformation Mapping

| Mock Field | Prisma Field(s) | Transformation |
|---|---|---|
| `Problem.locationCoords` | `locationLat`, `locationLng`, `locationAddress` | Object $\rightarrow$ Individual columns |
| `Problem.submittedBy` | `submitterName`, `submitterType`, `submitterContact`, `submitterEmail` | Object $\rightarrow$ Individual columns |
| `Problem.mediaUrls` | `MediaAttachment` model | Array of strings $\rightarrow$ Multiple rows |
| `Problem.aiAnalysis` | `AIAnalysis` model | Object $\rightarrow$ Related table |
| `AIAnalysis.thematicTags` | `AIAnalysis.thematicTags` | `string[]` $\rightarrow$ `JSON.stringify()` |
| `AIAnalysis.recommendedTech` | `AIAnalysis.recommendedTech` | `string[]` $\rightarrow$ `JSON.stringify()` |
| `University.specializationDomains` | `University.specializationDomains` | `string[]` $\rightarrow$ `JSON.stringify()` |
| `University.departments` | `University.departments` | `string[]` $\rightarrow$ `JSON.stringify()` |
| `IndustryPartner.focusDomains` | `IndustryPartner.focusDomains` | `string[]` $\rightarrow$ `JSON.stringify()` |
| `IndustryPartner.pilotTestSites` | `IndustryPartner.pilotTestSites` | `string[]` $\rightarrow$ `JSON.stringify()` |
| `SolutionProposal.teamDepartments` | `SolutionProposal.teamDepartments` | `string[]` $\rightarrow$ `JSON.stringify()` |

## 6. Verification Plan
- **Persistence Check**: Restart server and verify that created problems/upvotes remain.
- **API Integrity**: Test all endpoints (GET /problems, POST /problems, etc.) to ensure the response structure remains compatible with the frontend.
- **Relation Check**: Verify that `AIAnalysis` and `MediaAttachments` are correctly linked to `Problem`.
