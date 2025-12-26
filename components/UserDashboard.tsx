
import React, { useState } from 'react';
import { User, SessionData } from '../types';
import { ArrowLeft, User as UserIcon, Mail, Phone, FileText, CheckCircle, Clock, Heart, Edit3, Save, MessageSquare, ChevronRight } from 'lucide-react';

interface Props {
  user: User;
  sessions: SessionData[];
  onUpdateUser: (updatedUser: User) => void;
  onViewSession: (session: SessionData) => void;
  onBack: () => void;
}

const UserDashboard: React.FC<Props> = ({ user, sessions, onUpdateUser, onViewSession, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    bio: user.bio || ''
  });

  const openSessions = sessions.filter(s => s.status !== 'resolved');
  const resolvedSessions = sessions.filter(s => s.status === 'resolved');
  
  // Unique mentors contacted
  const contactedMentors = Array.from(new Set(sessions.map(s => s.selectedMentor?.id).filter(Boolean)))
    .map(id => sessions.find(s => s.selectedMentor?.id === id)?.selectedMentor!);

  const handleSave = () => {
    onUpdateUser({ ...user, ...formData });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 fade-in text-slate-100 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-white transition-all shadow-lg">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Profile & Dashboard</h1>
            <p className="text-slate-400 font-light mt-1">Manage your identity and track your untangling progress.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col items-center text-center space-y-4">
              <div className="relative group">
                <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-slate-950 shadow-2xl">
                  {user.name.charAt(0)}
                </div>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="absolute bottom-0 right-0 p-2 bg-slate-800 rounded-full border border-slate-700 text-slate-400 hover:text-white transition-all">
                    <Edit3 size={14} />
                  </button>
                )}
              </div>
              
              <div className="w-full space-y-4">
                {isEditing ? (
                  <div className="space-y-4 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Full Name</label>
                      <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Email</label>
                      <input value={formData.email} disabled className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm opacity-50 cursor-not-allowed" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Phone</label>
                      <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 outline-none" placeholder="+1..." />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Bio</label>
                      <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm h-24 resize-none focus:border-indigo-500 outline-none" placeholder="A little about yourself..." />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleSave} className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                        <Save size={14} /> Save
                      </button>
                      <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-sm font-bold">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="text-xl font-bold">{user.name}</h3>
                      <p className="text-slate-500 text-sm">{user.email}</p>
                    </div>
                    <div className="flex flex-col gap-3 pt-4 text-sm text-slate-400">
                      <div className="flex items-center gap-3">
                        <Phone size={14} className="text-indigo-400" />
                        <span>{user.phone || 'No phone added'}</span>
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 text-xs italic text-left leading-relaxed">
                        {user.bio || 'Add a bio to help mentors understand you better.'}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mentors Section */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <Heart size={14} className="text-rose-400" /> Your Guides
              </h3>
              <div className="space-y-4">
                {contactedMentors.length === 0 ? (
                  <p className="text-xs text-slate-600 italic">No mentors connected yet.</p>
                ) : (
                  contactedMentors.map(m => (
                    <div key={m.id} className="flex items-center gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 group hover:border-indigo-500/50 transition-all cursor-pointer">
                      <div className="w-10 h-10 bg-indigo-900 text-indigo-300 rounded-xl flex items-center justify-center font-bold">
                        {m.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{m.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{m.type}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-700 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sessions/Problems Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Open Problems */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Clock className="text-amber-400" size={20} /> Open Problems
                </h3>
                <span className="px-3 py-1 bg-amber-900/20 text-amber-400 text-[10px] font-bold uppercase rounded-full border border-amber-900/30">
                  {openSessions.length} Active
                </span>
              </div>
              <div className="space-y-4">
                {openSessions.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8 italic border-2 border-dashed border-slate-800 rounded-2xl">
                    No active problems currently untangling.
                  </p>
                ) : (
                  openSessions.map(s => (
                    <div 
                      key={s.id} 
                      onClick={() => onViewSession(s)}
                      className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-4 hover:bg-slate-900/50 hover:border-indigo-500/30 cursor-pointer transition-all group"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">{s.label}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{s.snapshot.primary_theme}</p>
                      </div>
                      {s.bookedTime && (
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-emerald-400 uppercase">Booked Session</p>
                          <p className="text-xs text-slate-400">{s.bookedTime}</p>
                        </div>
                      )}
                      <ChevronRight size={16} className="text-slate-700 group-hover:text-indigo-400" />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Resolved Problems */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <CheckCircle className="text-emerald-400" size={20} /> Resolved Problems
                </h3>
                <span className="px-3 py-1 bg-emerald-900/20 text-emerald-400 text-[10px] font-bold uppercase rounded-full border border-emerald-900/30">
                  {resolvedSessions.length} Total
                </span>
              </div>
              <div className="space-y-4">
                {resolvedSessions.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8 italic">No problems archived as resolved yet.</p>
                ) : (
                  resolvedSessions.map(s => (
                    <div 
                      key={s.id} 
                      onClick={() => onViewSession(s)}
                      className="p-4 bg-slate-950/50 border border-slate-800/50 rounded-2xl flex items-center gap-4 opacity-75 hover:opacity-100 hover:bg-slate-950 cursor-pointer transition-all"
                    >
                      <CheckCircle className="text-emerald-500/50" size={16} />
                      <div className="flex-1">
                        <p className="font-bold text-slate-400 text-sm">{s.label}</p>
                        <p className="text-[10px] text-slate-600 mt-0.5">Resolved on {new Date(s.timestamp).toLocaleDateString()}</p>
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
