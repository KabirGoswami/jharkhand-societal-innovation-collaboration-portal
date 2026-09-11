import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Starting debug proposal creation...');
  try {
    const proposal = await prisma.solutionProposal.create({
      data: {
        problemId: 'prob-2026-005', // Using one from initial data
        problemTitle: 'Test Problem',
        heiId: 'hei-bit-mesra',
        heiName: 'BIT Mesra',
        projectTitle: 'Test Project',
        abstract: 'Test Abstract',
        technologyMethodology: 'Test Tech',
        nepExperientialCredits: 6,
        ipPotential: 'PATENTABLE_TECHNOLOGY',
        status: 'open_for_csr',
        mentorName: 'Dr. Test',
        mentorDepartment: 'Test Dept',
        mentorEmail: 'test@univ.ac.in',
        teamLeadName: 'Student Test',
        teamLeadEmail: 'student@univ.ac.in',
        teamMembersCount: 4,
        teamDepartments: ['CS', 'EE'],
        budgetHardware: 1000,
        budgetPrototyping: 1000,
        budgetFieldTesting: 1000,
        budgetTravel: 1000,
        budgetContingency: 1000,
        budgetTotal: 5000,
      },
    });
    console.log('Success! Proposal created with ID:', proposal.id);
  } catch (e) {
    console.error('FAILED:');
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
