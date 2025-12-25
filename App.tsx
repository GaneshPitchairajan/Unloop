import React, { useState, useEffect } from 'react';
import { AppState, Message, LifeSnapshot, Mentor, SessionData } from './types';
import { createChatSession, generateLifeSnapshot, runWithRetry } from './services/geminiService';
import { Chat } from "@google/genai";
import { Menu as MenuIcon } from 'lucide-react';

import LandingPage from './components/LandingPage';
import State1Entry from './components/State1Entry';
import State2Discovery from './components/State2Discovery';
import State3Dashboard from './components/State3Dashboard';
import State4Marketplace from './components/State4Marketplace';
import State5Workspace from './components/State5Workspace';
import State6Booking from './components/State6Booking';
import Menu from './components/Menu';

const App: React.FC = () => {
  // Initial state is now LANDING
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  
  // Current Session State
  const [history, setHistory] = useState<Message[]>([]);
  const [snapshot, setSnapshot] = useState<LifeSnapshot | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [sessionLabel, setSessionLabel] = useState<string>(''); // Dynamic Label
  
  // New User Inputs
  const [userMood, setUserMood] = useState<string>('');
  const [userPriority, setUserPriority] = useState<string>('');
  const [userNotes, setUserNotes] = useState<string>('');
  
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

  // Save or Update Session when data changes
  useEffect(() => {
    if (snapshot && history.length > 0) {
      const sessionId = currentSessionId || Date.now().toString();
      const label = sessionLabel || snapshot.primary_theme;
      
      const sessionData: SessionData = {
        id: sessionId,
        timestamp: Date.now(),
        label: label,
        history,
        snapshot,
        selectedMentor: selectedMentor || undefined,
        userMood,
        userPriority,
        userNotes
      };

      setSessions(prev => {
        const exists = prev.find(s => s.id === sessionId);
        if (exists) {
          return prev.map(s => s.id === sessionId ? sessionData : s);
        }
        return [sessionData, ...prev];
      });
      
      if (!currentSessionId) setCurrentSessionId(sessionId);
      if (!sessionLabel) setSessionLabel(snapshot.primary_theme);
    }
  }, [snapshot, selectedMentor, history, sessionLabel, userMood, userPriority, userNotes]); 

  const handleEntryComplete = async (text: string) => {
    // Start new session
    setHistory([]);
    setSnapshot(null);
    setSelectedMentor(null);
    setCurrentSessionId(null);
    setSessionLabel('');
    setUserMood('');
    setUserPriority('');
    setUserNotes('');
    
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
      // Wrap the chat message in the retry logic
      const result = await runWithRetry(() => chatSession.sendMessage({ message: text }));
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
    } catch (error: any) {
      console.error("Chat Error", error);
      if (error?.status === 429 || error?.code === 429) {
        alert("We are receiving too many requests right now. Please wait a moment and try again.");
      } else {
        // Fallback message in chat if standard error occurs
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: "I'm having a little trouble connecting right now. Could you say that again?",
          timestamp: Date.now()
        };
        setHistory(prev => [...prev, errorMsg]);
      }
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
      // generateLifeSnapshot already uses runWithRetry internally in geminiService.ts
      const data = await generateLifeSnapshot(conversationBlock);
      setSnapshot(data);
      setSessionLabel(data.primary_theme); // Default label
      setState(AppState.INSIGHT);
    } catch (e) {
      console.error("Analysis Failed", e);
      alert("We couldn't generate the picture just yet due to high traffic. Please try continuing the conversation.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSession = (session: SessionData) => {
    setCurrentSessionId(session.id);
    setHistory(session.history);
    setSnapshot(session.snapshot);
    setSessionLabel(session.label);
    setSelectedMentor(session.selectedMentor || null);
    setUserMood(session.userMood || '');
    setUserPriority(session.userPriority || '');
    setUserNotes(session.userNotes || '');
    
    // Always open "Your Current Picture" (Insight) if data exists, regardless of mentor selection
    if (session.snapshot) {
      setState(AppState.INSIGHT);
    } else {
      setState(AppState.DISCOVERY);
    }
  };

  const handleNewSession = () => {
    // Reset everything to Entry state
    setHistory([]);
    setSnapshot(null);
    setSelectedMentor(null);
    setCurrentSessionId(null);
    setSessionLabel('');
    setUserMood('');
    setUserPriority('');
    setUserNotes('');
    
    // Make sure we create a fresh chat session for context
    try {
      const session = createChatSession();
      setChatSession(session);
    } catch (e) {
      console.error("Failed to reset AI", e);
    }

    setState(AppState.ENTRY);
    setIsMenuOpen(false);
  };

  const handleBookingComplete = (time: string) => {
    setShowBooking(false);
    if (currentSessionId) {
       setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, bookedTime: time } : s));
    }
  };
  
  // Renaming logic
  const renameSession = (id: string, newLabel: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, label: newLabel } : s));
    if (currentSessionId === id) {
      setSessionLabel(newLabel);
    }
  };

  const renameCurrentSession = (newLabel: string) => {
    setSessionLabel(newLabel);
    if (currentSessionId) {
      renameSession(currentSessionId, newLabel);
    }
  };

  return (
    <div className="antialiased text-slate-100 bg-slate-950 min-h-screen relative">
      {/* Menu Button (Visible except on Landing and Entry) */}
      {state !== AppState.LANDING && state !== AppState.ENTRY && (
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="fixed top-5 right-6 z-30 p-2.5 bg-slate-900/80 backdrop-blur-md rounded-full shadow-lg border border-slate-700 hover:bg-slate-800 transition-all text-slate-300 hover:text-white"
        >
          <MenuIcon size={24} />
        </button>
      )}

      <Menu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        sessions={sessions}
        onLoadSession={handleLoadSession}
        onRenameSession={renameSession}
        onNewSession={handleNewSession}
      />

      {state === AppState.LANDING && (
        <LandingPage onStart={() => setState(AppState.ENTRY)} />
      )}

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
          currentLabel={sessionLabel}
          onRename={renameCurrentSession}
          onNext={() => setState(AppState.MARKETPLACE)}
          onBack={() => setState(AppState.DISCOVERY)}
          // Pass new props
          mood={userMood}
          setMood={setUserMood}
          priority={userPriority}
          setPriority={setUserPriority}
          notes={userNotes}
          setNotes={setUserNotes}
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