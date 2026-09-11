import React, { useState } from 'react';
import { MessageSquare, Users, Search, Loader2 } from 'lucide-react';
import { DiscussionThread } from './DiscussionThread';
import { ProblemStatement } from '../types';

interface CommunicationHubProps {
  problems: ProblemStatement[];
  currentUserRole: 'citizen' | 'university' | 'industry' | 'admin';
}

export const CommunicationHub: React.FC<CommunicationHubProps> = ({
  problems,
  currentUserRole,
}) => {
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProblems = problems.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.trackingCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedProblem = problems.find((p) => p.id === selectedProblemId);

  return (
    <div className="flex h-[calc(100vh-200px)] gap-6">
      {/* Problem List Sidebar */}
      <div className="w-1/3 bg-white border border-stone-300 flex flex-col shadow-none">
        <div className="p-4 border-b border-stone-300 bg-[#FDFCFB]">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#BC5434]" />
            <h3 className="font-editorial-serif italic font-bold text-lg text-stone-900">Collaborative Hub</h3>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 bg-[#FAF7F2] focus:outline-none focus:border-stone-900"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredProblems.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-xs font-serif italic">
              No challenges found matching your search.
            </div>
          ) : (
            filteredProblems.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProblemId(p.id)}
                className={`w-full text-left p-3 border transition-all ${
                  selectedProblemId === p.id
                    ? 'bg-[#FAF7F2] border-[#BC5434] ring-1 ring-[#BC5434]'
                    : 'bg-white border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-tighter">{p.trackingCode}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-stone-100 text-stone-600 border border-stone-200 rounded">
                    {p.upvotesCount} upvotes
                  </span>
                </div>
                <h4 className={`text-xs font-bold mt-1 leading-tight ${
                  selectedProblemId === p.id ? 'text-[#BC5434]' : 'text-stone-900'
                }`}>
                  {p.title}
                </h4>
                <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 font-serif italic">
                  {p.description}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Thread Area */}
      <div className="flex-1 flex flex-col">
        {selectedProblem ? (
          <div className="flex flex-col h-full">
            <div className="mb-4 p-4 bg-white border border-stone-300 shadow-none">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-[#BC5434]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">Active Discussion</span>
              </div>
              <h2 className="font-editorial-serif italic font-bold text-2xl text-stone-900">
                {selectedProblem.title}
              </h2>
              <p className="text-xs text-stone-500 mt-1 font-serif italic">
                Tracking ID: {selectedProblem.trackingCode} • Status: {selectedProblem.status.replace('_', ' ')}
              </p>
            </div>
            <div className="flex-1">
              <DiscussionThread
                problemId={selectedProblem.id}
                problemTitle={selectedProblem.title}
                currentUserRole={currentUserRole}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-stone-400 bg-stone-50 border border-dashed border-stone-300">
            <MessageSquare className="w-12 h-12 text-stone-200 mb-4" />
            <p className="text-sm font-serif italic">Select a challenge from the hub to start collaborating</p>
          </div>
        )}
      </div>
    </div>
  );
};
