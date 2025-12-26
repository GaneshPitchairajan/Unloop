
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
      <header className="px-10 py-6 bg-sanctuary/60 backdrop-blur-xl border-b border-slate-800/50 flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-resolution-indigo/20 rounded-xl flex items-center justify-center text-resolution-indigo border border-resolution-indigo/30">
            <Command size={24} />
          </div>
          <h2 className="text-xl font-black tracking-tighter uppercase tracking-[0.2em]">Sanctuary Link</h2>
        </div>
        
        <button
          onClick={isLive ? stopLiveSession : startLiveSession}
          disabled={isConnecting}
          className={`flex items-center gap-3 px-10 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 border ${
            isLive 
              ? 'bg-red-950/40 border-red-500/50 text-red-400 shadow-3xl shadow-red-500/20'
              : 'bg-sanctuary border-slate-700 text-dim hover:border-resolution-cyan hover:text-resolution-cyan shadow-xl'
          }`}
        >
          {isConnecting ? (
            <div className="brand-loader !w-4 !h-4"></div>
          ) : isLive ? (
            <>
              <Activity size={18} className="animate-pulse" />
              <span>Voice Channel Open</span>
            </>
          ) : (
            <>
              <Mic size={18} />
              <span>Initiate Voice Map</span>
            </>
          )}
          {isLive && <X size={14} className="ml-1 opacity-50" />}
        </button>
      </header>

      {/* Dynamic Chat Flow */}
      <div className="flex-1 overflow-y-auto px-10 md:px-32 py-16 space-y-16 scroll-smooth no-scrollbar">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-10 py-8 rounded-[45px] transition-all duration-700 shadow-3xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-resolution-indigo to-resolution-cyan text-void font-bold rounded-br-none scale-entrance'
                  : 'bg-sanctuary border border-slate-800 text-high rounded-bl-none scale-entrance'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap text-xl font-light">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        {isProcessing && (
           <div className="flex justify-start opacity-70">
             <div className="bg-sanctuary/50 px-10 py-7 rounded-[35px] border border-slate-800 flex items-center gap-6">
               <div className="flex gap-2">
                 <span className="w-2.5 h-2.5 bg-resolution-cyan rounded-full animate-bounce"></span>
                 <span className="w-2.5 h-2.5 bg-resolution-cyan rounded-full animate-bounce delay-100"></span>
                 <span className="w-2.5 h-2.5 bg-resolution-cyan rounded-full animate-bounce delay-200"></span>
               </div>
               <span className="text-xs font-black tracking-[0.3em] uppercase text-resolution-cyan">Architectural Scan...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Intelligent Input Zone */}
      <div className="px-12 pb-14 pt-8 bg-void relative z-20">
        {showOptions ? (
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 bg-sanctuary p-14 rounded-[60px] border border-slate-800/60 shadow-3xl animate-arrival">
            <div className="flex items-center gap-10">
              <div className="w-24 h-24 bg-resolution-indigo/10 rounded-[40px] flex items-center justify-center text-resolution-cyan border border-resolution-cyan/20 shadow-inner">
                <BrainCircuit size={48} className="animate-pulse" />
              </div>
              <div>
                <h4 className="font-black text-4xl mb-2 text-white tracking-tighter">Structural Integrity 100%.</h4>
                <p className="text-dim font-light text-xl">The logic knots are successfully identified.</p>
              </div>
            </div>
            <div className="flex gap-6 w-full md:w-auto">
              <button 
                onClick={() => setShowOptions(false)}
                className="flex-1 md:flex-none px-12 py-6 bg-void border border-slate-800 text-dim font-black rounded-full hover:text-white transition-all text-sm uppercase tracking-widest"
              >
                Expand Detail
              </button>
              <button 
                onClick={onTransition}
                className="flex-1 md:flex-none px-16 py-6 bg-high text-void font-black rounded-full hover:bg-resolution-cyan transition-all flex items-center justify-center gap-5 text-sm uppercase tracking-[0.2em] shadow-2xl shadow-resolution-cyan/20"
              >
                Reveal Clarity
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSend} className="relative max-w-6xl mx-auto group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inject more structural context..."
              className="w-full py-10 px-14 bg-sanctuary border border-slate-800 rounded-full focus:outline-none focus:border-resolution-indigo text-high text-2xl placeholder:text-slate-700 transition-all duration-700 shadow-3xl neon-pulse"
              disabled={isProcessing}
            />
            {input.trim().length > 3 && (
              <button
                type="submit"
                disabled={isProcessing}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-7 bg-resolution-indigo text-white rounded-full hover:bg-resolution-cyan hover:text-void transition-all button-reveal shadow-2xl"
              >
                <Send size={32} />
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default State2Discovery;
