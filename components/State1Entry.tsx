
import React, { useState } from 'react';
import { ArrowRight, Command, MessageSquare } from 'lucide-react';

interface Props {
  onComplete: (initialText: string) => void;
}

const State1Entry: React.FC<Props> = ({ onComplete }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 2) {
      onComplete(text);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-obsidian page-arrival text-silver">
      <div className="max-w-3xl w-full space-y-12">
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4 text-unloop-500">
            <Command size={24} />
            <span className="text-[12px] font-black tracking-[0.4em] uppercase">Resolution Sanctuary</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">Map your complexity.</h1>
          <p className="text-muted text-xl font-light leading-relaxed max-w-lg mx-auto">
            Input the tangled nodes of your current situation. We architecturalize the path forward.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="w-full space-y-10">
          <div className="relative group">
            <textarea
              className={`w-full p-10 text-2xl bg-sanctuary border border-slate-800 rounded-[40px] focus:outline-none focus:border-unloop-500 transition-all font-light min-h-[350px] leading-relaxed placeholder:text-slate-700 shadow-2xl ${text.length > 0 ? 'unloop-pulse' : ''}`}
              placeholder="Start describing the loops..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />
            
            {text.trim().length > 2 && (
              <div className="flex justify-center mt-12 reveal-btn">
                <button
                  type="submit"
                  className="group flex items-center gap-6 px-14 py-6 bg-unloop-600 text-white rounded-full hover:bg-unloop-500 transition-all duration-500 font-bold text-xl shadow-xl shadow-unloop-600/20"
                >
                  <span>Release complexity to the sanctuary</span>
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default State1Entry;
