import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { CommunicationHub } from '../components/CommunicationHub';

const CommunityPage = () => {
  const context = useOutletContext<any>();

  return (
    <CommunicationHub
      problems={context.problems}
      currentUserRole={context.userRole || 'citizen'}
    />
  );
};

export default CommunityPage;
