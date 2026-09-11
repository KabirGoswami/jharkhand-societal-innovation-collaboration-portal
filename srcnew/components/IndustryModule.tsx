import React, { useState } from 'react';
import {
  Briefcase,
  IndianRupee,
  Building2,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  Send,
  Loader2,
  ShieldCheck,
  Target,
  FileCheck,
} from 'lucide-react';
import { IndustryPartner, SolutionProposal, ProblemStatement } from '../types';

interface IndustryModuleProps {
  industryPartners: IndustryPartner[];
  proposals: SolutionProposal[];
  problems: ProblemStatement[];
  onPledgeFunding: (proposalId: string, partnerId: string, amount: number, mentorName?: string, pilotSite?: string) => Promise<void>;
  onSelectProblem: (problem: ProblemStatement) => void;
}

export const IndustryModule: React.FC<IndustryModuleProps> = ({
  industryPartners,
  proposals,
  problems,
  onPledgeFunding,
  onSelectProblem,
}) => {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(industryPartners[0]?.id || 'ind-tata-steel');
  const [activeTab, setActiveTab] = useState<'proposals' | 'partners' | 'csr-tracker'>('proposals');

  // Pledge Modal State
  const [pledgingProposal, setPledgingProposal] = useState<SolutionProposal | null>(null);
  const [pledgeAmountLakhs, setPledgeAmountLakhs] = useState<number>(3.5);
  const [mentorName, setMentorName] = useState<string>('Er. Amitabh Sharma (Sr. Principal Technologist)');
  const [pilotSite, setPilotSite] = useState<string>('Potka Block Community Center & Tata Steel Rural Dev Society');
  const [isSubmittingPledge, setIsSubmittingPledge] = useState(false);

  const currentPartner = industryPartners.find((p) => p.id === selectedPartnerId) || industryPartners[0];

  // Total funds pledged across Jharkhand
  const totalPledgedLakhs = industryPartners.reduce((acc, p) => acc + p.totalPledgedLakhs, 0);

  const handleOpenPledge = (proposal: SolutionProposal) => {
    setPledgingProposal(proposal);
    const requiredLakhs = proposal.budgetBreakdown.totalAmount / 100000;
    setPledgeAmountLakhs(Number(requiredLakhs.toFixed(1)));
  };

  const handleConfirmPledge = async () => {
    if (!pledgingProposal) return;
    setIsSubmittingPledge(true);
    try {
      await onPledgeFunding(
        pledgingProposal.id,
        currentPartner.id,
        pledgeAmountLakhs * 100000,
        mentorName,
        pilotSite
      );
      setPledgingProposal(null);
      alert(`CSR Grant of ₹${pledgeAmountLakhs} Lakhs pledged by ${currentPartner.name}! Notification sent to university team.`);
    } catch (err) {
      console.error(err);
      alert('Failed to record pledge. Please try again.');
    } finally {
      setIsSubmittingPledge(false);
    }
  };

  return (
    <div id="industry-csr-hub" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white rounded-xl p-6 shadow-md border border-purple-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30 mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Corporate Social Responsibility (CSR) & Innovation Exchange</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Jharkhand Industry Co-Development Portal</h2>
          </div>

          <div className="bg-purple-900/40 border border-purple-700/50 p-3.5 rounded-xl text-center md:text-right">
            <div className="text-xs text-purple-200 font-medium">Total CSR & Innovation Capital Pledged</div>
            <div className="text-2xl font-bold text-amber-300">₹{totalPledgedLakhs.toFixed(1)} Lakhs</div>
            <div className="text-[11px] text-purple-300 mt-0.5">Across {industryPartners.length} Active Industry Enablers</div>
          </div>
        </div>
      </div>

      {/* Corporate Identity Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Simulating as Partner:</span>
          <select
            id="select-industry-partner"
            value={selectedPartnerId}
            onChange={(e) => setSelectedPartnerId(e.target.value)}
            className="text-xs font-bold px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:border-purple-600"
          >
            {industryPartners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.type})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div>
            Pledged by {currentPartner.shortName}: <strong className="text-emerald-700">₹{currentPartner.totalPledgedLakhs} Lakhs</strong>
          </div>
          <div className="hidden sm:block text-slate-300">•</div>
          <div className="hidden sm:block">
            Focus: <strong className="text-slate-800">{currentPartner.focusAreas.slice(0, 2).join(', ')}</strong>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 space-x-4 text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('proposals')}
          className={`pb-2.5 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'proposals'
              ? 'border-b-2 border-purple-600 text-purple-700 font-bold'
              : 'hover:text-slate-900'
          }`}
        >
          <span>University Research Proposals Seeking Co-Development</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px]">
            {proposals.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('partners')}
          className={`pb-2.5 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'partners'
              ? 'border-b-2 border-purple-600 text-purple-700 font-bold'
              : 'hover:text-slate-900'
          }`}
        >
          <span>Corporate & Startup Directory</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px]">
            {industryPartners.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Proposals seeking funding */}
      {activeTab === 'proposals' && (
        <div className="grid grid-cols-1 gap-4">
          {proposals.map((prop) => {
            const hasSponsor = Boolean(prop.industryPartnerName);
            const totalBudgetLakhs = (prop.budgetBreakdown.totalAmount / 100000).toFixed(2);
            const linkedProblem = problems.find((p) => p.id === prop.problemId);

            return (
              <div
                key={prop.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row items-start justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      HEI: {prop.heiName}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Faculty: {prop.facultyMentor.name}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      NEP Credits: {prop.nepExperientialCredits}
                    </span>
                    {hasSponsor ? (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-purple-700" />
                        <span>Sponsored by {prop.industryPartnerName}</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        Open for CSR Sponsorship
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{prop.projectTitle}</h3>
                  <div className="text-xs text-slate-500 font-medium">
                    Addressing: <span className="text-slate-700 font-semibold">{prop.problemTitle}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{prop.abstract}</p>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Total Requirement</span>
                      <strong className="text-slate-900 font-bold">₹{totalBudgetLakhs} Lakhs</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Student Researchers</span>
                      <strong className="text-slate-900">{prop.studentTeam.membersCount} Members</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">IP Proposition</span>
                      <strong className="text-purple-700">{prop.ipPotential}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Completed Milestones</span>
                      <strong className="text-emerald-700">
                        {prop.milestones.filter((m) => m.status === 'completed').length}/{prop.milestones.length} Done
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0 md:min-w-[210px] w-full md:w-auto">
                  {!hasSponsor ? (
                    <button
                      id={`btn-pledge-csr-${prop.id}`}
                      onClick={() => handleOpenPledge(prop)}
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      <IndianRupee className="w-4 h-4" />
                      <span>Pledge CSR Grant & Mentorship</span>
                    </button>
                  ) : (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900 text-center">
                      <div className="font-bold">Active Co-Development</div>
                      <div className="text-[11px] text-purple-700 mt-1">CSR MoU & Pilot Field Trials Active</div>
                    </div>
                  )}

                  {linkedProblem && (
                    <button
                      onClick={() => onSelectProblem(linkedProblem)}
                      className="w-full text-xs text-slate-600 hover:text-slate-900 py-1.5 text-center font-medium cursor-pointer"
                    >
                      View Ground Problem Details
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Partners Directory */}
      {activeTab === 'partners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {industryPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-purple-100 text-purple-900">
                    {partner.type}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    Pledged: ₹{partner.totalPledgedLakhs} Lakhs
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{partner.name}</h4>
                <div className="text-xs text-slate-500 mb-3">Headquarters: {partner.headquarters}</div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div>
                    <strong className="text-slate-700">Thematic Focus Areas:</strong>{' '}
                    <span>{partner.focusAreas.join(' • ')}</span>
                  </div>
                  <div>
                    <strong className="text-slate-700">Technical Mentors:</strong>{' '}
                    <span>{partner.mentorsAvailable.join(', ')}</span>
                  </div>
                  <div>
                    <strong className="text-slate-700">Pilot Testbeds:</strong>{' '}
                    <span>{partner.pilotSitesOffered.join(' • ')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{partner.contactPerson}</span>
                <span className="font-mono text-[11px] text-purple-700">{partner.contactEmail}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pledge CSR Modal */}
      {pledgingProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-700" />
                <h3 className="font-bold text-base text-slate-900">Pledge Industry CSR & Mentorship</h3>
              </div>
              <button
                onClick={() => setPledgingProposal(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <div className="text-xs text-slate-500 font-semibold mb-0.5">Sponsoring Research Project</div>
              <div className="text-sm font-bold text-slate-900">{pledgingProposal.projectTitle}</div>
              <div className="text-xs text-slate-600 mt-0.5">
                HEI: {pledgingProposal.heiName} • Lead: {pledgingProposal.facultyMentor.name}
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pledging Corporate Partner
                </label>
                <input
                  type="text"
                  disabled
                  value={`${currentPartner.name} (${currentPartner.type})`}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex justify-between">
                  <span>CSR Prototyping Grant Amount (in ₹ Lakhs)</span>
                  <span className="text-purple-700 font-bold">₹{pledgeAmountLakhs} Lakhs</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="15.0"
                  step="0.5"
                  value={pledgeAmountLakhs}
                  onChange={(e) => setPledgeAmountLakhs(parseFloat(e.target.value))}
                  className="w-full accent-purple-700"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹0.5 Lakhs (Seed)</span>
                  <span>₹5.0 Lakhs (Prototype)</span>
                  <span>₹15.0 Lakhs (Commercial Pilot)</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Designated Industry Technical Mentor
                </label>
                <input
                  type="text"
                  value={mentorName}
                  onChange={(e) => setMentorName(e.target.value)}
                  placeholder="e.g. Chief Metallurgist / Lead Agronomist"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Offered Field Pilot Testbed Site in Jharkhand
                </label>
                <input
                  type="text"
                  value={pilotSite}
                  onChange={(e) => setPilotSite(e.target.value)}
                  placeholder="e.g. Jharia Colliery, Potka block, Ramgarh industrial cluster"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-purple-900 text-[11px] leading-relaxed">
                <strong>CSR Compliance Note:</strong> Grants allocated through the Jharkhand Samadhan portal meet Ministry of Corporate Affairs Section 135 Schedule VII item (ix) for incubation & academic experiential innovation.
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setPledgingProposal(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-csr-pledge"
                onClick={handleConfirmPledge}
                disabled={isSubmittingPledge}
                className="inline-flex items-center gap-1.5 bg-purple-700 hover:bg-purple-600 text-white font-semibold text-xs px-5 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmittingPledge ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Confirm CSR Grant & Sign MoU</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
