
import React, { useState } from 'react';
import { User, Mentor } from '../types';
import { ArrowLeft, ShieldCheck, Sparkles, Check, Info, AlertCircle, Edit3 } from 'lucide-react';

interface Props {
  user: User;
  onUpdateProfile: (mentor: Mentor | null) => void;
  onBack: () => void;
}

const MentorDashboard: React.FC<Props> = ({ user, onUpdateProfile, onBack }) => {
  const [isMentor, setIsMentor] = useState(user.isMentor);
  const [profile, setProfile] = useState<Partial<Mentor>>(user.mentorProfile || {
    name: user.name,
    type: 'Clarity Architect',
    category: 'Strategic',
    tagline: 'Empowering clarity through master architecture.',
    specialty: 'Life Design',
    approach: 'I believe in finding the hidden structures that hold you back and rebuilding them for success.',
    rating: 5.0,
    sessionsCount: 0,
    similarCases: ['Burnout', 'Pivot', 'Growth'],
    reviews: [],
    availability: 'Open'
  });

  const handleToggleMentor = () => {
    const newStatus = !isMentor;
    setIsMentor(newStatus);
    if (!newStatus) {
      onUpdateProfile(null); // Deactivate
    } else {
      onUpdateProfile({ ...profile, id: user.id } as Mentor); // Activate with existing profile
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMentor) {
      onUpdateProfile({ ...profile, id: user.id } as Mentor);
      alert("Profile updated successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 fade-in text-slate-100 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex items-center gap-4 border-b border-slate-800 pb-8">
           <button onClick={onBack} className="p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-white transition-all">
             <ArrowLeft size={20} />
           </button>
           <div>
              <h1 className="text-3xl font-bold tracking-tight">Mentor Hub</h1>
              <p className="text-slate-400 font-light mt-1">Manage your presence as a guide for others.</p>
           </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           {/* Sidebar: Status */}
           <div className="space-y-6">
              <div className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col items-center text-center space-y-4
                 ${isMentor ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-slate-900 border-slate-800 opacity-60'}`}>
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center
                    ${isMentor ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'bg-slate-800 text-slate-600'}`}>
                    <ShieldCheck size={32} />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold">{isMentor ? 'Active Mentor' : 'Mentor Inactive'}</h3>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Visibility Status</p>
                 </div>
                 <button 
                  onClick={handleToggleMentor}
                  className={`w-full py-3 rounded-xl font-bold transition-all
                    ${isMentor ? 'bg-rose-900/20 text-rose-400 hover:bg-rose-900/40' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
                 >
                   {isMentor ? 'Deactivate Profile' : 'Activate Profile'}
                 </button>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                 <div className="flex items-center gap-2 text-indigo-400">
                    <Info size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Brand Values</span>
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed italic">
                   "Guides on Unloop provide calm, structured insight. No judgment, only logic and empathy."
                 </p>
              </div>
           </div>

           {/* Main: Form */}
           <div className="md:col-span-2">
              {!isMentor ? (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-800 rounded-3xl space-y-6">
                   <div className="p-4 bg-slate-900 rounded-full text-slate-500">
                      <Sparkles size={40} />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-xl font-bold">You are a guide in the making.</h4>
                      <p className="text-slate-500 text-sm max-w-sm">Activate your profile to share your expertise and help others unloop their problems.</p>
                   </div>
                   <button onClick={handleToggleMentor} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold">Start Mentoring</button>
                </div>
              ) : (
                <form onSubmit={handleSave} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-8">
                   <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                      <Edit3 size={20} className="text-indigo-400" />
                      <h3 className="font-bold text-lg">Public Information</h3>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Display Name</label>
                         <input 
                           type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})}
                           className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                           required
                         />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Role Type</label>
                         <select 
                           value={profile.type} onChange={e => setProfile({...profile, type: e.target.value as any})}
                           className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                         >
                            <option value="Listener">Listener</option>
                            <option value="Domain Strategist">Domain Strategist</option>
                            <option value="Clarity Architect">Clarity Architect</option>
                         </select>
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
                         <select 
                           value={profile.category} onChange={e => setProfile({...profile, category: e.target.value as any})}
                           className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                         >
                            <option value="Emotional">Emotional</option>
                            <option value="Practical">Practical</option>
                            <option value="Strategic">Strategic</option>
                            <option value="Legal/Financial">Legal/Financial</option>
                            <option value="Health">Health</option>
                         </select>
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Specialty</label>
                         <input 
                           type="text" value={profile.specialty} onChange={e => setProfile({...profile, specialty: e.target.value})}
                           className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                           required
                         />
                      </div>
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">One-line Tagline</label>
                      <input 
                        type="text" value={profile.tagline} onChange={e => setProfile({...profile, tagline: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        placeholder="A catchy phrase for your profile card"
                      />
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">How you will help</label>
                      <textarea 
                        value={profile.approach} onChange={e => setProfile({...profile, approach: e.target.value})}
                        className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 resize-none"
                        placeholder="Describe your process and helpfulness..."
                      />
                   </div>

                   <div className="pt-4">
                      <button 
                        type="submit"
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 shadow-xl shadow-indigo-900/20 transition-all flex items-center justify-center gap-3"
                      >
                         <Check size={20} />
                         <span>Save Profile</span>
                      </button>
                   </div>
                </form>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
