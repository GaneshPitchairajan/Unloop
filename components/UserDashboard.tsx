
import React, { useState } from 'react';
import { User, SessionData } from '../types';
import { ArrowLeft, User as UserIcon, Mail, Phone, FileText, Clock, Heart, Edit3, Save, ChevronRight, Calendar, Command } from 'lucide-react';

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
    <div className="min-h-screen bg-paper p-8 md:p-16 page-arrival text-charcoal overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="flex items-center gap-6 border-b border-slate-100 pb-12">
          <button onClick={onBack} className="p-4 bg-white rounded-full calm-shadow border border-slate-50 text-slate-300 hover:text-calm-500 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-calm-300">
              <Command size={14} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">User Profile</span>
            </div>
            <h1 className="text-3xl font-medium tracking-tight">Your resolution space</h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Personal Identity Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-10 rounded-[40px] border border-slate-50 calm-shadow flex flex-col items-center text-center space-y-8">
              <div className="relative group">
                <div className="w-24 h-24 bg-paper rounded-[32px] border border-slate-100 flex items-center justify-center text-3xl font-medium text-calm-500">
                  {user.name.charAt(0)}
                </div>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="absolute bottom-0 right-0 p-2.5 bg-white border border-slate-100 rounded-full text-slate-200 hover:text-calm-500 transition-all shadow-sm">
                    <Edit3 size={14} />
                  </button>
                )}
              </div>
              
              <div className="w-full space-y-6">
                {isEditing ? (
                  <div className="space-y-6 text-left animate-arrival">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-semibold tracking-widest text-slate-400 ml-1">Identity name</label>
                      <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-paper border border-slate-50 rounded-2xl px-5 py-3 text-sm focus:border-calm-200 outline-none font-light" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-semibold tracking-widest text-slate-400 ml-1">Brief reflection</label>
                      <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-paper border border-slate-50 rounded-2xl px-5 py-3 text-sm h-32 resize-none focus:border-calm-200 outline-none font-light leading-relaxed" />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button onClick={handleSave} className="flex-1 py-4 bg-calm-500 text-white rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-calm-600 transition-all">Save</button>
                      <button onClick={() => setIsEditing(false)} className="px-6 py-4 bg-paper text-slate-400 rounded-full text-xs font-semibold uppercase tracking-widest hover:text-charcoal transition-all">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-medium tracking-tight">{user.name}</h3>
                      <p className="text-slate-400 text-xs font-light italic">{user.email}</p>
                    </div>
                    <div className="space-y-6 pt-6 border-t border-slate-50 text-sm text-slate-400">
                      <div className="flex items-center gap-3 justify-center text-calm-400">
                        <Phone size={14} />
                        <span className="font-light">{user.phone || 'No phone added'}</span>
                      </div>
                      <div className="bg-paper/50 p-6 rounded-3xl border border-slate-50 text-xs italic text-left leading-relaxed text-slate-500 font-light">
                        {user.bio || 'Add a brief reflection about yourself.'}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-slate-50 calm-shadow space-y-8">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-calm-300 flex items-center gap-3">
                <Heart size={14} /> Your Guides
              </h3>
              <div className="space-y-4">
                {contactedMentors.length === 0 ? (
                  <p className="text-xs text-slate-300 italic px-2">No guide connections found yet.</p>
                ) : (
                  contactedMentors.map(m => (
                    <div 
                      key={m.id} 
                      onClick={() => handleMentorClick(m.id)}
                      className="flex items-center gap-4 p-5 bg-paper/50 rounded-3xl border border-transparent hover:bg-paper hover:border-slate-50 transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 bg-white border border-slate-50 rounded-xl flex items-center justify-center font-medium text-calm-500 shadow-sm">{m.name.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{m.name}</p>
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">{m.category}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-100 group-hover:text-calm-300 transition-all" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Activity Column */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white p-12 rounded-[40px] border border-slate-50 calm-shadow space-y-10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium tracking-tight flex items-center gap-3">
                  <Clock className="text-calm-200" size={20} /> Current unlooping paths
                </h3>
                <span className="px-4 py-1.5 bg-paper text-slate-400 text-[10px] font-semibold uppercase tracking-widest rounded-full border border-slate-50">
                  {openSessions.length} Active
                </span>
              </div>
              <div className="space-y-6">
                {openSessions.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-slate-50 rounded-[32px] text-slate-200">
                    <p className="font-light italic">No active resolution paths.</p>
                  </div>
                ) : (
                  openSessions.map(s => (
                    <div 
                      key={s.id} 
                      onClick={() => s.bookedTime ? onViewAppointment(s) : onViewSession(s)}
                      className="p-8 bg-paper/30 border border-slate-50 rounded-[32px] flex flex-col md:flex-row md:items-center gap-6 hover:bg-paper hover:border-calm-100 cursor-pointer transition-all group"
                    >
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-lg text-charcoal/90 group-hover:text-calm-500 transition-colors">{s.label}</p>
                        <p className="text-sm text-slate-400 font-light italic truncate">"{s.snapshot.primary_theme}"</p>
                      </div>
                      <div className="flex items-center gap-6">
                        {s.bookedTime && (
                          <div className="text-right hidden md:block">
                            <p className="text-[9px] font-semibold text-calm-500 uppercase tracking-[0.2em] flex items-center gap-2 justify-end">Scheduled</p>
                            <p className="text-xs text-slate-400 font-medium">{s.bookedTime}</p>
                          </div>
                        )}
                        <ChevronRight size={20} className="text-slate-100 group-hover:text-calm-300 transition-all" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
