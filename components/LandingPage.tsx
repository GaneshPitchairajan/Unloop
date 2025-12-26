
import React from 'react';
import { ArrowRight, Command, Shield } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center bg-obsidian overflow-hidden text-silver page-arrival">
      
      {/* --- Depth Background --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-unloop-600/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-slate-900/40 rounded-full blur-[150px]"></div>
      </div>

      {/* --- Innovative Unlooping Animation: The Stabilizer --- */}
      <div className="relative z-10 mb-6 group cursor-default">
        <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
          <svg className="absolute w-full h-full" viewBox="0 0 200 200">
            {/* The Outer Tangled Web */}
            <path 
              d="M100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 C20,60 60,20 100,20" 
              fill="none" 
              stroke="#1E293B" 
              strokeWidth="0.5"
            />
            {/* The Stabilizer Path */}
            <path 
              d="M100,40 Q160,40 160,100 Q160,160 100,160 Q40,160 40,100 Q40,40 100,40" 
              fill="none" 
              stroke="#6366F1" 
              strokeWidth="2"
              strokeLinecap="round"
              className="stabilizer-path"
            />
            <circle cx="100" cy="100" r="3" fill="#6366F1" className="animate-pulse" />
          </svg>
          
          <div className="relative z-20 flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-obsidian border border-slate-800 rounded-[30px] mb-4 shadow-2xl">
              <Command size={48} className="text-unloop-400" />
            </div>
            <span className="text-[10px] font-bold tracking-[1em] text-unloop-400 uppercase ml-[1em]">UnLOOP</span>
          </div>
        </div>
      </div>

      {/* --- Core Content --- */}
      <div className="relative z-10 text-center space-y-8 max-w-2xl px-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight">
            Stabilize Your <span className="text-unloop-500">Perspective.</span>
          </h1>
          <p className="text-muted text-xl font-light leading-relaxed max-w-lg mx-auto">
            A professional sanctuary for resolving architectural complexity. Reclaim clarity today.
          </p>
        </div>

        <div className="pt-6">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-6 px-12 py-6 bg-white text-obsidian rounded-full font-bold text-xl transition-all duration-500 hover:bg-unloop-50 hover:scale-[1.02] shadow-2xl"
          >
            <span>Begin my unlooping journey</span>
            <div className="w-10 h-10 bg-obsidian text-white rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform duration-500">
              <ArrowRight size={22} />
            </div>
          </button>
        </div>
        
        <div className="pt-10 flex items-center justify-center gap-2 text-slate-600 text-xs font-bold uppercase tracking-widest">
          <Shield size={14} />
          <span>Professional. Secure. Resolution Focused.</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
