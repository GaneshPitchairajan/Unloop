
import React, { useState } from 'react';
import { ArrowRight, Command, MessageSquare, Zap } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col items-center justify-center p-12 bg-void page-arrival text-high">
      <div className="max-w-4xl w-full space-y-16">
        <header className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-resolution-indigo/10 border border-resolution-indigo/20 rounded-full text-resolution-indigo">
            <Command size={20} className="animate-spin-slow" />
            <span className="text-[12px] font-black tracking-[0.4em] uppercase">Architecture Node</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">Map the <span className="text-dim italic font-light">Complexity.</span></h1>
          <p className="text-dim text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Input the structural bottlenecks of your current situation. Your text will initiate the resolution sequence.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="w-full space-y-12">
          <div className="relative group">
            {/* Background Glow for Textarea */}
            <div className="absolute inset-0 bg-resolution-indigo/5 blur-[100px] rounded-full pointer-events-none opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
            
            <textarea
              className={`relative w-full p-12 text-2xl bg-sanctuary border border-slate-800 rounded-[50px] focus:outline-none focus:border-resolution-cyan transition-all duration-700 font-light min-h-[400px] leading-relaxed placeholder:text-slate-700 shadow-3xl neon-pulse ${text.length > 0 ? 'unloop-pulse' : ''}`}
              placeholder="Describe the problem loops in detail..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />
            
            <div className="h-32 flex items-center justify-center">
              {text.trim().length > 5 ? (
                <div className="button-reveal">
                  <button
                    type="submit"
                    className="group flex items-center gap-6 px-16 py-7 bg-resolution-indigo text-white rounded-full hover:bg-resolution-cyan hover:text-void transition-all duration-500 font-black text-2xl shadow-2xl shadow-resolution-indigo/30"
                  >
                    <span>Initiate Resolution Sequence</span>
                    <Zap size={28} className="group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 opacity-40">
                  <div className="w-1.5 h-1.5 bg-slate-700 rounded-full animate-bounce"></div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Awaiting sufficient architectural input...</p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default State1Entry;
