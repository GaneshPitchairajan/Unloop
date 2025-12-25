import React from 'react';
import { X, User, Clock, FileText, Calendar, ChevronRight } from 'lucide-react';
import { SessionData } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sessions: SessionData[];
  onLoadSession: (session: SessionData) => void;
}

const Menu: React.FC<Props> = ({ isOpen, onClose, sessions, onLoadSession }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-800">Menu</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
              <X size={20} />
            </button>
          </div>

          {/* User Profile Stub */}
          <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
              <User size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-800">Guest User</p>
              <p className="text-xs text-slate-500">Free Plan</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-8">
            {/* My Journeys / Problems */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <FileText size={14} /> My Clarity Journeys
              </h3>
              <div className="space-y-3">
                {sessions.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No saved sessions yet.</p>
                ) : (
                  sessions.map(session => (
                    <button 
                      key={session.id}
                      onClick={() => {
                        onLoadSession(session);
                        onClose();
                      }}
                      className="w-full text-left p-3 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all group"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-slate-700 text-sm line-clamp-2 group-hover:text-indigo-700">
                          {session.label}
                        </span>
                        <ChevronRight size={14} className="text-slate-300 mt-1 group-hover:text-indigo-400" />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {new Date(session.timestamp).toLocaleDateString()}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Appointments */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Calendar size={14} /> Appointments
              </h3>
              <div className="space-y-3">
                {sessions.filter(s => s.bookedTime && s.selectedMentor).length === 0 ? (
                   <p className="text-sm text-slate-400 italic">No upcoming sessions.</p>
                ) : (
                  sessions.filter(s => s.bookedTime && s.selectedMentor).map(session => (
                    <div key={session.id + 'apt'} className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <p className="font-bold text-emerald-800 text-sm">{session.selectedMentor?.name}</p>
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

          <div className="mt-auto pt-6 border-t border-slate-100">
            <button className="w-full py-3 text-slate-500 font-medium hover:text-slate-800 text-sm">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
