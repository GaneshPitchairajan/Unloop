import React from 'react';
import { LifeSnapshot } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ArrowRight, Battery, Compass, Layers, Zap, ArrowLeft } from 'lucide-react';

interface Props {
  data: LifeSnapshot;
  onNext: () => void;
  onBack: () => void;
}

const State3Dashboard: React.FC<Props> = ({ data, onNext, onBack }) => {
  const chartData = [
    { name: 'Drains', value: data.energy_balance.drains },
    { name: 'Gains', value: data.energy_balance.gains },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 fade-in overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b border-slate-200 gap-6">
          <div className="flex gap-6 items-start">
            <button 
              onClick={onBack}
              className="mt-1 p-3 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm"
              title="Back to Conversation"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-indigo-600 fill-indigo-600" size={20} />
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Your Clarity Profile</span>
              </div>
              <h2 className="text-4xl font-semibold text-slate-900 tracking-tight">What We Found</h2>
              <p className="text-slate-500 mt-2 text-lg font-light">Here is a simple look at your current situation.</p>
            </div>
          </div>
          <button 
            onClick={onNext} 
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all hover:gap-3"
          >
            <span>Find a Helper</span>
            <ArrowRight size={18} />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Primary Theme Card */}
          <div className="col-span-1 md:col-span-2 bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-50 transition-colors duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                   <Compass size={24} />
                </div>
                <h3 className="font-bold uppercase tracking-wide text-xs text-indigo-900">What's Happening</h3>
              </div>
              <p className="text-3xl font-light text-slate-900 leading-tight mb-8">
                "{data.primary_theme}"
              </p>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">The Main Hurdle</h4>
                <p className="text-slate-700 font-medium text-lg">{data.the_bottleneck}</p>
              </div>
            </div>
          </div>

          {/* Energy Balance Chart */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
             <div className="flex items-center gap-3 mb-4 text-emerald-600">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                <Battery size={24} />
              </div>
              <h3 className="font-bold uppercase tracking-wide text-xs text-slate-900">Energy Levels</h3>
            </div>
            <div className="h-48 w-full my-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" barSize={32}>
                  <XAxis type="number" domain={[0, 10]} hide />
                  <YAxis dataKey="name" type="category" width={50} tick={{fontSize: 12, fill: '#64748b', fontWeight: 500}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#f43f5e' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{data.energy_balance.description}</p>
          </div>

          {/* Pattern Matrix */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center gap-3 mb-8 text-amber-600">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                <Layers size={24} />
              </div>
              <h3 className="font-bold uppercase tracking-wide text-xs text-slate-900">Your Habits</h3>
            </div>
            <ul className="space-y-4">
              {data.pattern_matrix.map((p, i) => (
                <li key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <span className="text-slate-700 font-medium">{p.behavior}</span>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold 
                    ${p.frequency === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                    {p.frequency}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Low Effort Action */}
          <div className="col-span-1 md:col-span-2 bg-slate-900 text-white p-10 rounded-3xl shadow-2xl shadow-slate-400/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h3 className="font-bold uppercase tracking-widest text-xs text-indigo-300 mb-4 relative z-10">One Small Step</h3>
            <p className="text-2xl font-light leading-relaxed relative z-10 text-slate-50">
              "{data.low_effort_action}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default State3Dashboard;