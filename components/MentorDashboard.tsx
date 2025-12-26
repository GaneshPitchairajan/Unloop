
import React, { useState, useMemo } from 'react';
import { User, Mentor, SessionData } from '../types';
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
    category: 'Life Coaching',
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
    <div className="min-h-screen bg-void p-8 md:p-16 page-arrival text-high overflow-y-auto no-scrollbar">
      <div className="max-w-7xl mx-auto space-y-12 pb-32">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 border-b border-slate-800 pb-12 relative">
           <div className="flex items-center gap-6">
              <button onClick={onBack} className="p-4 bg-sanctuary rounded-[20px] border border-slate-800 text-dim hover:text-resolution-cyan transition-all shadow-2xl">
                <ArrowLeft size={20} />
              </button>
              <div className="space-y-1">
                 <div className="flex items-center gap-2 text-resolution-indigo">
                   <Command size={16} />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em]">UnLOOP Hub</span>
                 </div>
                 <h1 className="text-3xl font-black tracking-tight text-white">Guide Dashboard</h1>
              </div>
           </div>

           <div className="flex bg-sanctuary p-2 rounded-[25px] border border-slate-800 shadow-2xl overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveTab('schedule')} className={`px-6 py-2.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'schedule' ? 'bg-resolution-indigo text-white shadow-xl' : 'text-dim hover:text-resolution-cyan'}`}>Schedules</button>
              <button onClick={() => setActiveTab('mentees')} className={`px-6 py-2.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'mentees' ? 'bg-resolution-indigo text-white shadow-xl' : 'text-dim hover:text-resolution-cyan'}`}>Mentees</button>
              <button onClick={() => setActiveTab('profile')} className={`px-6 py-2.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'profile' ? 'bg-resolution-indigo text-white shadow-xl' : 'text-dim hover:text-resolution-cyan'}`}>Identity</button>
           </div>
        </header>

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="space-y-8">
                <div className={`p-10 rounded-[40px] border transition-all duration-700 flex flex-col items-center text-center space-y-8 ${isMentor ? 'bg-sanctuary border-resolution-indigo/20 shadow-3xl' : 'bg-sanctuary/30 border-slate-800 opacity-60'}`}>
                  <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center ${isMentor ? 'bg-resolution-indigo/10 text-resolution-indigo border border-resolution-indigo/30' : 'bg-void text-slate-800 border border-slate-800'}`}>
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                      <h3 className="text-xl font-bold text-white">{isMentor ? 'Status: Active' : 'Status: Inactive'}</h3>
                      <p className="text-[9px] text-dim mt-2 uppercase tracking-[0.3em] font-black">Global Reach</p>
                  </div>
                  <button onClick={handleToggleMentor} className={`w-full py-4 rounded-full font-bold transition-all text-[10px] uppercase tracking-widest ${isMentor ? 'bg-void border border-slate-800 text-dim hover:text-red-500' : 'bg-resolution-indigo text-white hover:bg-resolution-cyan shadow-xl'}`}>{isMentor ? 'Deactivate guide' : 'Activate guide'}</button>
                </div>
            </div>

            <div className="lg:col-span-2">
                {!isMentor ? (
                  <div className="h-full flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-slate-800 rounded-[40px] space-y-8 bg-sanctuary/20">
                    <Sparkles size={40} className="text-slate-800" />
                    <p className="text-dim text-lg font-light max-w-sm">Help others stabilize their chaos. Secure your position as an UnLOOP Guide.</p>
                    <button onClick={handleToggleMentor} className="px-12 py-4 bg-resolution-indigo text-white rounded-full font-black text-[11px] uppercase tracking-widest shadow-xl">Become a guide</button>
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="bg-sanctuary p-12 rounded-[40px] border border-slate-800 shadow-3xl space-y-10">
                    <div className="space-y-2 border-b border-slate-800 pb-6 flex items-center gap-4">
                        <Edit3 size={20} className="text-resolution-indigo" />
                        <h3 className="font-bold text-xl text-white">Identity Core</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-dim uppercase tracking-[0.3em] ml-2">Display name</label>
                          <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-void border border-slate-800 rounded-[20px] px-6 py-4 text-white focus:outline-none focus:border-resolution-indigo text-base font-medium" required />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-dim uppercase tracking-[0.3em] ml-2">Secure email</label>
                          <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full bg-void border border-slate-800 rounded-[20px] px-6 py-4 text-white focus:outline-none focus:border-resolution-indigo text-base font-medium" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-dim uppercase tracking-[0.3em] ml-2">Resolution tagline</label>
                        <input type="text" value={profile.tagline} onChange={e => setProfile({...profile, tagline: e.target.value})} className="w-full bg-void border border-slate-800 rounded-[20px] px-6 py-4 text-white focus:outline-none focus:border-resolution-indigo text-base font-light italic" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-dim uppercase tracking-[0.3em] ml-2">Architecture philosophy</label>
                        <textarea value={profile.approach} onChange={e => setProfile({...profile, approach: e.target.value})} className="w-full h-40 bg-void border border-slate-800 rounded-[30px] px-6 py-5 text-white focus:outline-none focus:border-resolution-indigo text-sm font-light resize-none leading-relaxed" />
                    </div>

                    <div className="pt-6">
                        <button type="submit" disabled={saveStatus === 'saving'} className={`w-full py-5 rounded-full font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${saveStatus === 'saved' ? 'bg-green-600 text-white' : 'bg-resolution-indigo text-white hover:bg-resolution-cyan shadow-2xl'}`}>
                          {saveStatus === 'saving' ? 'Syncing...' : saveStatus === 'saved' ? <><Check size={16} /> Identity Locked</> : 'Update Identity'}
                        </button>
                    </div>
                  </form>
                )}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-10">
             <div className="bg-sanctuary p-12 rounded-[40px] border border-slate-800 shadow-3xl">
               <div className="flex items-center gap-3 mb-10 text-resolution-indigo">
                 <Calendar size={24} />
                 <h3 className="text-2xl font-black tracking-tight text-white uppercase tracking-wider">Appointments</h3>
               </div>
               
               {mySchedules.length === 0 ? (
                 <div className="text-center py-24 border-2 border-dashed border-slate-800 rounded-[35px] bg-void/50">
                   <p className="text-dim font-light italic text-lg opacity-60">No active resolution slots confirmed.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mySchedules.map((session) => (
                      <div key={session.id} className="p-8 bg-void rounded-[35px] border border-slate-800 hover:border-resolution-indigo/50 transition-all group shadow-2xl">
                        <div className="flex justify-between items-start mb-8">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-sanctuary rounded-[18px] flex items-center justify-center text-resolution-indigo border border-slate-800 font-bold text-xl shadow-inner">U</div>
                              <div>
                                <h4 className="font-bold text-white text-base">Client Authority</h4>
                                <p className="text-[8px] text-dim uppercase font-black tracking-widest mt-0.5">{session.label}</p>
                              </div>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-resolution-cyan font-bold text-sm mb-8 bg-resolution-cyan/5 p-3 rounded-xl border border-resolution-cyan/10">
                           <Clock size={16} />
                           {session.bookedTime}
                        </div>

                        <div className="space-y-3 pt-6 border-t border-slate-800">
                           <button onClick={() => setViewingReport(session)} className="w-full flex items-center justify-center gap-2 py-3 bg-sanctuary text-dim rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-800 hover:border-resolution-indigo transition-all">
                             <FileText size={16} /> Review Blueprint
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-1 space-y-4">
               <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-dim mb-6 ml-2">Active Channels</h3>
               {mentees.length === 0 ? (
                 <p className="text-xs text-dim italic px-4">No structural connections.</p>
               ) : mentees.map(([uId, data]) => (
                  <button key={uId} onClick={() => setSelectedMenteeId(uId)} className={`w-full p-6 rounded-[30px] border text-left transition-all flex items-center gap-4 shadow-xl ${selectedMenteeId === uId ? 'bg-resolution-indigo/10 border-resolution-indigo/50 text-white' : 'bg-sanctuary border-slate-800 text-dim hover:bg-sanctuary/80 hover:border-slate-700'}`}>
                    <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center font-black text-sm ${selectedMenteeId === uId ? 'bg-resolution-indigo text-white' : 'bg-void text-slate-700 border border-slate-800'}`}>U</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-sm">{data.name}</p>
                      <p className="text-[8px] uppercase font-black tracking-widest mt-0.5 opacity-60">{data.sessions.length} Threads</p>
                    </div>
                  </button>
               ))}
            </div>
            
            <div className="lg:col-span-3">
              {selectedMenteeId ? (
                <div className="bg-sanctuary p-12 rounded-[40px] border border-slate-800 shadow-3xl space-y-10 min-h-[500px] animate-arrival">
                   <header className="flex items-center gap-6 pb-8 border-b border-slate-800">
                     <div className="w-14 h-14 bg-resolution-indigo/10 text-resolution-indigo rounded-[20px] flex items-center justify-center font-bold border border-resolution-indigo/20 shadow-inner"><UserIcon size={28} /></div>
                     <div>
                       <h3 className="text-2xl font-black tracking-tight text-white">{mentees.find(([uId]) => uId === selectedMenteeId)?.[1].name}</h3>
                       <p className="text-sm text-dim font-light mt-0.5">Communication log.</p>
                     </div>
                   </header>
                   
                   <div className="space-y-8">
                     {mentees.find(([uId]) => uId === selectedMenteeId)?.[1].sessions.map(s => (
                      <div key={s.id} className="p-8 bg-void rounded-[35px] border border-slate-800 space-y-6 shadow-inner">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <h4 className="font-bold text-xl text-white tracking-tight">{s.label}</h4>
                            <p className="text-dim mt-1 italic font-light text-sm opacity-80">"{s.snapshot.primary_theme}"</p>
                          </div>
                          <button onClick={() => setViewingReport(s)} className="flex items-center gap-2 px-6 py-3 bg-sanctuary text-resolution-indigo rounded-full text-[9px] font-black uppercase tracking-widest border border-resolution-indigo/20 hover:bg-resolution-indigo hover:text-white transition-all">
                            <Eye size={16} /> Blueprint
                          </button>
                        </div>

                        <div className="pt-8 border-t border-slate-800 space-y-4">
                           <div className="flex items-center gap-2 text-resolution-indigo">
                             <MessageSquare size={16} />
                             <h5 className="text-[9px] font-black uppercase tracking-[0.3em]">Communication Stream</h5>
                           </div>
                           
                           {s.collaborationHistory && s.collaborationHistory.length > 0 ? (
                             <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                {s.collaborationHistory.map(msg => (
                                  <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'}`}>
                                    <div className="flex items-center gap-2 mb-1 px-2 opacity-50">
                                       <span className="text-[7px] font-black uppercase tracking-widest text-high">{msg.role === 'user' ? 'Client' : 'Guide'}</span>
                                       <span className="text-[7px]">{new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <div className={`p-4 rounded-[20px] text-xs font-light leading-relaxed max-w-[90%] shadow-lg ${msg.role === 'user' ? 'bg-sanctuary border border-slate-800 text-high' : 'bg-resolution-indigo/10 border border-resolution-indigo/20 text-high'}`}>
                                       {msg.content}
                                    </div>
                                  </div>
                                ))}
                             </div>
                           ) : (
                             <p className="text-[11px] text-slate-700 italic bg-void/30 p-4 rounded-2xl border border-slate-800/40">No historical transmission.</p>
                           )}
                        </div>
                      </div>
                   ))}
                   </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-24 text-center border-2 border-dashed border-slate-800 rounded-[40px] text-slate-800 bg-sanctuary/10">
                  <UserIcon size={48} className="mb-4 opacity-20" />
                  <p className="font-light italic text-lg opacity-40">Select a node to review architecture.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Blueprint Review Modal */}
      {viewingReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-arrival">
           <div className="absolute inset-0 bg-void/95 backdrop-blur-xl" onClick={() => setViewingReport(null)} />
           <div className="relative bg-sanctuary border border-slate-800 w-full max-w-3xl rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh] overflow-hidden">
              <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-sanctuary/50">
                 <div className="flex items-center gap-4 text-resolution-indigo">
                    <FileText size={24} />
                    <h3 className="text-xl font-black tracking-tight text-white uppercase tracking-widest">Master Blueprint Review</h3>
                 </div>
                 <button onClick={() => setViewingReport(null)} className="p-3 bg-void rounded-full text-dim hover:text-white transition-all border border-slate-800"><X size={20} /></button>
              </div>

              <div className="p-10 overflow-y-auto space-y-12 no-scrollbar">
                 <section className="space-y-4">
                    <div className="flex items-center gap-2 text-resolution-indigo">
                      <Hexagon size={14} />
                      <h4 className="text-[9px] font-black uppercase tracking-[0.4em]">Primary Theme Node</h4>
                    </div>
                    <p className="text-2xl font-light italic leading-tight text-white tracking-tight">
                      "{viewingReport.snapshot.primary_theme}"
                    </p>
                 </section>

                 <section className="space-y-4">
                    <div className="flex items-center gap-2 text-resolution-indigo">
                      <Layers size={14} />
                      <h4 className="text-[9px] font-black uppercase tracking-[0.4em]">Structural Bottleneck</h4>
                    </div>
                    <div className="p-6 bg-void border border-slate-800 rounded-[25px] text-dim font-light leading-relaxed text-base shadow-inner">
                      {viewingReport.snapshot.the_bottleneck}
                    </div>
                 </section>

                 {viewingReport.collaborationHistory && viewingReport.collaborationHistory.length > 0 && (
                   <section className="space-y-6">
                      <div className="flex items-center gap-3 text-resolution-indigo">
                        <MessageSquare size={16} />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">Collaboration Log</h4>
                      </div>
                      <div className="space-y-6 bg-void/40 p-6 rounded-[35px] border border-slate-800">
                        {viewingReport.collaborationHistory.map(msg => (
                          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'}`}>
                            <div className="flex gap-2 items-center px-2 mb-1 opacity-50">
                               <span className="text-[7px] font-black uppercase tracking-widest text-dim">{msg.role === 'user' ? 'Client' : 'Guide'}</span>
                               <span className="text-[7px]">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <div className={`p-4 rounded-[18px] text-xs font-light leading-relaxed max-w-[95%] shadow-lg ${msg.role === 'user' ? 'bg-sanctuary border border-slate-800 text-high' : 'bg-resolution-indigo text-white'}`}>
                               {msg.content}
                            </div>
                          </div>
                        ))}
                      </div>
                   </section>
                 )}
              </div>
              <div className="p-8 bg-void/50 border-t border-slate-800 flex justify-center">
                <button onClick={() => setViewingReport(null)} className="px-12 py-3.5 bg-resolution-indigo text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-resolution-cyan transition-all shadow-xl">
                  Exit Review
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
