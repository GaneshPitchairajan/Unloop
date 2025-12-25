import React, { useState } from 'react';
import { X, User, Clock, FileText, Calendar, ChevronRight, Edit2, Check, Plus } from 'lucide-react';
import { SessionData } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sessions: SessionData[];
  onLoadSession: (session: SessionData) => void;
  onRenameSession: (id: string, newLabel: string) => void;
  onNewSession: () => void;
  onViewAppointment: (session: SessionData) => void;
}

const Menu: React.FC<Props> = ({ isOpen, onClose, sessions, onLoadSession, onRenameSession, onNewSession, onViewAppointment }) => {
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

  const handleAppointmentClick = (session: SessionData) => {
    onViewAppointment(session);
    onClose(); // Close menu after navigating
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-800 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col text-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-100">Your Space</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* User Profile Stub */}
          <div className="flex items-center gap-4 mb-8 p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 bg-indigo-900 text-indigo-300 rounded-full flex items-center justify-center font-bold text-lg border border-indigo-500/30">
              <User size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-100">Guest User</p>
              <p className="text-xs text-slate-500">Free Plan</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-8">
            
            {/* New Conversation Button */}
            <button 
              onClick={onNewSession}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-900/40 transition-all flex items-center justify-center gap-2 mb-2"
            >
              <Plus size={18} />
              <span>New Conversation</span>
            </button>

            {/* My Journeys / Problems */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <FileText size={14} /> Your Problems
              </h3>
              <div className="space-y-3">
                {sessions.length === 0 ? (
                  <p className="text-sm text-slate-600 italic">No saved problems yet.</p>
                ) : (
                  sessions.map(session => (
                    <div 
                      key={session.id}
                      onClick={() => {
                        if (editingId !== session.id) {
                          onLoadSession(session);
                          onClose();
                        }
                      }}
                      className="w-full text-left p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all group cursor-pointer relative"
                    >
                      <div className="flex justify-between items-start">
                        {editingId === session.id ? (
                           <div className="flex items-center gap-2 w-full">
                             <input 
                               value={editValue}
                               onChange={(e) => setEditValue(e.target.value)}
                               onClick={(e) => e.stopPropagation()}
                               className="bg-slate-900 border border-indigo-500 rounded px-2 py-1 text-sm w-full focus:outline-none"
                               autoFocus
                             />
                             <button onClick={(e) => saveEditing(session.id, e)} className="text-indigo-400 hover:text-indigo-300">
                               <Check size={16} />
                             </button>
                           </div>
                        ) : (
                          <>
                            <span className="font-medium text-slate-300 text-sm line-clamp-2 group-hover:text-indigo-300 pr-6">
                              {session.label}
                            </span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={(e) => startEditing(session, e)}
                                className="text-slate-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Edit2 size={12} />
                              </button>
                              <ChevronRight size={14} className="text-slate-600 group-hover:text-indigo-400" />
                            </div>
                          </>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-600 mt-1 block">
                        {new Date(session.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Appointments */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <Calendar size={14} /> Appointments
              </h3>
              <div className="space-y-3">
                {sessions.filter(s => s.bookedTime && s.selectedMentor).length === 0 ? (
                   <p className="text-sm text-slate-600 italic">No upcoming sessions.</p>
                ) : (
                  sessions.filter(s => s.bookedTime && s.selectedMentor).map(session => (
                    <div 
                      key={session.id + 'apt'} 
                      onClick={() => handleAppointmentClick(session)}
                      className="p-3 bg-emerald-900/10 rounded-xl border border-emerald-900/30 hover:bg-emerald-900/20 cursor-pointer transition-colors"
                    >
                      <p className="font-bold text-emerald-400 text-sm">{session.selectedMentor?.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-emerald-600 text-xs">
                        <Clock size={12} />
                        <span>{session.bookedTime} (Tomorrow)</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-800">
            <button className="w-full py-3 text-slate-500 font-medium hover:text-slate-300 text-sm transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;