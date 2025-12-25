import React, { useState } from 'react';
import { LifeSnapshot } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ArrowRight, Battery, Compass, Layers, Zap, ArrowLeft, Edit2, Check } from 'lucide-react';

interface Props {
  data: LifeSnapshot;
  onNext: () => void;
  onBack: () => void;
  onRename: (newName: string) => void;
  currentLabel: string;
}

const State3Dashboard: React.FC<Props> = ({ data, onNext, onBack, onRename, currentLabel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentLabel);

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

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 fade-in overflow-y-auto text-slate-100">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b border-slate-800 gap-6">
          <div className="flex gap-6 items-start w-full">
            <button 
              onClick={onBack}
              className="mt-1 p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-600 transition-all shadow-sm"
              title="Back to Conversation"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="w-full">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-indigo-500 fill-indigo-500" size={20} />
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Your Clarity Profile</span>
              </div>
              
              {/* Editable Title Section */}
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
                      title="Rename this problem"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-slate-400 mt-2 text-lg font-light">Here is a simple look at your current situation.</p>
            </div>
          </div>
          <button 
            onClick={onNext} 
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-500 shadow-lg shadow-indigo-900/50 transition-all hover:gap-3 whitespace-nowrap"
          >
            <span>Find a Helper</span>
            <ArrowRight size={18} />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Primary Theme Card */}
          <div className="col-span-1 md:col-span-2 bg-slate-900 p-10 rounded-3xl shadow-xl shadow-black/20 border border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-900/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-900/30 transition-colors duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-900/50 rounded-lg text-indigo-300">
                   <Compass size={24} />
                </div>
                <h3 className="font-bold uppercase tracking-wide text-xs text-indigo-300">What's Happening</h3>
              </div>
              <p className="text-3xl font-light text-slate-100 leading-tight mb-8">
                "{data.primary_theme}"
              </p>
              <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">The Main Hurdle</h4>
                <p className="text-slate-200 font-medium text-lg">{data.the_bottleneck}</p>
              </div>
            </div>
          </div>

          {/* Energy Balance Chart */}
          <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-black/20 border border-slate-800 flex flex-col justify-between">
             <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <div className="p-2 bg-emerald-900/30 rounded-lg text-emerald-400">
                <Battery size={24} />
              </div>
              <h3 className="font-bold uppercase tracking-wide text-xs text-slate-200">Energy Levels</h3>
            </div>
            <div className="h-48 w-full my-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" barSize={32}>
                  <XAxis type="number" domain={[0, 10]} hide />
                  <YAxis dataKey="name" type="category" width={50} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 500}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}} 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }} 
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#f43f5e' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">{data.energy_balance.description}</p>
          </div>

          {/* Pattern Matrix */}
          <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-black/20 border border-slate-800">
            <div className="flex items-center gap-3 mb-8 text-amber-500">
              <div className="p-2 bg-amber-900/30 rounded-lg text-amber-500">
                <Layers size={24} />
              </div>
              <h3 className="font-bold uppercase tracking-wide text-xs text-slate-200">Your Habits</h3>
            </div>
            <ul className="space-y-4">
              {data.pattern_matrix.map((p, i) => (
                <li key={i} className="flex justify-between items-center p-3 hover:bg-slate-800 rounded-xl transition-colors">
                  <span className="text-slate-300 font-medium">{p.behavior}</span>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold 
                    ${p.frequency === 'High' ? 'bg-amber-900/40 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                    {p.frequency}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Low Effort Action */}
          <div className="col-span-1 md:col-span-2 bg-slate-800 text-white p-10 rounded-3xl shadow-2xl shadow-black/40 relative overflow-hidden border border-slate-700">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h3 className="font-bold uppercase tracking-widest text-xs text-indigo-300 mb-4 relative z-10">One Small Step</h3>
            <p className="text-2xl font-light leading-relaxed relative z-10 text-slate-100">
              "{data.low_effort_action}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default State3Dashboard;