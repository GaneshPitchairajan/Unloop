
import React, { useState, useEffect, useRef } from 'react';
import { LifeSnapshot, Mentor, SessionData, Message } from '../types';
import { Play, Calendar, Video, ArrowLeft, Star, Users, MessageSquare, Send, Square, CheckCircle, Sparkles, FileText, Info, Clock, ExternalLink, Activity, EyeOff, Mail, Phone, Edit3 } from 'lucide-react';

interface Props {
  snapshot: LifeSnapshot;
  mentor: Mentor;
  onBookSession: () => void;
  onBack: () => void;
  sessionData?: SessionData; 
  onSendMessage: (content: string) => void;
}

const State5Workspace: React.FC<Props> = ({ snapshot, mentor, onBookSession, onBack, sessionData, onSendMessage }) => {
  const [chatInput, setChatInput] = useState('');
  const [showReport, setShowReport] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeSnapshot = sessionData?.editedSnapshot || snapshot;
  const isThemeHidden = sessionData?.hiddenSnapshotFields?.includes('theme');
  const isBottleneckHidden = sessionData?.hiddenSnapshotFields?.includes('bottleneck');
  const chatHistory = sessionData?.collaborationHistory || [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput);
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-10 fade-in text-slate-100 flex flex-col h-screen overflow-hidden">
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full space-y-6">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-center gap-6 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <button onClick={onBack} className="p-3 bg-slate-950 rounded-full border border-slate-800 text-slate-400 hover:text-slate-100 transition-all shrink-0"><ArrowLeft size={20} /></button>
          <div className="flex-1 flex flex-col md:flex-row items-center gap-6 w-full">
             <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg shrink-0">{mentor.name.charAt(0)}</div>
             <div className="flex-1 text-center md:text-left">
               <div className="flex flex-col md:flex-row md:items-center gap-2">
                 <h2 className="text-2xl font-bold text-slate-100">Unlooping Portal with {mentor.name}</h2>
                 <span className="px-3 py-0.5 bg-indigo-900/40 text-indigo-400 text-[10px] font-bold uppercase rounded-full border border-indigo-900/50 w-fit mx-auto md:mx-0">{mentor.category}</span>
               </div>
               <p className="text-slate-500 text-sm mt-1">{mentor.tagline}</p>
             </div>
             <div className="flex gap-3">
               {sessionData?.bookedTime ? (
                 <div className="px-6 py-3 bg-emerald-900/20 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
                   <Calendar className="text-emerald-400" size={18} />
                   <div className="text-left">
                     <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none">Scheduled</p>
                     <p className="text-xs font-bold text-slate-200 mt-1">{sessionData.bookedTime}</p>
                   </div>
                 </div>
               ) : (
                 <button onClick={onBookSession} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-900/20">
                   <Calendar size={18} />
                   <span>Book Final Session</span>
                 </button>
               )}
             </div>
          </div>
        </header>

        {/* Main Content: Chat & Report */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
          
          {/* Left: Pre-booking Collaboration Chat */}
          <div className="flex-1 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-indigo-400" size={18} />
                <h3 className="font-bold text-sm uppercase tracking-widest text-slate-300">Guide Discussion</h3>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Aligning before the call</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4">
                  <div className="w-16 h-16 bg-slate-950 rounded-full flex items-center justify-center text-slate-700 border border-slate-800 border-dashed"><MessageSquare size={32} /></div>
                  <div className="max-w-xs">
                    <h4 className="font-bold text-slate-300 mb-1">Start the conversation</h4>
                    <p className="text-xs text-slate-500 leading-relaxed italic">Ask {mentor.name} a question about your problem or explain what you hope to achieve during the call.</p>
                  </div>
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-200'}`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p className={`text-[9px] mt-1.5 font-bold uppercase opacity-50 ${msg.role === 'user' ? 'text-right' : ''}`}>
                        {msg.role === 'user' ? 'You' : mentor.name} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-3">
              <input 
                type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                placeholder={`Message ${mentor.name}...`}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
              />
              <button type="submit" disabled={!chatInput.trim()} className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-all disabled:opacity-50"><Send size={20} /></button>
            </form>
          </div>

          {/* Right: Problem Report & Context */}
          <div className="w-full lg:w-96 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-10 lg:pb-0">
            {/* The Clarity Report */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-indigo-400" size={18} />
                  <h3 className="font-bold text-sm uppercase tracking-widest text-slate-300">Shared Insight</h3>
                </div>
                <button onClick={() => setShowReport(!showReport)} className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest underline">
                   {showReport ? 'Hide' : 'Full Detail'}
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                   {isThemeHidden ? (
                      <div className="text-[10px] text-rose-400 italic font-bold">Theme Hidden for Privacy</div>
                   ) : (
                      <>
                        <p className="text-xs font-bold text-slate-600 uppercase mb-2">Primary Theme</p>
                        <p className="text-base font-light text-slate-100 italic">"{activeSnapshot.primary_theme}"</p>
                      </>
                   )}
                </div>

                {showReport && (
                  <div className="space-y-6 animate-[fadeIn_0.3s]">
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                      {isBottleneckHidden ? (
                        <div className="text-[10px] text-rose-400 italic font-bold">Bottleneck Hidden for Privacy</div>
                      ) : (
                        <>
                          <p className="text-xs font-bold text-slate-600 uppercase mb-2">The Bottleneck</p>
                          <p className="text-sm text-slate-300 leading-relaxed">{activeSnapshot.the_bottleneck}</p>
                        </>
                      )}
                    </div>
                    
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                       <p className="text-xs font-bold text-slate-600 uppercase mb-3">Pattern Analysis</p>
                       <div className="space-y-2">
                         {activeSnapshot.pattern_matrix.map((p, i) => (
                           <div key={i} className="flex justify-between items-center text-xs p-2 bg-slate-900/50 rounded-lg">
                             <span className="text-slate-400">{p.behavior}</span>
                             <span className="text-indigo-400 font-bold">{p.frequency}</span>
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Self Solve Section */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
              <div className="flex items-center gap-3">
                <Activity className="text-emerald-500" size={18} />
                <h3 className="font-bold text-sm uppercase tracking-widest text-slate-300">Self-Solve Tasks</h3>
              </div>
              <div className="space-y-3">
                {(activeSnapshot.suggested_activities || []).map((activity, i) => (
                   <div key={i} className="flex items-start gap-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl group transition-all">
                     <div className="shrink-0 w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-[10px] font-bold text-emerald-400 border border-slate-800">{i + 1}</div>
                     <p className="text-[13px] text-slate-300 leading-relaxed">{activity}</p>
                   </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            {(mentor.email || mentor.phone) && (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Contact Options</h3>
                 <div className="space-y-2">
                   {mentor.email && <div className="flex items-center gap-3 text-xs text-slate-400"><Mail size={14}/> {mentor.email}</div>}
                   {mentor.phone && <div className="flex items-center gap-3 text-xs text-slate-400"><Phone size={14}/> {mentor.phone}</div>}
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default State5Workspace;
