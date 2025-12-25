import React, { useState } from 'react';
import { LifeSnapshot, Mentor } from '../types';
import { Play, Calendar, Video, ArrowLeft, Star, Users, MessageCircle, Briefcase, Square, CheckCircle } from 'lucide-react';

interface Props {
  snapshot: LifeSnapshot;
  mentor: Mentor;
  onBookSession: () => void;
  onBack: () => void;
}

const State5Workspace: React.FC<Props> = ({ snapshot, mentor, onBookSession, onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
    } else {
      setIsRecording(true);
      setHasRecorded(false);
      // Simulate recording time would require interval, but for UX simulation toggle is enough
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 fade-in text-slate-100">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4">
          <button 
             onClick={onBack}
             className="p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-600 transition-all shadow-sm"
             title="Go back"
          >
             <ArrowLeft size={20} />
          </button>
           {/* Header */}
          <div className="flex-1 bg-slate-900 p-8 rounded-3xl shadow-xl shadow-black/20 border border-slate-800 flex items-center gap-6">
             <div className="w-24 h-24 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-4xl shadow-lg shadow-indigo-900/50">
               {mentor.name.charAt(0)}
             </div>
             <div>
               <h2 className="text-3xl font-bold text-slate-100">{mentor.name} is ready to listen</h2>
               <p className="text-indigo-400 font-medium text-lg">{mentor.tagline}</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: User Video & Stats */}
          <div className="space-y-8">
            {/* User Video Recording Section */}
            <div className="bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-900/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <div className="z-10 text-center w-full">
                {hasRecorded ? (
                   <div className="flex flex-col items-center gap-4 animate-[fadeIn_0.5s]">
                     <div className="w-20 h-20 bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center">
                       <CheckCircle size={40} />
                     </div>
                     <p className="text-slate-200 font-bold">Video Note Saved</p>
                     <p className="text-xs text-slate-500">We will send this to {mentor.name} privately.</p>
                     <button onClick={() => setHasRecorded(false)} className="text-sm text-indigo-400 underline">Record again</button>
                   </div>
                ) : isRecording ? (
                  <div className="flex flex-col items-center gap-6 animate-pulse">
                     <div className="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
                     <p className="text-slate-200 font-medium">Recording...</p>
                     <button 
                       onClick={toggleRecording}
                       className="px-6 py-2 bg-slate-800 border-2 border-red-900/50 text-red-400 font-bold rounded-xl hover:bg-red-950/30 transition-all flex items-center gap-2"
                     >
                       <Square size={16} fill="currentColor" />
                       Stop Recording
                     </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
                      <Video size={32} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-200">Share your story</h3>
                      <p className="text-slate-500 text-sm mt-2 max-w-[200px] mx-auto">
                        You can record a 5 min video to explain more (Optional).
                      </p>
                    </div>
                    <button 
                      onClick={toggleRecording}
                      className="px-6 py-2 bg-slate-800 border-2 border-slate-700 text-slate-300 font-bold rounded-xl hover:border-indigo-500 hover:text-indigo-400 transition-all flex items-center gap-2 mx-auto"
                    >
                      <Play size={16} fill="currentColor" />
                      Record Video
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl">
                 <div className="flex items-center gap-2 text-indigo-400 mb-1">
                   <Star size={16} fill="currentColor" />
                   <span className="font-bold">{mentor.rating}</span>
                 </div>
                 <p className="text-xs text-slate-500 font-medium">Rating</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl">
                 <div className="flex items-center gap-2 text-indigo-400 mb-1">
                   <Users size={16} />
                   <span className="font-bold">{mentor.sessionsCount}+</span>
                 </div>
                 <p className="text-xs text-slate-500 font-medium">Conversations</p>
              </div>
            </div>
          </div>

          {/* Middle Column: Details & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Booking Call to Action */}
            <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl shadow-indigo-900/40">
               <h3 className="font-bold text-xl mb-4">Want to talk?</h3>
               <p className="text-indigo-100 mb-8 leading-relaxed">
                 Schedule a time to speak about <span className="font-bold border-b border-indigo-400">"{snapshot.the_bottleneck}"</span>. No pressure.
               </p>
               <button 
                 onClick={onBookSession}
                 className="w-full py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
               >
                 <Calendar size={20} />
                 Pick a time
               </button>
            </div>

            {/* Expertise & Similar Cases */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                 <Briefcase size={16} /> What they know
              </h3>
              <div className="mb-6">
                <p className="text-slate-300 leading-relaxed mb-4">
                  {mentor.matchReason} They know about {mentor.specialty}.
                </p>
                <div className="flex flex-wrap gap-2">
                  {mentor.similarCases.map((c, i) => (
                     <span key={i} className="px-3 py-1 bg-slate-800 text-indigo-300 text-xs rounded-lg border border-slate-700">
                        {c}
                     </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
               <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                 <MessageCircle size={16} /> Thoughts from others
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mentor.reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-200 text-sm">{review.user}</span>
                      <div className="flex text-indigo-500">
                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-snug">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default State5Workspace;