import React, { useState } from 'react';
import { SessionData } from '../types';
import { ArrowLeft, Calendar, Clock, Sparkles, StickyNote, Star, ShieldCheck, RefreshCcw } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-slate-100 fade-in">
        <div className="text-center p-8 bg-slate-900 rounded-3xl border border-slate-800">
          <p className="text-lg">No appointment details available.</p>
          <button onClick={onBack} className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-full">
            Go Back
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
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 fade-in overflow-y-auto text-slate-100">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-800">
          <button
            onClick={onBack}
            className="p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-600 transition-all shadow-sm group"
            title="Go back"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex-1">
            <h2 className="text-4xl font-semibold text-slate-100 tracking-tight">Appointment with {selectedMentor.name}</h2>
            <p className="text-slate-400 mt-2 text-lg font-light">Details of your scheduled session.</p>
          </div>
          <button 
            onClick={() => setShowReschedule(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-indigo-400 hover:bg-slate-700 hover:text-indigo-300 transition-all"
          >
            <RefreshCcw size={16} />
            <span>Reschedule</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mentor Information Card */}
          <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-black/20 border border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-900/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-900/30 transition-colors duration-700"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-900/50">
                  {selectedMentor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-100">{selectedMentor.name}</h3>
                  <p className="text-indigo-400 font-medium">{selectedMentor.type}</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{selectedMentor.tagline}</p>
              <div className="flex items-center gap-2 text-yellow-400">
                <Star size={16} fill="currentColor" />
                <span className="font-bold">{selectedMentor.rating}</span>
                <span className="text-slate-500 text-xs">({selectedMentor.sessionsCount} sessions)</span>
              </div>
            </div>
          </div>

          {/* Appointment Details Card */}
          <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-black/20 border border-slate-800 space-y-6 flex flex-col">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-emerald-500" /> Session Time
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-200">
                  <Calendar size={24} className="text-emerald-400" />
                  <p className="text-xl font-semibold">Scheduled</p>
                </div>
                <div className="flex items-center gap-4 text-slate-200">
                  <Clock size={24} className="text-emerald-400" />
                  <p className="text-xl font-semibold">{bookedTime}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 text-emerald-500 bg-emerald-950/20 p-3 rounded-xl border border-emerald-900/30">
                <ShieldCheck size={20} />
                <span className="text-xs font-bold uppercase tracking-wider">Clarity Report Shared</span>
              </div>
            </div>
          </div>
        </div>

        {/* Session Context Card */}
        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-black/20 border border-slate-800 space-y-6">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-500" /> Session Context
            </h3>
            {consentGiven && (
              <span className="text-[10px] font-bold bg-indigo-900/30 text-indigo-400 px-3 py-1 rounded-full border border-indigo-900/50 uppercase tracking-widest">
                Data Access Granted
              </span>
            )}
          </div>
          <p className="text-xl font-light leading-relaxed text-slate-200">
            Topic: <span className="font-medium text-indigo-300">"{snapshot.primary_theme}"</span>.
          </p>
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">What Feels Stuck</h4>
            <p className="text-lg text-slate-200">{snapshot.the_bottleneck}</p>
          </div>
        </div>

        {/* User Reflections Card */}
        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-black/20 border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <StickyNote size={16} className="text-amber-500" /> Your Notes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {userMood && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Mood</p>
                  <p className="text-slate-200 text-lg font-medium">{userMood}</p>
                </div>
              )}
              {userPriority && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Priority</p>
                  <p className="text-slate-200 text-lg font-medium">{userPriority}</p>
                </div>
              )}
            </div>
            {userNotes && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Additional Notes</p>
                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap p-4 bg-slate-950 rounded-xl border border-slate-800">{userNotes}</p>
              </div>
            )}
          </div>
          {!userMood && !userPriority && !userNotes && (
            <p className="text-slate-500 italic">No additional notes added.</p>
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