import React, { useState, useEffect } from 'react';
import { AppState, Message, LifeSnapshot, Mentor, SessionData } from './types';
import { createChatSession, generateLifeSnapshot } from './services/geminiService';
import { Chat } from "@google/genai";
import { Menu as MenuIcon } from 'lucide-react';

import State1Entry from './components/State1Entry';
import State2Discovery from './components/State2Discovery';
import State3Dashboard from './components/State3Dashboard';
import State4Marketplace from './components/State4Marketplace';
import State5Workspace from './components/State5Workspace';
import State6Booking from './components/State6Booking';
import Menu from './components/Menu';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.ENTRY);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  
  // Current Session State
  const [history, setHistory] = useState<Message[]>([]);
  const [snapshot, setSnapshot] = useState<LifeSnapshot | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  
  // Application State
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const session = createChatSession();
      setChatSession(session);
    } catch (e) {
      console.error("Failed to init AI", e);
    }
  }, []);

  // Save or Update Session when snapshot changes
  useEffect(() => {
    if (snapshot && history.length > 0) {
      const sessionId = currentSessionId || Date.now().toString();
      
      const sessionData: SessionData = {
        id: sessionId,
        timestamp: Date.now(),
        label: snapshot.primary_theme,
        history,
        snapshot,
        selectedMentor: selectedMentor || undefined,
      };

      setSessions(prev => {
        const exists = prev.find(s => s.id === sessionId);
        if (exists) {
          return prev.map(s => s.id === sessionId ? sessionData : s);
        }
        return [sessionData, ...prev];
      });
      
      if (!currentSessionId) setCurrentSessionId(sessionId);
    }
  }, [snapshot, selectedMentor, history]); // Update whenever these change

  const handleEntryComplete = async (text: string) => {
    // Start new session
    setHistory([]);
    setSnapshot(null);
    setSelectedMentor(null);
    setCurrentSessionId(null);
    
    const initialMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    setHistory([initialMsg]);
    setState(AppState.DISCOVERY);
    await processMessage(text);
  };

  const processMessage = async (text: string) => {
    if (!chatSession) return;
    setIsProcessing(true);

    try {
      const result = await chatSession.sendMessage({ message: text });
      const responseText = result.text || "I'm listening.";
      
      if (responseText.includes("CRITICAL_SAFETY_PROTOCOL")) {
        alert("We have detected a need for immediate professional support. Please contact emergency services.");
        return;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: Date.now()
      };

      setHistory(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat Error", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    setHistory(prev => [...prev, userMsg]);
    await processMessage(text);
  };

  const transitionToInsight = async () => {
    setIsProcessing(true);
    try {
      const conversationBlock = history.map(m => `${m.role}: ${m.content}`).join('\n');
      const data = await generateLifeSnapshot(conversationBlock);
      setSnapshot(data);
      setState(AppState.INSIGHT);
    } catch (e) {
      console.error("Analysis Failed", e);
      alert("We couldn't generate the snapshot just yet. Please continue chatting a bit more.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSession = (session: SessionData) => {
    setCurrentSessionId(session.id);
    setHistory(session.history);
    setSnapshot(session.snapshot);
    setSelectedMentor(session.selectedMentor || null);
    
    // Determine state based on data presence
    if (session.selectedMentor) {
      setState(AppState.CONNECTION);
    } else if (session.snapshot) {
      setState(AppState.INSIGHT);
    } else {
      setState(AppState.DISCOVERY);
    }
  };

  const handleBookingComplete = (time: string) => {
    setShowBooking(false);
    // Update session with booking info
    if (currentSessionId) {
       setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, bookedTime: time } : s));
    }
  };

  return (
    <div className="antialiased text-stone-800 relative">
      {/* Menu Button (Visible except on Entry) */}
      {state !== AppState.ENTRY && (
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="fixed top-5 right-6 z-30 p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white border border-slate-200 transition-all"
        >
          <MenuIcon size={24} className="text-slate-700" />
        </button>
      )}

      <Menu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        sessions={sessions}
        onLoadSession={handleLoadSession}
      />

      {state === AppState.ENTRY && (
        <State1Entry onComplete={handleEntryComplete} />
      )}

      {state === AppState.DISCOVERY && (
        <State2Discovery 
          chatHistory={history}
          onSendMessage={handleSendMessage}
          onTransition={transitionToInsight}
          isProcessing={isProcessing}
        />
      )}

      {state === AppState.INSIGHT && snapshot && (
        <State3Dashboard 
          data={snapshot}
          onNext={() => setState(AppState.MARKETPLACE)}
          onBack={() => setState(AppState.DISCOVERY)}
        />
      )}

      {state === AppState.MARKETPLACE && snapshot && (
        <State4Marketplace 
          snapshot={snapshot}
          onSelectMentor={(m) => {
            setSelectedMentor(m);
            setState(AppState.CONNECTION);
          }}
          onBack={() => setState(AppState.INSIGHT)}
        />
      )}

      {state === AppState.CONNECTION && snapshot && selectedMentor && (
        <>
          <State5Workspace 
            snapshot={snapshot}
            mentor={selectedMentor}
            onBookSession={() => setShowBooking(true)}
            onBack={() => setState(AppState.MARKETPLACE)}
          />
          {showBooking && (
            <State6Booking 
              mentor={selectedMentor}
              onClose={() => handleBookingComplete("Tomorrow at 10:00 AM")} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;