import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950 overflow-hidden text-slate-100">
      
      {/* --- Ambient Background Effects --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-800/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* --- The Unloop Animation --- */}
      <div className="relative z-10 mb-12 opacity-90">
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-[spin_10s_linear_infinite]"></div>
          
          {/* Middle Rotating Ellipse 1 */}
          <div className="absolute inset-4 rounded-[40%] border border-indigo-400/30 animate-[spin_7s_linear_infinite_reverse]" style={{ transformOrigin: 'center' }}></div>
          
          {/* Middle Rotating Ellipse 2 (Offset) */}
          <div className="absolute inset-4 rounded-[40%] border border-slate-400/20 animate-[spin_5s_linear_infinite]" style={{ transform: 'rotate(45deg)' }}></div>

          {/* Inner Glowing Core */}
          <div className="relative w-32 h-32 bg-gradient-to-tr from-indigo-600 to-slate-800 rounded-full blur-2xl opacity-40 animate-pulse"></div>
          
          {/* The "Loop" SVG Icon (Centerpiece) */}
          <svg className="absolute w-24 h-24 text-slate-100 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
             <path 
               d="M30 50 C 30 20, 70 20, 70 50 C 70 80, 30 80, 30 50 Z" 
               className="animate-[dash_3s_ease-in-out_infinite]"
               strokeDasharray="200"
               strokeDashoffset="0"
             />
             <path 
               d="M30 50 C 30 80, 70 80, 70 50" 
               className="opacity-50"
             />
          </svg>
        </div>
      </div>

      {/* --- Content --- */}
      <div className="relative z-10 text-center space-y-6 max-w-md px-6">
        <div className="space-y-2">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
            UNLOOP
          </h1>
          <p className="text-indigo-400 text-lg md:text-xl font-medium tracking-wide uppercase">
            Let's unloop your problem
          </p>
        </div>

        <p className="text-slate-400 font-light leading-relaxed">
          From chaos to clarity. An intelligent space to untangle your thoughts and find your path forward.
        </p>

        <div className="pt-8">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-100 text-slate-950 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            <span>Start Conversation</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* --- CSS for Custom Animation keyframes specific to this page --- */}
      <style>{`
        @keyframes dash {
          0% { stroke-dashoffset: 200; opacity: 0; }
          50% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -200; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;