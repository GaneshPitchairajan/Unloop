import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 fade-in text-slate-100">
      <div className="max-w-2xl w-full space-y-10">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 border border-slate-800 rounded-2xl mb-2 shadow-lg shadow-indigo-900/10">
            <Sparkles className="text-indigo-400" size={32} />
          </div>
          <h1 className="text-5xl font-semibold text-slate-100 tracking-tight">Your Space</h1>
          <p className="text-slate-400 text-xl font-light max-w-lg mx-auto leading-relaxed">
            It’s okay to not know where to start. Just say how things feel today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-900 to-slate-800 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative">
            <textarea
              className="w-full p-8 text-2xl bg-slate-900 border border-slate-800 shadow-xl shadow-black/50 rounded-2xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 focus:outline-none resize-none text-slate-100 placeholder:text-slate-600 transition-all font-light"
              rows={4}
              placeholder="How are things feeling today?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />
            
            <div className="absolute bottom-6 right-6">
              <button
                type="submit"
                disabled={!text.trim()}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-0 disabled:translate-y-2 transition-all duration-500 ease-out font-medium"
              >
                <span>Start here</span>
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