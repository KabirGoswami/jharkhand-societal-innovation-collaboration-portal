import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { AnalyticsSummary, University, ProblemStatement } from '../types';

interface LayoutContext {
  problems: ProblemStatement[];
  setProblems: React.Dispatch<React.SetStateAction<ProblemStatement[]>>;
  analytics: AnalyticsSummary;
  setAnalytics: React.Dispatch<React.SetStateAction<AnalyticsSummary>>;
  universities: University[];
  setUniversities: React.Dispatch<React.SetStateAction<University[]>>;
  industryPartners: any;
  setIndustryPartners: any;
  proposals: any;
  setProposals: any;
  selectedProblem: any;
  setSelectedProblem: any;
  trackingFilterCode: any;
  setTrackingFilterCode: any;
  handleUpvote: any;
  handleAssignHEI: any;
  handleSubmitProposal: any;
  handlePledgeFunding: any;
  handleUpdateMilestone: any;
  loadAllData: any;
  setIsSubmitModalOpen: any;
}

const AnalyticsPage: React.FC = () => {
  const { analytics, universities, problems } = useOutletContext<LayoutContext>();

  return (
    <AnalyticsDashboard
      analytics={analytics}
      universities={universities}
      problems={problems}
    />
  );
};

export default AnalyticsPage;
