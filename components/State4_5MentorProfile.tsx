
import React from 'react';
import { Mentor, LifeSnapshot } from '../types';
import { ArrowLeft, Star, ShieldCheck, Zap, Briefcase, MessageCircle, Calendar, Sparkles, Check } from 'lucide-react';

interface Props {
  mentor: Mentor;
  snapshot: LifeSnapshot;
  onAccept: () => void;
  onBack: () => void;
}

const State4_5MentorProfile: React.FC<Props> = ({ mentor, snapshot, onAccept, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 fade-in text-slate-100 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-8 p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-slate-100 transition-all flex items-center gap-2 pr-5"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-bold">Back to Marketplace</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side: Avatar & Core Stats */}
          <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center">
              <div className="w-32 h-32 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-5xl font-bold shadow-2xl shadow-indigo-900/50 mb-6">
                {mentor.name.charAt(0)}
              </div>
              <h1 className="text-2xl font-bold mb-1">{mentor.name}</h1>
              <p className="text-indigo-400 font-bold uppercase text-[10px] tracking-widest mb-4">{mentor.type}</p>
              
              <div className="flex items-center justify-center gap-4 py-4 border-y border-slate-800/50">
                 <div className="text-center">
                    <p className="text-lg font-bold">{mentor.rating}</p>
                    <p className="text-[10px] uppercase text-slate-500 font-bold">Rating</p>
                 </div>
                 <div className="w-px h-8 bg-slate-800"></div>
                 <div className="text-center">
                    <p className="text-lg font-bold">{mentor.sessionsCount}</p>
                    <p className="text-[10px] uppercase text-slate-500 font-bold">Sessions</p>
                 </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Expertise</h3>
               <div className="flex flex-wrap gap-2">
                 {mentor.similarCases.map(c => (
                   <span key={c} className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300">{c}</span>
                 ))}
               </div>
            </div>
          </div>

          {/* Right Side: Detailed Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
               <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="text-indigo-400" size={20} />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">How they help</h3>
               </div>
               <p className="text-lg text-slate-300 leading-relaxed font-light mb-8">
                  {mentor.approach}
               </p>

               <div className="bg-indigo-900/20 p-6 rounded-2xl border border-indigo-900/40">
                  <h4 className="text-xs font-bold uppercase text-indigo-400 mb-3 flex items-center gap-2">
                    <ShieldCheck size={14} /> The Fit Logic
                  </h4>
                  <p className="text-slate-300 text-sm italic">
                    "We matched {mentor.name} for you because: {mentor.matchReason}"
                  </p>
               </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
               <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                  <MessageCircle size={16} /> Recent Reviews
               </h3>
               <div className="space-y-4">
                 {mentor.reviews.map(r => (
                   <div key={r.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-sm">{r.user}</span>
                        <div className="flex text-yellow-500">
                           {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm">"{r.comment}"</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* Accept & Proceed */}
            <div className="pt-4">
              <button 
                onClick={onAccept}
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-bold text-xl hover:bg-indigo-500 shadow-2xl shadow-indigo-900/50 transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02]"
              >
                <span>Choose {mentor.name}</span>
                <Check size={24} />
              </button>
              <p className="text-center text-slate-500 text-xs mt-4">No commitment yet. You'll just enter their workspace.</p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default State4_5MentorProfile;
