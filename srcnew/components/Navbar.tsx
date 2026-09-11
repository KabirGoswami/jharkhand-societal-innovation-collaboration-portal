import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  GraduationCap,
  Briefcase,
  Layers,
  BarChart3,
  Search,
  Plus,
  ShieldCheck,
  Building2,
  Users,
  Compass,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { SubmitterType } from '../types';

interface NavbarProps {
  userRole: 'citizen' | 'university' | 'industry' | 'admin';
  setUserRole: (role: 'citizen' | 'university' | 'industry' | 'admin') => void;
  onOpenSubmitModal: () => void;
  onSearchTrackingCode: (code: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userRole,
  setUserRole,
  onOpenSubmitModal,
  onSearchTrackingCode,
}) => {
  const navigate = useNavigate();
  const [trackingInput, setTrackingInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      onSearchTrackingCode(trackingInput.trim());
      setTrackingInput('');
    }
  };

  return (
    <header id="portal-header" className="sticky top-0 z-40 bg-[#1A1A1A] text-stone-100 border-b border-stone-800 shadow-sm">
      {/* Top Banner: Jharkhand State & NEP 2020 Accreditation */}
      <div className="bg-[#111111] px-4 py-1.5 border-b border-stone-800 text-[11px] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 border border-[#BC5434]/50 bg-[#BC5434]/15 text-[#E07A5F] font-bold tracking-wider uppercase text-[10px]">
            Govt. of Jharkhand
          </span>
          <span className="text-stone-400 font-serif italic hidden sm:inline">
            Department of Higher & Technical Education • State Innovation Council
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-stone-300 font-medium text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BC5434]"></span>
            <span className="uppercase tracking-wider text-[10px] font-semibold text-stone-400">NEP 2020 Experiential Framework</span>
          </span>
          <div className="h-3 w-px bg-stone-800 hidden sm:block"></div>
          <div className="flex items-center gap-1.5 text-stone-300">
            <span className="text-stone-400 text-[11px] uppercase tracking-wider font-semibold">Role:</span>
            <select
              id="role-selector-dropdown"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as any)}
              className="bg-[#242424] text-stone-200 font-medium text-xs px-2 py-0.5 border border-stone-700 focus:outline-none focus:border-[#BC5434] cursor-pointer"
            >
              <option value="citizen">Citizen / Gram Panchayat / ULB</option>
              <option value="university">University / Faculty / Students</option>
              <option value="industry">Industry / Startup / CSR Partner</option>
              <option value="admin">Government / State Triage Officer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand: Editorial Masthead */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 border border-stone-700 bg-stone-900 flex items-center justify-center text-white">
              <span className="font-editorial-serif text-lg font-bold italic text-[#E07A5F]">JH</span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-editorial-serif italic text-2xl font-bold tracking-tight text-white">
                  Samadhan.JH
                </span>
                <span className="text-[10px] uppercase font-bold tracking-[2px] text-[#BC5434] hidden sm:inline">
                  Societal Innovation
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-serif italic hidden md:block">
                Grassroots Challenges • Academic Research • Industry CSR Co-Development
              </p>
            </div>
          </div>

          {/* Quick Tracking Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative max-w-xs w-full">
            <input
              id="tracking-search-input"
              type="text"
              placeholder="Track Challenge ID (e.g. JH-RNC...)"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              className="w-full bg-stone-900 text-xs text-stone-100 placeholder-stone-500 pl-8 pr-3 py-2 border border-stone-700 focus:outline-none focus:border-[#BC5434] transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
          </form>

          {/* Action Button Area */}
          <div className="flex items-center gap-2">
          </div>
        </div>
        {/* Tab Navigation Menu */}
        <nav id="portal-tab-navigation" className="flex overflow-x-auto space-x-1 py-0 no-scrollbar border-t border-stone-800 text-[11px] font-bold tracking-wider uppercase">
          <NavLink
            id="tab-nav-challenges"
            to="/challenges"
            className={({ isActive }) =>
              `px-3 py-2.5 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer border-b-2 ${
                isActive
                  ? 'border-[#BC5434] text-white bg-stone-900/60 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/30'
              }`
            }
          >
            <Compass className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>Community Challenges</span>
          </NavLink>
          <NavLink
            id="tab-nav-ai-triage"
            to="/ai-triage"
            className={({ isActive }) =>
              `px-3 py-2.5 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer border-b-2 ${
                isActive
                  ? 'border-[#BC5434] text-white bg-stone-900/60 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/30'
              }`
            }
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>AI Triage & HEI Routing</span>
          </NavLink>
          <NavLink
            id="tab-nav-university"
            to="/university"
            className={({ isActive }) =>
              `px-3 py-2.5 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer border-b-2 ${
                isActive
                  ? 'border-[#BC5434] text-white bg-stone-900/60 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/30'
              }`
            }
          >
            <GraduationCap className="w-3.5 h-3.5 text-stone-300" />
            <span>University Innovation (HEIs)</span>
          </NavLink>
          <NavLink
            id="tab-nav-industry"
            to="/industry"
            className={({ isActive }) =>
              `px-3 py-2.5 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer border-b-2 ${
                isActive
                  ? 'border-[#BC5434] text-white bg-stone-900/60 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/30'
              }`
            }
          >
            <Briefcase className="w-3.5 h-3.5 text-stone-300" />
            <span>Industry & CSR Hub</span>
          </NavLink>
          <NavLink
            id="tab-nav-lifecycle"
            to="/lifecycle"
            className={({ isActive }) =>
              `px-3 py-2.5 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer border-b-2 ${
                isActive
                  ? 'border-[#BC5434] text-white bg-stone-900/60 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/30'
              }`
            }
          >
            <Layers className="w-3.5 h-3.5 text-stone-300" />
            <span>Project Lifecycle & IP</span>
          </NavLink>
          <NavLink
            id="tab-nav-analytics"
            to="/analytics"
            className={({ isActive }) =>
              `px-3 py-2.5 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer border-b-2 ${
                isActive
                  ? 'border-[#BC5434] text-white bg-stone-900/60 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/30'
              }`
            }
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>Visual Analytics & Heatmap</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
export default Navbar;