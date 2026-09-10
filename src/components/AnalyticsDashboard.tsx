import React, { useState } from 'react';
import {
  BarChart3,
  MapPin,
  TrendingUp,
  Award,
  Users,
  GraduationCap,
  IndianRupee,
  CheckCircle2,
  Layers,
  Sparkles,
  Droplets,
  Sprout,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { AnalyticsSummary, University, ProblemStatement } from '../types';
import { THEMATIC_DOMAINS } from '../data/jharkhandData';
import { JharkhandMap } from './JharkhandMap';

interface AnalyticsDashboardProps {
  analytics: AnalyticsSummary;
  universities: University[];
  problems: ProblemStatement[];
  onSelectDistrictFilter?: (district: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  analytics,
  universities,
  problems,
  onSelectDistrictFilter,
}) => {
  const [selectedSortBy, setSelectedSortBy] = useState<'challenges' | 'active'>('challenges');

  // Sorted districts
  const sortedDistricts = [...(analytics?.districtStats || [])].sort((a, b) => {
    if (selectedSortBy === 'challenges') {
      return (b?.challengesCount || 0) - (a?.challengesCount || 0);
    }
    return (b?.activeProjects || 0) - (a?.activeProjects || 0);
  });

  // Calculate maximum challenges for proportional bars
  const maxDistrictChallenges = Math.max(...(analytics?.districtStats || []).map((d) => d?.challengesCount || 0), 1);
  const maxDomainCount = Math.max(...(analytics?.domainStats || []).map((d) => d?.count || 0), 1);

  return (
    <div id="visual-analytics-module" className="space-y-6">
      {/* Top Banner: Editorial Masthead */}
      <div className="bg-[#1A1A1A] text-stone-100 p-8 border border-stone-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-meta">Statewide Innovation Metrics</span>
              <span className="text-stone-600">•</span>
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Impact Ledger</span>
            </div>
            <h2 className="font-editorial-serif italic text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Jharkhand Innovation Performance Index
            </h2>
            <p className="text-xs text-stone-400 font-serif italic max-w-2xl mt-2 leading-relaxed">
              Real-time monitoring of community challenge submissions, multidisciplinary university research participation, industry CSR capital deployment, and ground social outcomes across all 24 districts.
            </p>
          </div>

          <div className="bg-stone-900 border border-stone-800 p-4 text-center min-w-[200px]">
            <span className="editorial-meta !text-[10px] !mb-1 block">Lives Directly Impacted</span>
            <span className="font-editorial-serif text-3xl font-bold text-white tracking-tight">1,84,000+</span>
            <span className="text-[10px] text-stone-400 block font-serif italic mt-1">Across 86 Gram Panchayats</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards Grid: Editorial Hairline Top Border */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 border border-stone-300 border-t-2 border-t-stone-900 shadow-none">
          <div className="editorial-meta !text-[10px] !mb-1">Challenges Logged</div>
          <div className="font-editorial-serif text-3xl font-light text-stone-900">{analytics?.totalChallengesReceived ?? 0}</div>
          <div className="text-[10px] text-stone-500 font-serif italic mt-1">100% Geo-tagged</div>
        </div>

        <div className="bg-white p-4 border border-stone-300 border-t-2 border-t-[#BC5434] shadow-none">
          <div className="editorial-meta !text-[10px] !mb-1">Routed to HEIs</div>
          <div className="font-editorial-serif text-3xl font-light text-stone-900">{analytics?.totalAssignedToHEIs ?? 0}</div>
          <div className="text-[10px] text-stone-500 font-serif italic mt-1">{analytics?.facultyMentorsEngaged ?? 0} Faculty Mentors</div>
        </div>

        <div className="bg-white p-4 border border-stone-300 border-t-2 border-t-stone-900 shadow-none">
          <div className="editorial-meta !text-[10px] !mb-1">Active Prototypes</div>
          <div className="font-editorial-serif text-3xl font-light text-stone-900">{analytics?.activePrototypes ?? 0}</div>
          <div className="text-[10px] text-stone-500 font-serif italic mt-1">In Univ Incubation Labs</div>
        </div>

        <div className="bg-white p-4 border border-stone-300 border-t-2 border-t-[#BC5434] shadow-none">
          <div className="editorial-meta !text-[10px] !mb-1">Field Pilots</div>
          <div className="font-editorial-serif text-3xl font-light text-stone-900">{analytics?.fieldPilotsDeployed ?? 0}</div>
          <div className="text-[10px] text-stone-500 font-serif italic mt-1">Deployed in Districts</div>
        </div>

        <div className="bg-white p-4 border border-stone-300 border-t-2 border-t-stone-900 shadow-none">
          <div className="editorial-meta !text-[10px] !mb-1">CSR Pledged</div>
          <div className="font-editorial-serif text-3xl font-light text-stone-900">₹{(analytics?.totalFundingPledgedLakhs ?? 0).toFixed(0)}L</div>
          <div className="text-[10px] text-stone-500 font-serif italic mt-1">Corporate & MSME Grants</div>
        </div>

        <div className="bg-white p-4 border border-stone-300 border-t-2 border-t-[#BC5434] shadow-none">
          <div className="editorial-meta !text-[10px] !mb-1">Students in NEP</div>
          <div className="font-editorial-serif text-3xl font-light text-stone-900">{analytics?.studentsParticipating ?? 0}</div>
          <div className="text-[10px] text-stone-500 font-serif italic mt-1">Experiential Credits</div>
        </div>
      </div>

      {/* Measurable Social Outcomes Section */}
      <div className="bg-white border border-stone-300 p-6 shadow-none">
        <h3 className="editorial-meta !text-xs !mb-4 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Measurable Ground Social Outcomes Across Jharkhand</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#FAF7F2] border border-stone-300 text-xs">
            <div className="flex items-center gap-2 mb-1.5 text-stone-900 font-bold uppercase tracking-wider text-[11px]">
              <Droplets className="w-3.5 h-3.5 text-[#BC5434]" />
              <span>Safe Drinking Water</span>
            </div>
            <div className="font-editorial-serif text-xl font-bold text-stone-900">1,25,000 Liters/Day</div>
            <p className="text-[11px] text-stone-600 font-serif italic mt-1.5 leading-relaxed">
              Fluoride & arsenic free water delivered to 14 schools and 6 Panchayats in Bundu & Latehar.
            </p>
          </div>

          <div className="p-4 bg-[#FAF7F2] border border-stone-300 text-xs">
            <div className="flex items-center gap-2 mb-1.5 text-stone-900 font-bold uppercase tracking-wider text-[11px]">
              <Sprout className="w-3.5 h-3.5 text-[#BC5434]" />
              <span>Tribal Agricultural Yield</span>
            </div>
            <div className="font-editorial-serif text-xl font-bold text-stone-900">+28% Millets & Lac</div>
            <p className="text-[11px] text-stone-600 font-serif italic mt-1.5 leading-relaxed">
              Solar micro-drip & bio-fungicide tested by BAU with 420 smallholder farmers in Khunti.
            </p>
          </div>

          <div className="p-4 bg-[#FAF7F2] border border-stone-300 text-xs">
            <div className="flex items-center gap-2 mb-1.5 text-stone-900 font-bold uppercase tracking-wider text-[11px]">
              <Flame className="w-3.5 h-3.5 text-[#BC5434]" />
              <span>Mine Fire Mitigation</span>
            </div>
            <div className="font-editorial-serif text-xl font-bold text-stone-900">3 Fissures Sealed</div>
            <p className="text-[11px] text-stone-600 font-serif italic mt-1.5 leading-relaxed">
              IIT (ISM) thermal drone mapping & flyash-nitrogen grouting in Jharia coalfield belt.
            </p>
          </div>

          <div className="p-4 bg-[#FAF7F2] border border-stone-300 text-xs">
            <div className="flex items-center gap-2 mb-1.5 text-stone-900 font-bold uppercase tracking-wider text-[11px]">
              <Award className="w-3.5 h-3.5 text-[#BC5434]" />
              <span>Grassroots IP & Startups</span>
            </div>
            <div className="font-editorial-serif text-xl font-bold text-stone-900">19 Patents • 11 Startups</div>
            <p className="text-[11px] text-stone-600 font-serif italic mt-1.5 leading-relaxed">
              Incubated at BIT Mesra, NIT Jamshedpur & BAU, generating local youth employment.
            </p>
          </div>
        </div>
      </div>

      {/* Dual Charts: Thematic Domains & Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thematic Domain Distribution */}
        <div className="bg-white border border-stone-300 p-6 shadow-none flex flex-col justify-between lg:col-span-1">
          <div>
            <div className="flex items-center justify-between mb-5 border-b border-stone-200 pb-3">
              <h3 className="font-editorial-serif italic text-lg font-bold text-stone-900">
                Thematic Domain Breakdown
              </h3>
            </div>

            <div className="space-y-4">
              {(analytics?.domainStats || []).map((ds) => {
                const domainDef = THEMATIC_DOMAINS.find((t) => t.key === ds.domain);
                const percent = Math.round(((ds?.count || 0) / maxDomainCount) * 100);

                return (
                  <div key={ds.domain} className="text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-stone-900">
                        {domainDef?.label || (ds.domain || 'general').replace('_', ' ').toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-600 font-mono text-[11px]">{ds.count} logged</span>
                        <span className="text-[10px] text-[#BC5434] bg-[#FAF7F2] border border-stone-300 px-2 py-0.5 font-bold uppercase">
                          {ds.solvedCount} solved
                        </span>
                      </div>
                    </div>


                    <div className="w-full bg-stone-100 h-2 overflow-hidden border border-stone-200">
                      <div
                        className="bg-stone-900 h-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Geographic Distribution: 24 Districts of Jharkhand with Map */}
        <div className="bg-white border border-stone-300 p-6 shadow-none flex flex-col justify-between lg:col-span-2">
          <div>
            <div className="flex items-center justify-between mb-5 border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-editorial-serif italic text-lg font-bold text-stone-900">
                  District Ledger & Spatial Heatmap
                </h3>
                <span className="text-[11px] text-stone-500 font-serif italic">Across all 24 administrative districts</span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-stone-400 uppercase tracking-wider text-[10px]">Sort:</span>
                <button
                  onClick={() => setSelectedSortBy('challenges')}
                  className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider cursor-pointer border ${
                    selectedSortBy === 'challenges' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-stone-300'
                  }`}
                >
                  Challenges
                </button>
                <button
                  onClick={() => setSelectedSortBy('active')}
                  className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider cursor-pointer border ${
                    selectedSortBy === 'active' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-stone-300'
                  }`}
                >
                  Projects
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Map Visualization */}
              <div className="w-full md:w-1/2 min-h-[300px] border border-stone-200 bg-[#FAF7F2]">
                <JharkhandMap
                  districtStats={analytics?.districtStats || []}
                  onSelectDistrict={onSelectDistrictFilter}
                />
              </div>

              {/* District List */}
              <div className="w-full md:w-1/2 max-h-[380px] overflow-y-auto pr-2 space-y-2">
                {sortedDistricts.map((d, index) => {
                  const percent = Math.round(((d?.challengesCount || 0) / maxDistrictChallenges) * 100);
                  return (
                    <div
                      key={d?.district}
                      onClick={() => onSelectDistrictFilter && onSelectDistrictFilter(d?.district)}
                      className="p-3 bg-[#FAF7F2] hover:bg-stone-100 border border-stone-300 transition-colors cursor-pointer text-xs"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-stone-500 w-5">{index + 1}.</span>
                          <span className="font-bold text-stone-900">{d?.district}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-stone-700 font-mono text-[11px]">{d?.challengesCount} challenges</span>
                          <span className="text-[10px] px-2 py-0.5 border border-stone-400 bg-white text-stone-900 font-bold uppercase">
                            {d?.activeProjects} active
                          </span>
                        </div>
                      </div>


                      <div className="w-full bg-stone-200 h-1.5 overflow-hidden">
                        <div
                          className="bg-[#BC5434] h-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* University Participation Leaderboard */}
      <div className="bg-white border border-stone-300 p-6 shadow-none">
        <h3 className="flex items-center justify-between mb-4 border-b border-stone-200 pb-3">
          <span className="font-editorial-serif italic text-lg font-bold text-stone-900">
            Higher Education Institutions (HEIs) Experiential Research Leaderboard
          </span>
          <span className="editorial-meta !text-[10px] !mb-0">Ranked by Grassroots Adoptions</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {universities.map((u, i) => (
            <div key={u.id} className="p-4 border border-stone-300 bg-[#FAF7F2] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#BC5434] text-xs">#{i + 1}</span>
                <span className="editorial-tag !py-0.5 !px-2 !text-[9px]">
                  {u.type}
                </span>
              </div>
              <h4 className="font-editorial-serif font-bold text-stone-900 text-sm">{u.name}</h4>
              <div className="text-[11px] text-stone-600 font-serif italic">
                Incubation: <strong className="text-stone-900 not-italic font-sans">{u.incubationCenter}</strong> ({u.district})
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-[11px] font-mono text-stone-600">
                <span>Depts: <strong>{u.departments?.length || 0}</strong></span>
                <span>Mentors: <strong>{u.facultyMentors?.length || 0}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
