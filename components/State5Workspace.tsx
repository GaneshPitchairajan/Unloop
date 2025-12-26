
import React, { useState, useEffect } from 'react';
import { LifeSnapshot, Mentor, SessionData } from '../types';
// Added missing Activity import to the list of lucide-react icons
import { Play, Calendar, Video, ArrowLeft, Star, Users, MessageCircle, Briefcase, Square, CheckCircle, Sparkles, FileText, Info, Clock, ExternalLink, Activity } from 'lucide-react';

interface Props {
  snapshot: LifeSnapshot;
  mentor: Mentor;
  onBookSession: () => void;
  onBack: () => void;
  sessionData?: SessionData; // We can use this to check for existing bookings
}

const State5Workspace: React.FC<Props> = ({ snapshot, mentor, onBookSession, onBack, sessionData }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
    } else {
      setIsRecording(true);
      setHasRecorded(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 fade-in text-slate-100 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        
        <div className="flex flex-col md:flex-row items-center gap-6">
          <button 
             onClick={onBack}
             className="p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-600 transition-all shadow-sm self-start md:self-auto"
             title="Go back"
          >
             <ArrowLeft size={20} />
          </button>
           {/* Header */}
          <div className="flex-1 bg-slate-900 p-8 rounded-3xl shadow-xl shadow-black/20 border border-slate-800 flex items-center gap-6 w-full">
             <div className="w-20 h-20 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-3xl shadow-lg shadow-indigo-900/50 flex-shrink-0">
               {mentor.name.charAt(0)}
             </div>
             <div>
               <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">{mentor.type} Hub</p>
               <h2 className="text-3xl font-bold text-slate-100">{mentor.name} is ready</h2>
               <p className="text-slate-500 font-medium text-lg mt-1">{mentor.tagline}</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Scheduled Meeting & Recording */}
          <div className="space-y-8">
            {/* Scheduled Meeting Info */}
            <div className="bg-emerald-950/20 p-8 rounded-3xl border border-emerald-500/30 flex flex-col items-center text-center space-y-4">
               {sessionData?.bookedTime ? (
                 <>
                   <div className="w-16 h-16 bg-emerald-900/30 text-emerald-400 rounded-full flex items-center justify-center">
                     <Calendar size={32} />
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-emerald-400">Meeting Scheduled</h3>
                     <p className="text-slate-200 font-medium mt-1">{sessionData.bookedTime}</p>
                   </div>
                   <div className="w-full pt-4 border-t border-emerald-900/30">
                      <button className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400 mx-auto hover:text-emerald-300 transition-colors">
                        <Video size={14} />
                        <span>Join Link Ready (Live {sessionData.bookedTime.split(' at ')[1]})</span>
                      </button>
                   </div>
                 </>
               ) : (
                 <>
                   <div className="w-16 h-16 bg-indigo-900/20 text-indigo-400 rounded-full flex items-center justify-center">
                     <Clock size={32} />
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-slate-200">No session booked</h3>
                     <p className="text-slate-500 text-sm mt-1">Book a 30-min untangling call.</p>
                   </div>
                   <button 
                     onClick={onBookSession}
                     className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
                   >
                     <Calendar size={18} />
                     Schedule Now
                   </button>
                 </>
               )}
            </div>

            {/* User Video Recording Section */}
            <div className="bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-900/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <div className="z-10 text-center w-full">
                {hasRecorded ? (
                   <div className="flex flex-col items-center gap-4 animate-[fadeIn_0.5s]">
                     <div className="w-16 h-16 bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center">
                       <CheckCircle size={32} />
                     </div>
                     <p className="text-slate-200 font-bold">Video Note Prepared</p>
                     <p className="text-xs text-slate-500 leading-relaxed px-4">
                       This context is attached to your clarity report for {mentor.name}.
                     </p>
                     <button onClick={() => setHasRecorded(false)} className="text-xs text-indigo-400 underline font-bold uppercase">Record again</button>
                   </div>
                ) : isRecording ? (
                  <div className="flex flex-col items-center gap-6 animate-pulse">
                     <div className="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
                     <p className="text-slate-200 font-medium">Recording Insight...</p>
                     <button 
                       onClick={toggleRecording}
                       className="px-6 py-2 bg-slate-800 border-2 border-red-900/50 text-red-400 font-bold rounded-xl hover:bg-red-950/30 transition-all flex items-center gap-2"
                     >
                       <Square size={16} fill="currentColor" />
                       Finish Recording
                     </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
                      <Video size={28} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-200">Clarify on Video</h3>
                      <p className="text-slate-500 text-xs mt-2 max-w-[200px] mx-auto">
                        Speak your thoughts. We'll summarize them for {mentor.name}.
                      </p>
                    </div>
                    <button 
                      onClick={toggleRecording}
                      className="px-6 py-2 bg-slate-800 border-2 border-slate-700 text-slate-300 font-bold rounded-xl hover:border-indigo-500 hover:text-indigo-400 transition-all flex items-center gap-2 mx-auto"
                    >
                      <Play size={14} fill="currentColor" />
                      Record Context
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle & Right: Problem Insight & Self Solve */}
          <div className="lg:col-span-2 space-y-8">
            {/* The Clarity Report Preview */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-400" /> What {mentor.name} will see
                  </h3>
                  <button onClick={() => setShowReport(!showReport)} className="text-indigo-400 text-xs font-bold uppercase tracking-widest underline">
                    {showReport ? 'Hide Detail' : 'Show Report Details'}
                  </button>
               </div>

               <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Problem Statement</h4>
                  <p className="text-2xl font-light text-slate-100 leading-tight">"{snapshot.primary_theme}"</p>
                  <p className="text-slate-400 text-sm mt-4 italic leading-relaxed">
                    Matched Expertise: <span className="text-indigo-400 font-bold uppercase">{mentor.category}</span>
                  </p>
               </div>

               {showReport && (
                 <div className="animate-[fadeIn_0.5s_ease-out] space-y-6 pt-4 border-t border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="p-5 bg-slate-950 rounded-xl border border-slate-800">
                          <h5 className="text-[10px] font-bold uppercase text-slate-500 mb-2">Primary Bottleneck</h5>
                          <p className="text-slate-200 text-sm">{snapshot.the_bottleneck}</p>
                       </div>
                       <div className="p-5 bg-slate-950 rounded-xl border border-slate-800">
                          <h5 className="text-[10px] font-bold uppercase text-slate-500 mb-2">Energy Balance</h5>
                          <p className="text-slate-200 text-sm">{snapshot.energy_balance.description}</p>
                       </div>
                    </div>
                 </div>
               )}
            </div>

            {/* Self-Solve Suggestions */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
               <div className="flex items-center gap-3 mb-6">
                  <Activity className="text-emerald-500" size={20} />
                  <div>
                    <h3 className="text-lg font-bold text-slate-200">Start solving now</h3>
                    <p className="text-xs text-slate-500">Suggested tasks while you wait for your session.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {(snapshot.suggested_activities || []).map((activity, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl group hover:border-emerald-500/30 transition-all cursor-pointer">
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-xs font-bold text-emerald-400 border border-slate-800 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        {i + 1}
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed pt-1">{activity}</p>
                    </div>
                 ))}
                 {(snapshot.suggested_activities || []).length === 0 && (
                    <p className="text-sm text-slate-500 italic">No specific self-solve steps generated. Try journaling about the bottleneck.</p>
                 )}
               </div>
            </div>

            {/* Mentor Approach */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                 <Users size={16} /> Mentor Approach
              </h3>
              <p className="text-slate-300 leading-relaxed italic text-sm">
                "{mentor.approach}"
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                 {mentor.similarCases.map(c => (
                   <span key={c} className="px-3 py-1 bg-indigo-900/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-indigo-900/30">
                     {c}
                   </span>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default State5Workspace;
