
import React, { useState, useEffect } from 'react';
import { Mentor, SessionData } from '../types';
import { CheckCircle, Calendar, Clock, ShieldCheck, AlertCircle, Sparkles, Command } from 'lucide-react';

interface Props {
  mentor: Mentor;
  existingSessions: SessionData[];
  onClose: () => void;
  onComplete: (time: string, consent: boolean) => void;
  currentBooking?: string; 
}

const State6Booking: React.FC<Props> = ({ mentor, existingSessions, onClose, onComplete, currentBooking }) => {
  const [step, setStep] = useState<'duplicate_check' | 'date' | 'consent' | 'confirm'>('duplicate_check');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);

  const times = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];
  
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      full: d.toISOString().split('T')[0],
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      num: d.getDate()
    });
  }

  useEffect(() => {
    const sessionWithMentor = existingSessions.find(s => s.selectedMentor?.id === mentor.id && s.bookedTime);
    if (sessionWithMentor && !currentBooking) {
      setStep('duplicate_check');
    } else {
      setStep('date');
    }
  }, [existingSessions, mentor.id, currentBooking]);

  const handleFinalConfirm = () => {
    if (selectedTime) {
      const dateTimeString = `${selectedDate} at ${selectedTime}`;
      onComplete(dateTimeString, consentGiven);
      setStep('confirm');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-50 flex items-center justify-center p-6 fade-in">
      <div className="bg-slate-900 rounded-[50px] shadow-[0_0_100px_rgba(0,0,0,0.8)] max-w-xl w-full overflow-hidden border border-slate-800 text-slate-100 flex flex-col">
        
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3">
             <Command size={18} className="text-indigo-400" />
             <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
               {step === 'duplicate_check' ? 'Operational Alert' : 
                step === 'date' ? 'Resolution Scheduling' : 
                step === 'consent' ? 'Secure Architecture' : 'UnLOOP Confirmed'}
             </h3>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-white text-xs font-black uppercase tracking-widest transition-all">
            Abandon
          </button>
        </div>

        <div className="p-10 overflow-y-auto max-h-[85vh] no-scrollbar">
          {step === 'duplicate_check' ? (
            <div className="text-center space-y-10 py-6">
              <div className="w-20 h-20 bg-amber-900/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <AlertCircle size={40} />
              </div>
              <div className="space-y-4">
                <h4 className="text-3xl font-black tracking-tight">Existing Resolve Slot Found</h4>
                <p className="text-slate-500 leading-relaxed font-medium">
                  You already have a secured slot with <strong>{mentor.name}</strong> for this resolution process.
                </p>
              </div>
              <div className="space-y-4 pt-6">
                <button
                  onClick={() => setStep('date')}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-500 transition-all uppercase tracking-widest shadow-xl shadow-indigo-900/40"
                >
                  Confirm Reschedule
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-4 text-slate-500 font-black uppercase tracking-widest hover:text-white transition-all text-xs"
                >
                  Preserve Current Appointment
                </button>
              </div>
            </div>
          ) : step === 'date' ? (
            <div className="space-y-10">
              <div className="flex items-center gap-6 p-6 bg-slate-950/50 rounded-3xl border border-slate-800 shadow-inner">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg shadow-indigo-900/30">
                  {mentor.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Selected Guide</p>
                  <p className="text-2xl font-bold text-slate-100 tracking-tight">{mentor.name}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Choose Resolution Date</p>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {dates.map((d) => (
                    <button
                      key={d.full}
                      onClick={() => setSelectedDate(d.full)}
                      className={`flex-shrink-0 w-16 py-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        selectedDate === d.full
                        ? 'border-indigo-500 bg-indigo-900/20 text-indigo-400 scale-105 shadow-xl'
                        : 'border-slate-800 bg-slate-950 text-slate-600 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-tighter">{d.day}</span>
                      <span className="text-xl font-black">{d.num}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Assign Solution Time</p>
                <div className="grid grid-cols-2 gap-5">
                  {times.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`p-5 rounded-2xl border-2 font-black transition-all text-sm tracking-widest ${
                        selectedTime === t 
                        ? 'border-indigo-500 bg-indigo-900/20 text-indigo-400 shadow-xl' 
                        : 'border-slate-800 bg-slate-950 text-slate-600 hover:border-indigo-500/30'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                disabled={!selectedTime}
                onClick={() => setStep('consent')}
                className="unloop-glow w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-500 disabled:opacity-40 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl"
              >
                <span>Advance Toward Resolution</span>
                <Clock size={22} />
              </button>
            </div>
          ) : step === 'consent' ? (
            <div className="space-y-10">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="p-5 bg-indigo-900/20 text-indigo-400 rounded-[30px] shadow-lg">
                  <ShieldCheck size={48} />
                </div>
                <h4 className="text-3xl font-black tracking-tight">Establish Trust</h4>
                <p className="text-slate-500 text-base leading-relaxed font-medium">
                  To architecturalize your solution, we must share your <strong className="text-slate-200">Clarity Blueprint</strong> with {mentor.name}.
                </p>
              </div>

              <div className="bg-slate-950 p-8 rounded-[30px] border border-slate-800 shadow-inner">
                 <div className="flex items-start gap-5">
                   <div className="pt-1.5">
                      <input 
                        type="checkbox" 
                        id="consent" 
                        className="w-6 h-6 accent-indigo-600 bg-slate-900 rounded-lg border-slate-700 transition-all"
                        checked={consentGiven}
                        onChange={(e) => setConsentGiven(e.target.checked)}
                      />
                   </div>
                   <label htmlFor="consent" className="text-sm text-slate-400 leading-relaxed cursor-pointer select-none font-medium italic">
                     I authorize the sharing of my UnLOOP analysis and session context to accelerate my problem resolution.
                   </label>
                 </div>
              </div>

              <div className="space-y-4">
                <button
                  disabled={!consentGiven}
                  onClick={handleFinalConfirm}
                  className="unloop-glow w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-500 disabled:opacity-40 transition-all uppercase tracking-[0.2em] shadow-2xl"
                >
                  Secure My Resolution Slot
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-8 py-10">
              <div className="w-24 h-24 bg-emerald-950 text-emerald-500 rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-lg border border-emerald-900/30">
                <CheckCircle size={56} />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-black tracking-tighter uppercase tracking-[0.1em]">Resolution Secured</h2>
                <p className="text-slate-500 text-lg font-light">
                  Your path to clarity with <span className="text-white font-bold">{mentor.name}</span> is set.
                </p>
              </div>

              <div className="p-8 bg-indigo-950/20 rounded-[30px] border border-indigo-900/20 text-center">
                 <p className="text-2xl font-black text-indigo-400 tracking-tight">{selectedDate} at {selectedTime}</p>
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mt-3">UnLOOP Resolution Appointment</p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-5 bg-slate-800 text-white rounded-2xl font-black text-sm hover:bg-slate-700 transition-all uppercase tracking-widest"
              >
                Return to Workspace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default State6Booking;
