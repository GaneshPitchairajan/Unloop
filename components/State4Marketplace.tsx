import React from 'react';
import { LifeSnapshot, Mentor } from '../types';
import { MOCK_MENTORS } from '../constants';
import { User, ArrowRight } from 'lucide-react';

interface Props {
  snapshot: LifeSnapshot;
  onSelectMentor: (mentor: Mentor) => void;
}

const State4Marketplace: React.FC<Props> = ({ snapshot, onSelectMentor }) => {
  // Simple logic to recommend a mentor based on bottleneck length/keywords
  // In a real app, this would be AI-driven or use vector similarity.
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
    <div className="min-h-screen bg-stone-50 p-6 md:p-12 fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-light text-stone-800">Guidance Matching</h2>
          <p className="text-stone-500 mt-2">Based on your bottleneck: <span className="text-stone-800 font-medium">{snapshot.the_bottleneck}</span></p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {sortedMentors.map((mentor, idx) => (
            <div 
              key={mentor.id}
              onClick={() => onSelectMentor(mentor)}
              className={`group relative p-8 rounded-2xl transition-all cursor-pointer border
                ${idx === 0 
                  ? 'bg-white border-indigo-100 shadow-md ring-1 ring-indigo-50 hover:shadow-lg' 
                  : 'bg-white/50 border-stone-200 hover:bg-white hover:shadow-md opacity-80 hover:opacity-100'}`}
            >
              {idx === 0 && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  RECOMMENDED
                </div>
              )}
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                    <User size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-stone-800">{mentor.name}</h3>
                    <p className="text-indigo-600 font-medium text-sm mb-1">{mentor.type}</p>
                    <p className="text-stone-500 text-sm">{mentor.tagline}</p>
                  </div>
                </div>

                <div className="md:text-right">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Why this match?</p>
                  <p className="text-stone-700 text-sm max-w-xs">{mentor.matchReason}</p>
                </div>

                <div className="hidden md:block text-stone-300 group-hover:text-stone-800 transition-colors">
                  <ArrowRight size={24} />
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