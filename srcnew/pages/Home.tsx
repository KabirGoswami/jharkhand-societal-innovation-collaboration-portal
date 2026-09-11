import React from 'react';
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  GraduationCap,
  Briefcase,
  Layers,
  BarChart3,
  Users,
  Plus
} from 'lucide-react';
import JharkhandMap from '../components/JharkhandMap';


const Home: React.FC = () => {
  const { setIsSubmitModalOpen } = useOutletContext<any>();
  const navCards = [
    {
      title: 'Challenge Registry',
      description: 'Explore real-world societal problems submitted by citizens and panchayats across Jharkhand.',
      path: '/challenges',
      tag: ' Problems ',
      stat: '247 Active Challenges',
      icon: Compass,
    },
    {
      title: 'University Hub',
      description: 'Connect with academic institutions and faculty mentors specializing in regional innovation.',
      path: '/universities',
      tag: ' Academia ',
      stat: '8+ Partner HEIs',
      icon: GraduationCap,
    },
    {
      title: 'Industry Partners',
      description: 'Collaborate with CSR wings and industrial giants providing funding and pilot sites.',
      path: '/industry',
      tag: ' Industry ',
      stat: '6 Major Partners',
      icon: Briefcase,
    },
    {
      title: 'Impact Analytics',
      description: 'Quantifiable metrics on how innovation is transforming lives in tribal and rural blocks.',
      path: '/analytics',
      tag: ' Data ',
      stat: '184k+ Lives Impacted',
      icon: BarChart3,
    },
    {
      title: 'Community Forum',
      description: 'Join multidisciplinary discussions between students, experts, and grassroots reporters.',
      path: '/community',
      tag: ' Discourse ',
      stat: '1.2k Active Threads',
      icon: Users,
    },
    {
      title: 'Project Lifecycle',
      description: 'Track the journey from problem validation to prototyping and field deployment.',
      path: '/lifecycle',
      tag: ' Process ',
      stat: '68 Active Prototypes',
      icon: Layers,
    },
    {
      title: 'AI Triage System',
      description: 'Our intelligent engine matching challenges to the best-suited HEI and industry partner.',
      path: '/ai-triage',
      tag: ' Intelligence ',
      stat: '94% Match Accuracy',
      icon: Sparkles,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <header className="text-center mb-16">
        <span className="editorial-meta block mb-4">Jharkhand State Initiative</span>
        <h1 className="font-editorial-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 text-ink">
          Societal Innovation <br />
          <span className="text-accent">Collaboration Portal</span>
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto mb-12 font-light">
          A multidisciplinary ecosystem bridging the gap between grassroots challenges,
          academic excellence, and industrial support to drive regional transformation.
        </p>

        <div className="flex flex-col items-center gap-8">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-bold uppercase tracking-[0.2em] px-8 py-4 shadow-lg transition-all duration-300 cursor-pointer active:scale-95 mb-4"
          >
            <Plus className="w-5 h-5" />
            <span>Submit a Grassroots Challenge</span>
          </button>

          <div className="relative w-full max-w-4xl">
            <JharkhandMap />
          </div>
        </div>
      </header>

      {/* Navigation Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {navCards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            className="group block p-6 bg-white border border-border transition-all duration-300 hover:border-accent hover:shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-paper-tint border border-border group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <card.icon className="w-4 h-4" />
                </div>
                <span className="editorial-tag group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  {card.tag}
                </span>
              </div>
            </div>
            <h3 className="font-editorial-serif text-2xl font-bold mb-3 group-hover:text-accent transition-colors">
              {card.title}
            </h3>
            <p className="text-muted text-sm leading-relaxed mb-8">
              {card.description}
            </p>
            <div className="editorial-stat-card">
              <span className="text-xs font-bold uppercase tracking-widest text-ink">
                {card.stat}
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Footer CTA */}
      <footer className="mt-20 text-center border-t border-border pt-12">
        <p className="text-sm text-muted mb-4">Driven by the spirit of "Jan Bhagidari" and academic rigor.</p>
        <div className="flex justify-center gap-4">
          <span className="editorial-tag">NEP 2020 Aligned</span>
          <span className="editorial-tag">Open Innovation</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
