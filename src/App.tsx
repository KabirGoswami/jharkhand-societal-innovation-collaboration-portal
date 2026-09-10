import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CitizenModule } from './components/CitizenModule';
import { CitizenSubmissionModal } from './components/CitizenSubmissionModal';
import { AIProblemManagement } from './components/AIProblemManagement';
import { UniversityModule } from './components/UniversityModule';
import { IndustryModule } from './components/IndustryModule';
import { ProjectLifecycleView } from './components/ProjectLifecycleView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ProblemDetailsModal } from './components/ProblemDetailsModal';
import { NotificationPanel } from './components/NotificationPanel';
import { CommunicationHub } from './components/CommunicationHub';
import {
  ProblemStatement,
  AnalyticsSummary,
  University,
  IndustryPartner,
  SolutionProposal,
  SystemNotification
} from './types';
import { Loader2, Sparkles, Building2, Briefcase, GraduationCap, Compass } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'challenges' | 'ai-triage' | 'university' | 'industry' | 'lifecycle' | 'analytics'
  >('challenges');
  const [userRole, setUserRole] = useState<'citizen' | 'university' | 'industry' | 'admin'>('citizen');

  // Core Datasets
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>({} as AnalyticsSummary);
  const [universities, setUniversities] = useState<University[]>([]);
  const [industryPartners, setIndustryPartners] = useState<IndustryPartner[]>([]);
  const [proposals, setProposals] = useState<SolutionProposal[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  // Modals & Selection
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<ProblemStatement | null>(null);
  const [trackingFilterCode, setTrackingFilterCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Fetching from server APIs
  const loadAllData = async () => {
    try {
      const [probRes, anaRes, uniRes, indRes, propRes, notifRes] = await Promise.all([
        fetch('/api/problems'),
        fetch('/api/analytics'),
        fetch('/api/universities'),
        fetch('/api/industry/partners'),
        fetch('/api/proposals'),
        fetch('/api/notifications'),
      ]);

      if (probRes.ok) {
        const probData = await probRes.json();
        const problemsData = probData.data || probData;
        const normalizedProblems = problemsData.map((p: any) => ({
          ...p,
          mediaUrls: p.mediaAttachments && p.mediaAttachments.length > 0
            ? p.mediaAttachments.map((a: any) => a.url)
            : p.mediaUrls || [],
        }));
        setProblems(normalizedProblems);
      }
      if (anaRes.ok) {
        const anaData = await anaRes.json();
        setAnalytics(anaData.data || anaData);
      }
      if (uniRes.ok) {
        const uniData = await uniRes.json();
        setUniversities(uniData.data || uniData);
      }
      if (indRes.ok) {
        const indData = await indRes.json();
        setIndustryPartners(indData.data || indData);
      }
      if (propRes.ok) {
        const propData = await propRes.json();
        setProposals(propData.data || propData);
      }
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData.data || notifData);
      }
    } catch (err) {
      console.warn('API fetch warning, using seeded data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers
  const handleUpvote = async (problemId: string) => {
    try {
      const res = await fetch(`/api/problems/${problemId}/upvote`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setProblems((prev) =>
          prev.map((p) => (p.id === problemId ? { ...p, upvotesCount: data.upvotesCount } : p))
        );
        if (selectedProblem?.id === problemId) {
          setSelectedProblem((prev) => (prev ? { ...prev, upvotesCount: data.upvotesCount } : null));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignHEI = async (problemId: string, heiId: string, department: string) => {
    try {
      const res = await fetch(`/api/problems/${problemId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heiId, department }),
      });
      if (res.ok) {
        const updated = await res.json();
        const normalizedUpdated = {
          ...updated,
          mediaUrls: updated.mediaAttachments && updated.mediaAttachments.length > 0 
            ? updated.mediaAttachments.map((a: any) => a.url) 
            : updated.mediaUrls || [],
        };
        setProblems((prev) => prev.map((p) => (p.id === problemId ? normalizedUpdated : p)));
        // Refresh analytics
        const anaRes = await fetch('/api/analytics');
        if (anaRes.ok) setAnalytics(await anaRes.json());
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleSubmitProposal = async (newProposalData: any) => {
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProposalData),
      });
      if (res.ok) {
        const saved = await res.json();
        setProposals((prev) => [saved, ...prev]);
        // Also update the local problems array status
        setProblems((prev) =>
          prev.map((p) => (p.id === newProposalData.problemId ? { ...p, status: 'proposal_submitted' } : p))
        );
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handlePledgeFunding = async (
    proposalId: string,
    partnerId: string,
    amount: number,
    mentorName?: string,
    pilotSite?: string
  ) => {
    try {
      const res = await fetch('/api/industry/pledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId, partnerId, amount, mentorName, pilotSite }),
      });
      if (res.ok) {
        const updatedProposal = await res.json();
        setProposals((prev) => prev.map((p) => (p.id === proposalId ? updatedProposal : p)));
        // Update industry partners state to reflect new pledge amount
        const indRes = await fetch('/api/industry/partners');
        if (indRes.ok) setIndustryPartners(await indRes.json());
        const anaRes = await fetch('/api/analytics');
        if (anaRes.ok) setAnalytics(await anaRes.json());
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleUpdateMilestone = async (proposalId: string, milestoneId: string, status: string) => {
    try {
      const res = await fetch(`/api/proposals/${proposalId}/milestone`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestoneId,
          status,
          completedDate: status === 'completed' ? new Date().toISOString() : undefined,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProposals((prev) => prev.map((p) => (p.id === proposalId ? updated : p)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleSearchTrackingCode = (code: string) => {
    const found = problems.find((p) => p.trackingCode.toLowerCase() === code.toLowerCase());
    if (found) {
      setSelectedProblem(found);
    } else {
      setTrackingFilterCode(code);
      setActiveTab('challenges');
    }
  };

  // Find linked proposal if modal is opened
  const activeProposalForModal = selectedProblem
    ? proposals.find((p) => p.problemId === selectedProblem.id)
    : undefined;

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#BC5434]/20 selection:text-[#1A1A1A]">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onSearchTrackingCode={handleSearchTrackingCode}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      <NotificationPanel 
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationRead}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onOpenCommunicationHub={() => {
          setIsNotificationOpen(false);
          setActiveTab('communication');
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28 text-stone-600">
            <Loader2 className="w-8 h-8 animate-spin text-[#BC5434] mb-3" />
            <p className="text-base font-editorial-serif italic font-bold text-stone-900">Connecting to Jharkhand State Registry...</p>
            <p className="text-xs uppercase tracking-widest text-stone-500 mt-1">Syncing HEI incubation nodes & field challenges</p>
          </div>
        ) : (
          <div>
            {activeTab === 'challenges' && (
              <CitizenModule
                problems={problems}
                onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
                onSelectProblem={(p) => setSelectedProblem(p)}
                onUpvote={handleUpvote}
                trackingFilterCode={trackingFilterCode}
                onClearTrackingFilter={() => setTrackingFilterCode('')}
              />
            )}

            {activeTab === 'ai-triage' && (
              <AIProblemManagement
                problems={problems}
                universities={universities}
                onAssignHEI={handleAssignHEI}
                onSelectProblem={(p) => setSelectedProblem(p)}
                onRefreshProblems={loadAllData}
              />
            )}

            {activeTab === 'university' && (
              <UniversityModule
                universities={universities}
                problems={problems}
                proposals={proposals}
                onSelectProblem={(p) => setSelectedProblem(p)}
                onSubmitProposal={handleSubmitProposal}
                onUpdateMilestone={handleUpdateMilestone}
              />
            )}

            {activeTab === 'industry' && (
              <IndustryModule
                industryPartners={industryPartners}
                proposals={proposals}
                problems={problems}
                onPledgeFunding={handlePledgeFunding}
                onSelectProblem={(p) => setSelectedProblem(p)}
              />
            )}

            {activeTab === 'lifecycle' && (
              <ProjectLifecycleView
                proposals={proposals}
                problems={problems}
                onSelectProblem={(p) => setSelectedProblem(p)}
                onUpdateMilestone={handleUpdateMilestone}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsDashboard
                analytics={analytics}
                universities={universities}
                problems={problems}
                onSelectDistrictFilter={(district) => {
                  setActiveTab('challenges');
                }}
              />
            )}

            {activeTab === 'communication' && (
              <CommunicationHub
                notifications={notifications}
                problems={problems}
                userRole={userRole}
                onViewProblemDetails={(problem) => {
                  setSelectedProblem(problem);
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* Citizen Submission Modal */}
      <CitizenSubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSuccess={(newProblem) => {
          const normalizedProblem = {
            ...newProblem,
            mediaUrls: newProblem.mediaAttachments && newProblem.mediaAttachments.length > 0 
              ? newProblem.mediaAttachments.map((a: any) => a.url) 
              : newProblem.mediaUrls || [],
          };
          setProblems((prev) => [normalizedProblem, ...prev]);
          // Refresh analytics
          fetch('/api/analytics')
            .then((r) => r.json())
            .then((d) => setAnalytics(d))
            .catch(() => {});
        }}
      />

      {/* Problem Details & Collaboration Modal */}
      <ProblemDetailsModal
        problem={selectedProblem}
        proposal={activeProposalForModal}
        onClose={() => setSelectedProblem(null)}
        onUpvote={handleUpvote}
        currentUserRole={userRole}
      />

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-stone-400 border-t border-stone-800 text-xs py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-800 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2.5 text-stone-100 font-bold text-base">
                <span className="font-editorial-serif italic text-xl text-white">Samadhan.JH</span>
                <span className="text-[10px] uppercase font-bold tracking-[2px] text-[#BC5434] border-l border-stone-700 pl-2">
                  Societal Innovation Portal
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-1 font-serif italic max-w-xl">
                National Education Policy (NEP) 2020: Experiential Learning, Multidisciplinary Field Research & Grassroots Incubation
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-wider">
              <span className="text-[#E07A5F]">24 Districts</span>
              <span className="text-stone-700">•</span>
              <span className="text-stone-300">6 Premier Jharkhand HEIs</span>
              <span className="text-stone-700">•</span>
              <span className="text-stone-300">CSR MCA Section 135 Compliant</span>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
            <div>
              &copy; {new Date().getFullYear()} Department of Higher & Technical Education, Government of Jharkhand.
            </div>
            <div className="text-stone-400 font-serif italic">
              Academic Nodes: BIT Mesra • IIT (ISM) Dhanbad • Birsa Agricultural University • NIT Jamshedpur • AIIMS Deoghar • Central University of Jharkhand
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
