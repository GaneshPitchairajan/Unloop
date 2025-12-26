
import React, { useState } from 'react';
import { X, User, Clock, FileText, Calendar, ChevronRight, Edit2, Check, Plus, ShieldCheck, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';
import { SessionData, User as UserType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sessions: SessionData[];
  currentUser: UserType;
  onLoadSession: (session: SessionData) => void;
  onRenameSession: (id: string, newLabel: string) => void;
  onNewSession: () => void;
  onViewAppointment: (session: SessionData) => void;
  onOpenMentorDashboard: () => void;
  onOpenUserDashboard: () => void;
  onLogout: () => void;
}

const Menu: React.FC<Props> = ({ 
  isOpen, onClose, sessions, currentUser, onLoadSession, onRenameSession, 
  onNewSession, onViewAppointment, onOpenMentorDashboard, onOpenUserDashboard, onLogout 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEditing = (session: SessionData, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditValue(session.label);
  };

  const saveEditing = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editValue.trim()) {
      onRenameSession(id, editValue);
    }
    setEditingId(null);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`fixed top-0 right-0 h-full w-80 bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-800 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col text-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-100">Your Space</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* User Profile Info Area */}
          <button 
            onClick={onOpenUserDashboard}
            className="flex items-center gap-4 mb-8 p-4 bg-slate-950 rounded-2xl border border-slate-800 group hover:border-indigo-500/50 transition-all text-left"
          >
            <div className="w-12 h-12 bg-indigo-900 text-indigo-300 rounded-full flex items-center justify-center font-bold text-lg border border-indigo-500/30 group-hover:scale-105 transition-transform">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-100 truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <LayoutDashboard size={10} className="text-indigo-400" />
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">View Profile & Dashboard</span>
              </div>
            </div>
          </button>

          <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar">
            {/* Main Action */}
            <button 
              onClick={onNewSession}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-900/40 transition-all flex items-center justify-center gap-2 mb-2"
            >
              <Plus size={18} />
              <span>New Conversation</span>
            </button>

            {/* Mentor Hub Access */}
            <div className="p-1 bg-slate-950 rounded-xl border border-slate-800">
               <button 
                onClick={onOpenMentorDashboard}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 transition-colors group"
               >
                 <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className={currentUser.isMentor ? "text-indigo-400" : "text-slate-600"} />
                    <span className="text-sm font-bold text-slate-300">{currentUser.isMentor ? 'Mentor Hub' : 'Become a Mentor'}</span>
                 </div>
                 <ChevronRight size={14} className="text-slate-600 group-hover:text-indigo-400" />
               </button>
            </div>

            {/* Problems List */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <FileText size={14} /> Your Untangling History
              </h3>
              <div className="space-y-3">
                {sessions.length === 0 ? (
                  <p className="text-sm text-slate-600 italic px-2">No saved problems yet.</p>
                ) : (
                  sessions.map(session => (
                    <div 
                      key={session.id}
                      onClick={() => editingId !== session.id && onLoadSession(session)}
                      className="w-full text-left p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all group cursor-pointer relative"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          {editingId === session.id ? (
                             <div className="flex items-center gap-2 w-full">
                               <input value={editValue} onChange={(e) => setEditValue(e.target.value)} onClick={(e) => e.stopPropagation()} className="bg-slate-900 border border-indigo-500 rounded px-2 py-1 text-sm w-full focus:outline-none" autoFocus />
                               <button onClick={(e) => saveEditing(session.id, e)} className="text-indigo-400 hover:text-indigo-300"><Check size={16} /></button>
                             </div>
                          ) : (
                            <>
                              <span className="font-medium text-slate-300 text-sm line-clamp-2 group-hover:text-indigo-300 pr-6">
                                {session.label}
                              </span>
                              <div className="flex items-center gap-2">
                                <button onClick={(e) => startEditing(session, e)} className="text-slate-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={12} /></button>
                                <ChevronRight size={14} className="text-slate-600 group-hover:text-indigo-400" />
                              </div>
                            </>
                          )}
                        </div>
                        {session.snapshot && editingId !== session.id && (
                          <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400/60 uppercase tracking-widest mt-1">
                            <LayoutDashboard size={10} />
                            <span>Insight Dashboard Ready</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Appointments */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <Calendar size={14} /> Upcoming Sessions
              </h3>
              <div className="space-y-3">
                {sessions.filter(s => s.bookedTime && s.selectedMentor).length === 0 ? (
                   <p className="text-sm text-slate-600 italic px-2">No upcoming sessions.</p>
                ) : (
                  sessions.filter(s => s.bookedTime && s.selectedMentor).map(session => (
                    <div key={session.id + 'apt'} onClick={() => onViewAppointment(session)} className="p-3 bg-emerald-900/10 rounded-xl border border-emerald-900/30 hover:bg-emerald-900/20 cursor-pointer transition-colors">
                      <p className="font-bold text-emerald-400 text-sm truncate">{session.selectedMentor?.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-emerald-600 text-[10px] font-bold">
                        <Clock size={12} />
                        <span>{session.bookedTime}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-800 space-y-2">
            <button 
              onClick={onLogout}
              className="w-full py-3 text-slate-500 font-medium hover:text-rose-400 text-sm transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={14} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
