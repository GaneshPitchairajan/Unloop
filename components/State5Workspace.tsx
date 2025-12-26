
import React, { useState, useEffect, useRef } from 'react';
import { LifeSnapshot, Mentor, SessionData } from '../types';
import { ArrowLeft, MessageSquare, Send, Calendar, Command, Sparkles, Activity } from 'lucide-react';

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
    <div className="h-screen bg-paper p-8 flex flex-col overflow-hidden text-charcoal page-arrival">
      <div className="max-w-6xl mx-auto w-full flex flex-col h-full space-y-8">
        
        {/* Header */}
        <header className="bg-white p-8 rounded-[40px] calm-shadow border border-slate-50 flex flex-col md:flex-row items-center gap-8">
          <button onClick={onBack} className="p-4 bg-paper rounded-full text-slate-300 hover:text-calm-500 transition-all shrink-0">
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex-1 flex flex-col md:flex-row items-center gap-8">
             <div className="w-16 h-16 bg-calm-50 border border-calm-100 rounded-3xl flex items-center justify-center font-medium text-2xl text-calm-500 shrink-0">
               {mentor.name.charAt(0)}
             </div>
             <div className="flex-1 text-center md:text-left space-y-1">
               <div className="flex items-center gap-2 justify-center md:justify-start text-calm-300">
                 <Command size={14} />
                 <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">Resolution space</span>
               </div>
               <h2 className="text-2xl font-medium tracking-tight">Collaboration with {mentor.name}</h2>
               <p className="text-slate-400 text-sm font-light italic">"{mentor.tagline}"</p>
             </div>
             
             <div className="shrink-0">
               {sessionData?.bookedTime ? (
                 <div className="px-8 py-4 bg-calm-50 border border-calm-100 rounded-full flex items-center gap-4">
                   <Calendar className="text-calm-500" size={20} />
                   <div className="text-left">
                     <p className="text-[10px] font-semibold text-calm-600 uppercase tracking-widest leading-none mb-1">Session secured</p>
                     <p className="text-sm font-medium text-charcoal">{sessionData.bookedTime}</p>
                   </div>
                 </div>
               ) : (
                 <button onClick={onBookSession} className="px-10 py-4 bg-calm-500 text-white font-medium rounded-full hover:bg-calm-600 transition-all shadow-md text-sm">
                   Request resolution session
                 </button>
               )}
             </div>
          </div>
        </header>

        {/* Workspace Body */}
        <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
          
          {/* Chat Column */}
          <div className="flex-1 bg-white rounded-[40px] calm-shadow border border-slate-50 flex flex-col overflow-hidden">
            <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between text-calm-300">
              <div className="flex items-center gap-3">
                <MessageSquare size={16} />
                <h3 className="text-[10px] font-semibold uppercase tracking-widest">Shared dialogue</h3>
              </div>
              <span className="text-[10px] uppercase font-semibold tracking-widest opacity-60">Untangling the knots</span>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar scroll-smooth">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
                  <div className="w-20 h-20 bg-paper rounded-[32px] flex items-center justify-center text-slate-100 border border-dashed border-slate-100">
                    <MessageSquare size={32} />
                  </div>
                  <div className="max-w-xs space-y-2">
                    <h4 className="font-medium text-slate-300">Begin the conversation</h4>
                    <p className="text-sm text-slate-400 font-light italic">Share any new thoughts with {mentor.name} before your session starts.</p>
                  </div>
                </div>
              ) : (
                chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-8 py-6 rounded-[28px] ${msg.role === 'user' ? 'bg-calm-100 text-charcoal rounded-br-none' : 'bg-paper text-slate-600 rounded-bl-none'}`}>
                      <p className="text-base font-light leading-relaxed">{msg.content}</p>
                      <div className={`flex items-center gap-2 mt-3 text-[9px] font-semibold uppercase opacity-40 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        <span>{msg.role === 'user' ? 'You' : mentor.name}</span>
                        <span>•</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-8 bg-paper border-t border-slate-50 flex gap-4">
              <input 
                type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                placeholder={`Share a thought with ${mentor.name}...`}
                className="flex-1 bg-white border border-slate-100 rounded-full px-8 py-5 text-sm focus:outline-none focus:border-calm-200 transition-all font-light"
              />
              <button type="submit" disabled={!chatInput.trim()} className="p-5 bg-calm-500 text-white rounded-full hover:bg-calm-600 transition-all disabled:opacity-30"><Send size={20} /></button>
            </form>
          </div>

          {/* Context Column */}
          <div className="w-full lg:w-96 flex flex-col gap-8 overflow-y-auto no-scrollbar">
            <div className="bg-white rounded-[40px] calm-shadow border border-slate-50 p-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-calm-300">
                  <Sparkles size={16} />
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest">Context</h3>
                </div>
                <button onClick={() => setShowReport(!showReport)} className="text-calm-500 text-[10px] font-semibold uppercase tracking-widest underline">
                   {showReport ? 'Hide' : 'Expand'}
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-paper p-6 rounded-3xl space-y-2">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Theme</p>
                  <p className="text-base font-light italic leading-relaxed">"{activeSnapshot.primary_theme}"</p>
                </div>

                {showReport && (
                  <div className="space-y-6 animate-arrival">
                    <div className="bg-paper p-6 rounded-3xl space-y-2">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Bottleneck</p>
                      <p className="text-sm font-light text-slate-500 leading-relaxed">{activeSnapshot.the_bottleneck}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-[40px] calm-shadow border border-slate-50 p-10 space-y-8">
              <div className="flex items-center gap-3 text-calm-300">
                <Activity size={16} />
                <h3 className="text-[10px] font-semibold uppercase tracking-widest">First steps</h3>
              </div>
              <div className="space-y-4">
                {activeSnapshot.suggested_activities?.map((activity, i) => (
                   <div key={i} className="flex gap-4 p-6 bg-paper rounded-2xl text-sm font-light text-slate-500">
                     <span className="text-calm-500 font-semibold">{i + 1}.</span>
                     {activity}
                   </div>
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
