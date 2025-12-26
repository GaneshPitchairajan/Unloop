
import React, { useState, useMemo } from 'react';
import { LifeSnapshot, Mentor, MentorCategory } from '../types';
import { ArrowRight, Star, ArrowLeft, Heart, Zap, Briefcase, Activity, GraduationCap, Users, Brain, TrendingUp, ChevronDown, Command, CheckCircle } from 'lucide-react';

interface Props {
  snapshot: LifeSnapshot;
  customMentors?: Mentor[];
  onSelectMentor: (mentor: Mentor) => void;
  onBack: () => void;
}

const ALL_CATEGORIES: MentorCategory[] = [
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
  const [showAllCategories, setShowAllCategories] = useState(false);

  const matchedCategory = useMemo(() => {
    const text = (snapshot.primary_theme + " " + snapshot.the_bottleneck).toLowerCase();
    if (text.includes("work") || text.includes("career") || text.includes("job") || text.includes("profession")) return 'Career Guidance';
    if (text.includes("feel") || text.includes("anxious") || text.includes("burnout") || text.includes("mental") || text.includes("stress")) return 'Mental Health & Well-Being';
    if (text.includes("business") || text.includes("startup") || text.includes("product") || text.includes("funding")) return 'Startup / Entrepreneurship';
    if (text.includes("relationship") || text.includes("friend") || text.includes("partner") || text.includes("divorce")) return 'Relationship Advice';
    if (text.includes("study") || text.includes("exam") || text.includes("school") || text.includes("academic")) return 'Academic / Exam Stress';
    return 'General Listening / Peer Support';
  }, [snapshot]);

  // Enhanced sorting logic to prioritize category matches first
  const sortedMentors = useMemo(() => {
    return [...customMentors].sort((a, b) => {
      if (a.category === matchedCategory && b.category !== matchedCategory) return -1;
      if (b.category === matchedCategory && a.category !== matchedCategory) return 1;
      return b.rating - a.rating;
    });
  }, [customMentors, matchedCategory]);

  const priorityCategories = useMemo(() => {
    const base = [matchedCategory];
    if (matchedCategory === 'Career Guidance') base.push('Workplace Issues', 'Life Coaching');
    if (matchedCategory === 'Mental Health & Well-Being') base.push('General Listening / Peer Support', 'Life Coaching');
    if (matchedCategory === 'Startup / Entrepreneurship') base.push('Career Guidance', 'Financial Guidance');
    return Array.from(new Set(base));
  }, [matchedCategory]);

  const displayedCategories = showAllCategories ? ALL_CATEGORIES : priorityCategories;
  const filteredMentors = sortedMentors.filter(m => filter === 'All' || m.category === filter);

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'Mental Health & Well-Being': return <Brain size={16} />;
      case 'Workplace Issues': return <Briefcase size={16} />;
      case 'Career Guidance': return <TrendingUp size={16} />;
      case 'Startup / Entrepreneurship': return <Zap size={16} />;
      case 'Relationship Advice': return <Users size={16} />;
      case 'Academic / Exam Stress': return <GraduationCap size={16} />;
      case 'General Listening / Peer Support': return <Heart size={16} />;
      default: return <Activity size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-void p-12 md:p-24 page-arrival text-high overflow-y-auto no-scrollbar">
      <div className="max-w-7xl mx-auto space-y-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-16 relative">
          <div className="space-y-8 flex-1">
            <button 
              onClick={onBack}
              className="flex items-center gap-3 text-dim hover:text-resolution-cyan transition-all text-sm font-black uppercase tracking-[0.3em]"
            >
              <ArrowLeft size={20} />
              <span>Back to Blueprint</span>
            </button>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-resolution-indigo">
                <Command size={24} />
                <span className="text-[12px] font-black uppercase tracking-[0.5em]">Global Guide Matrix</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">Select Your <span className="text-dim">Consultant.</span></h2>
              <p className="text-dim text-2xl font-light leading-relaxed max-w-2xl">
                The matrix has filtered {customMentors.length} professional guides aligned with your core bottleneck.
              </p>
            </div>
          </div>
        </header>

        {/* Matrix Filtering */}
        <div className="space-y-10">
           <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setFilter('All')}
                className={`px-10 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all border ${
                  filter === 'All' ? 'bg-resolution-indigo border-resolution-indigo text-white shadow-2xl' : 'bg-sanctuary border-slate-800 text-dim hover:border-slate-600'
                }`}
              >
                Full Matrix
              </button>
              {displayedCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-8 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all border flex items-center gap-4 ${
                    filter === cat ? 'bg-resolution-indigo border-resolution-indigo text-white shadow-2xl' : 'bg-sanctuary border-slate-800 text-dim hover:border-slate-600'
                  }`}
                >
                  {getCategoryIcon(cat)}
                  {cat}
                </button>
              ))}
              
              {!showAllCategories && (
                <button
                  onClick={() => setShowAllCategories(true)}
                  className="px-8 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] text-slate-700 hover:text-resolution-cyan transition-all border border-dashed border-slate-800 flex items-center gap-3"
                >
                  <ChevronDown size={18} />
                  More Sectors
                </button>
              )}
           </div>
        </div>

        {/* Guide Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-48">
          {filteredMentors.map((mentor) => (
            <div 
              key={mentor.id}
              onClick={() => onSelectMentor(mentor)}
              className={`group relative p-10 rounded-[50px] transition-all duration-700 cursor-pointer border bg-sanctuary shadow-3xl hover:-translate-y-4 hover:shadow-resolution-indigo/10 flex flex-col
                ${mentor.category === matchedCategory ? 'border-resolution-indigo/40 ring-1 ring-resolution-indigo/20' : 'border-slate-800/40'}`}
            >
              {/* Card Header Container to avoid overlap */}
              <div className="flex justify-between items-start mb-10 w-full overflow-hidden">
                <div className="w-16 h-16 bg-void border border-slate-800 rounded-[24px] flex items-center justify-center font-black text-2xl text-resolution-indigo shadow-inner group-hover:border-resolution-cyan transition-colors duration-500 shrink-0">
                  {mentor.name.charAt(0)}
                </div>
                
                {mentor.category === matchedCategory && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-resolution-cyan/10 border border-resolution-cyan/20 rounded-full text-[9px] font-black text-resolution-cyan uppercase tracking-widest shrink-0">
                    <CheckCircle size={10} />
                    Logical Match
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4 mb-10">
                <h3 className="font-black text-2xl group-hover:text-resolution-cyan transition-colors truncate text-white leading-tight pr-2">
                  {mentor.name}
                </h3>
                <div className="text-dim text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                  <Activity size={10} className="text-resolution-indigo" />
                  {mentor.category}
                </div>
                <p className="text-dim text-base leading-relaxed font-light italic line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity">
                  "{mentor.tagline}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-slate-800/60 mt-auto">
                 <div className="flex items-center gap-2 text-yellow-500/80">
                    <Star size={16} fill="currentColor" />
                    <span className="text-base font-black tracking-tight">{mentor.rating}</span>
                 </div>
                 <button className="text-high text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 group-hover:gap-5 transition-all group-hover:text-resolution-cyan">
                   Review Profile <ArrowRight size={18} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default State4Marketplace;
