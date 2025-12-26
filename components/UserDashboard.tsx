
import React, { useState } from 'react';
import { User, SessionData } from '../types';
import { ArrowLeft, User as UserIcon, Mail, Phone, FileText, Clock, Heart, Edit3, Save, ChevronRight, Calendar, Command, Sparkles, Activity } from 'lucide-react';

interface Props {
  user: User;
  sessions: SessionData[];
  onUpdateUser: (updatedUser: User) => void;
  onViewSession: (session: SessionData) => void;
  onViewAppointment: (session: SessionData) => void;
  onBack: () => void;
}

const UserDashboard: React.FC<Props> = ({ user, sessions, onUpdateUser, onViewSession, onViewAppointment, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    bio: user.bio || ''
  });

  const openSessions = sessions.filter(s => s.status !== 'resolved');
  
  const contactedMentors = Array.from(new Set(sessions.map(s => s.selectedMentor?.id).filter(Boolean)))
    .map(id => sessions.find(s => s.selectedMentor?.id === id)?.selectedMentor!);

  const handleSave = () => {
    onUpdateUser({ ...user, ...formData });
    setIsEditing(false);
  };

  const handleMentorClick = (mentorId: string) => {
    const lastSession = sessions
      .filter(s => s.selectedMentor?.id === mentorId)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    
    if (lastSession) {
      if (lastSession.bookedTime) onViewAppointment(lastSession);
      else onViewSession(lastSession);
    }
  };

  return (
    <div className="h-screen bg-void p-6 md:p-12 lg:p-16 page-arrival text-high flex flex-col overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col space-y-8 md:space-y-12 overflow-hidden">
        
        {/* Compact Dashboard Header */}
        <header className="flex items-center gap-6 border-b border-slate-800 pb-8 shrink-0">
          <button onClick={onBack} className="p-4 bg-sanctuary border border-slate-800 rounded-full text-dim hover:text-resolution-cyan transition-all shadow-xl">
            <ArrowLeft size={20} />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-resolution-indigo">
              <Command size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Personal Node</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">Identity Blueprint</h1>
          </div>
        </header>

        {/* Dashboard Grid - No global scroll, internal only */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 overflow-hidden pb-4">
          
          {/* Personal Identity Column */}
          <div className="lg:col-span-1 flex flex-col gap-8 overflow-y-auto no-scrollbar pr-1">
            <div className="bg-sanctuary p-8 rounded-[40px] border border-slate-800 shadow-3xl flex flex-col items-center text-center space-y-8 shrink-0">
              <div className="relative group">
                <div className="w-24 h-24 bg-void rounded-[32px] border border-slate-800 flex items-center justify-center text-4xl font-black text-resolution-cyan shadow-inner">
                  {user.name.charAt(0)}
                </div>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="absolute bottom-[-4px] right-[-4px] p-3 bg-resolution-indigo border border-void rounded-full text-white shadow-xl hover:bg-resolution-cyan hover:text-void transition-all">
                    <Edit3 size={14} />
                  </button>
                )}
              </div>
              
              <div className="w-full space-y-6">
                {isEditing ? (
                  <div className="space-y-5 text-left animate-arrival">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-500 ml-1">Alias Mapping</label>
                      <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-void border border-slate-800 rounded-2xl px-5 py-3 text-sm focus:border-resolution-indigo outline-none font-light text-high" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-500 ml-1">Structural Bio</label>
                      <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-void border border-slate-800 rounded-2xl px-5 py-3 text-sm h-28 resize-none focus:border-resolution-indigo outline-none font-light leading-relaxed text-dim" />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={handleSave} className="flex-1 py-4 bg-resolution-indigo text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-resolution-cyan hover:text-void transition-all shadow-xl shadow-resolution-indigo/20">Commit</button>
                      <button onClick={() => setIsEditing(false)} className="px-6 py-4 bg-void border border-slate-800 text-dim rounded-full text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Abort</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black tracking-tight text-white">{user.name}</h3>
                      <p className="text-dim text-[10px] font-black uppercase tracking-[0.2em]">{user.email}</p>
                    </div>
                    <div className="space-y-6 pt-6 border-t border-slate-800/60 text-sm">
                      <div className="flex items-center gap-3 justify-center text-resolution-cyan/80">
                        <Mail size={14} />
                        <span className="font-light truncate max-w-[200px]">{user.email}</span>
                      </div>
                      <div className="bg-void p-6 rounded-3xl border border-slate-800 text-[11px] italic text-left leading-relaxed text-dim font-light shadow-inner">
                        {user.bio || 'Identify your structural foundation here.'}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-sanctuary p-8 rounded-[40px] border border-slate-800 shadow-3xl space-y-6 shrink-0">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-resolution-indigo flex items-center gap-3">
                <Heart size={14} /> Established Guides
              </h3>
              <div className="space-y-3">
                {contactedMentors.length === 0 ? (
                  <p className="text-xs text-slate-700 italic px-2">No active connections established.</p>
                ) : (
                  contactedMentors.map(m => (
                    <div 
                      key={m.id} 
                      onClick={() => handleMentorClick(m.id)}
                      className="flex items-center gap-4 p-4 bg-void/50 rounded-2xl border border-slate-800/40 hover:bg-void hover:border-resolution-indigo/40 transition-all cursor-pointer group shadow-sm"
                    >
                      <div className="w-10 h-10 bg-sanctuary border border-slate-800 rounded-xl flex items-center justify-center font-black text-resolution-cyan shadow-sm group-hover:border-resolution-cyan transition-colors">{m.name.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate text-high group-hover:text-resolution-cyan transition-colors">{m.name}</p>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">{m.category}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-800 group-hover:text-resolution-cyan transition-all" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Activity Column - Detailed Path Review */}
          <div className="lg:col-span-2 flex flex-col bg-sanctuary p-8 md:p-12 rounded-[40px] border border-slate-800 shadow-3xl overflow-hidden">
            <div className="flex justify-between items-center mb-10 shrink-0">
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-4 text-white">
                <Clock className="text-resolution-indigo" size={24} /> Resolution Timeline
              </h3>
              <div className="px-5 py-2 bg-void border border-slate-800 text-resolution-cyan text-[10px] font-black uppercase tracking-widest rounded-full shadow-inner flex items-center gap-3">
                <Sparkles size={12} className="animate-pulse" />
                <span>{openSessions.length} Active Modules</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2 no-scrollbar">
              {openSessions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-20 border-2 border-dashed border-slate-800/40 rounded-[40px] text-slate-700 bg-void/20">
                  <Activity size={48} className="mb-6 opacity-20" />
                  <p className="font-light italic text-xl">System idle. Initiate your first resolution loop.</p>
                </div>
              ) : (
                openSessions.map(s => (
                  <div 
                    key={s.id} 
                    onClick={() => s.bookedTime ? onViewAppointment(s) : onViewSession(s)}
                    className="p-8 bg-void/40 border border-slate-800/50 rounded-[40px] flex flex-col md:flex-row md:items-center gap-8 hover:bg-void hover:border-resolution-indigo transition-all group cursor-pointer shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Command size={60} />
                    </div>
                    
                    <div className="flex-1 space-y-2 relative z-10">
                      <p className="font-black text-xl text-white group-hover:text-resolution-cyan transition-colors">{s.label}</p>
                      <p className="text-sm text-dim font-light italic truncate pr-12">"{s.snapshot.primary_theme}"</p>
                    </div>

                    <div className="flex items-center gap-8 relative z-10">
                      {s.bookedTime && (
                        <div className="text-right hidden md:block">
                          <p className="text-[9px] font-black text-resolution-cyan uppercase tracking-[0.3em] flex items-center gap-2 justify-end mb-1">Schedule Logged</p>
                          <p className="text-xs text-white font-bold">{s.bookedTime}</p>
                        </div>
                      )}
                      <div className="p-3 bg-sanctuary border border-slate-800 rounded-2xl text-dim group-hover:text-resolution-cyan group-hover:border-resolution-cyan/40 transition-all">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
