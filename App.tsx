
import React, { useState, useEffect } from 'react';
import { AppState, Message, LifeSnapshot, Mentor, SessionData } from './types';
import { createChatSession, generateLifeSnapshot, runWithRetry } from './services/geminiService';
import { Chat, GenerateContentResponse } from "@google/genai";
import { Menu as MenuIcon } from 'lucide-react';

import LandingPage from './components/LandingPage';
import State1Entry from './components/State1Entry';
import State2Discovery from './components/State2Discovery';
import State3Dashboard from './components/State3Dashboard';
import State3_5Matching from './components/State3_5Matching';
import State4Marketplace from './components/State4Marketplace';
import State4_5MentorProfile from './components/State4_5MentorProfile';
import State5Workspace from './components/State5Workspace';
import State6Booking from './components/State6Booking';
import State7AppointmentDetails from './components/State7AppointmentDetails';
import StateApiKeySelection from './components/StateApiKeySelection';
import Menu from './components/Menu';

const STORAGE_KEY = 'unloop_sessions_db';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  
  const [history, setHistory] = useState<Message[]>([]);
  const [snapshot, setSnapshot] = useState<LifeSnapshot | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [sessionLabel, setSessionLabel] = useState<string>('');
  
  const [userMood, setUserMood] = useState<string>('');
  const [userPriority, setUserPriority] = useState<string>('');
  const [userNotes, setUserNotes] = useState<string>('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sessions, setSessions] = useState<SessionData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse sessions from storage", e);
      return [];
    }
  });
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error("Failed to save sessions to storage", e);
    }
  }, [sessions]);

  useEffect(() => {
    if (state !== AppState.API_KEY_SELECTION && state !== AppState.LANDING) {
      try {
        const session = createChatSession();
        setChatSession(session);
      } catch (e) {
        console.error("Failed to init AI session", e);
        // Only transition to key selection if it's explicitly a missing key error
        // Otherwise, it might be a temporary init error
      }
    }
  }, [state]);

  useEffect(() => {
    if (snapshot && history.length > 0 && currentSessionId) {
      const label = sessionLabel || snapshot.primary_theme;
      
      const sessionData: SessionData = {
        id: currentSessionId,
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
        const exists = prev.find(s => s.id === currentSessionId);
        if (exists) {
          return prev.map(s => s.id === currentSessionId ? { ...s, ...sessionData } : s);
        }
        return [sessionData, ...prev];
      });
      
      if (!sessionLabel) setSessionLabel(snapshot.primary_theme);
    }
  }, [snapshot, selectedMentor, history, sessionLabel, userMood, userPriority, userNotes, currentSessionId]); 

  const handleEntryComplete = async (text: string) => {
    try {
      // Check for AI Studio API safely. If missing, assume API_KEY is provided via env
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          setState(AppState.API_KEY_SELECTION);
          return;
        }
      }

      const newId = Date.now().toString();
      setCurrentSessionId(newId);
      setHistory([]);
      setSnapshot(null);
      setSelectedMentor(null);
      setSessionLabel('');
      setUserMood('');
      setUserPriority('');
      setUserNotes('');
      
      try {
        setChatSession(createChatSession());
      } catch (e) {
        console.error("Failed to create chat session", e);
        // Fallback or retry logic could go here
      }

      const initialMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() };
      setHistory([initialMsg]);
      setState(AppState.DISCOVERY);
      await processMessage(text);
    } catch (err) {
      console.error("Critical error in handleEntryComplete", err);
      // Ensure the UI doesn't just hang
      alert("Something went wrong starting your session. Please try again.");
    }
  };

  const processMessage = async (text: string) => {
    if (!chatSession) {
      try { 
        setChatSession(createChatSession()); 
      } catch (e) { 
        console.error("Re-init session failed", e);
        return; 
      }
    }
    setIsProcessing(true);

    try {
      const result = await runWithRetry<GenerateContentResponse>(() => chatSession.sendMessage({ message: text }));
      const responseText = result.text || "I'm listening.";
      
      if (responseText.includes("CRITICAL_SAFETY_PROTOCOL")) {
        alert("Emergency protocols triggered. Please contact local authorities.");
        return;
      }

      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', content: responseText, timestamp: Date.now() };
      setHistory(prev => [...prev, aiMsg]);
    } catch (error: any) {
      console.error("Process message error", error);
      const isQuotaError = error?.status === 429 || error?.code === 429;
      if (isQuotaError && window.aistudio) {
        setState(AppState.API_KEY_SELECTION);
      } else {
        setHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', content: "Connection hiccup. Say again?", timestamp: Date.now() }]);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    setHistory(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() }]);
    await processMessage(text);
  };

  const transitionToInsight = async () => {
    setIsProcessing(true);
    try {
      const conversationBlock = history.map(m => `${m.role}: ${m.content}`).join('\n');
      const data = await generateLifeSnapshot(conversationBlock);
      setSnapshot(data);
      if (!sessionLabel) setSessionLabel(data.primary_theme);
      setState(AppState.INSIGHT);
    } catch (e: any) {
      console.error("Transition to insight failed", e);
      const isQuotaError = e?.status === 429 || e?.code === 429;
      if (isQuotaError && window.aistudio) setState(AppState.API_KEY_SELECTION);
      else alert("Snapshot failed. Keep chatting.");
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
    
    if (session.snapshot) setState(AppState.INSIGHT);
    else setState(AppState.DISCOVERY);
    setIsMenuOpen(false);
  };

  const handleNewSession = async () => {
    try {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) { 
          setState(AppState.API_KEY_SELECTION); 
          setIsMenuOpen(false); 
          return; 
        }
      }
      
      setCurrentSessionId(null);
      setHistory([]);
      setSnapshot(null);
      setSelectedMentor(null);
      setSessionLabel('');
      setUserMood('');
      setUserPriority('');
      setUserNotes('');
      setState(AppState.ENTRY);
      setIsMenuOpen(false);
    } catch (e) {
      console.error("New session failed", e);
      setState(AppState.ENTRY);
      setIsMenuOpen(false);
    }
  };

  const handleBookingComplete = (time: string, consent: boolean) => {
    setShowBooking(false);
    if (currentSessionId) {
       setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, bookedTime: time, consentGiven: consent } : s));
    }
  };
  
  const renameCurrentSession = (newLabel: string) => {
    setSessionLabel(newLabel);
    if (currentSessionId) {
      setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, label: newLabel } : s));
    }
  };

  const handleViewAppointmentDetails = (session: SessionData) => {
    handleLoadSession(session);
    setState(AppState.APPOINTMENT_DETAILS);
    setIsMenuOpen(false);
  };

  return (
    <div className="antialiased text-slate-100 bg-slate-950 min-h-screen relative">
      {state !== AppState.LANDING && state !== AppState.ENTRY && state !== AppState.API_KEY_SELECTION && (
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
        onRenameSession={(id, label) => setSessions(prev => prev.map(s => s.id === id ? { ...s, label } : s))}
        onNewSession={handleNewSession}
        onViewAppointment={handleViewAppointmentDetails}
      />

      {state === AppState.LANDING && <LandingPage onStart={() => setState(AppState.ENTRY)} />}
      {state === AppState.ENTRY && <State1Entry onComplete={handleEntryComplete} />}
      {state === AppState.API_KEY_SELECTION && <StateApiKeySelection onApiKeySelected={() => setState(AppState.ENTRY)} onContinueWithoutPro={() => setState(AppState.ENTRY)} />}
      {state === AppState.DISCOVERY && <State2Discovery chatHistory={history} onSendMessage={handleSendMessage} onTransition={transitionToInsight} isProcessing={isProcessing} />}
      
      {state === AppState.INSIGHT && snapshot && (
        <State3Dashboard 
          data={snapshot} currentLabel={sessionLabel} onRename={renameCurrentSession} 
          onNext={() => setState(AppState.MATCHING)} onBack={() => setState(AppState.DISCOVERY)}
          mood={userMood} setMood={setUserMood} priority={userPriority} setPriority={setUserPriority} notes={userNotes} setNotes={setUserNotes}
        />
      )}

      {state === AppState.MATCHING && snapshot && (
        <State3_5Matching 
          snapshot={snapshot}
          onFinish={() => setState(AppState.MARKETPLACE)}
        />
      )}

      {state === AppState.MARKETPLACE && snapshot && (
        <State4Marketplace 
          snapshot={snapshot}
          onSelectMentor={(m) => { setSelectedMentor(m); setState(AppState.MENTOR_PROFILE); }}
          onBack={() => setState(AppState.INSIGHT)}
        />
      )}

      {state === AppState.MENTOR_PROFILE && selectedMentor && snapshot && (
        <State4_5MentorProfile 
          mentor={selectedMentor}
          snapshot={snapshot}
          onAccept={() => setState(AppState.CONNECTION)}
          onBack={() => setState(AppState.MARKETPLACE)}
        />
      )}

      {state === AppState.CONNECTION && snapshot && selectedMentor && (
        <>
          <State5Workspace snapshot={snapshot} mentor={selectedMentor} onBookSession={() => setShowBooking(true)} onBack={() => setState(AppState.MENTOR_PROFILE)} />
          {showBooking && (
            <State6Booking 
              mentor={selectedMentor} existingSessions={sessions} 
              onClose={() => setShowBooking(false)} 
              onComplete={handleBookingComplete}
            />
          )}
        </>
      )}

      {state === AppState.APPOINTMENT_DETAILS && currentSessionId && sessions.find(s => s.id === currentSessionId) && (
        <State7AppointmentDetails 
          session={sessions.find(s => s.id === currentSessionId)!} 
          onBack={() => setState(AppState.INSIGHT)}
          onReschedule={handleBookingComplete}
          allSessions={sessions}
        />
      )}
    </div>
  );
};

export default App;
