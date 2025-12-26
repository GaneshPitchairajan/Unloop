
import React, { useEffect, useState } from 'react';
import { LifeSnapshot } from '../types';
import { Command, Hexagon } from 'lucide-react';

interface Props {
  snapshot: LifeSnapshot;
  onFinish: () => void;
}

const State3_5Matching: React.FC<Props> = ({ snapshot, onFinish }) => {
  const [step, setStep] = useState(0);
  const steps = [
    "Stabilizing problem nodes...",
    "Realigning structural bottlenecks...",
    "Scanning architecture pools...",
    "Finalizing resolution paths..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(timer);
          setTimeout(onFinish, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [onFinish, steps.length]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-void p-8 text-high page-arrival">
      <div className="max-w-xl w-full space-y-12 text-center">
        
        {/* Structural Realignment Visualization */}
        <div className="relative w-56 h-56 mx-auto">
          <div className="absolute inset-0 border-2 border-resolution-indigo/20 rounded-[40px] animate-ping"></div>
          <div className="absolute inset-6 border border-resolution-cyan/10 rounded-[30px] animate-[ping_3s_infinite]"></div>
          
          <div className="absolute inset-12 bg-sanctuary border border-slate-800 rounded-[35px] flex items-center justify-center shadow-3xl">
             <div className="relative">
               <Hexagon className="text-resolution-indigo animate-spin-slow" size={56} strokeWidth={1} />
               <Command className="absolute inset-0 m-auto text-white animate-pulse" size={20} />
             </div>
          </div>

          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-6 bg-resolution-indigo/40 rounded-full"
              style={{
                top: `${50 + 38 * Math.sin(i * Math.PI / 4)}%`,
                left: `${50 + 38 * Math.cos(i * Math.PI / 4)}%`,
                transform: `rotate(${i * 45}deg)`,
                opacity: step >= i ? 1 : 0.1,
                transition: 'opacity 0.6s ease-in-out'
              }}
            ></div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tighter text-white">Realigning Logic</h2>
            <div className="h-5 overflow-hidden">
               <p className="text-resolution-cyan font-black uppercase tracking-widest text-[10px] animate-arrival">
                  {steps[step]}
               </p>
            </div>
          </div>
          
          <div className="w-48 mx-auto h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
             <div 
               className="h-full bg-resolution-indigo transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]"
               style={{ width: `${(step + 1) * 25}%` }}
             ></div>
          </div>
        </div>

        <div className="p-8 bg-sanctuary rounded-[35px] border border-slate-800 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <Command size={80} />
           </div>
           <p className="text-[9px] text-dim font-black uppercase tracking-[0.4em] mb-4">Architecture Target</p>
           <p className="text-xl font-light italic text-white leading-snug">"{snapshot.primary_theme}"</p>
        </div>

      </div>
    </div>
  );
};

export default State3_5Matching;
