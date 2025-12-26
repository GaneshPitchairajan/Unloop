
import React, { useState, useEffect, useRef } from 'react';
import { Send, Activity, Mic, ArrowRight, X, Command, Sparkles, BrainCircuit } from 'lucide-react';
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

// --- Audio Utilities ---
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
  }, [chatHistory, showOptions, isProcessing]);

  useEffect(() => {
    const lastMsg = chatHistory[chatHistory.length - 1];
    if (lastMsg) {
      if (chatHistory.length >= 3 && lastMsg.role === 'model') {
        setShowOptions(true);
      }
      
      if (lastMsg.role === 'user') {
        extractKeywords(lastMsg.content).then(newKeywords => {
          setKeywords(prev => Array.from(new Set([...prev, ...newKeywords])).slice(-5));
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
    <div className="h-screen flex flex-col bg-void page-arrival overflow-hidden text-high">
      {/* Header with Glass Effect */}
      <header className="px-10 py-5 bg-sanctuary/60 backdrop-blur-xl border-b border-slate-800/50 flex justify-between items-center z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-resolution-indigo/20 rounded-xl flex items-center justify-center text-resolution-indigo border border-resolution-indigo/30 shadow-inner">
            <Command size={20} />
          </div>
          <h2 className="text-lg font-black tracking-tighter uppercase tracking-[0.2em]">Sanctuary Link</h2>
        </div>
        
        <button
          onClick={isLive ? stopLiveSession : startLiveSession}
          disabled={isConnecting}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border ${
            isLive 
              ? 'bg-red-950/40 border-red-500/50 text-red-400 shadow-3xl shadow-red-500/20'
              : 'bg-sanctuary border-slate-700 text-dim hover:border-resolution-cyan hover:text-resolution-cyan shadow-xl'
          }`}
        >
          {isConnecting ? (
            <div className="brand-loader !w-3.5 !h-3.5"></div>
          ) : isLive ? (
            <>
              <Activity size={16} className="animate-pulse" />
              <span>Voice Channel Open</span>
            </>
          ) : (
            <>
              <Mic size={16} />
              <span>Voice Map</span>
            </>
          )}
          {isLive && <X size={12} className="ml-1 opacity-50" />}
        </button>
      </header>

      {/* Dynamic Chat Flow - Optimized Scrolling */}
      <div className="flex-1 overflow-y-auto px-8 md:px-24 py-12 space-y-12 scroll-smooth no-scrollbar bg-void/30">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-8 py-6 rounded-[35px] transition-all duration-700 shadow-3xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-resolution-indigo to-resolution-cyan text-void font-bold rounded-br-none scale-entrance'
                  : 'bg-sanctuary border border-slate-800 text-high rounded-bl-none scale-entrance'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap text-lg font-light">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        {isProcessing && (
           <div className="flex justify-start opacity-70">
             <div className="bg-sanctuary/50 px-8 py-5 rounded-[28px] border border-slate-800 flex items-center gap-4">
               <div className="flex gap-1.5">
                 <span className="w-2 h-2 bg-resolution-cyan rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-resolution-cyan rounded-full animate-bounce delay-100"></span>
                 <span className="w-2 h-2 bg-resolution-cyan rounded-full animate-bounce delay-200"></span>
               </div>
               <span className="text-[9px] font-black tracking-[0.3em] uppercase text-resolution-cyan">Thinking...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Intelligent Input Zone */}
      <div className="px-10 pb-10 pt-6 bg-void relative z-20 shrink-0 border-t border-slate-900/50">
        {showOptions ? (
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-sanctuary p-8 rounded-[40px] border border-slate-800/60 shadow-3xl animate-arrival">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-resolution-indigo/10 rounded-[28px] flex items-center justify-center text-resolution-cyan border border-resolution-cyan/20 shadow-inner shrink-0">
                <BrainCircuit size={32} className="animate-pulse" />
              </div>
              <div>
                <h4 className="font-black text-2xl mb-1 text-white tracking-tighter">Structural Match High.</h4>
                <p className="text-dim font-light text-sm opacity-80">Logic knots identified.</p>
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button 
                onClick={() => setShowOptions(false)}
                className="flex-1 md:flex-none px-8 py-3.5 bg-void border border-slate-800 text-dim font-black rounded-full hover:text-white transition-all text-[10px] uppercase tracking-widest"
              >
                Expand
              </button>
              <button 
                onClick={onTransition}
                className="flex-1 md:flex-none px-10 py-3.5 bg-high text-void font-black rounded-full hover:bg-resolution-cyan transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-resolution-cyan/20"
              >
                Reveal Clarity
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSend} className="relative max-w-5xl mx-auto group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inject context..."
              className="w-full py-6 px-10 bg-sanctuary border border-slate-800 rounded-full focus:outline-none focus:border-resolution-indigo text-high text-xl placeholder:text-slate-700 transition-all duration-700 shadow-3xl neon-pulse"
              disabled={isProcessing}
            />
            {input.trim().length > 3 && (
              <button
                type="submit"
                disabled={isProcessing}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-4 bg-resolution-indigo text-white rounded-full hover:bg-resolution-cyan hover:text-void transition-all button-reveal shadow-2xl"
              >
                <Send size={24} />
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default State2Discovery;
