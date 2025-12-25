import React, { useState } from 'react';
import { Mentor } from '../types';
import { CheckCircle, Calendar, Clock, Video } from 'lucide-react';

interface Props {
  mentor: Mentor;
  onClose: () => void;
}

const State6Booking: React.FC<Props> = ({ mentor, onClose }) => {
  const [step, setStep] = useState<'date' | 'confirm'>('date');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const times = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">Booking Session</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 text-sm font-medium">
            Close
          </button>
        </div>

        <div className="p-8">
          {step === 'date' ? (
            <div className="space-y-8">
              <div>
                <p className="text-slate-500 font-medium mb-4">Select a time with {mentor.name}</p>
                <div className="grid grid-cols-2 gap-4">
                  {times.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`p-4 rounded-xl border-2 font-medium transition-all ${
                        selectedTime === t 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-slate-100 hover:border-indigo-200 text-slate-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                disabled={!selectedTime}
                onClick={() => setStep('confirm')}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:translate-y-0 transition-all hover:-translate-y-1 shadow-lg shadow-indigo-200"
              >
                Confirm Time
              </button>
            </div>
          ) : (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">You're Booked!</h2>
                <p className="text-slate-500 mt-2">
                  Session with {mentor.name} set for <br/> <span className="font-bold text-slate-800">Tomorrow at {selectedTime}</span>
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left space-y-3">
                 <div className="flex items-center gap-3 text-slate-700">
                    <Video size={18} className="text-indigo-600" />
                    <span className="text-sm font-medium">Video Link sent to your email</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-700">
                    <Calendar size={18} className="text-indigo-600" />
                    <span className="text-sm font-medium">Added to calendar</span>
                 </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 text-slate-500 font-medium hover:text-slate-800"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default State6Booking;