import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-50 fade-in">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light text-stone-800 tracking-tight">The Clarity Architect</h1>
          <p className="text-stone-500 text-lg font-light">
            Don't label it. Just describe how your day feels right now.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <textarea
            className="w-full p-6 text-xl bg-white border-none shadow-sm rounded-xl focus:ring-2 focus:ring-stone-200 focus:outline-none resize-none text-stone-700 placeholder:text-stone-300 transition-all"
            rows={6}
            placeholder="I feel..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
          
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={!text.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <span>Begin</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default State1Entry;