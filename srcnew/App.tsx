import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import AboutPage from './pages/About';
import ChallengesPage from './pages/challenges';
import AiTriagePage from './pages/AiTriage';
import CommunityPage from './pages/community';
import UniversitiesPage from './pages/universities';
import IndustryPage from './pages/industry';
import LifecyclePage from './pages/lifecycle';
import AnalyticsPage from './pages/analytics';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="challenges" element={<ChallengesPage />} />
          <Route path="ai-triage" element={<AiTriagePage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="universities" element={<UniversitiesPage />} />
          <Route path="industry" element={<IndustryPage />} />
          <Route path="lifecycle" element={<LifecyclePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
