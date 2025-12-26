
import React, { useState, useMemo } from 'react';
import { LifeSnapshot, Mentor, MentorCategory } from '../types';
import { ArrowRight, Star, ArrowLeft, Heart, Zap, Briefcase, Activity, GraduationCap, Users, Brain, TrendingUp, ChevronDown, Command } from 'lucide-react';

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
    if (text.includes("work") || text.includes("career") || text.includes("job")) return 'Career Guidance';
    if (text.includes("feel") || text.includes("anxious") || text.includes("burnout") || text.includes("mental")) return 'Mental Health & Well-Being';
    if (text.includes("business") || text.includes("startup") || text.includes("product")) return 'Startup / Entrepreneurship';
    if (text.includes("relationship") || text.includes("friend") || text.includes("partner")) return 'Relationship Advice';
    if (text.includes("study") || text.includes("exam") || text.includes("school")) return 'Academic / Exam Stress';
    return 'General Listening / Peer Support';
  }, [snapshot]);

  const priorityCategories = useMemo(() => {
    const base = [matchedCategory];
    if (matchedCategory === 'Career Guidance') base.push('Workplace Issues', 'Life Coaching');
    if (matchedCategory === 'Mental Health & Well-Being') base.push('General Listening / Peer Support', 'Life Coaching');
    if (matchedCategory === 'Startup / Entrepreneurship') base.push('Career Guidance', 'Financial Guidance');
    return Array.from(new Set(base));
  }, [matchedCategory]);

  const displayedCategories = showAllCategories ? ALL_CATEGORIES : priorityCategories;
  const filteredMentors = customMentors.filter(m => filter === 'All' || m.category === filter);

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
    <div className="min-h-screen bg-paper p-12 md:p-20 page-arrival text-charcoal overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-6 flex-1">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-calm-500 transition-all text-sm font-medium"
            >
              <ArrowLeft size={16} />
              <span>Back to map</span>
            </button>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-calm-300">
                <Command size={16} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">UnLOOP Resolution Pool</span>
              </div>
              <h2 className="text-4xl font-medium tracking-tight">Meet your guides.</h2>
              <p className="text-slate-500 text-lg font-light leading-relaxed max-w-xl">
                We have prepared a selection of specialized guides who match your architectural core.
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-8">
           <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('All')}
                className={`px-8 py-3 rounded-full text-xs font-medium transition-all border ${
                  filter === 'All' ? 'bg-calm-500 border-calm-500 text-white shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:text-calm-500'
                }`}
              >
                Recommended
              </button>
              {displayedCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-8 py-3 rounded-full text-xs font-medium transition-all border flex items-center gap-3 ${
                    filter === cat ? 'bg-calm-500 border-calm-500 text-white shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:text-calm-500'
                  }`}
                >
                  {getCategoryIcon(cat)}
                  {cat}
                </button>
              ))}
              
              {!showAllCategories && (
                <button
                  onClick={() => setShowAllCategories(true)}
                  className="px-8 py-3 rounded-full text-xs font-medium text-slate-300 hover:text-calm-400 transition-all border border-dashed border-slate-100 flex items-center gap-2"
                >
                  <ChevronDown size={14} />
                  Explore all categories
                </button>
              )}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
          {filteredMentors.map((mentor) => (
            <div 
              key={mentor.id}
              onClick={() => onSelectMentor(mentor)}
              className={`group p-10 rounded-[40px] transition-all duration-500 cursor-pointer border bg-white calm-shadow hover:translate-y-[-4px]
                ${mentor.category === matchedCategory ? 'border-calm-100' : 'border-slate-50'}`}
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="w-14 h-14 bg-paper border border-slate-50 rounded-2xl flex items-center justify-center font-medium text-xl text-calm-500">
                  {mentor.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg group-hover:text-calm-500 transition-colors truncate">{mentor.name}</h3>
                  <div className="text-calm-300 text-[10px] font-semibold uppercase tracking-widest mt-1">
                    {mentor.category}
                  </div>
                </div>
              </div>

              <p className="text-slate-400 text-base leading-relaxed mb-10 font-light italic line-clamp-2">
                "{mentor.tagline}"
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                 <div className="flex items-center gap-1 text-slate-300">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-medium">{mentor.rating}</span>
                 </div>
                 <button className="text-calm-500 text-xs font-semibold uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                   View guide <ArrowRight size={16} />
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
