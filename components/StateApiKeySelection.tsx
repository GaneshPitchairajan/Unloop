import React from 'react';
import { KeyRound, TriangleAlert } from 'lucide-react';
import { AppState } from '../types';

interface Props {
  onApiKeySelected: () => void;
  onContinueWithoutPro: () => void;
}

const StateApiKeySelection: React.FC<Props> = ({ onApiKeySelected, onContinueWithoutPro }) => {
  const handleSelectKey = async () => {
    // Open the API key selection dialog
    await window.aistudio.openSelectKey();
    // Assume success and proceed, as per guidelines to mitigate race condition
    onApiKeySelected(); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100 fade-in">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-xl shadow-black/20 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-900/20 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-800/20 rounded-full blur-3xl -ml-16 -mb-16 animate-pulse delay-500"></div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-900 border border-indigo-700 rounded-2xl mb-2 shadow-lg shadow-indigo-900/10">
            <KeyRound className="text-indigo-400" size={32} />
          </div>
          <h1 className="text-4xl font-semibold text-slate-100 tracking-tight">Access Pro Features</h1>
          <p className="text-slate-400 text-lg font-light leading-relaxed max-w-md mx-auto">
            To unlock the full potential and powerful AI models, please select an API key associated with a paid Google Cloud project.
          </p>

          <div className="space-y-4 pt-4">
            <button
              onClick={handleSelectKey}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-500 shadow-lg shadow-indigo-900/40 transition-all hover:scale-105 transform flex items-center justify-center mx-auto gap-2"
            >
              <KeyRound size={20} />
              <span>Select API Key</span>
            </button>
            <button
              onClick={onContinueWithoutPro}
              className="w-full sm:w-auto px-8 py-3 bg-slate-800 text-slate-300 rounded-full font-medium text-base hover:bg-slate-700 transition-colors mx-auto block"
            >
              Continue with basic functionality
            </button>
          </div>

          <p className="text-xs text-slate-600 mt-6 flex items-center justify-center gap-2">
            <TriangleAlert size={14} className="text-amber-500" />
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-slate-400"
            >
              Learn more about billing
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StateApiKeySelection;