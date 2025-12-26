
import React, { useState } from 'react';
import { LifeSnapshot } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip } from 'recharts';
// Added Zap to the imports from lucide-react to fix the 'Cannot find name Zap' error
import { ArrowRight, Compass, ArrowLeft, Edit2, Check, Activity, Info, FileText, Sparkles, Command, X, ShieldAlert, Zap } from 'lucide-react';

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
  onUpdateReport: (edited: Partial<LifeSnapshot>, hiddenFields: string[]) => void;
  hiddenFields: string[];
  editedSnapshot?: LifeSnapshot;
}

const State3Dashboard: React.FC<Props> = ({ 
  data, onNext, onBack, onRename, currentLabel,
  mood, setMood, priority, setPriority, notes, setNotes,
  onUpdateReport, hiddenFields, editedSnapshot
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(currentLabel);
  const [showClarityReport, setShowClarityReport] = useState(false);
  
  const activeSnapshot = editedSnapshot || data;

  const chartData = [
    { name: 'Drains', value: activeSnapshot.energy_balance.drains },
    { name: 'Gains', value: activeSnapshot.energy_balance.gains },
  ];

  const handleSaveName = () => {
    if (editNameValue.trim()) onRename(editNameValue);
    setIsEditingName(false);
  };

  const MOODS = ['Neutral', 'Anxious', 'Frustrated', 'Hopeful', 'Calm', 'Overwhelmed', 'Focused'];
  const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

  return (
    <div className="min-h-screen bg-void p-12 md:p-24 page-arrival overflow-y-auto text-high">
      <div className="max-w-6xl mx-auto space-y-24 pb-48">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div className="space-y-8 flex-1">
            <button 
              onClick={onBack}
              className="group flex items-center gap-3 text-dim hover:text-resolution-cyan transition-all text-sm font-black uppercase tracking-[0.3em]"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Reflections</span>
            </button>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-resolution-indigo">
                <Command size={24} />
                <span className="text-[14px] font-black uppercase tracking-[0.5em]">Clarity Blueprint v1.0</span>
              </div>
              
              <div className="flex items-center gap-4">
                {isEditingName ? (
                  <div className="flex items-center gap-4 w-full max-w-lg">
                    <input 
                      type="text" value={editNameValue} onChange={(e) => setEditNameValue(e.target.value)}
                      className="bg-sanctuary border-b-2 border-resolution-cyan text-5xl font-black focus:outline-none w-full"
                      autoFocus
                    />
                    <button onClick={handleSaveName} className="p-4 bg-resolution-cyan text-void rounded-2xl"><Check size={28} /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-6 group cursor-pointer" onClick={() => setIsEditingName(true)}>
                    <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-white leading-none">{currentLabel}</h2>
                    <Edit2 size={28} className="text-slate-700 group-hover:text-resolution-cyan transition-all" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-6">
            <button 
              onClick={() => setShowClarityReport(true)}
              className="px-10 py-5 bg-sanctuary border border-slate-800 text-dim rounded-full font-black text-sm uppercase tracking-widest hover:border-resolution-indigo transition-all shadow-xl"
            >
              Technical Detail
            </button>
            <button 
              onClick={onNext} 
              className="px-12 py-5 bg-high text-void rounded-full font-black hover:bg-resolution-indigo hover:text-white transition-all shadow-3xl shadow-resolution-indigo/20 flex items-center gap-5 text-sm uppercase tracking-[0.2em]"
            >
              Consult Experts
              <ArrowRight size={24} />
            </button>
          </div>
        </header>

        {/* Main Insight Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Core Theme Module */}
          <section className="lg:col-span-2 bg-sanctuary p-16 rounded-[60px] border border-slate-800/60 shadow-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-resolution-indigo/5 blur-[120px] rounded-full group-hover:bg-resolution-indigo/10 transition-colors"></div>
            <div className="relative z-10 space-y-12">
              <div className="flex items-center gap-4 text-resolution-indigo">
                <Compass size={32} />
                <h3 className="text-sm font-black uppercase tracking-[0.4em]">Primary Problem Vector</h3>
              </div>
              <p className="text-4xl md:text-5xl font-light leading-tight italic text-white/90">
                "{activeSnapshot.primary_theme}"
              </p>
              <div className="pt-12 border-t border-slate-800/50">
                 <div className="flex items-center gap-4 text-resolution-cyan mb-6">
                   <ShieldAlert size={20} />
                   <h4 className="text-[11px] font-black uppercase tracking-[0.4em]">Critical Bottleneck</h4>
                 </div>
                 <p className="text-2xl font-light text-dim leading-relaxed">
                   {activeSnapshot.the_bottleneck}
                 </p>
              </div>
            </div>
          </section>

          {/* Context Controls Module */}
          <div className="space-y-12">
            <section className="bg-sanctuary p-12 rounded-[50px] border border-slate-800/60 shadow-3xl space-y-10">
              <div className="flex items-center gap-3 text-resolution-indigo">
                <Activity size={24} />
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em]">Status Nodes</h3>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Emotional state</label>
                  <select value={mood} onChange={(e) => setMood(e.target.value)} className="w-full bg-void border border-slate-800 rounded-2xl p-5 text-high text-sm font-bold focus:border-resolution-cyan outline-none appearance-none cursor-pointer">
                    <option value="" disabled>Initialize...</option>
                    {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Resource priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full bg-void border border-slate-800 rounded-2xl p-5 text-high text-sm font-bold focus:border-resolution-cyan outline-none appearance-none cursor-pointer">
                    <option value="" disabled>Assign...</option>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* Energy Analysis Module */}
            <section className="bg-sanctuary p-12 rounded-[50px] border border-slate-800/60 shadow-3xl">
              <div className="flex items-center gap-3 mb-8 text-resolution-cyan">
                <Sparkles size={24} />
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em]">Balance Matrix</h3>
              </div>
              <div className="h-40 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" barSize={32}>
                    <XAxis type="number" domain={[0, 10]} hide />
                    <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12, fill: '#64748B', fontWeight: 900}} axisLine={false} tickLine={false} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={index === 0 ? '#EF4444' : '#22D3EE'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm font-light leading-relaxed text-dim italic text-center">
                "{activeSnapshot.energy_balance.description}"
              </p>
            </section>
          </div>
        </div>

        {/* Tactical Recommendation Module */}
        <section className="bg-gradient-to-r from-resolution-indigo/20 to-resolution-cyan/10 p-16 rounded-[60px] border border-resolution-indigo/30 shadow-3xl relative group overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-void/40 backdrop-blur-sm -z-10"></div>
           <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="w-32 h-32 bg-resolution-indigo text-white rounded-[40px] flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform duration-500 shrink-0">
                 {/* Zap is now imported and correctly used */}
                 <Zap size={64} fill="currentColor" />
              </div>
              <div className="space-y-6">
                 <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-resolution-cyan">Immediate Resolution Action</h3>
                 <p className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-tight">
                   "{activeSnapshot.low_effort_action}"
                 </p>
              </div>
           </div>
        </section>
      </div>

      {/* Detail Protocol Overlay */}
      {showClarityReport && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-12 animate-arrival">
           {/* Fixed: Use false instead of null for boolean state setter */}
           <div className="absolute inset-0 bg-void/95 backdrop-blur-md" onClick={() => setShowClarityReport(false)} />
           <div className="relative bg-sanctuary border border-slate-800 w-full max-w-4xl rounded-[60px] shadow-3xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="p-12 flex justify-between items-center border-b border-slate-800 bg-sanctuary/50">
                 <h3 className="text-3xl font-black tracking-tighter uppercase tracking-[0.2em]">Technical Blueprint Detail</h3>
                 {/* Fixed: Use false instead of null for boolean state setter */}
                 <button onClick={() => setShowClarityReport(false)} className="p-4 bg-void border border-slate-800 text-dim hover:text-white rounded-full transition-all"><X size={28} /></button>
              </div>

              <div className="p-16 overflow-y-auto space-y-16 no-scrollbar">
                 <div className="space-y-6">
                    <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-resolution-cyan">Analytical core</h4>
                    <p className="text-2xl font-light leading-relaxed text-high bg-void p-10 rounded-[40px] border border-slate-800/60 shadow-inner">{activeSnapshot.the_bottleneck}</p>
                 </div>
                 
                 <div className="space-y-8">
                    <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-resolution-cyan">Recommended resolution nodes</h4>
                    <div className="grid grid-cols-1 gap-6">
                      {activeSnapshot.suggested_activities?.map((act, i) => (
                        <div key={i} className="flex gap-8 p-10 bg-void/50 border border-slate-800/40 rounded-[40px] text-xl font-light text-dim hover:border-resolution-indigo transition-colors group">
                          <span className="text-resolution-indigo font-black text-3xl opacity-30 group-hover:opacity-100">{i + 1}</span>
                          <span className="group-hover:text-high transition-colors">{act}</span>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>

              <div className="p-12 border-t border-slate-800">
                 {/* Fixed: Use false instead of null for boolean state setter */}
                 <button onClick={() => setShowClarityReport(false)} className="w-full py-6 bg-resolution-indigo text-white rounded-full font-black text-lg uppercase tracking-[0.2em] shadow-2xl hover:bg-resolution-cyan hover:text-void transition-all">
                    Acknowledge Blueprint
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default State3Dashboard;
