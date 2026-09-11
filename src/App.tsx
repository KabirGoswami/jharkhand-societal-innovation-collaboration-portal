import React, { useState, useEffect } from 'react';
import { CitizenModule } from './components/CitizenModule';
import { CitizenSubmissionView } from './components/CitizenSubmissionView';
import { AIProblemManagement } from './components/AIProblemManagement';
import { UniversityModule } from './components/UniversityModule';
import { IndustryModule } from './components/IndustryModule';
import { ProjectLifecycleView } from './components/ProjectLifecycleView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ProblemDetailsModal } from './components/ProblemDetailsModal';
import { NotificationPanel } from './components/NotificationPanel';
import { CommunicationHub } from './components/CommunicationHub';
import { JharkhandMap } from './components/JharkhandMap';
import {
  ProblemStatement,
  AnalyticsSummary,
  University,
  IndustryPartner,
  SolutionProposal,
  SystemNotification
} from './types';
import { Loader2, Sparkles, Building2, Briefcase, GraduationCap, Compass, Users, Layers, BarChart3, Plus, ArrowLeft, Bell, MessageCircle } from 'lucide-react';

interface HomeCard {
  title: string;
  description: string;
  tab: string;
  tag: string;
  stat: string;
  icon: React.ElementType;
}

const HOME_CARDS: HomeCard[] = [
  {
    title: 'Challenge Registry',
    description: 'Explore real-world societal problems submitted by citizens and panchayats across Jharkhand.',
    tab: 'challenges',
    tag: ' Problems ',
    stat: '247 Active Challenges',
    icon: Compass,
  },
  {
    title: 'AI Triage System',
    description: 'Our intelligent engine matching challenges to the best-suited HEI and industry partner.',
    tab: 'ai-triage',
    tag: ' Intelligence ',
    stat: '94% Match Accuracy',
    icon: Sparkles,
  },
  {
    title: 'University Hub',
    description: 'Connect with academic institutions and faculty mentors specializing in regional innovation.',
    tab: 'university',
    tag: ' Academia ',
    stat: '8+ Partner HEIs',
    icon: GraduationCap,
  },
  {
    title: 'Industry Partners',
    description: 'Collaborate with CSR wings and industrial giants providing funding and pilot sites.',
    tab: 'industry',
    tag: ' Industry ',
    stat: '6 Major Partners',
    icon: Briefcase,
  },
  {
    title: 'Project Lifecycle',
    description: 'Track the journey from problem validation to prototyping and field deployment.',
    tab: 'lifecycle',
    tag: ' Process ',
    stat: '68 Active Prototypes',
    icon: Layers,
  },
  {
    title: 'Impact Analytics',
    description: 'Quantifiable metrics on how innovation is transforming lives in tribal and rural blocks.',
    tab: 'analytics',
    tag: ' Data ',
    stat: '184k+ Lives Impacted',
    icon: BarChart3,
  },
];

