
import React, { useState, useMemo } from 'react';
import { User, Mentor, SessionData } from '../types';
import { ArrowLeft, ShieldCheck, Check, Edit3, Calendar, Clock, FileText, User as UserIcon, X, Eye, ChevronRight, MessageSquare, Send, Command } from 'lucide-react';

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
    <div className="min-h-screen bg-paper p-8 md:p-16 page-arrival text-charcoal overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-slate-100 pb-12">
           <div className="flex items-center gap-5">
              <button onClick={onBack} className="p-4 bg-white rounded-full calm-shadow border border-slate-50 text-slate-300 hover:text-calm-500 transition-all">
                <ArrowLeft size={20} />
              </button>
              <div className="space-y-1">
                 <div className="flex items-center gap-2 text-calm-300">
                   <Command size={14} />
                   <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">UnLOOP Hub</span>
                 </div>
                 <h1 className="text-3xl font-medium tracking-tight">Guide dashboard</h1>
              </div>
           </div>

           <div className="flex bg-white p-1.5 rounded-full calm-shadow border border-slate-50 self-start md:self-auto overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveTab('schedule')} className={`px-6 py-2.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'schedule' ? 'bg-calm-500 text-white shadow-sm' : 'text-slate-400 hover:text-calm-500'}`}>Schedule</button>
              <button onClick={() => setActiveTab('mentees')} className={`px-6 py-2.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'mentees' ? 'bg-calm-500 text-white shadow-sm' : 'text-slate-400 hover:text-calm-500'}`}>Mentees</button>
              <button onClick={() => setActiveTab('profile')} className={`px-6 py-2.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'profile' ? 'bg-calm-500 text-white shadow-sm' : 'text-slate-400 hover:text-calm-500'}`}>Identity</button>
           </div>
        </header>

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="space-y-8">
                <div className={`p-10 rounded-[40px] border transition-all duration-700 flex flex-col items-center text-center space-y-6 ${isMentor ? 'bg-white border-calm-100 calm-shadow' : 'bg-white/50 border-slate-50 opacity-60'}`}>
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${isMentor ? 'bg-calm-50 text-calm-500 border border-calm-100' : 'bg-paper text-slate-200 border border-slate-50'}`}>
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                      <h3 className="text-xl font-medium">{isMentor ? 'Guide active' : 'Guide inactive'}</h3>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-semibold">Visibility status</p>
                  </div>
                  <button onClick={handleToggleMentor} className={`w-full py-4 rounded-full font-medium transition-all text-sm ${isMentor ? 'bg-paper text-slate-400 hover:text-rose-500' : 'bg-calm-500 text-white hover:bg-calm-600'}`}>{isMentor ? 'Deactivate identity' : 'Activate identity'}</button>
                </div>
            </div>

            <div className="lg:col-span-2">
                {!isMentor ? (
                  <div className="h-full flex flex-col items-center justify-center p-20 text-center border-2 border-dashed border-slate-100 rounded-[40px] space-y-6">
                    <p className="text-slate-400 font-light max-w-xs">Start your journey as a guide and help others unloop their complexity.</p>
                    <button onClick={handleToggleMentor} className="px-10 py-4 bg-calm-500 text-white rounded-full font-medium text-sm">Become a guide</button>
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="bg-white p-12 rounded-[40px] border border-slate-50 calm-shadow space-y-12">
                    <div className="space-y-1.5 border-b border-slate-50 pb-4 flex items-center gap-3">
                        <Edit3 size={18} className="text-calm-300" />
                        <h3 className="font-medium text-lg">Public profile details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Display name</label>
                          <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-paper border border-slate-50 rounded-2xl px-5 py-4 text-charcoal focus:outline-none focus:border-calm-200 text-sm font-light" required />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Secure email</label>
                          <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full bg-paper border border-slate-50 rounded-2xl px-5 py-4 text-charcoal focus:outline-none focus:border-calm-200 text-sm font-light" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Profile tagline</label>
                        <input type="text" value={profile.tagline} onChange={e => setProfile({...profile, tagline: e.target.value})} className="w-full bg-paper border border-slate-50 rounded-2xl px-5 py-4 text-charcoal focus:outline-none focus:border-calm-200 text-sm font-light italic" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Your approach to resolution</label>
                        <textarea value={profile.approach} onChange={e => setProfile({...profile, approach: e.target.value})} className="w-full h-40 bg-paper border border-slate-50 rounded-3xl px-6 py-5 text-charcoal focus:outline-none focus:border-calm-200 text-sm font-light resize-none leading-relaxed" />
                    </div>

                    <div className="pt-6">
                        <button type="submit" disabled={saveStatus === 'saving'} className={`w-full py-5 rounded-full font-medium transition-all text-sm flex items-center justify-center gap-3 ${saveStatus === 'saved' ? 'bg-sage text-white' : 'bg-calm-500 text-white hover:bg-calm-600 shadow-sm'}`}>
                          {saveStatus === 'saving' ? 'Updating...' : saveStatus === 'saved' ? <><Check size={18} /> Profile secured</> : 'Update profile'}
                        </button>
                    </div>
                  </form>
                )}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-8">
             <div className="bg-white p-12 rounded-[40px] border border-slate-50 calm-shadow">
               <div className="flex items-center gap-3 mb-10 text-calm-400">
                 <Calendar size={20} />
                 <h3 className="text-xl font-medium">Secured appointments</h3>
               </div>
               
               {mySchedules.length === 0 ? (
                 <div className="text-center py-24 border-2 border-dashed border-slate-50 rounded-[32px] bg-paper/30">
                   <p className="text-slate-300 font-light italic">No resolution sessions scheduled yet.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mySchedules.map((session) => (
                      <div key={session.id} className="p-8 bg-paper rounded-[32px] border border-slate-50 hover:border-calm-100 transition-all group">
                        <div className="flex justify-between items-start mb-8">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-calm-500 calm-shadow border border-slate-50 font-medium">U</div>
                              <div>
                                <h4 className="font-medium">User-{session.userId?.slice(-4)}</h4>
                                <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-widest">{session.label}</p>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 text-calm-600 font-medium text-sm mb-8">
                           <Clock size={16} />
                           {session.bookedTime?.split(' at ')[1]}
                        </div>
                        <div className="space-y-3 pt-6 border-t border-slate-100">
                           <button onClick={() => setViewingReport(session)} className="w-full flex items-center justify-center gap-2 py-3 bg-white text-slate-400 rounded-full text-xs font-medium border border-slate-100 hover:text-calm-500 hover:border-calm-100 transition-all">
                             <FileText size={14} /> Blueprint summary
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
               <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-6">Connected mentees</h3>
               {mentees.length === 0 ? (
                 <p className="text-xs text-slate-300 italic px-2">No active connections.</p>
               ) : mentees.map(([uId, data]) => (
                  <button key={uId} onClick={() => setSelectedMenteeId(uId)} className={`w-full p-6 rounded-[28px] border text-left transition-all flex items-center gap-4 ${selectedMenteeId === uId ? 'bg-white border-calm-300 calm-shadow text-charcoal' : 'bg-paper/50 border-transparent text-slate-400 hover:bg-white hover:border-slate-100'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium ${selectedMenteeId === uId ? 'bg-calm-50 text-calm-500' : 'bg-white text-slate-200'}`}>U</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">{data.name}</p>
                      <p className="text-[9px] uppercase font-semibold tracking-widest mt-0.5">{data.sessions.length} sessions</p>
                    </div>
                  </button>
               ))}
            </div>
            
            <div className="lg:col-span-3">
              {selectedMenteeId ? (
                <div className="bg-white p-12 rounded-[40px] border border-slate-50 calm-shadow space-y-10 min-h-[500px]">
                   <header className="flex items-center gap-6 pb-8 border-b border-slate-50">
                     <div className="w-14 h-14 bg-calm-50 text-calm-500 rounded-2xl flex items-center justify-center font-medium"><UserIcon size={24} /></div>
                     <div>
                       <h3 className="text-2xl font-medium tracking-tight">{mentees.find(([uId]) => uId === selectedMenteeId)?.[1].name}</h3>
                       <p className="text-sm text-slate-400 font-light">Dialogue history for this mentee.</p>
                     </div>
                   </header>
                   
                   <div className="space-y-8">
                     {mentees.find(([uId]) => uId === selectedMenteeId)?.[1].sessions.map(s => (
                      <div key={s.id} className="p-8 bg-paper/50 rounded-[32px] border border-slate-50 space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-xl text-charcoal/90">{s.label}</h4>
                            <p className="text-sm text-slate-400 mt-1 italic font-light">"{s.snapshot.primary_theme}"</p>
                          </div>
                          <button onClick={() => setViewingReport(s)} className="flex items-center gap-2 px-6 py-2 bg-white text-slate-400 rounded-full text-[10px] font-semibold uppercase tracking-widest border border-slate-100 hover:text-calm-500 transition-all">
                            <Eye size={12} /> View blueprint
                          </button>
                        </div>

                        {/* Dialogue History Insight */}
                        {s.collaborationHistory && s.collaborationHistory.length > 0 && (
                          <div className="pt-6 border-t border-slate-100 space-y-4">
                            <div className="flex items-center gap-2 text-calm-300">
                              <MessageSquare size={14} />
                              <span className="text-[10px] font-semibold uppercase tracking-widest">Recent dialogue</span>
                            </div>
                            <div className="space-y-3">
                               {s.collaborationHistory.slice(-2).map(msg => (
                                 <div key={msg.id} className="flex flex-col gap-1">
                                   <div className="flex justify-between items-center px-1">
                                      <span className="text-[9px] font-bold text-slate-300 uppercase">{msg.role === 'user' ? 'Mentee' : 'You'}</span>
                                      <span className="text-[8px] text-slate-200">{new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                   </div>
                                   <div className={`p-4 text-xs font-light leading-relaxed rounded-2xl ${msg.role === 'user' ? 'bg-white border border-slate-50' : 'bg-calm-50 text-calm-700'}`}>
                                      {msg.content}
                                   </div>
                                 </div>
                               ))}
                            </div>
                          </div>
                        )}
                      </div>
                   ))}
                   </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-24 text-center border-2 border-dashed border-slate-100 rounded-[40px] text-slate-200">
                  <UserIcon size={48} className="mb-4 opacity-30" />
                  <p className="font-light italic">Select a mentee to see resolution history.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Blueprint View Modal */}
      {viewingReport && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-8 page-arrival">
           <div className="absolute inset-0 bg-paper/95 backdrop-blur-sm" onClick={() => setViewingReport(null)} />
           <div className="relative bg-white border border-slate-100 w-full max-w-2xl rounded-[40px] calm-shadow flex flex-col max-h-[90vh] overflow-hidden">
              <div className="p-10 border-b border-slate-50 flex justify-between items-center">
                 <div className="flex items-center gap-4 text-calm-500">
                    <FileText size={20} />
                    <h3 className="text-xl font-medium">Clarity blueprint details</h3>
                 </div>
                 <button onClick={() => setViewingReport(null)} className="p-2 text-slate-300 hover:text-charcoal transition-all"><X size={20} /></button>
              </div>

              <div className="p-12 overflow-y-auto space-y-12 no-scrollbar">
                 <section className="space-y-4">
                    <h4 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Mentee situation</h4>
                    <p className="text-2xl font-light italic leading-relaxed text-charcoal/90">
                      "{viewingReport.snapshot.primary_theme}"
                    </p>
                 </section>

                 <section className="space-y-4">
                    <h4 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Operational bottleneck</h4>
                    <div className="p-8 bg-paper rounded-[28px] text-slate-600 font-light leading-relaxed">
                      {viewingReport.snapshot.the_bottleneck}
                    </div>
                 </section>

                 {/* Full Collaboration History inside Report View */}
                 {viewingReport.collaborationHistory && viewingReport.collaborationHistory.length > 0 && (
                   <section className="space-y-6">
                      <div className="flex items-center gap-3 text-calm-300">
                        <MessageSquare size={16} />
                        <h4 className="text-[10px] font-semibold uppercase tracking-widest">Discussion history</h4>
                      </div>
                      <div className="space-y-6 bg-paper/30 p-8 rounded-[32px] border border-slate-50">
                        {viewingReport.collaborationHistory.map(msg => (
                          <div key={msg.id} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-start' : 'items-end'}`}>
                            <div className="flex gap-2 items-center px-2">
                               <span className="text-[8px] font-black uppercase text-slate-300">{msg.role === 'user' ? 'Mentee' : 'You'}</span>
                            </div>
                            <div className={`p-5 rounded-3xl text-sm font-light leading-relaxed max-w-[90%] ${msg.role === 'user' ? 'bg-white text-charcoal shadow-sm' : 'bg-calm-50 text-calm-800'}`}>
                               {msg.content}
                            </div>
                          </div>
                        ))}
                      </div>
                   </section>
                 )}
              </div>
              <div className="p-10 bg-paper/30 border-t border-slate-50">
                <button onClick={() => setViewingReport(null)} className="w-full py-4 bg-calm-500 text-white rounded-full font-medium transition-all hover:bg-calm-600 text-sm">
                  Finish review
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
