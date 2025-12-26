
import React, { useState, useMemo } from 'react';
import { User, Mentor, SessionData } from '../types';
// Added Hexagon and Layers to the lucide-react imports
import { ArrowLeft, ShieldCheck, Check, Edit3, Calendar, Clock, FileText, User as UserIcon, X, Eye, ChevronRight, MessageSquare, Command, Sparkles, Hexagon, Layers } from 'lucide-react';

interface Props {
  user: User;
  allSessions: SessionData[];
  onUpdateProfile: (mentor: Mentor | null) => void;
  onBack: () => void;
}

const MentorDashboard: React.FC<Props> = ({ user, allSessions, onUpdateProfile, onBack }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'schedule' | 'mentees'>('schedule');
  const [isMentor, setIsMentor] = useState(user.isMentor);
  const [viewingReport, setViewingReport] = useState<SessionData | null>(null);
  const [selectedMenteeId, setSelectedMenteeId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  const [profile, setProfile] = useState<Partial<Mentor>>(user.mentorProfile || {
    name: user.name,
    email: user.email,
    phone: '',
    socialLink: '',
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

  const mySchedules = useMemo(() => {
    return allSessions.filter(s => s.selectedMentor?.id === user.id && s.bookedTime);
  }, [allSessions, user.id]);

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
    if (!newStatus) onUpdateProfile(null);
    else onUpdateProfile({ ...profile, id: user.id } as Mentor);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMentor) {
      setSaveStatus('saving');
      setTimeout(() => {
        onUpdateProfile({ ...profile, id: user.id } as Mentor);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian p-8 md:p-16 page-arrival text-silver overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 border-b border-slate-800 pb-12">
           <div className="flex items-center gap-6">
              <button onClick={onBack} className="p-5 bg-sanctuary rounded-[24px] border border-slate-800 text-slate-400 hover:text-unloop-400 transition-all shadow-2xl">
                <ArrowLeft size={24} />
              </button>
              <div className="space-y-1">
                 <div className="flex items-center gap-2 text-unloop-500">
                   <Command size={20} />
                   <span className="text-[12px] font-black uppercase tracking-[0.4em]">UnLOOP Hub</span>
                 </div>
                 <h1 className="text-4xl font-black tracking-tight text-white">Guide Dashboard</h1>
              </div>
           </div>

           <div className="flex bg-sanctuary p-2 rounded-[30px] border border-slate-800 shadow-2xl overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveTab('schedule')} className={`px-8 py-3 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'schedule' ? 'bg-unloop-600 text-white shadow-xl shadow-unloop-600/20' : 'text-slate-500 hover:text-unloop-400'}`}>Schedules</button>
              <button onClick={() => setActiveTab('mentees')} className={`px-8 py-3 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'mentees' ? 'bg-unloop-600 text-white shadow-xl shadow-unloop-600/20' : 'text-slate-500 hover:text-unloop-400'}`}>Mentees</button>
              <button onClick={() => setActiveTab('profile')} className={`px-8 py-3 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'profile' ? 'bg-unloop-600 text-white shadow-xl shadow-unloop-600/20' : 'text-slate-500 hover:text-unloop-400'}`}>Identity</button>
           </div>
        </header>

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="space-y-8">
                <div className={`p-12 rounded-[50px] border transition-all duration-700 flex flex-col items-center text-center space-y-8 ${isMentor ? 'bg-sanctuary border-unloop-500/20 shadow-3xl' : 'bg-sanctuary/30 border-slate-800 opacity-60'}`}>
                  <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center ${isMentor ? 'bg-unloop-600/10 text-unloop-400 border border-unloop-500/30' : 'bg-obsidian text-slate-700 border border-slate-800'}`}>
                    <ShieldCheck size={40} />
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold text-white">{isMentor ? 'Guide Status: Active' : 'Guide Status: Inactive'}</h3>
                      <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-[0.3em] font-black">Global Visibility</p>
                  </div>
                  <button onClick={handleToggleMentor} className={`w-full py-5 rounded-full font-bold transition-all text-sm uppercase tracking-widest ${isMentor ? 'bg-obsidian border border-slate-800 text-slate-500 hover:text-red-500' : 'bg-unloop-600 text-white hover:bg-unloop-500 shadow-xl shadow-unloop-600/20'}`}>{isMentor ? 'Deactivate guide identity' : 'Activate guide identity'}</button>
                </div>
            </div>

            <div className="lg:col-span-2">
                {!isMentor ? (
                  <div className="h-full flex flex-col items-center justify-center p-20 text-center border-2 border-dashed border-slate-800 rounded-[50px] space-y-8 bg-sanctuary/20">
                    <Sparkles size={48} className="text-slate-800" />
                    <p className="text-muted text-xl font-light max-w-sm">Help others stabilize their chaos. Secure your position as an UnLOOP Guide.</p>
                    <button onClick={handleToggleMentor} className="px-14 py-5 bg-unloop-600 text-white rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-unloop-600/20">Become a guide</button>
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="bg-sanctuary p-16 rounded-[50px] border border-slate-800 shadow-3xl space-y-12">
                    <div className="space-y-2 border-b border-slate-800 pb-6 flex items-center gap-4">
                        <Edit3 size={24} className="text-unloop-400" />
                        <h3 className="font-bold text-2xl text-white">Identity Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Public identity</label>
                          <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-obsidian border border-slate-800 rounded-[24px] px-8 py-5 text-white focus:outline-none focus:border-unloop-500 text-lg font-medium" required />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Secure node (Email)</label>
                          <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full bg-obsidian border border-slate-800 rounded-[24px] px-8 py-5 text-white focus:outline-none focus:border-unloop-500 text-lg font-medium" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Resolution tagline</label>
                        <input type="text" value={profile.tagline} onChange={e => setProfile({...profile, tagline: e.target.value})} className="w-full bg-obsidian border border-slate-800 rounded-[24px] px-8 py-5 text-white focus:outline-none focus:border-unloop-500 text-lg font-light italic" />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Architecture philosophy</label>
                        <textarea value={profile.approach} onChange={e => setProfile({...profile, approach: e.target.value})} className="w-full h-48 bg-obsidian border border-slate-800 rounded-[35px] px-8 py-6 text-white focus:outline-none focus:border-unloop-500 text-lg font-light resize-none leading-relaxed" />
                    </div>

                    <div className="pt-8">
                        <button type="submit" disabled={saveStatus === 'saving'} className={`w-full py-6 rounded-full font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-4 ${saveStatus === 'saved' ? 'bg-green-600 text-white' : 'bg-unloop-600 text-white hover:bg-unloop-500 shadow-2xl shadow-unloop-600/30'}`}>
                          {saveStatus === 'saving' ? 'Processing Alignment...' : saveStatus === 'saved' ? <><Check size={20} /> Identity Secure</> : 'Update guide identity'}
                        </button>
                    </div>
                  </form>
                )}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-12">
             <div className="bg-sanctuary p-16 rounded-[50px] border border-slate-800 shadow-3xl">
               <div className="flex items-center gap-4 mb-12 text-unloop-400">
                 <Calendar size={28} />
                 <h3 className="text-3xl font-black tracking-tight text-white">Active Appointments</h3>
               </div>
               
               {mySchedules.length === 0 ? (
                 <div className="text-center py-32 border-2 border-dashed border-slate-800 rounded-[40px] bg-obsidian/50">
                   <p className="text-slate-600 font-light italic text-xl">No active resolution sessions confirmed.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {mySchedules.map((session) => (
                      <div key={session.id} className="p-10 bg-obsidian rounded-[45px] border border-slate-800 hover:border-unloop-500/50 transition-all group shadow-2xl">
                        <div className="flex justify-between items-start mb-10">
                           <div className="flex items-center gap-5">
                              <div className="w-16 h-16 bg-sanctuary rounded-[24px] flex items-center justify-center text-unloop-400 border border-slate-800 font-bold text-2xl shadow-inner">U</div>
                              <div>
                                <h4 className="font-bold text-white text-lg">Mentee-{session.userId?.slice(-4)}</h4>
                                <p className="text-[10px] text-muted uppercase font-black tracking-widest mt-1">{session.label}</p>
                              </div>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-unloop-300 font-bold text-lg mb-10 bg-unloop-600/5 p-4 rounded-2xl border border-unloop-500/10">
                           <Clock size={20} />
                           {session.bookedTime}
                        </div>

                        <div className="space-y-4 pt-8 border-t border-slate-800">
                           <button onClick={() => setViewingReport(session)} className="w-full flex items-center justify-center gap-3 py-4 bg-sanctuary text-silver rounded-full text-xs font-black uppercase tracking-widest border border-slate-800 hover:border-unloop-500 hover:bg-obsidian transition-all">
                             <FileText size={18} /> Review Architecture
                           </button>
                           {session.collaborationHistory && session.collaborationHistory.length > 0 && (
                             <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-unloop-500 mt-2">
                               <MessageSquare size={12} />
                               <span>{session.collaborationHistory.length} New Messages</span>
                             </div>
                           )}
                        </div>
                      </div>
                    ))}
                 </div>
               )}
             </div>
          </div>
        )}

        {activeTab === 'mentees' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1 space-y-6">
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 ml-2">Connected Nodes</h3>
               {mentees.length === 0 ? (
                 <p className="text-sm text-slate-600 italic px-4">No structural connections established.</p>
               ) : mentees.map(([uId, data]) => (
                  <button key={uId} onClick={() => setSelectedMenteeId(uId)} className={`w-full p-8 rounded-[40px] border text-left transition-all flex items-center gap-5 shadow-2xl ${selectedMenteeId === uId ? 'bg-unloop-600/10 border-unloop-500/50 text-white' : 'bg-sanctuary border-slate-800 text-slate-500 hover:bg-sanctuary/80 hover:border-slate-700'}`}>
                    <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center font-black text-xl ${selectedMenteeId === uId ? 'bg-unloop-600 text-white' : 'bg-obsidian text-slate-700 border border-slate-800'}`}>U</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-lg">{data.name}</p>
                      <p className="text-[10px] uppercase font-black tracking-widest mt-1 opacity-60">{data.sessions.length} Problem Loops</p>
                    </div>
                  </button>
               ))}
            </div>
            
            <div className="lg:col-span-3">
              {selectedMenteeId ? (
                <div className="bg-sanctuary p-16 rounded-[55px] border border-slate-800 shadow-3xl space-y-12 min-h-[600px] animate-arrival">
                   <header className="flex items-center gap-8 pb-10 border-b border-slate-800">
                     <div className="w-20 h-20 bg-unloop-600/10 text-unloop-400 rounded-[30px] flex items-center justify-center font-bold border border-unloop-500/20 shadow-inner"><UserIcon size={40} /></div>
                     <div>
                       <h3 className="text-4xl font-black tracking-tight text-white">{mentees.find(([uId]) => uId === selectedMenteeId)?.[1].name}</h3>
                       <p className="text-lg text-muted font-light mt-1">Stabilization history for this mentee.</p>
                     </div>
                   </header>
                   
                   <div className="space-y-10">
                     {mentees.find(([uId]) => uId === selectedMenteeId)?.[1].sessions.map(s => (
                      <div key={s.id} className="p-10 bg-obsidian rounded-[45px] border border-slate-800 space-y-8 shadow-inner">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div>
                            <h4 className="font-bold text-2xl text-white tracking-tight">{s.label}</h4>
                            <p className="text-muted mt-2 italic font-light text-lg">"{s.snapshot.primary_theme}"</p>
                          </div>
                          <button onClick={() => setViewingReport(s)} className="flex items-center gap-3 px-8 py-4 bg-sanctuary text-unloop-400 rounded-full text-xs font-black uppercase tracking-widest border border-unloop-500/20 hover:bg-unloop-600 hover:text-white transition-all shadow-xl">
                            <Eye size={20} /> Review Blueprint
                          </button>
                        </div>

                        {/* Dialogue History View - ESSENTIAL FIX */}
                        <div className="pt-10 border-t border-slate-800 space-y-6">
                           <div className="flex items-center gap-3 text-unloop-500">
                             <MessageSquare size={20} />
                             <h5 className="text-[12px] font-black uppercase tracking-[0.3em]">Communication History</h5>
                           </div>
                           
                           {s.collaborationHistory && s.collaborationHistory.length > 0 ? (
                             <div className="space-y-4">
                                {s.collaborationHistory.map(msg => (
                                  <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'}`}>
                                    <div className="flex items-center gap-2 mb-1.5 px-3">
                                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{msg.role === 'user' ? 'Mentee' : 'You'}</span>
                                       <span className="text-[8px] text-slate-800">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div className={`p-6 rounded-[25px] text-sm font-light leading-relaxed max-w-[90%] shadow-lg ${msg.role === 'user' ? 'bg-sanctuary border border-slate-800 text-silver' : 'bg-unloop-600/10 border border-unloop-500/20 text-unloop-100'}`}>
                                       {msg.content}
                                    </div>
                                  </div>
                                ))}
                             </div>
                           ) : (
                             <p className="text-sm text-slate-700 italic bg-obsidian/50 p-6 rounded-3xl border border-slate-800/50">No discussion history recorded yet for this resolution path.</p>
                           )}
                        </div>
                      </div>
                   ))}
                   </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-32 text-center border-2 border-dashed border-slate-800 rounded-[55px] text-slate-800 bg-sanctuary/10">
                  <UserIcon size={64} className="mb-6 opacity-20" />
                  <p className="font-light italic text-xl">Select a node to begin architectural review.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Full Blueprint Review Modal */}
      {viewingReport && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-8 animate-arrival">
           <div className="absolute inset-0 bg-obsidian/95 backdrop-blur-xl" onClick={() => setViewingReport(null)} />
           <div className="relative bg-sanctuary border border-slate-800 w-full max-w-4xl rounded-[60px] shadow-3xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="p-12 border-b border-slate-800 flex justify-between items-center bg-sanctuary/50">
                 <div className="flex items-center gap-5 text-unloop-400">
                    <FileText size={32} />
                    <h3 className="text-3xl font-black tracking-tighter text-white uppercase tracking-widest">Master Blueprint Review</h3>
                 </div>
                 <button onClick={() => setViewingReport(null)} className="p-4 bg-obsidian rounded-full text-slate-500 hover:text-white transition-all border border-slate-800"><X size={28} /></button>
              </div>

              <div className="p-14 overflow-y-auto space-y-16 no-scrollbar">
                 <section className="space-y-6">
                    <div className="flex items-center gap-3 text-unloop-500">
                      <Hexagon size={18} />
                      <h4 className="text-[11px] font-black uppercase tracking-[0.4em]">Primary Theme Node</h4>
                    </div>
                    <p className="text-4xl font-light italic leading-tight text-white tracking-tight">
                      "{viewingReport.snapshot.primary_theme}"
                    </p>
                 </section>

                 <section className="space-y-6">
                    <div className="flex items-center gap-3 text-unloop-500">
                      <Layers size={18} />
                      <h4 className="text-[11px] font-black uppercase tracking-[0.4em]">Mapped Bottleneck</h4>
                    </div>
                    <div className="p-10 bg-obsidian border border-slate-800 rounded-[40px] text-silver font-light leading-relaxed text-xl shadow-inner">
                      {viewingReport.snapshot.the_bottleneck}
                    </div>
                 </section>

                 {/* Historical Record in Blueprint */}
                 {viewingReport.collaborationHistory && viewingReport.collaborationHistory.length > 0 && (
                   <section className="space-y-8">
                      <div className="flex items-center gap-4 text-unloop-500">
                        <MessageSquare size={20} />
                        <h4 className="text-[12px] font-black uppercase tracking-[0.4em]">Historical Resolution Thread</h4>
                      </div>
                      <div className="space-y-8 bg-obsidian/40 p-10 rounded-[50px] border border-slate-800 shadow-2xl">
                        {viewingReport.collaborationHistory.map(msg => (
                          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'}`}>
                            <div className="flex gap-3 items-center px-4 mb-2">
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{msg.role === 'user' ? 'Mentee' : 'Guide'}</span>
                               <span className="text-[8px] text-slate-800 font-bold">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <div className={`p-8 rounded-[35px] text-lg font-light leading-relaxed max-w-[95%] shadow-2xl ${msg.role === 'user' ? 'bg-sanctuary border border-slate-800 text-silver' : 'bg-unloop-600 text-white'}`}>
                               {msg.content}
                            </div>
                          </div>
                        ))}
                      </div>
                   </section>
                 )}
              </div>
              <div className="p-12 bg-obsidian/50 border-t border-slate-800 flex justify-center">
                <button onClick={() => setViewingReport(null)} className="px-16 py-5 bg-unloop-600 text-white rounded-full font-black text-sm uppercase tracking-[0.2em] hover:bg-unloop-500 transition-all shadow-xl shadow-unloop-600/20">
                  Exit Architecture Review
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
