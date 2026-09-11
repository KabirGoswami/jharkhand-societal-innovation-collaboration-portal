import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { CitizenModule } from '../components/CitizenModule';

const ChallengesPage = () => {
  const context = useOutletContext<any>();
  return (
    <CitizenModule
      problems={context.problems}
      onOpenSubmitModal={() => context.setIsSubmitModalOpen(true)}
      onSelectProblem={(p) => context.setSelectedProblem(p)}
      onUpvote={context.handleUpvote}
      trackingFilterCode={context.trackingFilterCode}
      onClearTrackingFilter={() => context.setTrackingFilterCode('')}
    />
  );
};

export default ChallengesPage;
