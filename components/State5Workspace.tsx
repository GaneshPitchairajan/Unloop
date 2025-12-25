import React, { useState } from 'react';
import { LifeSnapshot, Mentor } from '../types';
import { generateMentorVideo } from '../services/geminiService';
import { Play, Loader2, Calendar, Video, Clock, ArrowLeft, Star, Users, MessageCircle, Briefcase } from 'lucide-react';

interface Props {
  snapshot: LifeSnapshot;
  mentor: Mentor;
  onBookSession: () => void;
  onBack: () => void;
}

const State5Workspace: React.FC<Props> = ({ snapshot, mentor, onBookSession, onBack }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);

  const handleGenerateVideo = async () => {
    setLoadingVideo(true);
    const url = await generateMentorVideo(mentor.name, mentor.specialty);
    setVideoUrl(url);
    setLoadingVideo(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 fade-in text-slate-100">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4">
          <button 
             onClick={onBack}
             className="p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-600 transition-all shadow-sm"
          >
             <ArrowLeft size={20} />
          </button>
           {/* Header */}
          <div className="flex-1 bg-slate-900 p-8 rounded-3xl shadow-xl shadow-black/20 border border-slate-800 flex items-center gap-6">
             <div className="w-24 h-24 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-4xl shadow-lg shadow-indigo-900/50">
               {mentor.name.charAt(0)}
             </div>
             <div>
               <h2 className="text-3xl font-bold text-slate-100">Meet {mentor.name}</h2>
               <p className="text-indigo-400 font-medium text-lg">{mentor.tagline}</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Video & Stats */}
          <div className="space-y-8">
            {/* Video Section */}
            <div className="bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-900/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              {loadingVideo ? (
                <div className="text-center space-y-4 z-10">
                  <Loader2 className="animate-spin text-indigo-500 mx-auto" size={40} />
                  <p className="text-slate-400 font-medium">Creating your personal welcome video...</p>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto">This uses advanced AI to generate a scene matching {mentor.name}'s vibe.</p>
                </div>
              ) : videoUrl ? (
                <div className="w-full h-full relative z-10">
                  <video src={videoUrl} autoPlay loop muted className="w-full h-full object-cover rounded-xl shadow-lg" />
                  <p className="text-center text-xs text-slate-500 mt-4">Visual representation of {mentor.name}'s space</p>
                </div>
              ) : (
                <div className="text-center space-y-6 z-10">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
                    <Video size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-200">See Their Vibe</h3>
                    <p className="text-slate-500 text-sm mt-2">Generate a short welcome video.</p>
                  </div>
                  <button 
                    onClick={handleGenerateVideo}
                    className="px-6 py-2 bg-slate-800 border-2 border-slate-700 text-slate-300 font-bold rounded-xl hover:border-indigo-500 hover:text-indigo-400 transition-all flex items-center gap-2 mx-auto"
                  >
                    <Play size={16} fill="currentColor" />
                    Generate Video
                  </button>
                </div>
              )}
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
                 <p className="text-xs text-slate-500 font-medium">Sessions</p>
              </div>
            </div>
          </div>

          {/* Middle Column: Details & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Booking Call to Action */}
            <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl shadow-indigo-900/40">
               <h3 className="font-bold text-xl mb-4">Ready to start?</h3>
               <p className="text-indigo-100 mb-8 leading-relaxed">
                 Book a time to talk about <span className="font-bold border-b border-indigo-400">"{snapshot.the_bottleneck}"</span> and build a plan for <span className="font-bold border-b border-indigo-400">"{snapshot.primary_theme}"</span>.
               </p>
               <button 
                 onClick={onBookSession}
                 className="w-full py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
               >
                 <Calendar size={20} />
                 Book Appointment
               </button>
            </div>

            {/* Expertise & Similar Cases */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                 <Briefcase size={16} /> Expertise
              </h3>
              <div className="mb-6">
                <p className="text-slate-300 leading-relaxed mb-4">
                  {mentor.matchReason} Specially trained in {mentor.specialty}.
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
                 <MessageCircle size={16} /> Recent Feedback
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