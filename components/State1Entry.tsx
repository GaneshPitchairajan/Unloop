
import React, { useState } from 'react';
import { ArrowRight, Command, Zap } from 'lucide-react';

interface Props {
  onComplete: (initialText: string) => void;
}

const State1Entry: React.FC<Props> = ({ onComplete }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 5) {
      onComplete(text);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-6 md:p-12 bg-void page-arrival text-high overflow-hidden">
      <div className="max-w-4xl w-full space-y-8 flex flex-col items-center">
        <header className="text-center space-y-3">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-resolution-indigo/10 border border-resolution-indigo/20 rounded-full text-resolution-indigo">
            <Command size={14} className="animate-spin-slow" />
            <span className="text-[9px] font-black tracking-[0.4em] uppercase">Architecture Node</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">Map the <span className="text-dim italic font-light">Complexity.</span></h1>
          <p className="text-dim text-base font-light leading-relaxed max-w-lg mx-auto opacity-80">
            Identify the structural bottlenecks of your current situation.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-6">
          <div className="relative group w-full">
            <div className="absolute inset-0 bg-resolution-indigo/5 blur-[80px] rounded-full pointer-events-none opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
            
            <textarea
              className={`relative w-full p-6 text-lg bg-sanctuary border border-slate-800 rounded-[35px] focus:outline-none focus:border-resolution-cyan transition-all duration-700 font-light h-56 md:h-72 leading-relaxed placeholder:text-slate-700 shadow-3xl neon-pulse no-scrollbar resize-none`}
              placeholder="Describe the problem loops in detail..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />
          </div>

          <div className="h-20 flex items-center justify-center">
            {text.trim().length > 5 ? (
              <div className="button-reveal">
                <button
                  type="submit"
                  className="group flex items-center gap-4 px-10 py-4 bg-resolution-indigo text-white rounded-full hover:bg-resolution-cyan hover:text-void transition-all duration-500 font-black text-lg shadow-2xl shadow-resolution-indigo/30"
                >
                  <span>Initiate Resolution</span>
                  <Zap size={22} className="group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 opacity-30">
                <div className="w-1.5 h-1.5 bg-slate-700 rounded-full animate-bounce"></div>
                <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-500">Awaiting architectural input...</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default State1Entry;
