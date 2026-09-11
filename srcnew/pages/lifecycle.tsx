import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ProjectLifecycleView } from '../components/ProjectLifecycleView';

const LifecyclePage: React.FC = () => {
  const context = useOutletContext<any>();

  return (
    <ProjectLifecycleView
      proposals={context.proposals}
      problems={context.problems}
      onSelectProblem={(p) => context.setSelectedProblem(p)}
      onUpdateMilestone={context.handleUpdateMilestone}
    />
  );
};

export default LifecyclePage;
