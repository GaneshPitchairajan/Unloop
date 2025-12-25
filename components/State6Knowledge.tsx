import React, { useState } from 'react';
import { LifeSnapshot } from '../types';
import { analyzeDocument } from '../services/geminiService';
import { UploadCloud, FileText, X } from 'lucide-react';

interface Props {
  snapshot: LifeSnapshot;
  onClose: () => void;
}

const State6Knowledge: React.FC<Props> = ({ snapshot, onClose }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsAnalyzing(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      try {
        const result = await analyzeDocument(text, snapshot);
        setAnalysis(result);
      } catch (err) {
        setAnalysis("Could not analyze document.");
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <header className="p-6 border-b border-stone-100 flex justify-between items-center">
          <h3 className="text-xl font-light text-stone-800">Knowledge Hub Integration</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-800 transition-colors">
            <X size={24} />
          </button>
        </header>

        <div className="p-8 overflow-y-auto flex-1">
          {!analysis ? (
            <div className="border-2 border-dashed border-stone-200 rounded-2xl p-12 text-center hover:border-indigo-300 transition-colors">
              {isAnalyzing ? (
                <div className="space-y-4">
                  <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-stone-500">Reading {fileName} and cross-referencing with your snapshot...</p>
                </div>
              ) : (
                <label className="cursor-pointer space-y-4">
                  <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-400 mx-auto">
                    <UploadCloud size={32} />
                  </div>
                  <div>
                    <p className="font-medium text-stone-800">Upload a journal entry or plan</p>
                    <p className="text-sm text-stone-400">Supported: .txt, .md (Text only for demo)</p>
                  </div>
                  <input type="file" accept=".txt,.md" className="hidden" onChange={handleFileUpload} />
                </label>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-indigo-600">
                <FileText size={20} />
                <span className="font-semibold text-sm uppercase tracking-wide">Analysis Complete</span>
              </div>
              <div className="prose prose-stone leading-relaxed">
                <p className="whitespace-pre-wrap text-stone-700">{analysis}</p>
              </div>
              <button 
                onClick={() => setAnalysis(null)} 
                className="text-sm text-stone-400 underline hover:text-stone-600"
              >
                Analyze another document
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default State6Knowledge;