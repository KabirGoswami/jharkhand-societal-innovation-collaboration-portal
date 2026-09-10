import { prisma } from '../../config/db';
import { SolutionProposal } from '../../../src/types';
import { problemsService } from '../problems/problems.service';

export class ProposalService {
  async createProposal(data: any) {
    const {
      facultyMentor,
      studentTeam,
      budgetBreakdown,
      ...rest
    } = data;

    const newProposal = await prisma.solutionProposal.create({
      data: {
        ...rest,
        mentorName: facultyMentor?.name,
        mentorDepartment: facultyMentor?.department,
        mentorEmail: facultyMentor?.email,
        teamLeadName: studentTeam?.leadName,
        teamLeadEmail: studentTeam?.leadEmail,
        teamMembersCount: studentTeam?.membersCount || 4,
        teamDepartments: JSON.stringify(studentTeam?.departments || []),
        budgetHardware: budgetBreakdown?.hardwareEquip || 0,
        budgetPrototyping: budgetBreakdown?.prototyping || 0,
        budgetFieldTesting: budgetBreakdown?.fieldTesting || 0,
        budgetTravel: budgetBreakdown?.travelAndLogistics || 0,
        budgetContingency: budgetBreakdown?.contingency || 0,
        budgetTotal: budgetBreakdown?.totalAmount || 0,
      },
    });

    // Update associated problem status via problemsService
    await problemsService.updateStatus(data.problemId, {
      status: 'proposal_submitted',
    });

    return this.mapProposal(newProposal);
  }

  async getProposalById(id: string) {
    const proposal = await prisma.solutionProposal.findUnique({
      where: { id },
    });
    return proposal ? this.mapProposal(proposal) : null;
  }

  async getProposalsByProblem(problemId: string) {
    const proposals = await prisma.solutionProposal.findMany({
      where: { problemId },
    });
    return proposals.map(p => this.mapProposal(p));
  }

  async updateMilestone(proposalId: string, milestoneId: string, updates: any) {
    const milestone = await prisma.projectMilestone.update({
      where: { id: milestoneId },
      data: updates,
    });

    const proposal = await prisma.solutionProposal.findUnique({
      where: { id: proposalId },
      include: { milestones: true },
    });
    return proposal ? this.mapProposal(proposal) : null;
  }

  async updateStatus(id: string, updates: { status?: string; industryPartnerId?: string; industryPartnerName?: string }) {
    const updated = await prisma.solutionProposal.update({
      where: { id },
      data: updates,
    });
    return this.mapProposal(updated);
  }

  async getAllProposals(filters: { problemId?: string; heiId?: string }) {
    const where: any = {};
    if (filters.problemId) where.problemId = filters.problemId;
    if (filters.heiId) where.heiId = filters.heiId;

    const proposals = await prisma.solutionProposal.findMany({
      where,
    });
    return proposals.map(p => this.mapProposal(p));
  }

  private mapProposal(p: any) {
    return {
      ...p,
      facultyMentor: {
        name: p.mentorName,
        department: p.mentorDepartment,
        email: p.mentorEmail,
      },
      studentTeam: {
        leadName: p.teamLeadName,
        leadEmail: p.teamLeadEmail,
        membersCount: p.teamMembersCount,
        departments: JSON.parse(p.teamDepartments || '[]'),
      },
      budgetBreakdown: {
        hardwareEquip: p.budgetHardware,
        prototyping: p.budgetPrototyping,
        fieldTesting: p.budgetFieldTesting,
        travelAndLogistics: p.budgetTravel,
        contingency: p.budgetContingency,
        totalAmount: p.budgetTotal,
      },
    };
  }
}

export const proposalService = new ProposalService();
