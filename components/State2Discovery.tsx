
import React, { useState, useEffect, useRef } from 'react';
import { Send, Activity, Mic, ArrowRight, X, Command } from 'lucide-react';
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
    <div className="h-screen flex flex-col bg-paper page-arrival overflow-hidden text-charcoal">
      {/* Header */}
      <header className="px-8 py-6 bg-paper/80 backdrop-blur-sm border-b border-slate-100 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <Command size={18} className="text-calm-300" />
          <h2 className="text-lg font-medium tracking-tight">Listening space</h2>
        </div>
        
        <button
          onClick={isLive ? stopLiveSession : startLiveSession}
          disabled={isConnecting}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-medium transition-all duration-300 border ${
            isLive 
              ? 'bg-calm-50 border-calm-200 text-calm-600 voice-active'
              : 'bg-white border-slate-100 text-slate-500 hover:border-calm-100 hover:text-calm-500'
          }`}
        >
          {isConnecting ? "Connecting..." : isLive ? "Vocalizing thoughts" : "Take a moment to speak"}
          {isLive && <X size={14} className="ml-1 opacity-40" />}
        </button>
      </header>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-12 space-y-12 scroll-smooth no-scrollbar">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-10 py-8 rounded-[32px] transition-all duration-300 ${
                msg.role === 'user'
                  ? 'bg-calm-100 text-charcoal'
                  : 'bg-white border border-slate-100 calm-shadow text-charcoal'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap text-lg font-light">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        {isProcessing && (
           <div className="flex justify-start opacity-40">
             <div className="bg-white px-8 py-5 rounded-[24px] border border-slate-100 flex items-center gap-3">
               <div className="flex gap-1.5">
                 <span className="w-1.5 h-1.5 bg-calm-300 rounded-full animate-bounce"></span>
                 <span className="w-1.5 h-1.5 bg-calm-300 rounded-full animate-bounce delay-75"></span>
                 <span className="w-1.5 h-1.5 bg-calm-300 rounded-full animate-bounce delay-150"></span>
               </div>
               <span className="text-xs font-medium tracking-widest uppercase">Reflecting...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer Area */}
      <div className="px-12 pb-12 pt-6 bg-paper relative z-20">
        {showOptions ? (
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-10 rounded-[40px] border border-slate-100 calm-shadow animate-arrival">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-calm-50 rounded-2xl flex items-center justify-center text-calm-500">
                <Activity size={24} />
              </div>
              <div>
                <h4 className="font-medium text-xl">Are you ready to see your path?</h4>
                <p className="text-sm text-slate-400 font-light">We have identified the core loops of your situation.</p>
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button 
                onClick={() => setShowOptions(false)}
                className="flex-1 md:flex-none px-8 py-4 bg-paper text-slate-500 font-medium rounded-full hover:bg-slate-50 transition-all text-sm"
              >
                Explore slowly
              </button>
              <button 
                onClick={onTransition}
                className="flex-1 md:flex-none px-10 py-4 bg-calm-500 text-white font-medium rounded-full hover:bg-calm-600 transition-all flex items-center justify-center gap-3 text-sm"
              >
                Continue to insights
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share more thoughts..."
              className="w-full py-6 px-10 bg-white border border-slate-100 rounded-full focus:outline-none focus:border-calm-200 text-charcoal text-lg placeholder:text-slate-300 transition-all calm-shadow"
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-4 text-calm-400 hover:text-calm-600 disabled:opacity-20 transition-all"
            >
              <Send size={20} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default State2Discovery;
