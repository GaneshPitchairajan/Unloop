import React, { useEffect, useState } from 'react';
import { LifeSnapshot, Mentor, BriefingDoc } from '../types';
import { generateBriefingDoc } from '../services/geminiService';
import { FileText, Loader2, BookOpen, CheckCircle } from 'lucide-react';

interface Props {
  snapshot: LifeSnapshot;
  mentor: Mentor;
  onGoToKnowledge: () => void;
}

const State5Workspace: React.FC<Props> = ({ snapshot, mentor, onGoToKnowledge }) => {
  const [doc, setDoc] = useState<BriefingDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateBriefingDoc(snapshot)
      .then(setDoc)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [snapshot]);

  return (
    <div className="min-h-screen bg-stone-100 p-6 md:p-12 fade-in">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Context */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-4">Session Active</h3>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                 {mentor.name.charAt(0)}
               </div>
               <div>
                 <p className="font-medium text-stone-800">{mentor.name}</p>
                 <p className="text-xs text-stone-500">{mentor.type}</p>
               </div>
            </div>
          </div>

          <button 
            onClick={onGoToKnowledge}
            className="w-full py-4 bg-stone-200 text-stone-700 rounded-xl hover:bg-stone-300 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <BookOpen size={18} />
            <span>Open Knowledge Hub</span>
          </button>
        </div>

        {/* Right Col: Briefing Doc */}
        <div className="lg:col-span-2">
          {loading ? (
             <div className="bg-white p-12 rounded-2xl shadow-sm border border-stone-200 flex flex-col items-center justify-center min-h-[400px]">
               <Loader2 className="animate-spin text-stone-300 mb-4" size={48} />
               <p className="text-stone-500 animate-pulse">Generating Briefing Document...</p>
             </div>
          ) : doc ? (
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-stone-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-stone-200 to-stone-400"></div>
              
              <div className="flex items-center gap-3 mb-8 pb-8 border-b border-stone-100">
                <FileText className="text-stone-400" />
                <h2 className="text-2xl font-serif text-stone-800">Session Briefing</h2>
                <span className="ml-auto px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full flex items-center gap-1">
                  <CheckCircle size={12} /> Ready
                </span>
              </div>

              <div className="space-y-8">
                <section>
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Seeker Context</h4>
                  <p className="text-stone-700 leading-relaxed font-serif text-lg">{doc.seeker_context}</p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Current Blockers</h4>
                    <p className="text-stone-600 text-sm leading-relaxed">{doc.current_blockers}</p>
                  </div>
                  <div>
                     <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">History & Attempts</h4>
                     <p className="text-stone-600 text-sm leading-relaxed">{doc.attempted_solutions}</p>
                  </div>
                </section>

                <section className="bg-stone-50 p-6 rounded-xl border border-stone-100">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-widest mb-3">Recommended Entry Point</h4>
                  <p className="text-stone-800 italic font-medium">{doc.recommended_start_point}</p>
                </section>
              </div>
            </div>
          ) : (
            <div className="text-center p-12 text-red-500">Failed to load briefing.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default State5Workspace;