
import React, { useState } from 'react';
import { LifeSnapshot } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import { ArrowRight, Compass, ArrowLeft, Edit2, Check, Activity, Info, FileText, Sparkles, Command, X } from 'lucide-react';

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
    <div className="min-h-screen bg-paper p-8 md:p-16 page-arrival overflow-y-auto text-charcoal">
      <div className="max-w-4xl mx-auto space-y-16 pb-32">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="space-y-6 flex-1">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-calm-500 transition-all text-sm font-medium"
            >
              <ArrowLeft size={16} />
              <span>Revisit reflections</span>
            </button>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-calm-300">
                <Command size={16} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Clarity Map</span>
              </div>
              
              <div className="flex items-center gap-3">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" value={editNameValue} onChange={(e) => setEditNameValue(e.target.value)}
                      className="bg-white border-b border-calm-500 text-3xl font-medium focus:outline-none"
                      autoFocus
                    />
                    <button onClick={handleSaveName} className="text-calm-500"><Check size={20} /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 group">
                    <h2 className="text-4xl font-medium tracking-tight">{currentLabel}</h2>
                    <button onClick={() => setIsEditingName(true)} className="text-slate-200 group-hover:text-calm-300 transition-all"><Edit2 size={16} /></button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setShowClarityReport(true)}
              className="px-8 py-3 bg-white border border-slate-100 calm-shadow text-slate-500 rounded-full font-medium text-sm transition-all"
            >
              Blueprint detail
            </button>
            <button 
              onClick={onNext} 
              className="px-10 py-4 bg-calm-500 text-white rounded-full font-medium hover:bg-calm-600 transition-all shadow-md flex items-center gap-3 text-sm"
            >
              Explore guides
              <ArrowRight size={18} />
            </button>
          </div>
        </header>

        {/* Main Content Sections - One reflection per card */}
        <div className="space-y-12">
          
          {/* Theme Section */}
          <section className="bg-white p-12 rounded-[40px] border border-slate-50 calm-shadow">
            <div className="flex items-center gap-3 mb-8 text-calm-400">
              <Compass size={20} />
              <h3 className="text-xs font-semibold uppercase tracking-widest">The Core Theme</h3>
            </div>
            <p className="text-3xl font-light leading-relaxed italic text-charcoal/90">
              "{activeSnapshot.primary_theme}"
            </p>
          </section>

          {/* Bottleneck Section */}
          <section className="bg-white p-12 rounded-[40px] border border-slate-50 calm-shadow">
            <div className="flex items-center gap-3 mb-8 text-calm-400">
              <Sparkles size={20} />
              <h3 className="text-xs font-semibold uppercase tracking-widest">The Bottleneck</h3>
            </div>
            <p className="text-xl font-light leading-relaxed text-slate-600">
              {activeSnapshot.the_bottleneck}
            </p>
          </section>

          {/* Action Section */}
          <section className="bg-calm-50 p-12 rounded-[40px] border border-calm-100">
            <div className="flex items-center gap-3 mb-8 text-calm-600">
              <Activity size={20} />
              <h3 className="text-xs font-semibold uppercase tracking-widest">A simple first step</h3>
            </div>
            <p className="text-2xl font-medium leading-relaxed italic text-calm-900">
              "{activeSnapshot.low_effort_action}"
            </p>
          </section>

          {/* Energy Section */}
          <section className="bg-white p-12 rounded-[40px] border border-slate-50 calm-shadow grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-8 text-calm-400">
                <Info size={20} />
                <h3 className="text-xs font-semibold uppercase tracking-widest">Energy Balance</h3>
              </div>
              <p className="text-sm font-light leading-relaxed text-slate-500 italic">
                {activeSnapshot.energy_balance.description}
              </p>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" barSize={24}>
                  <XAxis type="number" domain={[0, 10]} hide />
                  <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 10, fill: '#87A7AF', fontWeight: 600}} axisLine={false} tickLine={false} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={index === 0 ? '#C3D3D7' : '#87A7AF'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Input Section */}
          <section className="bg-white p-12 rounded-[40px] border border-slate-50 calm-shadow space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Your current mood</label>
                <select value={mood} onChange={(e) => setMood(e.target.value)} className="w-full bg-paper border-b border-slate-100 py-3 text-sm focus:outline-none focus:border-calm-300 font-light">
                  <option value="" disabled>Choose...</option>
                  {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Resolution priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full bg-paper border-b border-slate-100 py-3 text-sm focus:outline-none focus:border-calm-300 font-light">
                  <option value="" disabled>Choose...</option>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Notes for your guide</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything else your guide should know?" className="w-full h-24 bg-paper border border-slate-50 rounded-2xl p-6 text-sm focus:outline-none focus:border-calm-100 resize-none font-light" />
            </div>
          </section>
        </div>
      </div>

      {/* Blueprint Detail Modal */}
      {showClarityReport && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-8 page-arrival">
           <div className="absolute inset-0 bg-paper/95 backdrop-blur-sm" onClick={() => setShowClarityReport(null)} />
           <div className="relative bg-white border border-slate-100 w-full max-w-2xl rounded-[40px] calm-shadow flex flex-col max-h-[90vh] overflow-hidden">
              <div className="p-10 flex justify-between items-center border-b border-slate-50">
                 <h3 className="text-xl font-medium tracking-tight">Blueprint details</h3>
                 <button onClick={() => setShowClarityReport(null)} className="p-2 text-slate-300 hover:text-charcoal transition-all"><X size={20} /></button>
              </div>

              <div className="p-12 overflow-y-auto space-y-10 no-scrollbar">
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-semibold uppercase tracking-widest text-calm-400">Architectural Core</h4>
                    <p className="text-lg font-light leading-relaxed text-slate-600">{activeSnapshot.the_bottleneck}</p>
                 </div>
                 
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-semibold uppercase tracking-widest text-calm-400">Recommended activities</h4>
                    <div className="space-y-4">
                      {activeSnapshot.suggested_activities?.map((act, i) => (
                        <div key={i} className="flex gap-4 p-6 bg-paper rounded-2xl text-sm font-light text-slate-600">
                          <span className="text-calm-500 font-semibold">{i + 1}.</span>
                          {act}
                        </div>
                      ))}
                    </div>
                 </div>
              </div>

              <div className="p-10 border-t border-slate-50">
                 <button onClick={() => setShowClarityReport(null)} className="w-full py-4 bg-calm-500 text-white rounded-full font-medium transition-all hover:bg-calm-600 text-sm">
                    Take a moment to reflect
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default State3Dashboard;
