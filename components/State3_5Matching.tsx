
import React, { useEffect, useState } from 'react';
import { LifeSnapshot } from '../types';
import { Search, Layers, ShieldCheck, Zap, Command, Hexagon } from 'lucide-react';

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
    }, 2000);
    return () => clearInterval(timer);
  }, [onFinish, steps.length]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian p-8 text-silver page-arrival">
      <div className="max-w-xl w-full space-y-16 text-center">
        
        {/* Structural Realignment Visualization */}
        <div className="relative w-64 h-64 mx-auto">
          {/* Pulsing Hexagons */}
          <div className="absolute inset-0 border-2 border-unloop-500/20 rounded-[40px] animate-ping"></div>
          <div className="absolute inset-8 border border-unloop-400/30 rounded-[30px] animate-[ping_3s_infinite]"></div>
          
          {/* Main Visual Core */}
          <div className="absolute inset-16 bg-sanctuary border border-slate-800 rounded-[35px] flex items-center justify-center shadow-3xl shadow-unloop-500/20">
             <div className="relative">
               <Hexagon className="text-unloop-500 animate-spin-slow" size={64} strokeWidth={1} />
               <Command className="absolute inset-0 m-auto text-white animate-pulse" size={24} />
             </div>
          </div>

          {/* Alignment Beams */}
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-8 bg-unloop-500/40 rounded-full"
              style={{
                top: `${50 + 40 * Math.sin(i * Math.PI / 4)}%`,
                left: `${50 + 40 * Math.cos(i * Math.PI / 4)}%`,
                transform: `rotate(${i * 45}deg)`,
                opacity: step >= i ? 1 : 0.1,
                transition: 'opacity 0.8s ease-in-out'
              }}
            ></div>
          ))}
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tighter text-white">Realigning Logic</h2>
            <div className="h-6 overflow-hidden">
               <p className="text-unloop-400 font-bold uppercase tracking-widest text-sm animate-arrival">
                  {steps[step]}
               </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
             <div 
               className="h-full bg-unloop-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]"
               style={{ width: `${(step + 1) * 25}%` }}
             ></div>
          </div>
        </div>

        <div className="p-10 bg-sanctuary rounded-[40px] border border-slate-800 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
             <Command size={100} />
           </div>
           <p className="text-xs text-slate-500 font-black uppercase tracking-[0.3em] mb-4">Architecture Target</p>
           <p className="text-2xl font-light italic text-white leading-snug">"{snapshot.primary_theme}"</p>
        </div>

      </div>
    </div>
  );
};

export default State3_5Matching;
