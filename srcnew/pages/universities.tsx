import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { UniversityModule } from '../components/UniversityModule';
import { ProblemStatement, University, SolutionProposal } from '../types';

interface LayoutContext {
  problems: ProblemStatement[];
  setProblems: React.Dispatch<React.SetStateAction<ProblemStatement[]>>;
  analytics: any;
  setAnalytics: any;
  universities: University[];
  setUniversities: React.Dispatch<React.SetStateAction<University[]>>;
  industryPartners: any;
  setIndustryPartners: any;
  proposals: SolutionProposal[];
  setProposals: any;
  selectedProblem: any;
  setSelectedProblem: (problem: ProblemStatement | null) => void;
  trackingFilterCode: any;
  setTrackingFilterCode: any;
  handleUpvote: any;
  handleAssignHEI: any;
  handleSubmitProposal: (newProposal: any) => Promise<void>;
  handlePledgeFunding: any;
  handleUpdateMilestone: (proposalId: string, milestoneId: string, status: string) => Promise<void>;
  loadAllData: any;
  setIsSubmitModalOpen: any;
}

const UniversitiesPage: React.FC = () => {
  const {
    universities,
    problems,
    proposals,
    setSelectedProblem,
    handleSubmitProposal,
    handleUpdateMilestone
  } = useOutletContext<LayoutContext>();

  return (
    <UniversityModule
      universities={universities}
      problems={problems}
      proposals={proposals}
      onSelectProblem={setSelectedProblem}
      onSubmitProposal={handleSubmitProposal}
      onUpdateMilestone={handleUpdateMilestone}
    />
  );
};

export default UniversitiesPage;
