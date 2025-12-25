import React, { useState } from 'react';
import { LifeSnapshot, Mentor } from '../types';
import { generateMentorVideo } from '../services/geminiService';
import { Play, Loader2, Calendar, Video, Clock, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4">
          <button 
             onClick={onBack}
             className="p-3 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm"
          >
             <ArrowLeft size={20} />
          </button>
           {/* Header */}
          <div className="flex-1 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-6">
             <div className="w-24 h-24 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-4xl shadow-lg shadow-indigo-200">
               {mentor.name.charAt(0)}
             </div>
             <div>
               <h2 className="text-3xl font-bold text-slate-900">Meet {mentor.name}</h2>
               <p className="text-indigo-600 font-medium text-lg">{mentor.tagline}</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Video Section */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-rose-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            {loadingVideo ? (
              <div className="text-center space-y-4 z-10">
                <Loader2 className="animate-spin text-indigo-600 mx-auto" size={40} />
                <p className="text-slate-500 font-medium">Creating your personal welcome video...</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">This uses advanced AI to generate a scene matching {mentor.name}'s vibe.</p>
              </div>
            ) : videoUrl ? (
              <div className="w-full h-full relative z-10">
                <video src={videoUrl} autoPlay loop muted className="w-full h-full object-cover rounded-xl shadow-lg" />
                <p className="text-center text-xs text-slate-400 mt-4">Visual representation of {mentor.name}'s space</p>
              </div>
            ) : (
              <div className="text-center space-y-6 z-10">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Video size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">See Their Vibe</h3>
                  <p className="text-slate-500 text-sm mt-2">Generate a short welcome video.</p>
                </div>
                <button 
                  onClick={handleGenerateVideo}
                  className="px-6 py-2 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center gap-2 mx-auto"
                >
                  <Play size={16} fill="currentColor" />
                  Generate Video
                </button>
              </div>
            )}
          </div>

          {/* Booking Section */}
          <div className="space-y-6">
             <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl shadow-indigo-200">
               <h3 className="font-bold text-xl mb-4">Ready to start?</h3>
               <p className="text-indigo-100 mb-8 leading-relaxed">
                 Book a time to talk about "{snapshot.the_bottleneck}" and build a plan for "{snapshot.primary_theme}".
               </p>
               <button 
                 onClick={onBookSession}
                 className="w-full py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
               >
                 <Calendar size={20} />
                 Book Appointment
               </button>
             </div>

             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
               <div className="flex items-center gap-3 mb-4">
                 <Clock className="text-slate-400" size={20} />
                 <h4 className="font-bold text-slate-700">Next Available</h4>
               </div>
               <div className="flex gap-3">
                 <div className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium border border-slate-200">Today, 4:00 PM</div>
                 <div className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium border border-slate-200">Tmrw, 10:00 AM</div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default State5Workspace;