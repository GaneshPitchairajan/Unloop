
import React, { useState, useMemo } from 'react';
import { User, Mentor, SessionData, LifeSnapshot } from '../types';
import { ArrowLeft, ShieldCheck, Sparkles, Check, Info, Edit3, Calendar, Clock, FileText, User as UserIcon, X, Eye, ChevronRight } from 'lucide-react';

interface Props {
  user: User;
  allSessions: SessionData[];
  onUpdateProfile: (mentor: Mentor | null) => void;
  onBack: () => void;
}

const MentorDashboard: React.FC<Props> = ({ user, allSessions, onUpdateProfile, onBack }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'schedule' | 'mentees'>('schedule');
  const [isMentor, setIsMentor] = useState(user.isMentor);
  const [viewingReport, setViewingReport] = useState<LifeSnapshot | null>(null);
  const [selectedMenteeId, setSelectedMenteeId] = useState<string | null>(null);
  
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

  // Filter sessions where THIS user is the selected mentor
  const mySchedules = useMemo(() => {
    return allSessions.filter(s => s.selectedMentor?.id === user.id && s.bookedTime);
  }, [allSessions, user.id]);

  // Unique mentees who have booked with this mentor
  const mentees = useMemo(() => {
    const uniqueUsers = new Map<string, {name: string, sessions: SessionData[]}>();
    allSessions.filter(s => s.selectedMentor?.id === user.id).forEach(s => {
      const uId = s.userId || 'unknown';
      if (!uniqueUsers.has(uId)) {
        uniqueUsers.set(uId, { name: 'User-' + uId.slice(-4), sessions: [] });
      }
      uniqueUsers.get(uId)!.sessions.push(s);
    });
    return Array.from(uniqueUsers.entries());
  }, [allSessions, user.id]);

  const handleToggleMentor = () => {
    const newStatus = !isMentor;
    setIsMentor(newStatus);
    if (!newStatus) {
      onUpdateProfile(null);
    } else {
      onUpdateProfile({ ...profile, id: user.id } as Mentor);
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
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 fade-in text-slate-100 overflow-y-auto relative">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
           <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-white transition-all shadow-lg">
                <ArrowLeft size={20} />
              </button>
              <div>
                 <h1 className="text-3xl font-bold tracking-tight">Mentor Hub</h1>
                 <p className="text-slate-400 font-light mt-1">Guide others and manage your sessions.</p>
              </div>
           </div>

           <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto flex-wrap">
              <button 
                onClick={() => setActiveTab('schedule')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'schedule' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Calendar size={14} /> Schedule
              </button>
              <button 
                onClick={() => setActiveTab('mentees')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'mentees' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <UserIcon size={14} /> Mentees
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Edit3 size={14} /> My Profile
              </button>
           </div>
        </header>

        {activeTab === 'profile' && (
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

            {/* Main: Profile Form */}
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
                        <h3 className="font-bold text-lg text-slate-100">Public Information</h3>
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
                          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 shadow-xl shadow-indigo-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                          <Check size={20} />
                          <span>Save Changes</span>
                        </button>
                    </div>
                  </form>
                )}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-6">
             <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
               <div className="flex items-center gap-3 mb-8">
                  <Calendar className="text-indigo-400" size={24} />
                  <h3 className="text-xl font-bold text-slate-100">Active Schedules</h3>
               </div>
               
               {mySchedules.length === 0 ? (
                 <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/50">
                   <div className="p-4 bg-slate-900 rounded-full w-fit mx-auto text-slate-600 mb-4">
                      <Clock size={32} />
                   </div>
                   <p className="text-slate-400 font-medium">No sessions booked yet.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mySchedules.map((session) => (
                      <div key={session.id} className="p-6 bg-slate-950 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-indigo-400">
                                 <UserIcon size={20} />
                              </div>
                              <div>
                                 <h4 className="font-bold text-slate-200">User-{session.userId?.slice(-4) || '??'}</h4>
                                 <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{session.label}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-bold">
                                 <Clock size={14} />
                                 {session.bookedTime?.split(' at ')[1]}
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-800/50">
                           <button 
                            onClick={() => setViewingReport(session.snapshot)}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-900/30 hover:text-indigo-300 transition-all border border-slate-700"
                           >
                             <FileText size={14} />
                             Quick Report
                           </button>
                        </div>
                      </div>
                    ))}
                 </div>
               )}
             </div>
          </div>
        )}

        {activeTab === 'mentees' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Mentee List Sidebar */}
            <div className="lg:col-span-1 space-y-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Your Mentees</h3>
               {mentees.length === 0 ? (
                 <p className="text-xs text-slate-600 italic">No mentees connected yet.</p>
               ) : (
                 mentees.map(([uId, data]) => (
                    <button 
                      key={uId}
                      onClick={() => setSelectedMenteeId(uId)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-3
                        ${selectedMenteeId === uId ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                      <UserIcon size={18} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate text-sm">{data.name}</p>
                        <p className={`text-[10px] uppercase font-bold ${selectedMenteeId === uId ? 'text-indigo-200' : 'text-slate-600'}`}>{data.sessions.length} Problems</p>
                      </div>
                    </button>
                 ))
               )}
            </div>

            {/* Mentee Detailed View */}
            <div className="lg:col-span-3">
              {selectedMenteeId ? (
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-8 min-h-[500px]">
                   <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
                      <div className="w-12 h-12 bg-indigo-900 text-indigo-300 rounded-xl flex items-center justify-center font-bold">
                        <UserIcon size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{mentees.find(([uId]) => uId === selectedMenteeId)?.[1].name}</h3>
                        <p className="text-sm text-slate-500">History of problems shared with you.</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      {mentees.find(([uId]) => uId === selectedMenteeId)?.[1].sessions.map(s => (
                        <div key={s.id} className="p-6 bg-slate-950 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all">
                           <div className="flex justify-between items-start mb-4">
                              <div>
                                 <h4 className="font-bold text-lg text-slate-200">{s.label}</h4>
                                 <p className="text-xs text-slate-500 mt-1 italic">"{s.snapshot.primary_theme}"</p>
                              </div>
                              <button 
                                onClick={() => setViewingReport(s.snapshot)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-900/30 text-indigo-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-indigo-900/40 hover:bg-indigo-900/50"
                              >
                                <Eye size={12} /> View Full Report
                              </button>
                           </div>
                           <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                              <p className="text-[10px] font-bold uppercase text-slate-600 mb-1">Bottleneck</p>
                              <p className="text-sm text-slate-400">{s.snapshot.the_bottleneck}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-20 text-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-600">
                   <UserIcon size={48} className="mb-4 opacity-20" />
                   <p>Select a mentee from the sidebar to see their user-wise reports and history.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Report View Overlay */}
      {viewingReport && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 fade-in">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setViewingReport(null)} />
           <div className="relative bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                 <div className="flex items-center gap-3">
                    <Sparkles className="text-indigo-400" size={20} />
                    <h3 className="font-bold text-slate-100">Mentee Clarity Report</h3>
                 </div>
                 <button onClick={() => setViewingReport(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
                    <X size={20} />
                 </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-8 no-scrollbar">
                 <section className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">The Problem Core</h4>
                    <p className="text-2xl font-light text-slate-100 leading-tight">"{viewingReport.primary_theme}"</p>
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                       <p className="text-sm text-slate-300 italic">"The Bottleneck: {viewingReport.the_bottleneck}"</p>
                    </div>
                 </section>

                 <section className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Pattern Matrix</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       {viewingReport.pattern_matrix.map((p, i) => (
                         <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                            <span className="text-xs text-slate-300">{p.behavior}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.frequency === 'High' ? 'bg-amber-900/40 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>{p.frequency}</span>
                         </div>
                       ))}
                    </div>
                 </section>

                 <section className="p-5 bg-indigo-900/10 border border-indigo-900/30 rounded-2xl">
                    <h4 className="text-xs font-bold uppercase text-indigo-400 mb-2">Recommended First Step</h4>
                    <p className="text-slate-200 text-sm italic">"{viewingReport.low_effort_action}"</p>
                 </section>
              </div>

              <div className="p-6 bg-slate-900/50 border-t border-slate-800">
                 <button onClick={() => setViewingReport(null)} className="w-full py-3 bg-slate-800 text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-700 transition-all">
                    Finish Reviewing
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
