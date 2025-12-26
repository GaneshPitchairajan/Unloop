
import React, { useState, useMemo } from 'react';
import { LifeSnapshot, Mentor, MentorCategory } from '../types';
import { ArrowRight, Star, ArrowLeft, Filter, Sparkles, Heart, Zap, Shield, Briefcase, Activity, GraduationCap, Users, Brain, TrendingUp, Handshake } from 'lucide-react';

interface Props {
  snapshot: LifeSnapshot;
  customMentors?: Mentor[];
  onSelectMentor: (mentor: Mentor) => void;
  onBack: () => void;
}

const CATEGORIES: MentorCategory[] = [
  'Career Guidance', 
  'Mental Health & Well-Being', 
  'Relationship Advice', 
  'Academic / Exam Stress', 
  'Workplace Issues', 
  'Life Coaching', 
  'Technical / Skill Mentorship', 
  'Financial Guidance', 
  'Startup / Entrepreneurship', 
  'General Listening / Peer Support'
];

const State4Marketplace: React.FC<Props> = ({ snapshot, customMentors = [], onSelectMentor, onBack }) => {
  const [filter, setFilter] = useState<MentorCategory | 'All'>('All');

  const recommendedCategory = useMemo(() => {
    const text = (snapshot.primary_theme + " " + snapshot.the_bottleneck).toLowerCase();
    if (text.includes("work") || text.includes("career") || text.includes("job")) return 'Career Guidance';
    if (text.includes("feel") || text.includes("anxious") || text.includes("burnout") || text.includes("mental")) return 'Mental Health & Well-Being';
    if (text.includes("business") || text.includes("startup") || text.includes("product")) return 'Startup / Entrepreneurship';
    if (text.includes("relationship") || text.includes("friend") || text.includes("partner")) return 'Relationship Advice';
    if (text.includes("study") || text.includes("exam") || text.includes("school")) return 'Academic / Exam Stress';
    return 'General Listening / Peer Support';
  }, [snapshot]);

  const allAvailableMentors = useMemo(() => {
    return customMentors;
  }, [customMentors]);

  const filteredMentors = allAvailableMentors.filter(m => filter === 'All' || m.category === filter);

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'Mental Health & Well-Being': return <Brain size={14} />;
      case 'Workplace Issues': return <Briefcase size={14} />;
      case 'Career Guidance': return <TrendingUp size={14} />;
      case 'Startup / Entrepreneurship': return <Zap size={14} />;
      case 'Relationship Advice': return <Users size={14} />;
      case 'Academic / Exam Stress': return <GraduationCap size={14} />;
      case 'General Listening / Peer Support': return <Heart size={14} />;
      default: return <Activity size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 fade-in text-slate-100">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex gap-6">
            <button 
              onClick={onBack}
              className="mt-1 p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-600 transition-all h-fit"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-4xl font-semibold tracking-tight">Expertise Pools</h2>
              <p className="text-slate-400 mt-2 text-lg font-light max-w-xl">
                Matched categories based on your bottleneck: <span className="text-indigo-400 font-bold">"{recommendedCategory}"</span>
              </p>
            </div>
          </div>
        </header>

        {/* Filter Section */}
        <div className="mb-10 flex flex-wrap gap-2">
           <button
             onClick={() => setFilter('All')}
             className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
               filter === 'All' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
             }`}
           >
             All
           </button>
           {CATEGORIES.map((cat) => (
             <button
               key={cat}
               onClick={() => setFilter(cat)}
               className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 ${
                 filter === cat ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
               } ${cat === recommendedCategory && filter !== cat ? 'ring-2 ring-indigo-500/50' : ''}`}
             >
               {getCategoryIcon(cat)}
               {cat}
               {cat === recommendedCategory && filter !== cat && <Sparkles size={10} className="text-indigo-400" />}
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <div 
              key={mentor.id}
              onClick={() => onSelectMentor(mentor)}
              className={`group relative p-6 rounded-3xl transition-all duration-300 cursor-pointer border flex flex-col h-full overflow-hidden
                ${mentor.category === recommendedCategory 
                  ? 'bg-indigo-950/30 border-indigo-500/50 shadow-xl shadow-indigo-900/10' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850 shadow-sm'}`}
            >
              {mentor.category === recommendedCategory && (
                <div className="absolute top-0 right-0 p-3 bg-indigo-500 rounded-bl-2xl text-white z-10">
                  <Sparkles size={16} fill="currentColor" />
                </div>
              )}

              <div className="flex items-start gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0
                  ${mentor.category === recommendedCategory ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {mentor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg group-hover:text-indigo-400 transition-colors">{mentor.name}</h3>
                  <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                    {getCategoryIcon(mentor.category)}
                    {mentor.category}
                  </div>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                {mentor.tagline}
              </p>

              <div className="space-y-4 pt-4 border-t border-slate-800/50 mt-auto">
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Expertise</span>
                    <span className="text-slate-300 font-bold truncate ml-2">{mentor.specialty}</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Availability</span>
                    <span className="text-emerald-500 font-bold">{mentor.availability}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-400">
                       <Star size={12} fill="currentColor" />
                       <span className="text-xs font-bold">{mentor.rating}</span>
                    </div>
                    <button className="text-indigo-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                      Profile <ArrowRight size={14} />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/50">
             <Filter size={40} className="mx-auto text-slate-700 mb-4" />
             <p className="text-slate-500 font-medium">No mentors available in this pool yet.</p>
             <button onClick={() => setFilter('All')} className="mt-4 text-indigo-400 text-sm font-bold underline">Show all available mentors</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default State4Marketplace;
