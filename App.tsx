
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Message, LifeSnapshot, Mentor, SessionData, User } from './types';
import { createChatSession, generateLifeSnapshot, runWithRetry } from './services/geminiService';
import { Chat, GenerateContentResponse } from "@google/genai";
import { Menu as MenuIcon } from 'lucide-react';

import LoginPage from './components/LoginPage';
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
import MentorDashboard from './components/MentorDashboard';
import Menu from './components/Menu';
import { MOCK_MENTORS } from './constants';

const STORAGE_KEY = 'unloop_sessions_db';
const USERS_KEY = 'unloop_users_db';
const AUTH_KEY = 'unloop_auth_user';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LOGIN);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // AI Session state
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [history, setHistory] = useState<Message[]>([]);
  const [snapshot, setSnapshot] = useState<LifeSnapshot | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [sessionLabel, setSessionLabel] = useState<string>('');
  
  // User Inputs
  const [userMood, setUserMood] = useState<string>('');
  const [userPriority, setUserPriority] = useState<string>('');
  const [userNotes, setUserNotes] = useState<string>('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Persistence states
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [sessions, setSessions] = useState<SessionData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Auth initialization
  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_KEY);
    if (savedAuth) {
      const user = JSON.parse(savedAuth);
      setCurrentUser(user);
      setState(AppState.LANDING);
    }
  }, []);

  // Save changes to DBs
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
      // Sync currentUser back into allUsers list
      setAllUsers(prev => {
        const index = prev.findIndex(u => u.id === currentUser.id);
        if (index === -1) return [...prev, currentUser];
        const updated = [...prev];
        updated[index] = currentUser;
        return updated;
      });
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    if (state !== AppState.API_KEY_SELECTION && state !== AppState.LANDING && state !== AppState.LOGIN) {
      try {
        setChatSession(createChatSession());
      } catch (e) {
        console.error("AI init failed");
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
        if (exists) return prev.map(s => s.id === currentSessionId ? { ...s, ...sessionData } : s);
        return [sessionData, ...prev];
      });
      if (!sessionLabel) setSessionLabel(snapshot.primary_theme);
    }
  }, [snapshot, selectedMentor, history, sessionLabel, userMood, userPriority, userNotes, currentSessionId]); 

  // Derived mentor list
  const activeMentors = useMemo(() => {
    const userMentors = allUsers
      .filter(u => u.isMentor && u.mentorProfile)
      .map(u => u.mentorProfile!);
    // Merge with mock mentors but filter out if the current user is a mentor (so they don't see themselves)
    const combined = [...userMentors, ...MOCK_MENTORS];
    return combined.filter(m => m.id !== currentUser?.id);
  }, [allUsers, currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setState(AppState.LANDING);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setState(AppState.LOGIN);
    setIsMenuOpen(false);
  };

  const handleEntryComplete = async (text: string) => {
    try {
      if (window.aistudio?.hasSelectedApiKey) {
        if (!(await window.aistudio.hasSelectedApiKey())) {
          setState(AppState.API_KEY_SELECTION);
          return;
        }
      }
      const newId = Date.now().toString();
      setCurrentSessionId(newId);
      setHistory([{ id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() }]);
      setSnapshot(null);
      setSelectedMentor(null);
      setSessionLabel('');
      setUserMood('');
      setUserPriority('');
      setUserNotes('');
      setState(AppState.DISCOVERY);
      await processMessage(text);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  const processMessage = async (text: string) => {
    const session = chatSession || createChatSession();
    if (!chatSession) setChatSession(session);
    setIsProcessing(true);
    try {
      const result = await runWithRetry<GenerateContentResponse>(() => session.sendMessage({ message: text }));
      const responseText = result.text || "I'm listening.";
      setHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', content: responseText, timestamp: Date.now() }]);
    } catch (error: any) {
      if (error?.status === 429 && window.aistudio) setState(AppState.API_KEY_SELECTION);
      else setHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', content: "Hiccup. Say again?", timestamp: Date.now() }]);
    } finally { setIsProcessing(false); }
  };

  const handleSendMessage = async (text: string) => {
    setHistory(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() }]);
    await processMessage(text);
  };

  const transitionToInsight = async () => {
    setIsProcessing(true);
    try {
      const data = await generateLifeSnapshot(history.map(m => `${m.role}: ${m.content}`).join('\n'));
      setSnapshot(data);
      setSessionLabel(data.primary_theme);
      setState(AppState.INSIGHT);
    } catch (e: any) {
      alert("Analysis failed. Let's keep talking.");
    } finally { setIsProcessing(false); }
  };

  const handleUpdateMentorProfile = (updatedMentor: Mentor | null) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      isMentor: !!updatedMentor,
      mentorProfile: updatedMentor || undefined
    });
  };

  return (
    <div className="antialiased text-slate-100 bg-slate-950 min-h-screen relative">
      {state !== AppState.LOGIN && state !== AppState.LANDING && state !== AppState.ENTRY && state !== AppState.API_KEY_SELECTION && (
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="fixed top-5 right-6 z-30 p-2.5 bg-slate-900/80 backdrop-blur-md rounded-full shadow-lg border border-slate-700 hover:bg-slate-800 transition-all text-slate-300 hover:text-white"
        >
          <MenuIcon size={24} />
        </button>
      )}

      {currentUser && (
        <Menu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
          sessions={sessions}
          currentUser={currentUser}
          onLoadSession={(s) => { setCurrentSessionId(s.id); setHistory(s.history); setSnapshot(s.snapshot); setState(s.snapshot ? AppState.INSIGHT : AppState.DISCOVERY); setIsMenuOpen(false); }}
          onRenameSession={(id, label) => setSessions(prev => prev.map(s => s.id === id ? { ...s, label } : s))}
          onNewSession={() => { setCurrentSessionId(null); setHistory([]); setSnapshot(null); setState(AppState.ENTRY); setIsMenuOpen(false); }}
          onViewAppointment={(s) => { setCurrentSessionId(s.id); setHistory(s.history); setSnapshot(s.snapshot); setState(AppState.APPOINTMENT_DETAILS); setIsMenuOpen(false); }}
          onOpenMentorDashboard={() => { setState(AppState.MENTOR_DASHBOARD); setIsMenuOpen(false); }}
          onLogout={handleLogout}
        />
      )}

      {state === AppState.LOGIN && <LoginPage onLogin={handleLogin} allUsers={allUsers} />}
      {state === AppState.LANDING && <LandingPage onStart={() => setState(AppState.ENTRY)} />}
      {state === AppState.ENTRY && <State1Entry onComplete={handleEntryComplete} />}
      {state === AppState.API_KEY_SELECTION && <StateApiKeySelection onApiKeySelected={() => setState(AppState.ENTRY)} onContinueWithoutPro={() => setState(AppState.ENTRY)} />}
      {state === AppState.DISCOVERY && <State2Discovery chatHistory={history} onSendMessage={handleSendMessage} onTransition={transitionToInsight} isProcessing={isProcessing} />}
      
      {state === AppState.INSIGHT && snapshot && (
        <State3Dashboard 
          data={snapshot} currentLabel={sessionLabel} onRename={(l) => setSessionLabel(l)}
          onNext={() => setState(AppState.MATCHING)} onBack={() => setState(AppState.DISCOVERY)}
          mood={userMood} setMood={setUserMood} priority={userPriority} setPriority={setUserPriority} notes={userNotes} setNotes={setUserNotes}
        />
      )}

      {state === AppState.MATCHING && snapshot && (
        <State3_5Matching snapshot={snapshot} onFinish={() => setState(AppState.MARKETPLACE)} />
      )}

      {state === AppState.MARKETPLACE && snapshot && (
        <State4Marketplace 
          snapshot={snapshot}
          customMentors={activeMentors}
          onSelectMentor={(m) => { setSelectedMentor(m); setState(AppState.MENTOR_PROFILE); }}
          onBack={() => setState(AppState.INSIGHT)}
        />
      )}

      {state === AppState.MENTOR_PROFILE && selectedMentor && snapshot && (
        <State4_5MentorProfile mentor={selectedMentor} snapshot={snapshot} onAccept={() => setState(AppState.CONNECTION)} onBack={() => setState(AppState.MARKETPLACE)} />
      )}

      {state === AppState.CONNECTION && snapshot && selectedMentor && (
        <>
          <State5Workspace snapshot={snapshot} mentor={selectedMentor} onBookSession={() => setShowBooking(true)} onBack={() => setState(AppState.MENTOR_PROFILE)} />
          {showBooking && <State6Booking mentor={selectedMentor} existingSessions={sessions} onClose={() => setShowBooking(false)} onComplete={(t, c) => { setShowBooking(false); if (currentSessionId) setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, bookedTime: t, consentGiven: c } : s)); }} />}
        </>
      )}

      {state === AppState.APPOINTMENT_DETAILS && currentSessionId && sessions.find(s => s.id === currentSessionId) && (
        <State7AppointmentDetails session={sessions.find(s => s.id === currentSessionId)!} onBack={() => setState(AppState.INSIGHT)} onReschedule={(t, c) => setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, bookedTime: t, consentGiven: c } : s))} allSessions={sessions} />
      )}

      {state === AppState.MENTOR_DASHBOARD && currentUser && (
        <MentorDashboard user={currentUser} onUpdateProfile={handleUpdateMentorProfile} onBack={() => setState(AppState.LANDING)} />
      )}
    </div>
  );
};

export default App;
