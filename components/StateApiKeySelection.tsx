
import React from 'react';
import { KeyRound, TriangleAlert, Command, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-void text-high page-arrival">
      <div className="max-w-xl w-full bg-sanctuary border border-slate-800 rounded-[60px] p-12 shadow-[0_0_100px_rgba(0,0,0,0.8)] text-center space-y-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-resolution-indigo/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-20%] w-64 h-64 bg-resolution-cyan/5 rounded-full blur-[100px] animate-pulse delay-700"></div>

        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center justify-center p-6 bg-void border border-slate-800 rounded-[40px] mb-2 shadow-inner">
            <KeyRound className="text-resolution-indigo" size={48} />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-resolution-cyan mb-2">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Protocol Authorization</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Access <span className="text-dim">Pro</span> Nodes.</h1>
            <p className="text-dim text-lg font-light leading-relaxed max-w-sm mx-auto">
              To activate high-precision architectural models, a professional API key linkage is required.
            </p>
          </div>

          <div className="space-y-5 pt-6">
            <button
              onClick={handleSelectKey}
              className="w-full px-10 py-5 bg-resolution-indigo text-white rounded-full font-black text-sm uppercase tracking-[0.2em] hover:bg-resolution-cyan hover:text-void shadow-2xl shadow-resolution-indigo/20 transition-all active:scale-95 flex items-center justify-center gap-4"
            >
              <KeyRound size={20} />
              <span>Initialize Key Link</span>
            </button>
            <button
              onClick={onContinueWithoutPro}
              className="w-full px-10 py-4 bg-void border border-slate-800 text-dim rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:text-white hover:border-slate-600 transition-all"
            >
              Maintain Basic Resolution
            </button>
          </div>

          <div className="pt-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-slate-700">
               <TriangleAlert size={14} className="text-amber-500/50" />
               <a 
                 href="https://ai.google.dev/gemini-api/docs/billing" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-[10px] font-black uppercase tracking-widest underline hover:text-slate-400"
               >
                 Review Billing Protocol
               </a>
            </div>
            <div className="flex items-center gap-2 opacity-20">
              <Command size={12} />
              <span className="text-[9px] font-black tracking-[0.4em] uppercase">UnLOOP Systems</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateApiKeySelection;
