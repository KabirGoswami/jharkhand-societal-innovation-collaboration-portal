import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ArrowRight,
  Send,
  Loader2,
  ExternalLink,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';
import { ProblemStatement, University, District, DomainTheme } from '../types';
import { JHARKHAND_DISTRICTS, THEMATIC_DOMAINS } from '../data/jharkhandData';

interface AIProblemManagementProps {
  problems: ProblemStatement[];
  universities: University[];
  onAssignHEI: (problemId: string, heiId: string, department: string) => Promise<void>;
  onSelectProblem: (problem: ProblemStatement) => void;
  onRefreshProblems: () => void;
}

export const AIProblemManagement: React.FC<AIProblemManagementProps> = ({
  problems,
  universities,
  onAssignHEI,
  onSelectProblem,
  onRefreshProblems,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [assigningProblemId, setAssigningProblemId] = useState<string | null>(null);
  const [selectedHeiId, setSelectedHeiId] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [isSubmittingAssign, setIsSubmittingAssign] = useState(false);

  // Filter problems
  const filteredProblems = problems.filter((p) => {
    if (selectedDomain !== 'all' && p.domain !== selectedDomain) return false;
    if (selectedDistrict !== 'all' && p.district !== selectedDistrict) return false;
    if (selectedUrgency !== 'all' && p.urgency !== selectedUrgency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.trackingCode.toLowerCase().includes(q) ||
        p.blockOrPanchayat.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Calculate triage stats
  const totalCount = problems.length;
  const unassignedCount = problems.filter((p) => !p.assignedHeiId).length;
  const highPriorityCount = problems.filter((p) => p.aiAnalysis?.priorityScore >= 85).length;
  const duplicateAlertsCount = problems.filter((p) => p.aiAnalysis?.duplicateMatches?.length > 0).length;

  const handleOpenAssignModal = (problem: ProblemStatement) => {
    setAssigningProblemId(problem.id);
    // Preset top matched HEI if available
    const topMatch = problem.aiAnalysis?.matchedHeis?.[0];
    if (topMatch) {
      setSelectedHeiId(topMatch.universityId);
      setSelectedDept(topMatch.department);
    } else {
      setSelectedHeiId(universities[0]?.id || '');
      setSelectedDept(universities[0]?.departments[0] || '');
    }
  };

  const handleConfirmAssignment = async () => {
    if (!assigningProblemId || !selectedHeiId) return;
    setIsSubmittingAssign(true);
    try {
      await onAssignHEI(assigningProblemId, selectedHeiId, selectedDept);
      setAssigningProblemId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to assign university. Please try again.');
    } finally {
      setIsSubmittingAssign(false);
    }
  };

  const currentProblemForAssign = problems.find((p) => p.id === assigningProblemId);
  const currentSelectedHei = universities.find((u) => u.id === selectedHeiId);

  return (
    <div id="ai-triage-module" className="space-y-6">
      {/* Triage Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-xl p-6 shadow-md border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Problem Management & Routing Desk</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Institutional Triage & Allocation Matrix</h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Automated classification, deduplication clustering, and intelligent matching with Jharkhand Higher Education Institutions based on faculty specialization and incubation center capacity.
            </p>
          </div>

          {/* Quick Stats Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
              <div className="text-lg font-bold text-white">{totalCount}</div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Total Received</div>
            </div>
            <div className="bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/40">
              <div className="text-lg font-bold text-amber-400">{unassignedCount}</div>
              <div className="text-[10px] text-amber-300 uppercase font-medium">Pending HEI Route</div>
            </div>
            <div className="bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40">
              <div className="text-lg font-bold text-emerald-400">{highPriorityCount}</div>
              <div className="text-[10px] text-emerald-300 uppercase font-medium">Critical / Priority &gt; 85</div>
            </div>
            <div className="bg-blue-950/40 p-2.5 rounded-lg border border-blue-800/40">
              <div className="text-lg font-bold text-blue-400">{duplicateAlertsCount}</div>
              <div className="text-[10px] text-blue-300 uppercase font-medium">Duplicate Clusters</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search by keywords, block, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Domain Filter */}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-emerald-600"
          >
            <option value="all">All Domains ({THEMATIC_DOMAINS.length})</option>
            {THEMATIC_DOMAINS.map((td) => (
              <option key={td.key} value={td.key}>
                {td.label}
              </option>
            ))}
          </select>

          {/* District Filter */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-emerald-600"
          >
            <option value="all">All 24 Districts</option>
            {JHARKHAND_DISTRICTS.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>

          {/* Urgency Filter */}
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-emerald-600"
          >
            <option value="all">All Urgency Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-800">{filteredProblems.length}</strong> challenges
        </div>
      </div>

      {/* Problem Statements Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProblems.map((prob) => {
          const isAssigned = Boolean(prob.assignedHeiId);
          const topMatch = prob.aiAnalysis?.matchedHeis?.[0];
          const hasDuplicates = prob.aiAnalysis?.duplicateMatches?.length > 0;

          return (
            <div
              key={prob.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left: Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {prob.trackingCode}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {prob.domain.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {prob.district} • {prob.blockOrPanchayat}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        prob.urgency === 'Critical'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : prob.urgency === 'High'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-50 text-blue-800'
                      }`}
                    >
                      {prob.urgency} Urgency
                    </span>
                    {hasDuplicates && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>{prob.aiAnalysis.duplicateMatches.length} Similar Flagged</span>
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => onSelectProblem(prob)}
                    className="text-base font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors"
                  >
                    {prob.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{prob.description}</p>

                  {/* AI Evaluation Insights */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        {prob.aiAnalysis?.priorityScore || 85}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">
                          AI Priority Score: {prob.aiAnalysis?.priorityScore || 85}/100
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Subcategory: {prob.aiAnalysis?.subCategory || 'Grassroots Need'}
                        </div>
                      </div>
                    </div>

                    {/* Top Recommended HEI Match */}
                    {topMatch && (
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded border border-slate-200">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="font-semibold text-slate-800 text-[11px]">
                            Top HEI Match: <span className="text-blue-700">{topMatch.universityName}</span> ({topMatch.matchScore}%)
                          </div>
                          <div className="text-[10px] text-slate-500">{topMatch.department}</div>
                        </div>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-500">
                      Affected: <strong className="text-slate-700">{prob.affectedPopulation.toLocaleString()}</strong> citizens
                    </div>
                  </div>
                </div>

                {/* Right: Assignment Actions */}
                <div className="flex flex-col items-end gap-2 shrink-0 md:min-w-[190px]">
                  {isAssigned ? (
                    <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-center">
                      <div className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Assigned HEI</div>
                      <div className="text-xs font-bold text-blue-950 mt-0.5">{prob.assignedHeiName}</div>
                      <div className="text-[11px] text-blue-800 font-medium">{prob.assignedDepartment}</div>
                      <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Team Allocation Active</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      id={`btn-route-hei-${prob.id}`}
                      onClick={() => handleOpenAssignModal(prob)}
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Route to University</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSelectProblem(prob)}
                    className="w-full inline-flex items-center justify-center gap-1 text-xs text-slate-600 hover:text-slate-900 py-1.5 font-medium cursor-pointer"
                  >
                    <span>Inspect Full Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredProblems.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
            <p className="text-sm text-slate-500">No challenges found matching the selected filters.</p>
          </div>
        )}
      </div>

      {/* Route to University Assignment Modal */}
      {assigningProblemId && currentProblemForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Route Challenge to Jharkhand HEI</h3>
              </div>
              <button
                onClick={() => setAssigningProblemId(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <div className="text-xs text-slate-500 font-semibold mb-1">Target Societal Challenge</div>
              <div className="text-sm font-bold text-slate-900">{currentProblemForAssign.title}</div>
              <div className="text-xs text-slate-600 mt-0.5">
                {currentProblemForAssign.district} • {currentProblemForAssign.domain} • Priority: {currentProblemForAssign.aiAnalysis?.priorityScore}/100
              </div>
            </div>

            {/* AI Recommendation Box */}
            {currentProblemForAssign.aiAnalysis?.matchedHeis?.[0] && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 text-xs text-emerald-900">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-emerald-950">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AI Recommended HEI Match:</span>
                </div>
                <div className="font-semibold text-emerald-800">
                  {currentProblemForAssign.aiAnalysis.matchedHeis[0].universityName} ({currentProblemForAssign.aiAnalysis.matchedHeis[0].matchScore}% Match)
                </div>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  {currentProblemForAssign.aiAnalysis.matchedHeis[0].reason}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Higher Education Institution (HEI) <span className="text-red-500">*</span>
                </label>
                <select
                  id="select-assign-hei"
                  value={selectedHeiId}
                  onChange={(e) => {
                    const uId = e.target.value;
                    setSelectedHeiId(uId);
                    const foundU = universities.find((u) => u.id === uId);
                    if (foundU && foundU.departments.length > 0) {
                      setSelectedDept(foundU.departments[0]);
                    }
                  }}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-emerald-600"
                >
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department / Center of Excellence <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-emerald-600"
                >
                  {currentSelectedHei?.departments?.map((dept, i) => (
                    <option key={i} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {currentSelectedHei && (
                <div className="text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-slate-600">
                  <div>
                    <strong>Incubation Center:</strong> {currentSelectedHei.incubationCenter}
                  </div>
                  <div>
                    <strong>Available Mentors:</strong> {currentSelectedHei.facultyMentors.map((m) => m.name).join(', ')}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setAssigningProblemId(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-route-hei"
                onClick={handleConfirmAssignment}
                disabled={isSubmittingAssign}
                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs px-5 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmittingAssign ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Confirm & Dispatch to University Dean</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
