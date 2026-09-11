import React from 'react';
import { JHARKHAND_UNIVERSITIES } from '../data/jharkhandData';
import { GraduationCap, BookOpen, Lightbulb, Globe, Landmark, Users } from 'lucide-react';

const PREMIER_HEIs = [
  'Birla Institute of Technology (BIT) Mesra',
  'Indian Institute of Technology (ISM) Dhanbad',
  'Birsa Agricultural University (BAU)',
  'National Institute of Technology (NIT) Jamshedpur',
  'All India Institute of Medical Sciences (AIIMS) Deoghar',
  'Central University of Jharkhand (CUJ)',
];

export default function About() {
  const premierUniversities = JHARKHAND_UNIVERSITIES.filter(uni =>
    PREMIER_HEIs.includes(uni.name)
  );

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto py-12">
        <h1 className="text-4xl md:text-5xl font-editorial-serif italic font-bold text-stone-900 mb-6">
          About Samadhan.JH
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed font-serif">
          A state-led initiative to bridge the gap between grassroots societal challenges
          and academic rigor, fostering a culture of innovation that directly impacts
          the lives of citizens across Jharkhand.
        </p>
      </section>

      {/* NEP 2020 Section */}
      <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#BC5434]/5 rounded-full -mr-16 -mt-16 blur-3xl" />

        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 text-[#BC5434] font-bold uppercase tracking-widest text-xs mb-4">
              <BookOpen className="w-4 h-4" />
              <span>The Vision</span>
            </div>
            <h2 className="text-3xl font-editorial-serif italic font-bold text-stone-900 mb-6">
              NEP 2020 & Grassroots Innovation
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6 font-serif">
              The <span className="font-bold text-stone-900">National Education Policy (NEP) 2020</span>
              reimagines higher education as a catalyst for societal transformation. Samadhan.JH
              operationalizes this vision through three core pillars:
            </p>
            <ul className="space-y-4">
              {[
                { icon: Globe, title: 'Experiential Learning', desc: 'Moving beyond textbooks to real-world problem solving in tribal and rural landscapes.' },
                { icon: Users, title: 'Multidisciplinary Field Research', desc: 'Integrating engineering, medicine, agriculture, and social sciences to solve complex challenges.' },
                { icon: Lightbulb, title: 'Grassroots Incubation', desc: 'Transforming student-led prototypes into scalable solutions through industry CSR partnerships.' },
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4 p-3 rounded-xl hover:bg-stone-50 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#BC5434]/10 rounded-lg flex items-center justify-center text-[#BC5434]">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-stone-900 text-sm">{item.title}</span>
                    <span className="block text-stone-500 text-xs leading-relaxed">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-stone-50 rounded-2xl p-8 border border-stone-100 italic font-serif text-stone-600 text-center relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-white border border-stone-200 rounded-full flex items-center justify-center text-stone-400">
              <span className="text-xl">“</span>
            </div>
            <p className="text-lg relative z-10">
              "Education is not just about degrees, but about the capacity to solve
              the problems of the land one belongs to."
            </p>
            <div className="mt-4 font-bold text-stone-900 not-italic text-sm uppercase tracking-wider">
              — Vision for a New Jharkhand
            </div>
          </div>
        </div>
      </section>

      {/* Premier HEIs Section */}
      <section className="space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 text-[#BC5434] font-bold uppercase tracking-widest text-xs mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>Knowledge Hubs</span>
          </div>
          <h2 className="text-3xl font-editorial-serif italic font-bold text-stone-900">
            6 Premier Jharkhand HEIs
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premierUniversities.map((uni) => (
            <div key={uni.id} className="group bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-stone-50 rounded-lg group-hover:bg-[#BC5434]/10 transition-colors">
                  <Landmark className="w-6 h-6 text-stone-400 group-hover:text-[#BC5434]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter px-2 py-1 bg-stone-100 text-stone-500 rounded">
                  {uni.type}
                </span>
              </div>
              <h3 className="font-editorial-serif italic font-bold text-lg text-stone-900 mb-2 group-hover:text-[#BC5434] transition-colors">
                {uni.name}
              </h3>
              <p className="text-xs text-stone-500 mb-4 line-clamp-2">
                Established in {uni.establishedYear}, specializing in {uni.specializationDomains.join(', ').replace(/_/g, ' ')}.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                  {uni.district}
                </span>
                <a
                  href={uni.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#BC5434] hover:underline"
                >
                  Visit Website &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
