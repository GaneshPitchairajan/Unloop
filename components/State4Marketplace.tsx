import React from 'react';
import { LifeSnapshot, Mentor } from '../types';
import { MOCK_MENTORS } from '../constants';
import { User, ArrowRight, Star, ArrowLeft } from 'lucide-react';

interface Props {
  snapshot: LifeSnapshot;
  onSelectMentor: (mentor: Mentor) => void;
  onBack: () => void;
}

const State4Marketplace: React.FC<Props> = ({ snapshot, onSelectMentor, onBack }) => {
  const recommendedId = snapshot.the_bottleneck.toLowerCase().includes("feel") || snapshot.the_bottleneck.toLowerCase().includes("emotion") 
    ? 'm1' // Listener
    : snapshot.the_bottleneck.toLowerCase().includes("work") || snapshot.the_bottleneck.toLowerCase().includes("time") 
    ? 'm2' // Strategist
    : 'm3'; // Architect

  const sortedMentors = [
    ...MOCK_MENTORS.filter(m => m.id === recommendedId),
    ...MOCK_MENTORS.filter(m => m.id !== recommendedId)
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 flex gap-6">
          <button 
            onClick={onBack}
            className="mt-1 p-3 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm h-fit"
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-4xl font-semibold text-slate-900 tracking-tight">Choose Your Guide</h2>
            <p className="text-slate-500 mt-2 text-lg">
              We found these people who can help with: <span className="text-slate-900 font-semibold border-b-2 border-indigo-200">{snapshot.the_bottleneck}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {sortedMentors.map((mentor, idx) => (
            <div 
              key={mentor.id}
              onClick={() => onSelectMentor(mentor)}
              className={`group relative p-8 rounded-3xl transition-all duration-300 cursor-pointer border-2
                ${idx === 0 
                  ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100 hover:shadow-2xl hover:scale-[1.02]' 
                  : 'bg-white border-transparent hover:border-slate-200 shadow-sm hover:shadow-lg'}`}
            >
              {idx === 0 && (
                <div className="absolute -top-3 left-8 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                  <Star size={10} fill="currentColor" /> Best Match
                </div>
              )}
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-inner
                    ${idx === 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                    {mentor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{mentor.name}</h3>
                    <p className="text-indigo-600 font-semibold text-sm mb-2">{mentor.type}</p>
                    <p className="text-slate-500">{mentor.tagline}</p>
                  </div>
                </div>

                <div className="md:text-right pl-6 border-l border-slate-100 md:border-0 md:pl-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Why them?</p>
                  <p className="text-slate-700 text-sm font-medium max-w-xs leading-relaxed">{mentor.matchReason}</p>
                </div>

                <div className={`hidden md:block transition-all transform duration-300 ${idx === 0 ? 'text-indigo-600 translate-x-0' : 'text-slate-300 -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
                  <ArrowRight size={28} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default State4Marketplace;