import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { AIProblemManagement } from '../components/AIProblemManagement';

const AiTriagePage = () => {
  const context = useOutletContext<any>();
  return (
    <AIProblemManagement
      problems={context.problems}
      universities={context.universities}
      onAssignHEI={context.handleAssignHEI}
      onSelectProblem={(p) => context.setSelectedProblem(p)}
      onRefreshProblems={context.loadAllData}
    />
  );
};

export default AiTriagePage;
