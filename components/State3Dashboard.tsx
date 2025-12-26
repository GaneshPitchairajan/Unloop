
import React, { useState } from 'react';
import { LifeSnapshot } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
// Added missing Sparkles import to the list of lucide-react icons
import { ArrowRight, Battery, Compass, Layers, Zap, ArrowLeft, Edit2, Check, BarChart2, Smile, Activity, Info, FileText, CheckCircle, Sparkles } from 'lucide-react';

interface Props {
  data: LifeSnapshot;
  onNext: () => void;
  onBack: () => void;
  onRename: (newName: string) => void;
  currentLabel: string;
  mood: string;
  setMood: (m: string) => void;
  priority: string;
  setPriority: (p: string) => void;
  notes: string;
  setNotes: (n: string) => void;
}

const State3Dashboard: React.FC<Props> = ({ 
  data, onNext, onBack, onRename, currentLabel,
  mood, setMood, priority, setPriority, notes, setNotes
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentLabel);
  const [showEnergyDetail, setShowEnergyDetail] = useState(false);
  const [showClarityReport, setShowClarityReport] = useState(false);

  const chartData = [
    { name: 'Drains', value: data.energy_balance.drains },
    { name: 'Gains', value: data.energy_balance.gains },
  ];

  const handleSaveName = () => {
    if (editValue.trim()) {
      onRename(editValue);
    }
    setIsEditing(false);
  };

  const MOODS = ['Neutral', 'Anxious', 'Frustrated', 'Hopeful', 'Calm', 'Overwhelmed', 'Focused'];
  const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 fade-in overflow-y-auto text-slate-100">
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b border-slate-800 gap-6">
          <div className="flex gap-6 items-start w-full">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-600 transition-all shadow-sm flex-shrink-0 group mt-1"
              title="Back to conversation"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium text-sm">Chat</span>
            </button>
            <div className="w-full">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-indigo-500 fill-indigo-500" size={20} />
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Your Current Picture</span>
              </div>
              
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <div className="flex items-center gap-2 w-full max-w-md">
                    <input 
                      type="text" 
                      value={editValue} 
                      onChange={(e) => setEditValue(e.target.value)}
                      className="bg-slate-900 border border-indigo-500 rounded-lg px-3 py-1 text-3xl font-semibold text-white w-full focus:outline-none"
                      autoFocus
                    />
                    <button onClick={handleSaveName} className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-500">
                      <Check size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 group">
                    <h2 className="text-4xl font-semibold text-slate-100 tracking-tight">{currentLabel}</h2>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-slate-600 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"
                      title="Change this name"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-slate-400 mt-2 text-lg font-light">Self-reflection dashboard before connecting with a mentor.</p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={() => setShowClarityReport(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 text-slate-300 rounded-full font-medium hover:bg-slate-800 transition-all"
            >
              <FileText size={18} />
              <span>Full Report</span>
            </button>
            <button 
              onClick={onNext} 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-500 shadow-lg shadow-indigo-900/50 transition-all hover:gap-3 whitespace-nowrap"
            >
              <span>Talk to someone</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info Card */}
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="bg-slate-900 p-10 rounded-3xl shadow-xl shadow-black/20 border border-slate-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-900/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-900/30 transition-colors duration-700"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-900/50 rounded-lg text-indigo-300">
                    <Compass size={24} />
                  </div>
                  <h3 className="font-bold uppercase tracking-wide text-xs text-indigo-300">The Problem Core</h3>
                </div>
                <p className="text-3xl font-light text-slate-100 leading-tight mb-8">
                  "{data.primary_theme}"
                </p>
                <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">What's Creating Friction</h4>
                  <p className="text-slate-200 font-medium text-lg">{data.the_bottleneck}</p>
                </div>
              </div>
            </div>

            {/* Suggested Activities Column */}
            <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-black/20 border border-slate-800">
              <div className="flex items-center gap-3 mb-8 text-emerald-400">
                <div className="p-2 bg-emerald-900/30 rounded-lg text-emerald-400">
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="font-bold uppercase tracking-wide text-xs text-slate-200">Solve It Yourself First</h3>
                  <p className="text-xs text-slate-500 mt-1">Activities to help you unloop on your own.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {(data.suggested_activities || []).map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl group hover:border-emerald-500/30 transition-all">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-emerald-400 font-bold border border-slate-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      {i + 1}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed pt-1 flex-1">{activity}</p>
                    <button className="text-slate-600 hover:text-emerald-400">
                      <CheckCircle size={18} />
                    </button>
                  </div>
                ))}
                {(data.suggested_activities || []).length === 0 && (
                   <p className="text-slate-500 italic text-sm p-4 border border-dashed border-slate-800 rounded-xl">No specific independent activities generated. Try the low-effort action below.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Context & Energy */}
          <div className="col-span-1 space-y-8">
             <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-black/20 border border-slate-800 flex flex-col gap-6">
                <div className="flex items-center gap-3 text-indigo-400">
                    <div className="p-2 bg-indigo-900/30 rounded-lg text-indigo-400">
                      <Edit2 size={24} />
                    </div>
                    <h3 className="font-bold uppercase tracking-wide text-xs text-slate-200">Contextual Notes</h3>
                </div>
                
                <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">How do you feel?</label>
                      <select 
                        value={mood} 
                        onChange={(e) => setMood(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="" disabled>Select Mood...</option>
                        {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Priority</label>
                      <select 
                        value={priority} 
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="" disabled>Select Priority...</option>
                        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any specific context for your mentor..."
                      className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none placeholder:text-slate-600"
                    />
                </div>
             </div>

             <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-black/20 border border-slate-800 relative group overflow-hidden">
                <div className="flex items-center justify-between mb-6 text-emerald-400">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-900/30 rounded-lg text-emerald-400">
                      <Battery size={24} />
                    </div>
                    <h3 className="font-bold uppercase tracking-wide text-xs text-slate-200">Your Energy</h3>
                  </div>
                  <button onClick={() => setShowEnergyDetail(!showEnergyDetail)} className="text-slate-500 hover:text-indigo-400">
                    <Info size={16} />
                  </button>
                </div>

                <div className="h-40 w-full mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" barSize={32}>
                      <XAxis type="number" domain={[0, 10]} hide />
                      <YAxis dataKey="name" type="category" width={50} tick={{fontSize: 10, fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#f43f5e' : '#10b981'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">{data.energy_balance.description}</p>
                
                {showEnergyDetail && (
                   <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-500/30 animate-[fadeIn_0.3s_ease-out]">
                      <h4 className="text-[10px] font-bold uppercase text-indigo-400 mb-2">Detailed Reason</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed italic">
                        Your energy drains outweigh your gains by {Math.abs(data.energy_balance.drains - data.energy_balance.gains)}. 
                        This suggests that the bottleneck "{data.the_bottleneck}" is active and taxing your cognitive resources. 
                        Resolving this theme could free up to {data.energy_balance.drains} capacity points.
                      </p>
                   </div>
                )}
             </div>
          </div>
        </div>

        {/* Action Footnote */}
        <div className="bg-indigo-600 text-white p-10 rounded-3xl shadow-2xl shadow-indigo-900/40 border border-indigo-500 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
           <h3 className="font-bold uppercase tracking-widest text-xs text-indigo-200 mb-4 relative z-10">Low-Effort Action</h3>
           <p className="text-2xl font-light leading-relaxed relative z-10 text-white">
             "{data.low_effort_action}"
           </p>
        </div>
      </div>

      {/* Clarity Report Overlay */}
      {showClarityReport && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 fade-in">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowClarityReport(null)} />
           <div className="relative bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                 <div className="flex items-center gap-3">
                    <Sparkles className="text-indigo-400" size={20} />
                    <h3 className="font-bold text-slate-100">The Clarity Report</h3>
                 </div>
                 <button onClick={() => setShowClarityReport(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
                    <CheckCircle size={20} />
                 </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-8 no-scrollbar">
                 <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 text-center space-y-2">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Prepared for Mentor Collaboration</p>
                    <h4 className="text-2xl font-bold text-slate-100">"{currentLabel}"</h4>
                 </div>

                 <section className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">The Core Summary</h4>
                    <p className="text-lg font-light text-slate-200 leading-relaxed italic">"{data.primary_theme}"</p>
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                       <p className="text-sm text-slate-400 leading-relaxed">
                         <strong className="text-slate-200">Bottleneck:</strong> {data.the_bottleneck}
                       </p>
                    </div>
                 </section>

                 <section className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Pattern Matrix</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       {data.pattern_matrix.map((p, i) => (
                         <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                            <span className="text-xs text-slate-300 font-medium">{p.behavior}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.frequency === 'High' ? 'bg-amber-900/40 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>{p.frequency}</span>
                         </div>
                       ))}
                    </div>
                 </section>

                 <section className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Energy Profile</h4>
                    <div className="flex gap-4 items-center">
                       <div className="flex-1 h-3 bg-slate-950 rounded-full overflow-hidden flex">
                          <div className="h-full bg-rose-500" style={{ width: `${(data.energy_balance.drains / 10) * 100}%` }}></div>
                          <div className="h-full bg-emerald-500" style={{ width: `${(data.energy_balance.gains / 10) * 100}%` }}></div>
                       </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{data.energy_balance.description}</p>
                 </section>

                 <div className="p-5 bg-indigo-900/10 border border-indigo-900/30 rounded-2xl">
                    <h4 className="text-xs font-bold uppercase text-indigo-400 mb-2">Notes for Engagement</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      User current mood: <span className="text-white font-medium">{mood || 'Not specified'}</span><br/>
                      Priority level: <span className="text-white font-medium">{priority || 'Medium'}</span>
                    </p>
                 </div>
              </div>

              <div className="p-6 bg-slate-900/50 border-t border-slate-800">
                 <button onClick={() => setShowClarityReport(null)} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-500 transition-all flex items-center justify-center gap-2">
                    <CheckCircle size={18} />
                    <span>I understand what's being shared</span>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default State3Dashboard;
