import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, AlertCircle } from 'lucide-react';
import { Message } from '../types';
import { extractKeywords } from '../services/geminiService';

interface Props {
  chatHistory: Message[];
  onSendMessage: (text: string) => Promise<void>;
  onTransition: () => void;
  isProcessing: boolean;
}

const State2Discovery: React.FC<Props> = ({ chatHistory, onSendMessage, onTransition, isProcessing }) => {
  const [input, setInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Glass Box Logic: Extract keywords from user messages
  useEffect(() => {
    const lastMsg = chatHistory[chatHistory.length - 1];
    if (lastMsg && lastMsg.role === 'user') {
      extractKeywords(lastMsg.content).then(newKeywords => {
        setKeywords(prev => Array.from(new Set([...prev, ...newKeywords])).slice(-8));
      });
    }
  }, [chatHistory]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    const text = input;
    setInput('');
    await onSendMessage(text);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-stone-50 fade-in">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full max-w-4xl mx-auto w-full">
        <header className="p-6 border-b border-stone-100 flex justify-between items-center">
          <h2 className="text-xl font-light text-stone-800">Discovery Lounge</h2>
          {chatHistory.length > 4 && (
            <button 
              onClick={onTransition}
              className="px-4 py-2 bg-stone-900 text-white text-sm rounded-full hover:bg-stone-800 transition-colors animate-pulse"
            >
              Analyze Clarity
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-stone-200 text-stone-800 rounded-br-none'
                    : 'bg-white text-stone-700 shadow-sm rounded-bl-none border border-stone-100'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isProcessing && (
             <div className="flex justify-start">
               <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-stone-100 flex gap-2">
                 <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce delay-75"></span>
                 <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce delay-150"></span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-stone-100">
          <form onSubmit={handleSend} className="relative max-w-3xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Reflect here..."
              className="w-full p-4 pr-12 bg-stone-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-300 text-stone-700 placeholder:text-stone-400"
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-800 disabled:opacity-30 transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Glass Box Side Panel */}
      <div className="hidden md:flex flex-col w-80 bg-white border-l border-stone-100 p-6 space-y-8">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-2">
            <Sparkles size={14} />
            System Perception
          </h3>
          <p className="text-sm text-stone-500 italic mb-4">
            The system is listening for themes, not diagnoses.
          </p>
          <div className="flex flex-wrap gap-2">
            {keywords.map((k, i) => (
              <span key={i} className="px-3 py-1 bg-stone-50 border border-stone-100 text-stone-600 text-xs rounded-full">
                {k}
              </span>
            ))}
            {keywords.length === 0 && (
              <span className="text-xs text-stone-300">Listening...</span>
            )}
          </div>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <h4 className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <AlertCircle size={14} />
            Calm Tech Protocol
          </h4>
          <p className="text-xs text-amber-700 leading-relaxed">
            I am mapping your clarity, not your pathology. You remain the agent of your own decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default State2Discovery;