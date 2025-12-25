import React, { useState, useEffect } from 'react';
import { Mentor, SessionData } from '../types';
import { CheckCircle, Calendar, Clock, ShieldCheck, AlertCircle, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  mentor: Mentor;
  existingSessions: SessionData[];
  onClose: () => void;
  onComplete: (time: string, consent: boolean) => void;
  currentBooking?: string; // If rescheduling
}

const State6Booking: React.FC<Props> = ({ mentor, existingSessions, onClose, onComplete, currentBooking }) => {
  const [step, setStep] = useState<'duplicate_check' | 'date' | 'consent' | 'confirm'>('duplicate_check');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);

  const times = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];
  
  // Generate next 7 days
  const getNextDates = () => {
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
    return dates;
  };

  const dates = getNextDates();

  useEffect(() => {
    // Logic: Check if user already has an appointment for THIS session/problem
    // If they do and they aren't explicitly rescheduling it, we show the "Are you sure?" warning
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
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 fade-in">
      <div className="bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-800 text-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="text-xl font-bold text-slate-100">
            {step === 'duplicate_check' ? 'Attention' : 
             step === 'date' ? (currentBooking ? 'Reschedule Session' : 'Pick a time') : 
             step === 'consent' ? 'Secure Sharing' : 'Confirmed'}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors">
            Close
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[80vh]">
          {step === 'duplicate_check' ? (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-amber-900/20 text-amber-500 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={32} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-slate-200">Are you sure?</h4>
                <p className="text-slate-400 leading-relaxed">
                  You already booked a meeting with <strong>{mentor.name}</strong> for this problem.
                </p>
                <div className="p-4 bg-slate-950 rounded-xl border border-amber-900/30 text-xs text-amber-400/80">
                   Note: Booking a new slot will automatically cancel your previous appointment.
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setStep('date')}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg"
                >
                  Yes, Reschedule
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 text-slate-500 font-medium hover:text-slate-300"
                >
                  Keep my existing time
                </button>
              </div>
            </div>
          ) : step === 'date' ? (
            <div className="space-y-8">
              {/* Mentor Header */}
              <div className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold">
                  {mentor.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Guide</p>
                  <p className="text-slate-200 font-bold">{mentor.name}</p>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <p className="text-slate-400 font-medium mb-4 flex items-center justify-between">
                  <span>Select a Date</span>
                </p>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {dates.map((d) => (
                    <button
                      key={d.full}
                      onClick={() => setSelectedDate(d.full)}
                      className={`flex-shrink-0 w-14 py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                        selectedDate === d.full
                        ? 'border-indigo-500 bg-indigo-900/20 text-indigo-400'
                        : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase">{d.day}</span>
                      <span className="text-lg font-bold">{d.num}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <p className="text-slate-400 font-medium mb-4">Select a Time Slot</p>
                <div className="grid grid-cols-2 gap-4">
                  {times.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`p-4 rounded-xl border-2 font-medium transition-all ${
                        selectedTime === t 
                        ? 'border-indigo-500 bg-indigo-900/20 text-indigo-400' 
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-indigo-500/50'
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
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2"
              >
                <span>{currentBooking ? 'Update Schedule' : 'Next Step'}</span>
                <Clock size={18} />
              </button>
            </div>
          ) : step === 'consent' ? (
            <div className="space-y-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-indigo-900/30 text-indigo-400 rounded-full">
                  <ShieldCheck size={40} />
                </div>
                <h4 className="text-2xl font-bold text-slate-100">Prepare your Mentor</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We create a <strong>Clarity Report</strong> summarizing your patterns so {mentor.name} is ready for you.
                </p>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                 <div className="flex items-start gap-3">
                   <div className="pt-1">
                      <input 
                        type="checkbox" 
                        id="consent" 
                        className="w-5 h-5 accent-indigo-600 bg-slate-900 rounded border-slate-700"
                        checked={consentGiven}
                        onChange={(e) => setConsentGiven(e.target.checked)}
                      />
                   </div>
                   <label htmlFor="consent" className="text-sm text-slate-300 leading-relaxed cursor-pointer select-none">
                     I consent to sharing my untangling summary and personal notes with <strong>{mentor.name}</strong>.
                   </label>
                 </div>
              </div>

              <div className="space-y-3">
                <button
                  disabled={!consentGiven}
                  onClick={handleFinalConfirm}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-900/40"
                >
                  {currentBooking ? 'Confirm Reschedule' : 'Confirm Appointment'}
                </button>
                <button
                  onClick={() => setStep('date')}
                  className="w-full py-2 text-slate-500 text-sm font-medium hover:text-slate-300"
                >
                  Change Date/Time
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100">{currentBooking ? 'Rescheduled!' : 'All set.'}</h2>
                <p className="text-slate-400 mt-2">
                  Session confirmed for <span className="font-bold text-slate-200">{selectedDate} at {selectedTime}</span>
                </p>
              </div>

              <div className="bg-emerald-900/10 p-6 rounded-2xl border border-emerald-900/20 text-left space-y-4">
                 <div className="flex items-center gap-3 text-emerald-400">
                    <Sparkles size={18} />
                    <span className="text-sm font-bold">Clarity Report Shared</span>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed">
                   {mentor.name} will review your "Problem Snapshot" before the call.
                 </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 bg-slate-800 text-slate-200 rounded-xl font-bold hover:bg-slate-700 transition-all"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default State6Booking;