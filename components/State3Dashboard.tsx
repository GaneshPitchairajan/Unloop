import React from 'react';
import { LifeSnapshot } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ArrowRight, Battery, Compass, Layers } from 'lucide-react';

interface Props {
  data: LifeSnapshot;
  onNext: () => void;
}

const State3Dashboard: React.FC<Props> = ({ data, onNext }) => {
  const chartData = [
    { name: 'Drains', value: data.energy_balance.drains },
    { name: 'Gains', value: data.energy_balance.gains },
  ];

  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-12 fade-in overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-light text-stone-800">Insight Dashboard</h2>
            <p className="text-stone-500 mt-2">Your current clarity snapshot.</p>
          </div>
          <button onClick={onNext} className="flex items-center gap-2 text-stone-800 font-medium hover:opacity-70 transition-opacity">
            <span>Find Guidance</span>
            <ArrowRight size={20} />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Primary Theme Card */}
          <div className="col-span-1 md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center gap-3 mb-4 text-indigo-600">
              <Compass size={24} />
              <h3 className="font-semibold uppercase tracking-wide text-xs">Primary Theme</h3>
            </div>
            <p className="text-2xl font-light text-stone-900 leading-tight">
              "{data.primary_theme}"
            </p>
            <div className="mt-6 pt-6 border-t border-stone-50">
              <h4 className="text-sm font-medium text-stone-500 mb-2">The Bottleneck</h4>
              <p className="text-stone-700">{data.the_bottleneck}</p>
            </div>
          </div>

          {/* Energy Balance Chart */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex flex-col justify-between">
             <div className="flex items-center gap-3 mb-4 text-emerald-600">
              <Battery size={24} />
              <h3 className="font-semibold uppercase tracking-wide text-xs">Energy Balance</h3>
            </div>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <XAxis type="number" domain={[0, 10]} hide />
                  <YAxis dataKey="name" type="category" width={50} tick={{fontSize: 12, fill: '#78716c'}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-stone-400 mt-4">{data.energy_balance.description}</p>
          </div>

          {/* Pattern Matrix */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center gap-3 mb-6 text-amber-600">
              <Layers size={24} />
              <h3 className="font-semibold uppercase tracking-wide text-xs">Pattern Matrix</h3>
            </div>
            <ul className="space-y-4">
              {data.pattern_matrix.map((p, i) => (
                <li key={i} className="flex justify-between items-center text-sm">
                  <span className="text-stone-700">{p.behavior}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium 
                    ${p.frequency === 'High' ? 'bg-stone-100 text-stone-600' : 'text-stone-400'}`}>
                    {p.frequency}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Low Effort Action */}
          <div className="col-span-1 md:col-span-2 bg-stone-900 text-white p-8 rounded-2xl shadow-lg">
            <h3 className="font-semibold uppercase tracking-wide text-xs text-stone-400 mb-4">Immediate Low-Effort Action</h3>
            <p className="text-xl font-light leading-relaxed">
              {data.low_effort_action}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default State3Dashboard;