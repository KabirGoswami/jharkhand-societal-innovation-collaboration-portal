import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useAppContext } from '../AppContext';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const {
    analytics,
    universities,
    problems,
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

      <AnalyticsDashboard
        analytics={analytics}
        universities={universities}
        problems={problems}
        onSelectDistrictFilter={() => {
          navigate('/challenges');
        }}
      />
    </div>
  );
}
