
import React, { useState } from 'react';
import { SessionData } from '../types';
import { ArrowLeft, Calendar, Clock, Sparkles, StickyNote, Star, ShieldCheck, RefreshCcw, Command, FileText } from 'lucide-react';
import State6Booking from './State6Booking';

interface Props {
  session: SessionData;
  onBack: () => void;
  onReschedule?: (time: string, consent: boolean) => void;
  allSessions: SessionData[];
}

const State7AppointmentDetails: React.FC<Props> = ({ session, onBack, onReschedule, allSessions }) => {
  const { selectedMentor, bookedTime, snapshot, userMood, userPriority, userNotes, consentGiven } = session;
  const [showReschedule, setShowReschedule] = useState(false);

  if (!selectedMentor || !bookedTime || !snapshot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void p-6 text-high page-arrival">
        <div className="text-center p-12 bg-sanctuary rounded-[40px] border border-slate-800 shadow-2xl space-y-8 max-w-md">
          <div className="w-16 h-16 bg-red-950/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto border border-red-900/30">
            <FileText size={32} />
          </div>
          <p className="text-lg font-light text-dim">No structural appointment data found in the current buffer.</p>
          <button onClick={onBack} className="w-full py-4 bg-void border border-slate-800 text-high rounded-full font-black text-xs uppercase tracking-widest hover:border-resolution-indigo transition-all">
            Return to Matrix
          </button>
        </div>
      </div>
    );
  }

  const handleBookingComplete = (time: string, consent: boolean) => {
    if (onReschedule) onReschedule(time, consent);
    setShowReschedule(false);
  };

  return (
    <div className="min-h-screen bg-void p-6 md:p-12 lg:p-20 page-arrival text-high overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto space-y-12 pb-24">
        
        {/* Detailed Header */}
        <header className="flex flex-col md:flex-row items-start md:items-end gap-8 pb-10 border-b border-slate-800/60">
          <div className="flex-1 space-y-6">
            <button
              onClick={onBack}
              className="group flex items-center gap-3 text-dim hover:text-resolution-cyan transition-all text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Exit Blueprint View</span>
            </button>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-resolution-indigo">
                <Command size={20} />
                <span className="text-[12px] font-black uppercase tracking-[0.4em]">Scheduled Resolution</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                Protocol with <span className="text-dim">{selectedMentor.name}</span>
              </h2>
            </div>
          </div>
          <button 
            onClick={() => setShowReschedule(true)}
            className="flex items-center gap-3 px-8 py-4 bg-sanctuary border border-slate-800 rounded-full text-xs font-black text-resolution-indigo hover:border-resolution-indigo hover:bg-void transition-all shadow-xl uppercase tracking-widest"
          >
            <RefreshCcw size={18} />
            <span>Re-Align Schedule</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Identity Core */}
          <div className="lg:col-span-2 bg-sanctuary p-10 rounded-[50px] border border-slate-800/60 shadow-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-resolution-indigo/5 blur-[80px] rounded-full"></div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-void border border-slate-800 text-resolution-indigo rounded-[30px] flex items-center justify-center font-black text-3xl shadow-inner group-hover:border-resolution-indigo transition-colors duration-500">
                  {selectedMentor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">{selectedMentor.name}</h3>
                  <p className="text-resolution-cyan font-black text-[10px] uppercase tracking-[0.3em] mt-1">{selectedMentor.type}</p>
                </div>
              </div>
              <p className="text-dim text-lg leading-relaxed font-light italic">"{selectedMentor.tagline}"</p>
              <div className="flex items-center gap-4 py-4 border-y border-slate-800/50">
                <div className="flex items-center gap-2 text-yellow-500/80">
                  <Star size={18} fill="currentColor" />
                  <span className="text-lg font-black">{selectedMentor.rating}</span>
                </div>
                <div className="w-px h-6 bg-slate-800"></div>
                <span className="text-xs text-slate-500 font-black uppercase tracking-widest">{selectedMentor.sessionsCount} Resolutions Logged</span>
              </div>
            </div>
          </div>

          {/* Temporal Data Card */}
          <div className="lg:col-span-3 bg-sanctuary p-10 rounded-[50px] border border-slate-800/60 shadow-3xl flex flex-col justify-between">
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
                  <Clock size={16} className="text-resolution-cyan" /> Temporal Synchronization
                </h3>
                <div className="px-5 py-1.5 bg-void border border-slate-800 rounded-full text-resolution-cyan text-[9px] font-black uppercase tracking-widest">Confirmed Slot</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-void border border-slate-800/50 rounded-3xl space-y-2">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol Date</p>
                  <p className="text-2xl font-black text-white">{bookedTime.split(' at ')[0]}</p>
                </div>
                <div className="p-6 bg-void border border-slate-800/50 rounded-3xl space-y-2">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Window Access</p>
                  <p className="text-2xl font-black text-white">{bookedTime.split(' at ')[1]}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-8 mt-8 border-t border-slate-800/50">
              <div className="flex items-center gap-4 text-resolution-cyan bg-resolution-cyan/5 p-5 rounded-[30px] border border-resolution-cyan/10">
                <ShieldCheck size={24} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Secure Link Established</p>
                  <p className="text-xs font-light text-dim leading-none">A high-bandwidth resolution space is ready for your entry.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Insight Node */}
        <div className="bg-sanctuary p-12 rounded-[60px] border border-slate-800/60 shadow-3xl space-y-10 group relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-resolution-indigo to-resolution-cyan opacity-20"></div>
          <div className="flex justify-between items-start">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
              <Sparkles size={16} className="text-resolution-indigo" /> Logic Context Buffer
            </h3>
            {consentGiven && (
              <span className="text-[9px] font-black bg-resolution-indigo/10 text-resolution-indigo px-4 py-1.5 rounded-full border border-resolution-indigo/20 uppercase tracking-[0.2em] shadow-inner">
                Analytical Access Authorized
              </span>
            )}
          </div>
          <div className="space-y-8">
            <p className="text-4xl md:text-5xl font-light leading-tight italic text-white tracking-tight">
              Target: <span className="font-black text-resolution-indigo">"{snapshot.primary_theme}"</span>
            </p>
            <div className="p-10 bg-void border border-slate-800 rounded-[40px] shadow-inner space-y-4">
              <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Identified Structural Chaos</h4>
              <p className="text-2xl font-light text-dim leading-relaxed">{snapshot.the_bottleneck}</p>
            </div>
          </div>
        </div>

        {/* User Reflections Module */}
        <div className="bg-sanctuary p-12 rounded-[60px] border border-slate-800/60 shadow-3xl space-y-10">
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
            <StickyNote size={16} className="text-amber-500/60" /> Individual Reflex Nodes
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              {userMood && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Emotional Frequency</p>
                  <p className="text-white text-2xl font-black">{userMood}</p>
                </div>
              )}
              {userPriority && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Resolution Criticality</p>
                  <p className="text-resolution-indigo text-2xl font-black uppercase tracking-widest">{userPriority}</p>
                </div>
              )}
            </div>
            {userNotes && (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Extended Context Log</p>
                <div className="text-dim text-lg font-light leading-relaxed whitespace-pre-wrap p-8 bg-void rounded-[35px] border border-slate-800/80 shadow-inner">
                  {userNotes}
                </div>
              </div>
            )}
          </div>
          {!userMood && !userPriority && !userNotes && (
            <p className="text-slate-700 italic text-center py-10 font-light text-xl">Buffer empty. No additional reflections logged.</p>
          )}
        </div>
      </div>

      {showReschedule && (
        <State6Booking 
          mentor={selectedMentor}
          existingSessions={allSessions}
          onClose={() => setShowReschedule(false)}
          onComplete={handleBookingComplete}
          currentBooking={bookedTime}
        />
      )}
    </div>
  );
};

export default State7AppointmentDetails;
