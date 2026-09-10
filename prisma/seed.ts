import { PrismaClient } from '@prisma/client';
import {
  INITIAL_UNIVERSITIES,
  INITIAL_INDUSTRY_PARTNERS,
  INITIAL_PROBLEM_STATEMENTS,
  INITIAL_SOLUTION_PROPOSALS,
  INITIAL_DISCUSSIONS
} from '../src/data/jharkhandData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding process...');

  // 1. Universities
  console.log('🎓 Seeding Universities...');
  for (const uni of INITIAL_UNIVERSITIES) {
    await prisma.university.upsert({
      where: { id: uni.id },
      update: {},
      create: {
        id: uni.id,
        name: uni.name,
        shortName: uni.shortName,
        district: uni.district,
        type: uni.type,
        establishedYear: uni.establishedYear,
        specializationDomains: JSON.stringify(uni.specializationDomains),
        departments: JSON.stringify(uni.departments),
        incubationCenter: uni.incubationCenter,
        website: uni.website,
        activeProjectsCount: uni.activeProjectsCount,
        studentResearchersCount: uni.studentResearchersCount,
        rating: uni.rating,
        logoUrl: uni.logoUrl,
        facultyMentors: {
          create: uni.facultyMentors.map(fm => ({
            id: fm.id,
            name: fm.name,
            designation: fm.designation,
            department: fm.department,
            email: fm.email,
            specialization: fm.specialization,
          })),
        },
      },
    });
  }

  // 2. Industry Partners
  console.log('🏭 Seeding Industry Partners...');
  for (const ind of INITIAL_INDUSTRY_PARTNERS) {
    await prisma.industryPartner.upsert({
      where: { id: ind.id },
      update: {},
      create: {
        id: ind.id,
        name: ind.name,
        type: ind.type,
        focusDomains: JSON.stringify(ind.focusDomains),
        headquarters: ind.headquarters,
        csrBudgetCommitted: ind.csrBudgetCommitted,
        availableMentors: ind.availableMentors,
        activeCollaborations: ind.activeCollaborations,
        description: ind.description,
        pilotTestSites: JSON.stringify(ind.pilotTestSites),
        contactPerson: ind.contactPerson,
      },
    });
  }

  // 3. Problems
  console.log('📝 Seeding Problems...');
  for (const prob of INITIAL_PROBLEM_STATEMENTS) {
    await prisma.problem.upsert({
      where: { id: prob.id },
      update: {},
      create: {
        id: prob.id,
        trackingCode: prob.trackingCode,
        title: prob.title,
        description: prob.description,
        domain: prob.domain,
        district: prob.district,
        blockOrPanchayat: prob.blockOrPanchayat,
        locationLat: prob.locationCoords?.lat,
        locationLng: prob.locationCoords?.lng,
        locationAddress: prob.locationCoords?.address,
        urgency: prob.urgency,
        affectedPopulation: prob.affectedPopulation,
        status: prob.status,
        socialImpactMetric: prob.socialImpactMetric,
        viewsCount: prob.viewsCount,
        upvotesCount: prob.upvotesCount,
        createdAt: new Date(prob.createdAt),
        updatedAt: new Date(prob.updatedAt),
        submitterName: prob.submittedBy?.name,
        submitterType: prob.submittedBy?.type,
        submitterContact: prob.submittedBy?.contact,
        submitterEmail: prob.submittedBy?.email,
        submitterOrg: prob.submittedBy?.organization,
        assignedHeiId: prob.assignedHeiId,
        assignedHeiName: prob.assignedHeiName,
        assignedDepartment: prob.assignedDepartment,
        partnerIndustryId: prob.partnerIndustryId,
        partnerIndustryName: prob.partnerIndustryName,
        fundingAmount: prob.fundingAmount,
        aiAnalysis: {
          create: {
            category: prob.aiAnalysis?.category,
            subCategory: prob.aiAnalysis?.subCategory,
            priorityScore: prob.aiAnalysis?.priorityScore,
            urgencyLevel: prob.aiAnalysis?.urgencyLevel,
            thematicTags: JSON.stringify(prob.aiAnalysis?.thematicTags),
            recommendedTech: JSON.stringify(prob.aiAnalysis?.recommendedTech),
            nepRelevance: prob.aiAnalysis?.nepRelevance,
            estimatedBudgetBand: prob.aiAnalysis?.estimatedBudgetBand,
            socialImpactPotential: prob.aiAnalysis?.socialImpactPotential,
            matchedHeis: {
              create: prob.aiAnalysis?.matchedHeis.map(mh => ({
                universityId: mh.universityId,
                universityName: mh.universityName,
                department: mh.department,
                matchScore: mh.matchScore,
                reason: mh.reason,
              })),
            },
            duplicateMatches: {
              create: prob.aiAnalysis?.duplicateMatches.map(dm => ({
                problemId: dm.problemId,
                title: dm.title,
                similarity: dm.similarity,
                district: dm.district,
              })),
            },
          },
        },
        mediaAttachments: {
          create: prob.mediaUrls.map(url => ({
            url,
            type: 'image',
          })),
        },
      },
    });
  }

  // 4. Solution Proposals
  console.log('💡 Seeding Solution Proposals...');
  for (const prop of INITIAL_SOLUTION_PROPOSALS) {
    await prisma.solutionProposal.upsert({
      where: { id: prop.id },
      update: {},
      create: {
        id: prop.id,
        problemId: prop.problemId,
        problemTitle: prop.problemTitle,
        heiId: prop.heiId,
        heiName: prop.heiName,
        projectTitle: prop.projectTitle,
        abstract: prop.abstract,
        technologyMethodology: prop.technologyMethodology,
        nepExperientialCredits: prop.nepExperientialCredits,
        ipPotential: prop.ipPotential,
        status: prop.status,
        mentorName: prop.facultyMentor?.name,
        mentorDepartment: prop.facultyMentor?.department,
        mentorEmail: prop.facultyMentor?.email,
        teamLeadName: prop.studentTeam?.leadName,
        teamLeadEmail: prop.studentTeam?.leadEmail,
        teamMembersCount: prop.studentTeam?.membersCount,
        teamDepartments: JSON.stringify(prop.studentTeam?.departments),
        budgetHardware: prop.budgetBreakdown?.hardwareEquip,
        budgetPrototyping: prop.budgetBreakdown?.prototyping,
        budgetFieldTesting: prop.budgetBreakdown?.fieldTesting,
        budgetTravel: prop.budgetBreakdown?.travelAndLogistics,
        budgetContingency: prop.budgetBreakdown?.contingency,
        budgetTotal: prop.budgetBreakdown?.totalAmount,
        industryPartnerId: prop.industryPartnerId,
        industryPartnerName: prop.industryPartnerName,
        milestones: {
          create: prop.milestones.map(m => ({
            id: m.id,
            title: m.title,
            stage: m.stage,
            durationWeeks: m.durationWeeks,
            status: m.status,
            deliverable: m.deliverable,
            verificationEvidence: m.verificationEvidence,
            completedDate: m.completedDate ? new Date(m.completedDate) : null,
          })),
        },
      },
    });
  }

  // 5. Discussions
  console.log('💬 Seeding Discussions...');
  for (const problemId in INITIAL_DISCUSSIONS) {
    for (const msg of INITIAL_DISCUSSIONS[problemId]) {
      await prisma.discussion.upsert({
        where: { id: msg.id },
        update: {},
        create: {
          id: msg.id,
          problemId: problemId,
          senderName: msg.senderName,
          senderRole: msg.senderRole,
          message: msg.message,
          timestamp: new Date(msg.timestamp),
        },
      });
    }
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