function HomeView({ setActiveTab, onOpenSubmitModal, analytics, onSelectDistrict, onSelectInstitution }: { setActiveTab: (tab: any) => void, onOpenSubmitModal: () => void, analytics: any, onSelectDistrict: (district: string) => void, onSelectInstitution: (inst: any) => void }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <header className="text-center mb-16">
        <span className="editorial-meta block mb-4">Jharkhand State Initiative</span>
        <h1 className="font-editorial-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 text-[#1A1A1A]">
          Societal Innovation <br />
          <span className="text-[#BC5434]">Collaboration Portal</span>
        </h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-12 font-light">
          A multidisciplinary ecosystem bridging the gap between grassroots challenges,
          academic excellence, and industrial support to drive regional transformation.
        </p>

        <div className="flex flex-col items-center gap-8">
          <button
            onClick={onOpenSubmitModal}
            className="inline-flex items-center gap-2 bg-[#BC5434] hover:bg-[#A3452B] text-white text-sm font-bold uppercase tracking-[0.2em] px-8 py-4 shadow-lg transition-all duration-300 cursor-pointer active:scale-95 mb-4"
          >
            <Plus className="w-5 h-5" />
            <span>Submit a Grassroots Challenge</span>
          </button>

          <div className="relative w-full max-w-4xl">
            <JharkhandMap
              districtStats={analytics?.districtStats || []}
              onSelectDistrict={onSelectDistrict}
              onSelectInstitution={onSelectInstitution}
            />
          </div>
        </div>
      </header>

      {/* Navigation Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {HOME_CARDS.map((card) => (
          <div
            key={card.tab}
            onClick={() => setActiveTab(card.tab)}
            className="group block p-6 bg-white border border-stone-200 transition-all duration-300 hover:border-[#BC5434] hover:shadow-sm cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FAF7F2] border border-stone-200 group-hover:bg-[#BC5434] group-hover:text-white transition-all duration-300">
                  <card.icon className="w-4 h-4" />
                </div>
                <span className="editorial-tag group-hover:bg-[#BC5434] group-hover:text-white transition-all duration-300">
                  {card.tag}
                </span>
              </div>
            </div>
            <h3 className="font-editorial-serif text-2xl font-bold mb-3 group-hover:text-[#BC5434] transition-colors">
              {card.title}
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed mb-8">
              {card.description}
            </p>
            <div className="editorial-stat-card">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                {card.stat}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Footer CTA */}
      <footer className="mt-20 text-center border-t border-stone-200 pt-12">
        <p className="text-sm text-stone-600 mb-4">Driven by the spirit of "Jan Bhagidari" and academic rigor.</p>
        <div className="flex justify-center gap-4">
          <span className="editorial-tag">NEP 2020 Aligned</span>
          <span className="editorial-tag">Open Innovation</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'home' | 'challenges' | 'ai-triage' | 'university' | 'industry' | 'lifecycle' | 'analytics' | 'communication' | 'submit-challenge'
  >('home');
  const [userRole, setUserRole] = useState<'citizen' | 'university' | 'industry' | 'admin'>('citizen');

  // Core Datasets
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>({} as AnalyticsSummary);
  const [universities, setUniversities] = useState<University[]>([]);
  const [industryPartners, setIndustryPartners] = useState<IndustryPartner[]>([]);
  const [proposals, setProposals] = useState<SolutionProposal[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  // Modals & Selection
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<ProblemStatement | null>(null);
  const [trackingFilterCode, setTrackingFilterCode] = useState<string>('');
  const [mapFilter, setMapFilter] = useState<{ type: 'district' | 'university' | 'industry'; value: string } | null>(null);
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
        const problemsData = Array.isArray(probData.data) ? probData.data : (Array.isArray(probData) ? probData : []);
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
        setAnalytics(anaData.data || anaData || {});
      }
      if (uniRes.ok) {
        const uniData = await uniRes.json();
        setUniversities(Array.isArray(uniData.data) ? uniData.data : (Array.isArray(uniData) ? uniData : []));
      }
      if (indRes.ok) {
        const indData = await indRes.json();
        setIndustryPartners(Array.isArray(indData.data) ? indData.data : (Array.isArray(indData) ? indData : []));
      }
      if (propRes.ok) {
        const propData = await propRes.json();
        setProposals(Array.isArray(propData.data) ? propData.data : (Array.isArray(propData) ? propData : []));
      }
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(Array.isArray(notifData.data) ? notifData.data : (Array.isArray(notifData) ? notifData : []));
      }
    } catch (err) {
      console.error('Fatal API fetch error:', err);
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
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || `Failed to submit proposal: ${res.statusText}`;
        throw new Error(errorMessage);
      }
      const saved = await res.json();
      setProposals((prev) => [saved, ...prev]);
      setProblems((prev) =>
        prev.map((p) => (p.id === newProposalData.problemId ? { ...p, status: 'proposal_submitted' } : p))
      );
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

  const activeProposalForModal = selectedProblem
    ? proposals.find((p) => p.problemId === selectedProblem.id)
    : undefined;

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#BC5434]/20 selection:text-[#1A1A1A]">
      {/* Global Notification Trigger */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => setIsNotificationOpen(true)}
          className="relative p-3 bg-white border border-stone-200 text-stone-500 hover:text-[#BC5434] hover:border-[#BC5434] rounded-full shadow-md transition-all duration-200 cursor-pointer active:scale-90"
          title="Notifications"
        >
          <Bell className="w-6 h-6" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-2 right-2 w-3 h-3 bg-[#BC5434] rounded-full border-2 border-white"></span>
          )}
        </button>
      </div>

      {/* Global Chat/Forum Trigger */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setActiveTab('communication')}
          className="relative p-4 bg-[#BC5434] text-white rounded-full shadow-xl hover:bg-[#A3452B] transition-all duration-200 cursor-pointer active:scale-90 group"
          title="Community Forum"
        >
          <MessageCircle className="w-7 h-7" />
          {/* Simple pulse effect if there are unread notifications */}
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
          {/* Tooltip on hover */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-stone-900 text-white text-[10px] font-medium leading-tight rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-normal w-48 text-center">
            Join multidisciplinary discussions between students, experts, and grassroots reporters.
          </span>
        </button>
      </div>

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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28 text-stone-600">
            <Loader2 className="w-8 h-8 animate-spin text-[#BC5434] mb-3" />
            <p className="text-base font-editorial-serif italic font-bold text-stone-900">Connecting to Jharkhand State Registry...</p>
            <p className="text-xs uppercase tracking-widest text-stone-500 mt-1">Syncing HEI incubation nodes & field challenges</p>
          </div>
        ) : (
          <div>
            {activeTab === 'home' && (
              <HomeView
                setActiveTab={setActiveTab}
                onOpenSubmitModal={() => setActiveTab('submit-challenge')}
                analytics={analytics}
                onSelectDistrict={(district) => {
                  setMapFilter({ type: 'district', value: district });
                  setActiveTab('challenges');
                }}
                onSelectInstitution={(inst) => {
                  setMapFilter({ type: inst.type, value: inst.id });
                  setActiveTab('challenges');
                }}
              />
            )}

            {activeTab !== 'home' && (
              <div className="space-y-6">
                <div className="flex items-center justify-start mb-4">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#BC5434] hover:text-[#A3452B] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Back to Home</span>
                  </button>
                </div>

                {activeTab === 'challenges' && (
                  <CitizenModule
                    problems={problems}
                    onOpenSubmitModal={() => setActiveTab('submit-challenge')}
                    onSelectProblem={(p) => setSelectedProblem(p)}
                    onUpvote={handleUpvote}
                    trackingFilterCode={trackingFilterCode}
                    onClearTrackingFilter={() => {
                      setTrackingFilterCode('');
                      setMapFilter(null);
                    }}
                    onSearchTrackingCode={handleSearchTrackingCode}
                    mapFilter={mapFilter}
                    onClearMapFilter={() => setMapFilter(null)}
                  />
                )}

                {activeTab === 'submit-challenge' && (
                  <CitizenSubmissionView
                    onNavigateBack={() => setActiveTab('home')}
                    onSuccess={(newProblem) => {
                      const normalizedProblem = {
                        ...newProblem,
                        mediaUrls: newProblem.mediaAttachments && newProblem.mediaAttachments.length > 0
                          ? newProblem.mediaAttachments.map((a: any) => a.url)
                          : newProblem.mediaUrls || [],
                      };
                      setProblems((prev) => [normalizedProblem, ...prev]);
                      fetch('/api/analytics')
                        .then((r) => r.json())
                        .then((d) => setAnalytics(d))
                        .catch(() => {});
                      setActiveTab('challenges');
                    }}
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
          </div>
        )}
      </main>

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
