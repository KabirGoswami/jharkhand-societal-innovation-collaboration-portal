import { prisma } from '../../config/db';
import { IndustryPartner } from '../../../src/types';
import { problemsService } from '../problems/problems.service';
import { proposalService } from '../proposals/proposals.service';

export class IndustryService {
  async getAllPartners() {
    const partners = await prisma.industryPartner.findMany();
    return partners.map(p => ({
      ...p,
      focusDomains: JSON.parse(p.focusDomains || '[]'),
      pilotTestSites: JSON.parse(p.pilotTestSites || '[]'),
    }));
  }

  async getPartnerById(id: string) {
    const partner = await prisma.industryPartner.findUnique({
      where: { id },
    });
    if (!partner) return null;
    return {
      ...partner,
      focusDomains: JSON.parse(partner.focusDomains || '[]'),
      pilotTestSites: JSON.parse(partner.pilotTestSites || '[]'),
    };
  }

  async createPartner(data: any) {
    const { focusDomains, pilotTestSites, ...rest } = data;
    const newPartner = await prisma.industryPartner.create({
      data: {
        ...rest,
        focusDomains: JSON.stringify(focusDomains || []),
        pilotTestSites: JSON.stringify(pilotTestSites || []),
      },
    });
    return {
      ...newPartner,
      focusDomains: JSON.parse(newPartner.focusDomains || '[]'),
      pilotTestSites: JSON.parse(newPartner.pilotTestSites || '[]'),
    };
  }

  async updatePartner(id: string, data: any) {
    const { focusDomains, pilotTestSites, ...rest } = data;
    const updateData: any = { ...rest };
    if (focusDomains) updateData.focusDomains = JSON.stringify(focusDomains);
    if (pilotTestSites) updateData.pilotTestSites = JSON.stringify(pilotTestSites);

    const updatedPartner = await prisma.industryPartner.update({
      where: { id },
      data: updateData,
    });
    return {
      ...updatedPartner,
      focusDomains: JSON.parse(updatedPartner.focusDomains || '[]'),
      pilotTestSites: JSON.parse(updatedPartner.pilotTestSites || '[]'),
    };
  }

  async deletePartner(id: string) {
    return await prisma.industryPartner.delete({
      where: { id },
    });
  }

  async pledgeFunding(data: {
    problemId?: string;
    proposalId: string;
    industryId?: string;
    partnerId?: string;
    pledgeAmount?: number;
    amount?: number;
    mentorshipOffer?: string;
    mentorName?: string;
    pilotSiteOffer?: string;
    pilotSite?: string;
  }) {
    const industryId = data.industryId || data.partnerId;
    const pledgeAmount = data.pledgeAmount || data.amount || 0;

    if (!industryId) throw new Error('Industry partner ID is required');

    const partner = await this.getPartnerById(industryId);
    if (!partner) throw new Error('Industry partner not found');

    // Update Problem if problemId is provided
    if (data.problemId) {
      await problemsService.updateStatus(data.problemId, {
        partnerIndustryId: partner.id,
        fundingAmount: pledgeAmount,
        status: 'industry_partnered',
      });
    }

    // Update Proposal
    await proposalService.updateStatus(data.proposalId, {
      industryPartnerId: partner.id,
      industryPartnerName: partner.name,
      status: 'industry_partnered',
    });

    return { success: true, message: 'Funding pledge recorded' };
  }
}

export const industryService = new IndustryService();
