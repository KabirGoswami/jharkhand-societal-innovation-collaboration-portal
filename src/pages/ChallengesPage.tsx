import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useAppContext } from '../AppContext';
import { CitizenModule } from '../components/CitizenModule';

export default function ChallengesPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const {
    problems,
    handleUpvote,
    setSelectedProblem,
    trackingFilterCode,
    setTrackingFilterCode,
    handleSearchTrackingCode,
    mapFilter,
    setMapFilter,
  } = useAppContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-start mb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#BC5434] hover:text-[#A3452B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>{t('back_to_home')}</span>
        </button>
      </div>

      <CitizenModule
        problems={problems}
        onOpenSubmitModal={() => navigate('/submit-challenge')}
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
    </div>
  );
}
