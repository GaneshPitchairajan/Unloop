
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
      <div className="flex-1 flex flex-col max-w-[1600px] mx-auto w-full h-full p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 overflow-hidden">
        
        {/* Compact Header */}
        <header className="bg-sanctuary/60 backdrop-blur-xl p-4 md:p-6 rounded-[32px] border border-slate-800/50 flex flex-col md:flex-row items-center gap-4 md:gap-8 shrink-0 shadow-2xl">
          <button onClick={onBack} className="p-3 bg-void border border-slate-800 rounded-full text-dim hover:text-resolution-cyan transition-all shrink-0">
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex-1 flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full">
             <div className="w-14 h-14 bg-resolution-indigo/10 border border-resolution-indigo/30 rounded-2xl flex items-center justify-center font-black text-xl text-resolution-indigo shrink-0">
               {mentor.name.charAt(0)}
             </div>
             <div className="flex-1 text-center md:text-left space-y-0.5">
               <div className="flex items-center gap-2 justify-center md:justify-start text-resolution-cyan/60">
                 <Command size={12} />
                 <span className="text-[9px] font-black uppercase tracking-[0.2em]">Secure Node 087</span>
               </div>
               <h2 className="text-xl font-black tracking-tight text-white">Collaboration with {mentor.name}</h2>
               <p className="text-dim text-xs font-light italic truncate">"{mentor.tagline}"</p>
             </div>
             
             <div className="shrink-0 w-full md:w-auto">
               {sessionData?.bookedTime ? (
                 <div className="px-6 py-3 bg-resolution-indigo/10 border border-resolution-indigo/20 rounded-full flex items-center gap-3">
                   <Calendar className="text-resolution-indigo" size={18} />
                   <div className="text-left">
                     <p className="text-[8px] font-black text-resolution-indigo uppercase tracking-widest leading-none mb-1">Session Active</p>
                     <p className="text-xs font-bold text-white">{sessionData.bookedTime}</p>
                   </div>
                 </div>
               ) : (
                 <button onClick={onBookSession} className="w-full md:w-auto px-8 py-3 bg-resolution-indigo text-white font-black rounded-full hover:bg-resolution-cyan hover:text-void transition-all shadow-xl text-xs uppercase tracking-widest">
                   Request Resolution Slot
                 </button>
               )}
             </div>
          </div>
        </header>

        {/* Workspace Body - Two Column Layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 md:gap-6 overflow-hidden">
          
          {/* Main Chat Engine */}
          <div className="flex-1 bg-sanctuary/40 border border-slate-800/40 rounded-[32px] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-8 py-4 border-b border-slate-800/50 flex items-center justify-between text-dim">
              <div className="flex items-center gap-3">
                <MessageSquare size={14} className="text-resolution-indigo" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Encrypted Stream</h3>
              </div>
              <span className="text-[9px] uppercase font-black tracking-[0.2em] text-resolution-cyan animate-pulse">Live Syncing</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar scroll-smooth bg-void/20">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
                  <div className="w-16 h-16 bg-sanctuary rounded-[24px] flex items-center justify-center text-slate-800 border border-slate-800/50">
                    <MessageSquare size={28} />
                  </div>
                  <div className="max-w-xs space-y-1">
                    <h4 className="font-bold text-dim">System Standby</h4>
                    <p className="text-xs text-slate-600 font-light italic leading-relaxed">Share your structural updates with {mentor.name} to refine the resolution blueprint.</p>
                  </div>
                </div>
              ) : (
                chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] md:max-w-[70%] px-6 py-4 rounded-[28px] shadow-xl ${
                      msg.role === 'user' 
                      ? 'bg-resolution-indigo/90 text-white rounded-br-none' 
                      : 'bg-sanctuary border border-slate-800 text-high rounded-bl-none'
                    }`}>
                      <p className="text-sm font-light leading-relaxed">{msg.content}</p>
                      <div className={`flex items-center gap-2 mt-2 text-[8px] font-black uppercase tracking-widest opacity-40 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        <span>{msg.role === 'user' ? 'Mentee' : mentor.name}</span>
                        <span>•</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-6 bg-sanctuary/80 border-t border-slate-800/50 flex gap-4">
              <input 
                type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                placeholder={`Inject context for ${mentor.name}...`}
                className="flex-1 bg-void border border-slate-800 rounded-full px-8 py-4 text-sm focus:outline-none focus:border-resolution-indigo transition-all font-light text-high placeholder:text-slate-700 shadow-inner"
              />
              <button 
                type="submit" 
                disabled={!chatInput.trim()} 
                className="p-4 bg-resolution-indigo text-white rounded-full hover:bg-resolution-cyan hover:text-void transition-all disabled:opacity-20 shadow-lg shadow-resolution-indigo/20"
              >
                <Send size={20} />
              </button>
            </form>
          </div>

          {/* Context & Data Sidebar */}
          <div className="w-full lg:w-[380px] flex flex-col gap-4 md:gap-6 overflow-hidden">
            {/* Context Card */}
            <div className="bg-sanctuary/40 border border-slate-800/40 rounded-[32px] p-6 space-y-6 flex flex-col shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-resolution-cyan">
                  <Sparkles size={14} />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Active Blueprint</h3>
                </div>
                <button 
                  onClick={() => setShowReport(!showReport)} 
                  className="text-dim hover:text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors"
                >
                   {showReport ? 'Condense' : 'Detailed Scan'}
                   <ChevronRight size={10} className={`transform transition-transform ${showReport ? 'rotate-90' : ''}`} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-void/60 p-5 rounded-2xl border border-slate-800/50 shadow-inner">
                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Primary Vector</p>
                  <p className="text-sm font-light italic leading-relaxed text-white">"{activeSnapshot.primary_theme}"</p>
                </div>

                {showReport && (
                  <div className="space-y-4 animate-arrival">
                    <div className="bg-void/60 p-5 rounded-2xl border border-slate-800/50 shadow-inner">
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Structural Bottleneck</p>
                      <p className="text-xs font-light text-dim leading-relaxed">{activeSnapshot.the_bottleneck}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Strategic Nodes Card */}
            <div className="flex-1 bg-sanctuary/40 border border-slate-800/40 rounded-[32px] p-6 space-y-6 flex flex-col overflow-hidden">
              <div className="flex items-center gap-3 text-resolution-indigo shrink-0">
                <Activity size={14} />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Tactical Steps</h3>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 no-scrollbar">
                {activeSnapshot.suggested_activities?.map((activity, i) => (
                   <div key={i} className="flex gap-4 p-5 bg-void/40 border border-slate-800/30 rounded-2xl text-xs font-light text-dim hover:border-resolution-indigo transition-colors group">
                     <span className="text-resolution-indigo font-black opacity-40 group-hover:opacity-100">{i + 1}.</span>
                     <p className="leading-relaxed group-hover:text-high transition-colors">{activity}</p>
                   </div>
                ))}
              </div>
              {/* Call to Action Shortcut */}
              {!sessionData?.bookedTime && (
                <div className="pt-4 border-t border-slate-800/50 shrink-0">
                  <button 
                    onClick={onBookSession}
                    className="w-full py-4 bg-void border border-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-resolution-cyan transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar size={14} className="text-resolution-cyan" />
                    Lock Schedule
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
