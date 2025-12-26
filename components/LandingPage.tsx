
import React from 'react';
import { ArrowRight, Command, ShieldCheck, Sparkles } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center bg-void overflow-hidden text-high page-arrival">
      
      {/* --- Depth Layer: Atmospheric Gradients --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-30%] left-[-10%] w-[80%] h-[80%] bg-resolution-indigo/10 rounded-full blur-[180px] opacity-40"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-resolution-cyan/10 rounded-full blur-[150px] opacity-30"></div>
      </div>

      {/* --- Brand Identity Core --- */}
      <div className="relative z-10 mb-8 flex flex-col items-center group cursor-default">
        <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] flex items-center justify-center">
          {/* Orbital Visualization */}
          <div className="absolute inset-0 border border-slate-800/40 rounded-full stabilizer-ring"></div>
          <div className="absolute inset-12 border border-resolution-indigo/20 rounded-full stabilizer-ring" style={{animationDirection: 'reverse', animationDuration: '20s'}}></div>
          <div className="absolute inset-24 border border-resolution-cyan/10 rounded-full stabilizer-ring" style={{animationDuration: '25s'}}></div>
          
          <svg className="absolute w-[60%] h-[60%]" viewBox="0 0 200 200">
            <path 
              d="M100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 C20,60 60,20 100,20" 
              fill="none" 
              stroke="url(#indigoCyan)" 
              strokeWidth="1.5"
              className="stabilizer-path"
            />
            <defs>
              <linearGradient id="indigoCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="relative z-20 flex flex-col items-center justify-center text-center scale-up">
            <div className="p-6 bg-void/60 backdrop-blur-xl border border-slate-800 rounded-[40px] mb-4 shadow-3xl group-hover:border-resolution-indigo/50 transition-all duration-700">
              <Command size={64} className="text-resolution-indigo animate-pulse" />
            </div>
            <h1 className="text-lg font-black tracking-[1.2em] text-resolution-cyan uppercase ml-[1.2em] opacity-80">UnLOOP</h1>
          </div>
        </div>
      </div>

      {/* --- High Impact Messaging --- */}
      <div className="relative z-10 text-center space-y-10 max-w-3xl px-12">
        <div className="space-y-6">
          <h2 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-[0.9]">
            Structural <span className="text-transparent bg-clip-text bg-gradient-to-r from-resolution-indigo to-resolution-cyan">Clarity.</span>
          </h2>
          <p className="text-dim text-xl md:text-2xl font-light leading-relaxed max-w-2xl mx-auto">
            Resolving architectural complexity through high-precision human logic. Move from the loop to the sanctuary.
          </p>
        </div>

        <div className="pt-8">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-6 px-14 py-7 bg-white text-void rounded-full font-black text-2xl transition-all duration-500 hover:bg-resolution-indigo hover:text-white hover:scale-[1.05] shadow-2xl active:scale-95"
          >
            <span>Begin Resolution Protocol</span>
            <div className="w-12 h-12 bg-void text-white rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-resolution-indigo transition-all duration-500">
              <ArrowRight size={28} />
            </div>
          </button>
        </div>
        
        <div className="pt-12 flex items-center justify-center gap-6 text-slate-600 text-xs font-black uppercase tracking-[0.3em] opacity-50">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} />
            <span>Secure Nodes</span>
          </div>
          <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <span>Clarity First</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
