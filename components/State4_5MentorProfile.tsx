
import React from 'react';
import { Mentor, LifeSnapshot } from '../types';
import { ArrowLeft, Star, ShieldCheck, Zap, MessageCircle, Sparkles, Check, Command } from 'lucide-react';

interface Props {
  mentor: Mentor;
  snapshot: LifeSnapshot;
  onAccept: () => void;
  onBack: () => void;
}

const State4_5MentorProfile: React.FC<Props> = ({ mentor, snapshot, onAccept, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 page-transition text-slate-100 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-8 p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-slate-100 transition-all flex items-center gap-2 pr-6"
        >
          <ArrowLeft size={20} />
          <span className="text-xs font-black uppercase tracking-widest">Revisit Resolution Pools</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Side: Avatar & Core Stats */}
          <div className="space-y-8">
            <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800 text-center shadow-xl">
              <div className="w-32 h-32 bg-indigo-600 rounded-[30px] mx-auto flex items-center justify-center text-5xl font-black shadow-2xl shadow-indigo-900/50 mb-8">
                {mentor.name.charAt(0)}
              </div>
              <h1 className="text-3xl font-black mb-1 tracking-tight">{mentor.name}</h1>
              <p className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em] mb-6">{mentor.type}</p>
              
              <div className="flex items-center justify-center gap-6 py-6 border-y border-slate-800/50">
                 <div className="text-center">
                    <p className="text-xl font-black">{mentor.rating}</p>
                    <p className="text-[10px] uppercase text-slate-500 font-black">Quality</p>
                 </div>
                 <div className="w-px h-10 bg-slate-800"></div>
                 <div className="text-center">
                    <p className="text-xl font-black">{mentor.sessionsCount}</p>
                    <p className="text-[10px] uppercase text-slate-500 font-black">Resolutions</p>
                 </div>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[40px] border border-slate-800 space-y-6">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mastered Domains</h3>
               <div className="flex flex-wrap gap-2">
                 {mentor.similarCases.map(c => (
                   <span key={c} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-300">{c}</span>
                 ))}
               </div>
            </div>
          </div>

          {/* Right Side: Detailed Info */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-900/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
               <div className="flex items-center gap-4 mb-8">
                  <Command className="text-indigo-400" size={24} />
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Resolution Philosophy</h3>
               </div>
               <p className="text-xl text-slate-300 leading-relaxed font-light mb-10 italic">
                  "{mentor.approach}"
               </p>

               <div className="bg-indigo-900/20 p-8 rounded-3xl border border-indigo-900/40">
                  <h4 className="text-xs font-black uppercase text-indigo-400 mb-4 flex items-center gap-2">
                    <ShieldCheck size={16} /> Matching Logic | UnLOOP
                  </h4>
                  <p className="text-slate-300 text-sm italic font-medium">
                    "We matched {mentor.name} for you because: {mentor.matchReason}"
                  </p>
               </div>
            </div>

            <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-3">
                  <MessageCircle size={18} /> Resolution Feedback
               </h3>
               <div className="space-y-5">
                 {mentor.reviews.length === 0 ? (
                    <p className="text-slate-600 text-sm italic">No shared feedback yet for this guide.</p>
                 ) : mentor.reviews.map(r => (
                   <div key={r.id} className="p-6 bg-slate-950 rounded-2xl border border-slate-800">
                      <div className="flex justify-between mb-3">
                        <span className="font-black text-sm text-slate-200">{r.user}</span>
                        <div className="flex text-yellow-500">
                           {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm italic leading-relaxed">"{r.comment}"</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* Accept & Proceed */}
            <div className="pt-6">
              <button 
                onClick={onAccept}
                className="unloop-button unloop-glow w-full py-6 bg-indigo-600 text-white rounded-[30px] font-black text-2xl hover:bg-indigo-500 shadow-2xl transition-all flex items-center justify-center gap-4 transform hover:scale-[1.02]"
              >
                <span>Select {mentor.name} as my Guide</span>
                <Check size={28} />
              </button>
              <div className="flex items-center justify-center gap-2 mt-5 text-slate-600">
                <Sparkles size={14} />
                <p className="text-center text-[10px] font-black uppercase tracking-widest">Entry to private collaboration sanctuary</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default State4_5MentorProfile;
