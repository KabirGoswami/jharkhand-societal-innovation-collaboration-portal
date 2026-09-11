import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { CitizenSubmissionModal } from '../components/CitizenSubmissionModal';
import { ProblemDetailsModal } from '../components/ProblemDetailsModal';
import {
  ProblemStatement,
  AnalyticsSummary,
  University,
  IndustryPartner,
  SolutionProposal,
} from '../types';
import {
  INITIAL_PROBLEMS,
  INITIAL_ANALYTICS,
  JHARKHAND_UNIVERSITIES,
  JHARKHAND_INDUSTRY_PARTNERS,
  INITIAL_SOLUTION_PROPOSALS,
} from '../data/jharkhandData';
import { Loader2 } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userRole, setUserRole] = useState<'citizen' | 'university' | 'industry' | 'admin'>('citizen');

  // Core Datasets
  const [problems, setProblems] = useState<ProblemStatement[]>(INITIAL_PROBLEMS);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(INITIAL_ANALYTICS);
  const [universities, setUniversities] = useState<University[]>(JHARKHAND_UNIVERSITIES);
  const [industryPartners, setIndustryPartners] = useState<IndustryPartner[]>(JHARKHAND_INDUSTRY_PARTNERS);
  const [proposals, setProposals] = useState<SolutionProposal[]>(INITIAL_SOLUTION_PROPOSALS);

  // Modals & Selection
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<ProblemStatement | null>(null);
  const [trackingFilterCode, setTrackingFilterCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Fetching from server APIs
  const loadAllData = async () => {
    try {
      const [probRes, anaRes, uniRes, indRes, propRes] = await Promise.all([
        fetch('/api/problems'),
        fetch('/api/analytics'),
        fetch('/api/universities'),
        fetch('/api/industry/partners'),
        fetch('/api/proposals'),
      ]);

      if (probRes.ok) {
        const probData = await probRes.json();
        setProblems(probData);
      }
      if (anaRes.ok) {
        const anaData = await anaRes.json();
        setAnalytics(anaData);
      }
      if (uniRes.ok) {
        const uniData = await uniRes.json();
        setUniversities(uniData);
      }
      if (indRes.ok) {
        const indData = await indRes.json();
        setIndustryPartners(indData);
      }
      if (propRes.ok) {
        const propData = await propRes.json();
        setProposals(propData);
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
        setProblems((prev) => prev.map((p) => (p.id === problemId ? updated : p)));
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

  const handleSearchTrackingCode = (code: string) => {
    const found = problems.find((p) => p.trackingCode.toLowerCase() === code.toLowerCase());
    if (found) {
      setSelectedProblem(found);
    } else {
      setTrackingFilterCode(code);
      navigate('/challenges');
    }
  };

  const activeProposalForModal = selectedProblem
    ? proposals.find((p) => p.problemId === selectedProblem.id)
    : undefined;

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#BC5434]/20 selection:text-[#1A1A1A]">
      <Navbar
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onSearchTrackingCode={handleSearchTrackingCode}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-28 text-stone-600 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#BC5434]" />
            <p className="text-sm font-editorial-serif italic font-bold text-stone-900">
              Connecting to Jharkhand State Registry... <span className="text-xs uppercase tracking-widest text-stone-500 font-sans not-italic ml-2">Syncing HEI nodes</span>
            </p>
          </div>
        ) : (
          <Outlet context={{
            userRole, setUserRole,
            problems, setProblems,
            analytics, setAnalytics,
            universities, setUniversities,
            industryPartners, setIndustryPartners,
            proposals, setProposals,
            selectedProblem, setSelectedProblem,
            trackingFilterCode, setTrackingFilterCode,
            handleUpvote, handleAssignHEI, handleSubmitProposal, handlePledgeFunding, handleUpdateMilestone, loadAllData,
            setIsSubmitModalOpen
          }} />
        )}
      </main>

      <CitizenSubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSuccess={(newProblem) => {
          setProblems((prev) => [newProblem, ...prev]);
          fetch('/api/analytics')
            .then((r) => r.json())
            .then((d) => setAnalytics(d))
            .catch(() => {});
        }}
      />

      <ProblemDetailsModal
        problem={selectedProblem}
        proposal={activeProposalForModal}
        onClose={() => setSelectedProblem(null)}
        onUpvote={handleUpvote}
        currentUserRole={userRole}
      />

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
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-wider">
              <span className="text-[#E07A5F]">24 Districts</span>
              <span className="text-stone-700">•</span>
              <Link to="/about" className="text-stone-300 hover:text-white transition-colors">6 Premier Jharkhand HEIs</Link>
              <span className="text-stone-700">•</span>
              <span className="text-stone-300">CSR MCA Section 135 Compliant</span>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
            <div>
              &copy; {new Date().getFullYear()} Department of Higher & Technical Education, Government of Jharkhand.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
