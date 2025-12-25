
import React, { useState, useMemo } from 'react';
import { LifeSnapshot, Mentor } from '../types';
import { MOCK_MENTORS } from '../constants';
import { ArrowRight, Star, ArrowLeft, Filter, Sparkles, Heart, Zap, Shield, Briefcase, Activity } from 'lucide-react';

interface Props {
  snapshot: LifeSnapshot;
  onSelectMentor: (mentor: Mentor) => void;
  onBack: () => void;
}

const State4Marketplace: React.FC<Props> = ({ snapshot, onSelectMentor, onBack }) => {
  const [filter, setFilter] = useState<'All' | 'Emotional' | 'Practical' | 'Strategic'>('All');

  // Intelligent Recommendation logic
  const recommendedId = useMemo(() => {
    const text = (snapshot.primary_theme + " " + snapshot.the_bottleneck).toLowerCase();
    if (text.includes("feel") || text.includes("sad") || text.includes("anxious")) return 'm1';
    if (text.includes("work") || text.includes("time") || text.includes("money")) return 'm2';
    if (text.includes("change") || text.includes("purpose") || text.includes("choice")) return 'm3';
    return null;
  }, [snapshot]);

  const filteredMentors = MOCK_MENTORS.filter(m => filter === 'All' || m.category === filter);

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'Emotional': return <Heart size={14} />;
      case 'Practical': return <Briefcase size={14} />;
      case 'Strategic': return <Zap size={14} />;
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
                We've matched your bottleneck with mentors specializing in these fields.
              </p>
            </div>
          </div>

          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
            {['All', 'Emotional', 'Practical', 'Strategic'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <div 
              key={mentor.id}
              onClick={() => onSelectMentor(mentor)}
              className={`group relative p-6 rounded-3xl transition-all duration-300 cursor-pointer border flex flex-col h-full overflow-hidden
                ${mentor.id === recommendedId 
                  ? 'bg-indigo-950/30 border-indigo-500 shadow-xl shadow-indigo-900/10' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850 shadow-sm'}`}
            >
              {mentor.id === recommendedId && (
                <div className="absolute top-0 right-0 p-3 bg-indigo-500 rounded-bl-2xl text-white">
                  <Sparkles size={16} fill="currentColor" />
                </div>
              )}

              <div className="flex items-start gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0
                  ${mentor.id === recommendedId ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
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

              <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-grow">
                {mentor.tagline}
              </p>

              <div className="space-y-4 pt-4 border-t border-slate-800/50 mt-auto">
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Expertise</span>
                    <span className="text-slate-300 font-bold">{mentor.specialty}</span>
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
                      View Profile <ArrowRight size={14} />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
             <p className="text-slate-500 font-medium">No mentors found in this pool yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default State4Marketplace;
