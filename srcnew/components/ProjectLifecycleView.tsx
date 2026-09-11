import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  Clock,
  Award,
  FileCheck,
  TrendingUp,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Building2,
  Users,
} from 'lucide-react';
import { SolutionProposal, ProblemStatement, InnovationStage } from '../types';

interface ProjectLifecycleViewProps {
  proposals: SolutionProposal[];
  problems: ProblemStatement[];
  onSelectProblem: (problem: ProblemStatement) => void;
  onUpdateMilestone: (proposalId: string, milestoneId: string, status: string) => Promise<void>;
}

const STAGES: { stage: InnovationStage; label: string; desc: string }[] = [
  { stage: 'Ideation', label: '1. Ideation & Diagnostic', desc: 'Baseline testing & root cause discovery' },
  { stage: 'Lab Prototype', label: '2. Lab Prototype', desc: 'Formulation, engineering & bench validation' },
  { stage: 'Field Testing', label: '3. Field Testing', desc: 'On-site trial in Jharkhand block/village' },
  { stage: 'Community Pilot', label: '4. Community Pilot', desc: 'Direct feedback & Gram Panchayat testing' },
  { stage: 'Deployment & Scale', label: '5. Handover & Scale', desc: 'PRI/ULB adoption, patent filing & spin-off' },
];

export const ProjectLifecycleView: React.FC<ProjectLifecycleViewProps> = ({
  proposals,
  problems,
  onSelectProblem,
  onUpdateMilestone,
}) => {
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');
  const [selectedProposalId, setSelectedProposalId] = useState<string>(proposals[0]?.id || '');

  const activeProposal = proposals.find((p) => p.id === selectedProposalId) || proposals[0];
  const linkedProblem = activeProposal ? problems.find((p) => p.id === activeProposal.problemId) : null;

  // Calculate overall project completion percentage
  const getProposalProgress = (prop: SolutionProposal) => {
    if (!prop.milestones || prop.milestones.length === 0) return 0;
    const completed = prop.milestones.filter((m) => m.status === 'completed').length;
    return Math.round((completed / prop.milestones.length) * 100);
  };

  return (
    <div id="project-lifecycle-module" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 text-white rounded-xl p-6 shadow-md border border-teal-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Stage-Gate Innovation Lifecycle & IP Commercialization</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Jharkhand Grassroots Innovation Tracker</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-teal-900/40 border border-teal-700/40 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-teal-300">19</div>
              <div className="text-[10px] text-teal-200 uppercase font-medium">Patents Filed</div>
            </div>
            <div className="bg-teal-900/40 border border-teal-700/40 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-amber-300">11</div>
              <div className="text-[10px] text-amber-200 uppercase font-medium">Startups Incubated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Gates Flow Visualization */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs overflow-x-auto">
        <div className="flex items-center min-w-[650px] justify-between">
          {STAGES.map((s, idx) => {
            const isSelected = selectedStageFilter === s.stage;
            return (
              <div
                key={s.stage}
                onClick={() => setSelectedStageFilter(isSelected ? 'all' : s.stage)}
                className={`flex-1 p-2.5 rounded-lg border text-xs cursor-pointer transition-all mx-1 ${
                  isSelected
                    ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-[11px] mb-0.5">{s.label}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1">{s.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Dual-Pane View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Active Innovation Projects */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 px-1">
            <span>Active Projects ({proposals.length})</span>
            {selectedStageFilter !== 'all' && (
              <button
                onClick={() => setSelectedStageFilter('all')}
                className="text-teal-700 hover:underline cursor-pointer text-[11px]"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {proposals.map((prop) => {
              const isSelected = prop.id === activeProposal?.id;
              const progress = getProposalProgress(prop);

              return (
                <div
                  key={prop.id}
                  onClick={() => setSelectedProposalId(prop.id)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-blue-700 text-[11px]">{prop.heiName}</span>
                    <span className="font-bold text-teal-800 text-[11px]">{progress}% Complete</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1">{prop.projectTitle}</h4>
                  <div className="text-slate-500 text-[11px] line-clamp-1 mb-2">For: {prop.problemTitle}</div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-teal-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>IP: {prop.ipPotential}</span>
                    <span className="font-semibold text-purple-700">
                      {prop.industryPartnerName ? 'CSR Backed' : 'Seeking CSR'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Lifecycle Dossier */}
        {activeProposal ? (
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    Stage-Gate Progression: {getProposalProgress(activeProposal)}%
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    NEP Credits: {activeProposal.nepExperientialCredits}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{activeProposal.projectTitle}</h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Institution: <strong className="text-slate-800">{activeProposal.heiName}</strong> • Lead: {activeProposal.facultyMentor.name}
                </div>
              </div>

              {linkedProblem && (
                <button
                  onClick={() => onSelectProblem(linkedProblem)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>View District Problem</span>
                </button>
              )}
            </div>

            {/* Milestones Checklist & Evidence */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Execution Milestones & Ground Verification</span>
                <span className="text-slate-500 font-normal">Click status to toggle completion</span>
              </h4>

              <div className="space-y-3">
                {activeProposal.milestones.map((m, idx) => {
                  const isDone = m.status === 'completed';
                  return (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-lg border text-xs transition-all ${
                        isDone ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              const nextStatus = isDone ? 'in_progress' : 'completed';
                              onUpdateMilestone(activeProposal.id, m.id, nextStatus);
                            }}
                            className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-colors ${
                              isDone ? 'bg-emerald-600 text-white' : 'border border-slate-400 bg-white text-transparent'
                            }`}
                          >
                            ✓
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{m.title}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-medium">
                                {m.stage}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 mt-0.5">
                              Deliverable: <strong className="text-slate-700">{m.deliverable}</strong> • Duration: {m.durationWeeks} weeks
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap ${
                            isDone ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isDone ? 'Verified & Completed' : 'Pending Verification'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Intellectual Property, Patent & Handover Section */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-teal-600" />
                <span>Intellectual Property, Startups & Public Handover</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">IP Strategy</span>
                  <strong className="text-slate-900">{activeProposal.ipPotential}</strong>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">CSR Co-Funder</span>
                  <strong className="text-purple-800">{activeProposal.industryPartnerName || 'Pending Sponsor'}</strong>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Local Body Handover</span>
                  <strong className="text-emerald-800">PRI Operation & Maintenance SOP</strong>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            No proposal selected.
          </div>
        )}
      </div>
    </div>
  );
};
