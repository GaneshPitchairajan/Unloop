
import React from 'react';
import { ArrowRight, Command, ShieldCheck, Sparkles } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center bg-void overflow-hidden text-high page-arrival px-6">
      
      {/* --- Depth Layer: Atmospheric Gradients --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-resolution-indigo/10 rounded-full blur-[150px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-resolution-cyan/10 rounded-full blur-[120px] opacity-30"></div>
      </div>

      {/* --- Brand Identity Core - Scaled Down for Visibility --- */}
      <div className="relative z-10 flex flex-col items-center group cursor-default scale-90 md:scale-100 mb-4">
        <div className="relative w-56 h-56 md:w-[340px] md:h-[340px] flex items-center justify-center">
          <div className="absolute inset-0 border border-slate-800/40 rounded-full stabilizer-ring"></div>
          <div className="absolute inset-6 border border-resolution-indigo/20 rounded-full stabilizer-ring" style={{animationDirection: 'reverse', animationDuration: '20s'}}></div>
          
          <svg className="absolute w-[60%] h-[60%]" viewBox="0 0 200 200">
            <path 
              d="M100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 C20,60 60,20 100,20" 
              fill="none" 
              stroke="url(#indigoCyan)" 
              strokeWidth="2"
              className="stabilizer-path"
            />
            <defs>
              <linearGradient id="indigoCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="relative z-20 flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-void/60 backdrop-blur-xl border border-slate-800 rounded-[30px] mb-3 shadow-3xl group-hover:border-resolution-indigo/50 transition-all duration-700">
              <Command size={40} className="text-resolution-indigo animate-pulse" />
            </div>
            <h1 className="text-[10px] font-black tracking-[0.8em] text-resolution-cyan uppercase ml-[0.8em] opacity-80">UnLOOP</h1>
          </div>
        </div>
      </div>

      {/* --- High Impact Messaging - Optimized Gaps --- */}
      <div className="relative z-10 text-center space-y-6 max-w-3xl">
        <div className="space-y-3">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Structural <span className="text-transparent bg-clip-text bg-gradient-to-r from-resolution-indigo to-resolution-cyan">Clarity.</span>
          </h2>
          <p className="text-dim text-base md:text-lg font-light leading-relaxed max-w-lg mx-auto opacity-90">
            Resolving complexity through high-precision human logic. Move from the loop to the sanctuary.
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white text-void rounded-full font-black text-lg transition-all duration-500 hover:bg-resolution-indigo hover:text-white shadow-2xl active:scale-95"
          >
            <span>Begin Protocol</span>
            <div className="w-8 h-8 bg-void text-white rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-resolution-indigo transition-all duration-500">
              <ArrowRight size={20} />
            </div>
          </button>
        </div>
        
        <div className="pt-6 flex items-center justify-center gap-5 text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} />
            <span>Secure Nodes</span>
          </div>
          <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Sparkles size={12} />
            <span>Clarity First</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
