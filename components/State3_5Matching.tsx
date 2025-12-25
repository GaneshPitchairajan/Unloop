
import React, { useEffect, useState } from 'react';
import { LifeSnapshot } from '../types';
import { Sparkles, Search, Layers, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  snapshot: LifeSnapshot;
  onFinish: () => void;
}

const State3_5Matching: React.FC<Props> = ({ snapshot, onFinish }) => {
  const [step, setStep] = useState(0);
  const steps = [
    "Analyzing core theme...",
    "Scanning expertise pools...",
    "Filtering by approach & safety...",
    "Finalizing mentor connections..."
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
    }, 1500);
    return () => clearInterval(timer);
  }, [onFinish, steps.length]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-slate-100 fade-in">
      <div className="max-w-md w-full space-y-12 text-center">
        
        {/* Animated Visualization */}
        <div className="relative w-48 h-48 mx-auto">
          {/* Outer Pulsing Rings */}
          <div className="absolute inset-0 border border-indigo-500/20 rounded-full animate-ping"></div>
          <div className="absolute inset-4 border border-indigo-400/30 rounded-full animate-[ping_2s_infinite]"></div>
          
          {/* Center Icon */}
          <div className="absolute inset-10 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-900/50">
             {step === 0 && <Search className="text-white animate-bounce" size={32} />}
             {step === 1 && <Layers className="text-white animate-pulse" size={32} />}
             {step === 2 && <ShieldCheck className="text-white" size={32} />}
             {step === 3 && <Zap className="text-white animate-pulse" size={32} />}
          </div>

          {/* Floating Data Nodes */}
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
              style={{
                top: `${50 + 40 * Math.sin(i * Math.PI / 3)}%`,
                left: `${50 + 40 * Math.cos(i * Math.PI / 3)}%`,
                animationDelay: `${i * 0.2}s`
              }}
            ></div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Finding your Guides</h2>
          <div className="h-6 overflow-hidden">
             <p className="text-indigo-400 font-medium animate-[fadeIn_0.3s_ease-out]">
                {steps[step]}
             </p>
          </div>
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
             <div 
               className="h-full bg-indigo-600 transition-all duration-500"
               style={{ width: `${(step + 1) * 25}%` }}
             ></div>
          </div>
        </div>

        <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
           <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Target Problem</p>
           <p className="text-sm font-medium text-slate-300">"{snapshot.primary_theme}"</p>
        </div>

      </div>
    </div>
  );
};

export default State3_5Matching;
