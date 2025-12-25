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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 fade-in">
      <div className="max-w-2xl w-full space-y-10">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-2">
            <Sparkles className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-5xl font-semibold text-slate-900 tracking-tight">The Clarity Architect</h1>
          <p className="text-slate-500 text-xl font-light max-w-lg mx-auto leading-relaxed">
            Move from noise to signal. Describe your current state without labeling it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-100 to-slate-200 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative">
            <textarea
              className="w-full p-8 text-2xl bg-white shadow-xl shadow-slate-200/50 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:outline-none resize-none text-slate-700 placeholder:text-slate-300 transition-all font-light"
              rows={4}
              placeholder="Right now, my day feels..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />
            
            <div className="absolute bottom-6 right-6">
              <button
                type="submit"
                disabled={!text.trim()}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-0 disabled:translate-y-2 transition-all duration-500 ease-out font-medium"
              >
                <span>Begin</span>
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