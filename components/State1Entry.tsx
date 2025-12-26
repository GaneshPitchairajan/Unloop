
import React, { useState } from 'react';
import { ArrowRight, Command } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-paper page-arrival text-charcoal">
      <div className="max-w-2xl w-full space-y-12">
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4 text-calm-300">
            <Command size={18} />
            <span className="text-[10px] font-semibold tracking-widest uppercase">UnLOOP Sanctuary</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-medium text-charcoal tracking-tight">Your resolution space.</h1>
          <p className="text-slate-500 text-lg font-light leading-relaxed max-w-md mx-auto">
            Take a breath. Share whatever feels tangled in your mind. There is no right way to begin.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="w-full space-y-8">
          <div className="relative">
            <textarea
              className="w-full p-8 text-xl bg-white border border-slate-100 calm-shadow rounded-3xl focus:border-calm-200 focus:outline-none resize-none text-charcoal placeholder:text-slate-300 transition-all font-light min-h-[300px] leading-relaxed"
              placeholder="I am listening..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />
            
            <div className="flex justify-center mt-10">
              <button
                type="submit"
                disabled={!text.trim()}
                className="flex items-center gap-3 px-12 py-5 bg-calm-500 text-white rounded-full hover:bg-calm-600 disabled:opacity-30 disabled:translate-y-2 transition-all duration-700 ease-out font-medium text-lg"
              >
                <span>Continue toward clarity</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default State1Entry;
