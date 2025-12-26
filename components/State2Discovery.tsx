
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Activity, Mic, ArrowRight, Edit3, MessageSquare, X } from 'lucide-react';
import { Message } from '../types';
import { extractKeywords } from '../services/geminiService';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

interface Props {
  chatHistory: Message[];
  onSendMessage: (text: string) => Promise<void>;
  onTransition: () => void;
  isProcessing: boolean;
}

// --- Audio Utilities for Live API ---
function base64ToFloat32(base64: string): Float32Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  return float32;
}

function float32ToBase64(data: Float32Array): string {
  const int16 = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) {
    let s = Math.max(-1, Math.min(1, data[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  let binary = '';
  const bytes = new Uint8Array(int16.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const State2Discovery: React.FC<Props> = ({ chatHistory, onSendMessage, onTransition, isProcessing }) => {
  const [input, setInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Live API State ---
  const [isLive, setIsLive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, showOptions]);

  // Logic: If conversation is deep enough (3+ messages) and AI just spoke, offer the choice to exit
  useEffect(() => {
    const lastMsg = chatHistory[chatHistory.length - 1];
    if (lastMsg) {
      if (chatHistory.length >= 3 && lastMsg.role === 'model') {
        setShowOptions(true);
      }
      
      if (lastMsg.role === 'user') {
        extractKeywords(lastMsg.content).then(newKeywords => {
          setKeywords(prev => Array.from(new Set([...prev, ...newKeywords])).slice(-8));
        });
      }
    }
  }, [chatHistory]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    const text = input;
    setInput('');
    setShowOptions(false); 
    await onSendMessage(text);
  };

  const handleManualTyping = () => {
    setShowOptions(false);
  };

  // --- Live API Implementation ---
  const startLiveSession = async () => {
    if (isLive || isConnecting) return;
    setIsConnecting(true);
    setShowOptions(false);

    try {
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      audioContextRef.current = outputCtx;
      inputContextRef.current = inputCtx;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      // Create GoogleGenAI instance just before making the API call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
        callbacks: {
          onopen: () => {
            setIsLive(true);
            setIsConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const b64Data = float32ToBase64(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: { mimeType: 'audio/pcm;rate=16000', data: b64Data }
                });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
            
            sourceRef.current = source;
            processorRef.current = scriptProcessor;
          },
          onmessage: async (msg: LiveServerMessage) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const ctx = audioContextRef.current;
              const float32 = base64ToFloat32(base64Audio);
              const buffer = ctx.createBuffer(1, float32.length, 24000);
              buffer.getChannelData(0).set(float32);

              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              
              const startTime = Math.max(ctx.currentTime, nextStartTimeRef.current);
              source.start(startTime);
              nextStartTimeRef.current = startTime + buffer.duration;
              
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
            if (msg.serverContent?.interrupted) {
               sourcesRef.current.forEach(s => s.stop());
               sourcesRef.current.clear();
               nextStartTimeRef.current = 0;
            }
          },
          onclose: () => stopLiveSession(),
          onerror: (err) => stopLiveSession()
        }
      });
      sessionPromise.then(s => sessionRef.current = s);
    } catch (err) {
      setIsConnecting(false);
      alert('Could not start audio session.');
    }
  };

  const stopLiveSession = () => {
    setIsLive(false);
    setIsConnecting(false);
    audioStream?.getTracks().forEach(track => track.stop());
    setAudioStream(null);
    sourceRef.current?.disconnect();
    processorRef.current?.disconnect();
    inputContextRef.current?.close();
    audioContextRef.current?.close();
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-slate-950 fade-in overflow-hidden">
      <div className="flex-1 flex flex-col h-full w-full relative">
        <header className="px-8 py-5 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex justify-between items-center z-10 sticky top-0">
          <div>
            <h2 className="text-xl font-semibold text-slate-100 tracking-tight">Our conversation</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Safe space. No judgment.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={isLive ? stopLiveSession : startLiveSession}
              disabled={isConnecting}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                isLive 
                  ? 'bg-rose-950/30 text-rose-400 border border-rose-900 hover:bg-rose-900/40 voice-active'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {isConnecting ? (
                 <span className="animate-pulse">Connecting...</span>
              ) : isLive ? (
                <>
                  <Activity size={18} className="animate-pulse" />
                  <span>Live</span>
                  <X size={16} className="ml-1 opacity-50" />
                </>
              ) : (
                <>
                  <Mic size={18} />
                  <span>Speak</span>
                </>
              )}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-950/50">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-5 rounded-2xl shadow-lg transition-all duration-300 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-900/50'
                    : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
                }`}
              >
                <p className={`leading-relaxed whitespace-pre-wrap text-[15px] ${msg.role === 'user' ? 'font-light' : 'font-normal'}`}>
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
          {isProcessing && (
             <div className="flex justify-start animate-pulse">
               <div className="bg-slate-900 p-4 px-6 rounded-2xl rounded-bl-none shadow-sm border border-slate-800 flex items-center gap-3">
                 <div className="flex gap-1.5">
                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                 </div>
                 <span className="text-xs text-slate-400 font-medium">Thinking...</span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic Footer Area */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] z-10 transition-all duration-500">
          {isLive ? (
            <div className="max-w-3xl mx-auto h-14 flex items-center justify-center gap-3 text-slate-400 bg-slate-950 rounded-xl border border-dashed border-slate-700">
               <Activity className="animate-pulse text-indigo-500" size={20} />
               <span className="text-sm font-medium">Listening... (Tap 'Live' to stop)</span>
            </div>
          ) : showOptions ? (
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-indigo-900/50 shadow-sm animate-[fadeIn_0.5s_ease-out]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-800 rounded-full shadow-sm text-indigo-400">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100">Ready to see your picture?</h4>
                  <p className="text-sm text-slate-400">We have a picture of what's going on.</p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={handleManualTyping}
                  className="flex-1 md:flex-none px-6 py-3 bg-slate-800 border border-slate-700 text-slate-300 font-medium rounded-xl hover:bg-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} />
                  <span>Unloop & Talk</span>
                </button>
                <button 
                  onClick={onTransition}
                  className="flex-1 md:flex-none px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-900/40 transition-all flex items-center justify-center gap-2 transform hover:scale-105"
                >
                  <span>UNLOOP Your Problem</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSend} className="relative max-w-3xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Say what's on your mind..."
                className="w-full py-4 pl-6 pr-14 bg-slate-950 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-slate-200 placeholder:text-slate-600 transition-all"
                disabled={isProcessing}
                autoFocus
              />
              <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-700 transition-all hover:scale-105"
              >
                <Send size={18} />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="hidden lg:flex flex-col w-96 bg-slate-900 border-l border-slate-800 p-8 space-y-10 shadow-xl shadow-black/20 z-20">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
            <Sparkles size={14} className="text-indigo-400" />
            Themes
          </h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((k, i) => (
              <span key={i} className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-all hover:border-indigo-500/50 hover:text-indigo-400">
                {k}
              </span>
            ))}
            {keywords.length === 0 && (
              <div className="w-full py-8 text-center border-2 border-dashed border-slate-800 rounded-xl">
                 <span className="text-xs text-slate-500 font-medium">Chat to see themes...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default State2Discovery;
