# Implementation Plan: Phase 1 - Multi-Role Authentication System

## Overview
This plan details the migration of the current user and organization models to a more robust, role-based architecture with verification workflows.

## 1. Database Schema Changes (`prisma/schema.prisma`)

### Enum Definitions
- `Role`: `{ CITIZEN, STUDENT, FACULTY, INDUSTRY_REP, UNIVERSITY_ADMIN, GOVERNMENT_ADMIN, SUPER_ADMIN }`
- `VerificationStatus`: `{ NOT_REQUIRED, PENDING, VERIFIED, REJECTED }`
- `OrgType`: `{ STARTUP, MSME, CSR, RESEARCH_LAB, CORPORATE }`

### Model Modifications

#### `User` Model
- Rename `name` -> `fullName`.
- Change `role` from `String` to `Role` enum.
- Add `verificationStatus` (`VerificationStatus`) default `NOT_REQUIRED`.
- Remove `passwordHash`.
- Add relations:
    - `studentProfile StudentProfile?`
    - `facultyProfile FacultyProfile?`
    - `industryProfile IndustryProfile?`
    - `verificationRequests VerificationRequest[]`

#### `University` Model
- Add `domains String[]` (PostgreSQL scalar list).
- Add relations:
    - `students StudentProfile[]`
    - `faculty FacultyProfile[]`

#### `Organization` Model (Renamed from `IndustryPartner`)
- Rename `IndustryPartner` -> `Organization`.
- Fields:
    - `name String`
    - `type OrgType`
    - `registrationNumber String`
    - `website String?`
    - `isVerified Boolean @default(false)`
- Relations:
    - `industryProfiles IndustryProfile[]`
    - `problems Problem[]`
    - `proposals SolutionProposal[]`

#### `Problem` Model
- Rename `partnerIndustryId` -> `organizationId`.
- Update relation `partnerIndustry` -> `organization Organization?`.

#### `SolutionProposal` Model
- Rename `industryPartnerId` -> `organizationId`.
- Update relation `industryPartner` -> `organization Organization?`.

### New Models

#### `StudentProfile`
- `id String @id @default(uuid())`
- `userId String @unique` -> `User`
- `universityId String` -> `University`
- `studentIdNumber String`
- `department String`
- `verifiedById String?` -> `User`
- `verifiedAt DateTime?`

#### `FacultyProfile`
- `id String @id @default(uuid())`
- `userId String @unique` -> `User`
- `universityId String` -> `University`
- `employeeId String`
- `designation String`
- `department String`
- `verifiedById String?` -> `User`
- `verifiedAt DateTime?`

#### `IndustryProfile`
- `id String @id @default(uuid())`
- `userId String @unique` -> `User`
- `organizationId String` -> `Organization`
- `designation String`
- `verifiedById String?` -> `User`
- `verifiedAt DateTime?`

#### `VerificationRequest`
- `id String @id @default(uuid())`
- `userId String` -> `User`
- `role Role`
- `documentUrls String[]`
- `status VerificationStatus @default(PENDING)`
- `reviewerNotes String?`
- `reviewedById String?` -> `User`
- `reviewedAt DateTime?`

## 3. Migration Strategy

### Fresh Migration (Recommended)
Since this is a fundamental change to the identity and organization models (including renaming tables and removing primary authentication fields), a **fresh migration** is recommended for the development/staging environment.

**Command:**
```bash
npx prisma migrate dev --name phase1_multi_role_auth
```

### Data Preservation Strategy (If required for production)
If data must be preserved:
1. Create a migration that adds the new fields/tables without removing the old ones.
2. Run a data transformation script to:
    - Map `User.name` -> `User.fullName`.
    - Map `User.role` -> `Role` enum.
    - Map `IndustryPartner` -> `Organization`.
    - Create `StudentProfile`/`FacultyProfile`/`IndustryProfile` based on existing roles and university/industry associations.
3. Perform a second migration to remove the old fields (`passwordHash`, `name`, `IndustryPartner` table).

## 4. Seed Script (`prisma/seed.ts`)

The seed script will initialize the system with a `SUPER_ADMIN` and basic `University` records for testing.

```typescript
import { PrismaClient, Role, VerificationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // 1. Create SUPER_ADMIN
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@jsic.gov.in',
      fullName: 'System Administrator',
      role: Role.SUPER_ADMIN,
      verificationStatus: VerificationStatus.NOT_REQUIRED,
      isActive: true,
    },
  });

  // 2. Create Test Universities
  const universities = [
    {
      name: 'Ranchi University',
      shortName: 'RU',
      district: 'Ranchi',
      type: 'State University',
      establishedYear: 1960,
      specializationDomains: ['Agriculture', 'Social Sciences'],
      departments: ['Sociology', 'Environmental Science'],
      domains: ['ranchiuniversity.ac.in'],
    },
    {
      name: 'NIT Jamshedpur',
      shortName: 'NITJ',
      district: 'East Singhbhum',
      type: 'National Institute',
      establishedYear: 1960,
      specializationDomains: ['Engineering', 'Technology'],
      departments: ['Mechanical', 'Electrical'],
      domains: ['nitjsr.ac.in'],
    },
  ];

  for (const uni of universities) {
    await prisma.university.create({
      data: uni,
    });
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## 5. Potential Challenges & Mitigation

- **Auth Breakdown**: Removing `passwordHash` will break `AuthService.login` and `AuthService.register`. 
    - *Mitigation*: This plan assumes the authentication logic will be updated in Phase 2 (e.g., moving to an external IdP or adding a separate `Credentials` table). For Phase 1, the `AuthService` will need temporary mocks or updates to prevent system crash.
- **Relational Integrity**: Renaming `IndustryPartner` to `Organization` affects `Problem` and `SolutionProposal`.
    - *Mitigation*: Ensure all references in the codebase (services, controllers) are updated to use `Organization` immediately after the migration.
- **Enum Constraints**: Changing `role` from `String` to `Enum` might fail if existing data contains roles not defined in the `Role` enum.
    - *Mitigation*: Data cleanup script should be run prior to migration if using the data preservation strategy.

## 6. Implementation Sequence
1. Update `prisma/schema.prisma` with the new design.
2. Run `npx prisma migrate dev --name phase1_multi_role_auth`.
3. Update `prisma/seed.ts` and run `npx prisma db seed`.
4. Update `User` references in `server/modules/auth/auth.service.ts` and `server/middleware/auth.ts` (e.g., `name` -> `fullName`).
5. Update all references of `IndustryPartner` to `Organization` across the codebase.

## 2. Modified schema.prisma Content

(See final response for full schema content to avoid shell escaping issues during planning phase)
