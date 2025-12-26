
import React from 'react';
import { ArrowRight, Command } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-paper overflow-hidden text-charcoal page-arrival">
      
      {/* --- Ambient Soft Light --- */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-calm-100/40 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-calm-50/60 rounded-full blur-[100px]"></div>
      </div>

      {/* --- Unlooping Branding --- */}
      <div className="relative z-10 mb-8 flex flex-col items-center">
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          <svg className="absolute w-full h-full" viewBox="0 0 200 200">
            <path 
              d="M100,50 C140,50 160,80 160,100 C160,120 140,150 100,150 C60,150 40,120 40,100 C40,80 60,50 100,50" 
              fill="none" 
              stroke="#A5BDC3" 
              strokeWidth="1.5"
              className="unloop-path"
            />
            <path 
              d="M100,70 C120,70 135,85 135,100 C135,115 120,130 100,130 C80,130 65,115 65,100 C65,85 80,70 100,70" 
              fill="none" 
              stroke="#69919B" 
              strokeWidth="1"
              opacity="0.5"
              className="unloop-path"
              style={{ animationDelay: '1s' }}
            />
          </svg>
          <div className="relative z-20 flex flex-col items-center justify-center gap-2">
            <Command size={40} className="text-calm-500 mb-2" />
            <span className="text-sm font-semibold tracking-[0.4em] text-calm-400 uppercase">UnLOOP</span>
          </div>
        </div>
      </div>

      {/* --- Core Content --- */}
      <div className="relative z-10 text-center space-y-10 max-w-lg px-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-charcoal leading-tight">
            Complexity is a loop waiting to be untied.
          </h1>
          <p className="text-slate-500 text-lg font-light leading-relaxed">
            Welcome to your calm base. We are here to listen, untangle the knots, and find your center.
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-4 px-10 py-5 bg-calm-500 text-white rounded-full font-medium text-lg transition-all duration-500 hover:bg-calm-600 hover:shadow-lg active:scale-95"
          >
            <span>Begin unlooping my thoughts</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <footer className="absolute bottom-10 text-slate-400 text-xs font-light tracking-wide uppercase">
        Sitting on a chair with feet on the floor
      </footer>
    </div>
  );
};

export default LandingPage;
