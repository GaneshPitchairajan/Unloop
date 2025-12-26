
import React, { useState, useEffect, useRef } from 'react';
import { LifeSnapshot, Mentor, SessionData } from '../types';
import { ArrowLeft, MessageSquare, Send, Calendar, Command, Sparkles, Activity, ChevronRight } from 'lucide-react';

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
    <div className="h-screen bg-void flex flex-col overflow-hidden text-high page-arrival">
      <div className="flex-1 flex flex-col max-w-[1500px] mx-auto w-full h-full p-6 lg:p-10 space-y-6 overflow-hidden">
        
        {/* Professional Header - High Contrast */}
        <header className="bg-sanctuary/70 backdrop-blur-2xl p-6 rounded-[35px] border border-slate-800/60 flex flex-col md:flex-row items-center gap-6 shrink-0 shadow-2xl">
          <button onClick={onBack} className="p-3.5 bg-void border border-slate-800 rounded-full text-dim hover:text-resolution-cyan transition-all shrink-0 hover:scale-110 active:scale-95">
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex-1 flex flex-col md:flex-row items-center gap-6 w-full">
             <div className="w-14 h-14 bg-resolution-indigo/20 border border-resolution-indigo/40 rounded-[22px] flex items-center justify-center font-black text-2xl text-resolution-indigo shrink-0 shadow-inner">
               {mentor.name.charAt(0)}
             </div>
             <div className="flex-1 text-center md:text-left">
               <div className="flex items-center gap-2 justify-center md:justify-start text-resolution-cyan/90 mb-1">
                 <Command size={12} />
                 <span className="text-[9px] font-black uppercase tracking-[0.3em]">Encrypted Channel - Node {mentor.id.slice(-3).toUpperCase()}</span>
               </div>
               <h2 className="text-xl font-black tracking-tight text-white leading-tight">Consultation: {mentor.name}</h2>
               <p className="text-dim text-xs font-light italic truncate opacity-90">"{mentor.tagline}"</p>
             </div>
             
             <div className="shrink-0 w-full md:w-auto">
               {sessionData?.bookedTime ? (
                 <div className="px-6 py-3 bg-resolution-indigo/10 border border-resolution-indigo/20 rounded-full flex items-center gap-4">
                   <Calendar className="text-resolution-indigo" size={18} />
                   <div className="text-left">
                     <p className="text-[8px] font-black text-resolution-indigo uppercase tracking-widest leading-none mb-1.5">Established Slot</p>
                     <p className="text-xs font-bold text-white leading-none">{sessionData.bookedTime}</p>
                   </div>
                 </div>
               ) : (
                 <button onClick={onBookSession} className="w-full md:w-auto px-10 py-3.5 bg-resolution-indigo text-white font-black rounded-full hover:bg-resolution-cyan hover:text-void transition-all shadow-xl text-[11px] uppercase tracking-widest shadow-resolution-indigo/20">
                   Establish Appointment
                 </button>
               )}
             </div>
          </div>
        </header>

        {/* Workspace Body - Two Column Grid */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
          
          {/* Main Chat Engine - Focused View */}
          <div className="flex-1 bg-sanctuary/40 border border-slate-800/40 rounded-[35px] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="px-8 py-4 border-b border-slate-800/50 flex items-center justify-between text-dim bg-void/10">
              <div className="flex items-center gap-3">
                <MessageSquare size={14} className="text-resolution-indigo" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Resolution Stream</h3>
              </div>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-resolution-cyan animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.5)]"></span>
                 <span className="text-[9px] uppercase font-black tracking-[0.2em] text-resolution-cyan">Matrix Active</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar scroll-smooth bg-void/5">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4 opacity-40">
                  <div className="w-20 h-20 bg-void rounded-[30px] border border-slate-800/60 flex items-center justify-center text-slate-800 shadow-inner">
                    <MessageSquare size={36} />
                  </div>
                  <div className="max-w-xs">
                    <p className="text-sm font-light italic text-dim">Node initialized. Transmit structural updates to {mentor.name} to refine the resolution path.</p>
                  </div>
                </div>
              ) : (
                chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-arrival`}>
                    <div className={`max-w-[85%] md:max-w-[70%] px-7 py-5 rounded-[28px] shadow-xl ${
                      msg.role === 'user' 
                      ? 'bg-gradient-to-br from-resolution-indigo to-resolution-indigo/90 text-white rounded-br-none' 
                      : 'bg-sanctuary border border-slate-800/80 text-white rounded-bl-none shadow-void'
                    }`}>
                      <p className="text-[15px] font-light leading-relaxed">{msg.content}</p>
                      <div className={`flex items-center gap-2 mt-3 text-[8px] font-black uppercase tracking-widest opacity-70 ${msg.role === 'user' ? 'justify-end text-resolution-cyan' : 'text-resolution-indigo'}`}>
                        <span>{msg.role === 'user' ? 'Client Authority' : mentor.name}</span>
                        <span className="opacity-30">•</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-6 bg-sanctuary/90 border-t border-slate-800/50 flex gap-4 backdrop-blur-xl">
              <input 
                type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                placeholder={`Type a secure message for ${mentor.name}...`}
                className="flex-1 bg-void border border-slate-800/80 rounded-full px-8 py-4 text-[15px] focus:outline-none focus:border-resolution-indigo transition-all font-light text-white placeholder:text-slate-700 shadow-inner"
              />
              <button 
                type="submit" 
                disabled={!chatInput.trim()} 
                className="p-4 bg-resolution-indigo text-white rounded-full hover:bg-resolution-cyan hover:text-void transition-all disabled:opacity-10 shadow-lg shadow-resolution-indigo/20 flex items-center justify-center"
              >
                <Send size={22} />
              </button>
            </form>
          </div>

          {/* Sidebar - Context Matrix */}
          <div className="w-full lg:w-[360px] flex flex-col gap-6 overflow-hidden">
            {/* Core Snapshot Card */}
            <div className="bg-sanctuary/40 border border-slate-800/40 rounded-[35px] p-6 space-y-6 flex flex-col shrink-0 shadow-xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-resolution-indigo/5 blur-[60px] rounded-full group-hover:bg-resolution-indigo/10 transition-colors"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3 text-resolution-cyan">
                  <Sparkles size={14} />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Context Node</h3>
                </div>
                <button 
                  onClick={() => setShowReport(!showReport)} 
                  className="text-dim hover:text-white text-[9px] font-black uppercase tracking-widest transition-all hover:bg-void/40 px-3 py-1 rounded-full border border-slate-800/40"
                >
                   {showReport ? 'Condense' : 'Expand Details'}
                </button>
              </div>
              
              <div className="space-y-4 relative z-10">
                <div className="bg-void/50 p-5 rounded-2xl border border-slate-800/50 shadow-inner group-hover:border-resolution-indigo/30 transition-colors">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Target Theme</p>
                  <p className="text-sm font-light italic leading-relaxed text-white">"{activeSnapshot.primary_theme}"</p>
                </div>

                {showReport && (
                  <div className="bg-void/50 p-5 rounded-2xl border border-slate-800/50 shadow-inner animate-arrival border-resolution-cyan/20">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Structural Bottleneck</p>
                    <p className="text-xs font-light text-dim leading-relaxed leading-relaxed">{activeSnapshot.the_bottleneck}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tactical Actions - Internal Scroll */}
            <div className="flex-1 bg-sanctuary/40 border border-slate-800/40 rounded-[35px] p-6 space-y-5 flex flex-col overflow-hidden shadow-xl">
              <div className="flex items-center gap-3 text-resolution-indigo shrink-0">
                <Activity size={14} />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Resolution Steps</h3>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar">
                {activeSnapshot.suggested_activities?.map((activity, i) => (
                   <div key={i} className="flex gap-4 p-5 bg-void/30 border border-slate-800/30 rounded-2xl text-xs font-light text-dim hover:border-resolution-indigo/60 transition-all group cursor-default">
                     <span className="text-resolution-indigo font-black opacity-30 group-hover:opacity-100 transition-opacity text-base">{i + 1}</span>
                     <p className="leading-relaxed group-hover:text-white transition-colors">{activity}</p>
                   </div>
                ))}
              </div>
              
              {!sessionData?.bookedTime && (
                <div className="pt-4 border-t border-slate-800/50 shrink-0">
                   <button 
                    onClick={onBookSession}
                    className="w-full py-4 bg-void border border-slate-800 text-dim hover:text-white hover:border-resolution-cyan rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
                  >
                    <Calendar size={14} className="group-hover:text-resolution-cyan transition-colors" />
                    Secure Slot
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default State5Workspace;
