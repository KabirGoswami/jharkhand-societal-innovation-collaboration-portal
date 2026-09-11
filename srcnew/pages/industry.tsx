import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { IndustryModule } from '../components/IndustryModule';

const IndustryPage = () => {
  const context = useOutletContext<any>();
  return (
    <IndustryModule
      industryPartners={context.industryPartners}
      proposals={context.proposals}
      problems={context.problems}
      onPledgeFunding={context.handlePledgeFunding}
      onSelectProblem={(p) => context.setSelectedProblem(p)}
    />
  );
};

export default IndustryPage;
