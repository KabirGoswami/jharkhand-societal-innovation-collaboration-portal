import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import HomePage from './pages/HomePage';
import ChallengesPage from './pages/ChallengesPage';
import SubmitChallengePage from './pages/SubmitChallengePage';
import AITriagePage from './pages/AITriagePage';
import UniversityPage from './pages/UniversityPage';
import IndustryPage from './pages/IndustryPage';
import LifecyclePage from './pages/LifecyclePage';
import AnalyticsPage from './pages/AnalyticsPage';
import CommunicationPage from './pages/CommunicationPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/submit-challenge" element={<SubmitChallengePage />} />
        <Route path="/ai-triage" element={<AITriagePage />} />
        <Route path="/university" element={<UniversityPage />} />
        <Route path="/industry" element={<IndustryPage />} />
        <Route path="/lifecycle" element={<LifecyclePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/communication" element={<CommunicationPage />} />
      </Route>
    </Routes>
  );
}
