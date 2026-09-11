import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useAppContext } from '../AppContext';
import { JharkhandMap } from '../components/JharkhandMap';
import { Compass, Sparkles, GraduationCap, Briefcase, Layers, BarChart3, Plus } from 'lucide-react';

interface HomeCard {
  title: string;
  description: string;
  route: string;
  tag: string;
  stat: string;
  icon: React.ElementType;
  translationKey: string;
}

const HOME_CARDS: HomeCard[] = [
  {
    title: 'Challenge Registry',
    description: 'Explore real-world societal problems submitted by citizens and panchayats across Jharkhand.',
    route: '/challenges',
    tag: ' Problems ',
    stat: '247 Active Challenges',
    icon: Compass,
    translationKey: 'challenge_registry',
  },
  {
    title: 'AI Triage System',
    description: 'Our intelligent engine matching challenges to the best-suited HEI and industry partner.',
    route: '/ai-triage',
    tag: ' Intelligence ',
    stat: '94% Match Accuracy',
    icon: Sparkles,
    translationKey: 'ai_triage',
  },
  {
    title: 'University Hub',
    description: 'Connect with academic institutions and faculty mentors specializing in regional innovation.',
    route: '/university',
    tag: ' Academia ',
    stat: '8+ Partner HEIs',
    icon: GraduationCap,
    translationKey: 'university_hub',
  },
  {
    title: 'Industry Partners',
    description: 'Collaborate with CSR wings and industrial giants providing funding and pilot sites.',
    route: '/industry',
    tag: ' Industry ',
    stat: '6 Major Partners',
    icon: Briefcase,
    translationKey: 'industry_partners',
  },
  {
    title: 'Project Lifecycle',
    description: 'Track the journey from problem validation to prototyping and field deployment.',
    route: '/lifecycle',
    tag: ' Process ',
    stat: '68 Active Prototypes',
    icon: Layers,
    translationKey: 'project_lifecycle',
  },
  {
    title: 'Impact Analytics',
    description: 'Quantifiable metrics on how innovation is transforming lives in tribal and rural blocks.',
    route: '/analytics',
    tag: ' Data ',
    stat: '184k+ Lives Impacted',
    icon: BarChart3,
    translationKey: 'impact_analytics',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { analytics, setMapFilter } = useAppContext();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <header className="text-center mb-16">
        <span className="editorial-meta block mb-4">{t('initiative')}</span>
        <h1 className="font-editorial-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 text-[#1A1A1A]">
          {t('title').split(' ').slice(0, -2).join(' ')} <br />
          <span className="text-[#BC5434]">{t('title').split(' ').slice(-2).join(' ')}</span>
        </h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-12 font-light">
          {t('subtitle')}
        </p>

        <div className="flex flex-col items-center gap-8">
          <button
            onClick={() => navigate('/submit-challenge')}
            className="inline-flex items-center gap-2 bg-[#BC5434] hover:bg-[#A3452B] text-white text-sm font-bold uppercase tracking-[0.2em] px-8 py-4 shadow-lg transition-all duration-300 cursor-pointer active:scale-95 mb-4"
          >
            <Plus className="w-5 h-5" />
            <span>{t('submit_challenge')}</span>
          </button>

          <div className="relative w-full max-w-4xl">
            <JharkhandMap
              districtStats={analytics?.districtStats || []}
              onSelectDistrict={(district) => {
                setMapFilter({ type: 'district', value: district });
                navigate('/challenges');
              }}
              onSelectInstitution={(inst) => {
                setMapFilter({ type: inst.type, value: inst.id });
                navigate('/challenges');
              }}
            />
          </div>
        </div>
      </header>

      {/* Navigation Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {HOME_CARDS.map((card) => (
          <div
            key={card.route}
            onClick={() => navigate(card.route)}
            className="group block p-6 bg-white border border-stone-200 transition-all duration-300 hover:border-[#BC5434] hover:shadow-sm cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FAF7F2] border border-stone-200 group-hover:bg-[#BC5434] group-hover:text-white transition-all duration-300">
                  <card.icon className="w-4 h-4" />
                </div>
                <span className="editorial-tag group-hover:bg-[#BC5434] group-hover:text-white transition-all duration-300">
                  {t(card.translationKey + '_tag')}
                </span>
              </div>
            </div>
            <h3 className="font-editorial-serif text-2xl font-bold mb-3 group-hover:text-[#BC5434] transition-colors">
              {t(card.translationKey)}
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed mb-8">
              {t(card.translationKey + '_desc')}
            </p>
            <div className="editorial-stat-card">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                {t(card.translationKey + '_stat')}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Footer CTA */}
      <footer className="mt-20 text-center border-t border-stone-200 pt-12">
        <p className="text-sm text-stone-600 mb-4">{t('spirit')}</p>
        <div className="flex justify-center gap-4">
          <span className="editorial-tag">{t('nep_aligned')}</span>
          <span className="editorial-tag">{t('open_innovation')}</span>
        </div>
      </footer>
    </div>
  );
}
