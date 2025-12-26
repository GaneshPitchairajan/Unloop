
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Message, LifeSnapshot, Mentor, SessionData, User } from './types';
import { createChatSession, generateLifeSnapshot, runWithRetry } from './services/geminiService';
import { Chat, GenerateContentResponse } from "@google/genai";
import { Menu as MenuIcon, Command } from 'lucide-react';

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
import UserDashboard from './components/UserDashboard';
import Menu from './components/Menu';
import { MOCK_MENTORS } from './constants';

const STORAGE_KEY = 'unloop_sessions_db';
const USERS_KEY = 'unloop_users_db';
const AUTH_KEY = 'unloop_auth_user';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LOGIN);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
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
  const [isNavigating, setIsNavigating] = useState(false);
  
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

  // Global Page Navigation Wrapper for high-end cinematic transition
  const navigateTo = (newState: AppState) => {
    setIsNavigating(true);
    // Deep Contrast Launch Anticipation: intentional brief delay for page arrival logic
    setTimeout(() => {
      setState(newState);
      setIsNavigating(false);
      window.scrollTo(0, 0);
    }, 600);
  };

  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_KEY);
    if (savedAuth) {
      try {
        const user = JSON.parse(savedAuth);
        setCurrentUser(user);
        setState(AppState.LANDING);
      } catch (e) {
        localStorage.removeItem(AUTH_KEY);
      }
    }
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem(USERS_KEY, JSON.stringify(allUsers)); }, [allUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
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
      setSessions(prev => {
        const existing = prev.find(s => s.id === currentSessionId);
        const sessionData: SessionData = {
          id: currentSessionId,
          timestamp: Date.now(),
          label: label,
          history,
          collaborationHistory: existing?.collaborationHistory || [],
          snapshot,
          editedSnapshot: existing?.editedSnapshot || undefined,
          hiddenSnapshotFields: existing?.hiddenSnapshotFields || [],
          editedFields: existing?.editedFields || [],
          selectedMentor: selectedMentor || undefined,
          userMood,
          userPriority,
          userNotes,
          userId: currentUser?.id,
          status: 'open'
        };
        if (existing) return prev.map(s => s.id === currentSessionId ? { ...s, ...sessionData } : s);
        return [sessionData, ...prev];
      });
      if (!sessionLabel) setSessionLabel(snapshot.primary_theme);
    }
  }, [snapshot, selectedMentor, history, sessionLabel, userMood, userPriority, userNotes, currentSessionId, currentUser]); 

  const activeMentors = useMemo(() => {
    const userMentors = allUsers.filter(u => u.isMentor && u.mentorProfile).map(u => u.mentorProfile!);
    const combined = [...userMentors, ...MOCK_MENTORS];
    return combined.filter(m => m.id !== currentUser?.id);
  }, [allUsers, currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    navigateTo(AppState.LANDING);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigateTo(AppState.LOGIN);
    setIsMenuOpen(false);
  };

  const handleEntryComplete = async (text: string) => {
    try {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        if (!(await window.aistudio.hasSelectedApiKey())) {
          navigateTo(AppState.API_KEY_SELECTION);
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
      navigateTo(AppState.DISCOVERY);
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
      if (error?.status === 429 && window.aistudio) navigateTo(AppState.API_KEY_SELECTION);
      else setHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', content: "Protocol hiccup. Recalibrating... Can you say that again?", timestamp: Date.now() }]);
    } finally { setIsProcessing(false); }
  };

  const handleSendMessage = async (text: string) => {
    setHistory(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() }]);
    await processMessage(text);
  };

  const handleSendCollaborationMessage = (text: string) => {
    if (!currentSessionId) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          collaborationHistory: [...(s.collaborationHistory || []), newMessage]
        };
      }
      return s;
    }));
  };

  const transitionToInsight = async () => {
    setIsProcessing(true);
    try {
      const data = await generateLifeSnapshot(history.map(m => `${m.role}: ${m.content}`).join('\n'));
      setSnapshot(data);
      setSessionLabel(data.primary_theme);
      navigateTo(AppState.INSIGHT);
    } catch (e: any) {
      alert("Analytical scan failed. Recalibrate and try again.");
    } finally { setIsProcessing(false); }
  };

  const handleUpdateMentorProfile = (updatedMentor: Mentor | null) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, isMentor: !!updatedMentor, mentorProfile: updatedMentor || undefined });
  };

  const handleUpdateUser = (updatedUser: User) => { setCurrentUser(updatedUser); };

  const handleUpdateReport = (edited: Partial<LifeSnapshot>, hiddenFields: string[]) => {
    if (!currentSessionId) return;
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        const editedFields: string[] = [];
        if (edited.primary_theme !== s.snapshot.primary_theme) editedFields.push('theme');
        if (edited.the_bottleneck !== s.snapshot.the_bottleneck) editedFields.push('bottleneck');
        
        return {
          ...s,
          editedSnapshot: { ...s.snapshot, ...edited },
          hiddenSnapshotFields: hiddenFields,
          editedFields
        };
      }
      return s;
    }));
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <div className="antialiased text-high bg-void min-h-screen relative font-sans">
      
      {/* Brand Watermark - Professional Intensity */}
      {state !== AppState.LOGIN && state !== AppState.LANDING && (
        <div className="fixed top-10 left-12 z-30 flex items-center gap-3 pointer-events-none opacity-40 hover:opacity-100 transition-opacity duration-700">
          <Command size={20} className="text-resolution-indigo" />
          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-high">UnLOOP</span>
        </div>
      )}

      {state !== AppState.LOGIN && state !== AppState.API_KEY_SELECTION && (
        <button onClick={() => setIsMenuOpen(true)} className="fixed top-10 right-12 z-30 p-3.5 bg-sanctuary border border-slate-800 rounded-2xl shadow-3xl hover:border-resolution-cyan transition-all text-dim hover:text-white">
          <MenuIcon size={24} />
        </button>
      )}

      {/* Navigation Arrival Overlay - Launch Anticipation */}
      {isNavigating && (
        <div className="fixed inset-0 z-[100] bg-void/80 backdrop-blur-[10px] flex flex-col items-center justify-center animate-fadeIn">
          <div className="brand-loader mb-6 !w-16 !h-16"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-resolution-cyan animate-pulse">Initializing Matrix...</p>
        </div>
      )}

      {currentUser && (
        <Menu 
          isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} sessions={sessions.filter(s => s.userId === currentUser.id)} currentUser={currentUser}
          onLoadSession={(s) => { setCurrentSessionId(s.id); setHistory(s.history); setSnapshot(s.snapshot); navigateTo(s.snapshot ? AppState.INSIGHT : AppState.DISCOVERY); setIsMenuOpen(false); }}
          onRenameSession={(id, label) => setSessions(prev => prev.map(s => s.id === id ? { ...s, label } : s))}
          onNewSession={() => { setCurrentSessionId(null); setHistory([]); setSnapshot(null); navigateTo(AppState.ENTRY); setIsMenuOpen(false); }}
          onViewAppointment={(s) => { setCurrentSessionId(s.id); setHistory(s.history); setSnapshot(s.snapshot); navigateTo(AppState.APPOINTMENT_DETAILS); setIsMenuOpen(false); }}
          onOpenMentorDashboard={() => { navigateTo(AppState.MENTOR_DASHBOARD); setIsMenuOpen(false); }}
          onOpenUserDashboard={() => { navigateTo(AppState.USER_DASHBOARD); setIsMenuOpen(false); }}
          onLogout={handleLogout}
        />
      )}

      {state === AppState.LOGIN && <LoginPage onLogin={handleLogin} allUsers={allUsers} />}
      {state === AppState.LANDING && <LandingPage onStart={() => navigateTo(AppState.ENTRY)} />}
      {state === AppState.ENTRY && <State1Entry onComplete={handleEntryComplete} />}
      {state === AppState.API_KEY_SELECTION && <StateApiKeySelection onApiKeySelected={() => navigateTo(AppState.ENTRY)} onContinueWithoutPro={() => navigateTo(AppState.ENTRY)} />}
      {state === AppState.DISCOVERY && <State2Discovery chatHistory={history} onSendMessage={handleSendMessage} onTransition={transitionToInsight} isProcessing={isProcessing} />}
      
      {state === AppState.INSIGHT && snapshot && (
        <State3Dashboard 
          data={snapshot} currentLabel={sessionLabel} onRename={(l) => setSessionLabel(l)}
          onNext={() => navigateTo(AppState.MATCHING)} onBack={() => navigateTo(AppState.DISCOVERY)}
          mood={userMood} setMood={setUserMood} priority={userPriority} setPriority={setUserPriority} notes={userNotes} setNotes={setUserNotes}
          onUpdateReport={handleUpdateReport} 
          hiddenFields={currentSession?.hiddenSnapshotFields || []}
          editedSnapshot={currentSession?.editedSnapshot}
        />
      )}

      {state === AppState.MATCHING && snapshot && <State3_5Matching snapshot={snapshot} onFinish={() => navigateTo(AppState.MARKETPLACE)} />}

      {state === AppState.MARKETPLACE && snapshot && (
        <State4Marketplace snapshot={snapshot} customMentors={activeMentors} onSelectMentor={(m) => { setSelectedMentor(m); navigateTo(AppState.MENTOR_PROFILE); }} onBack={() => navigateTo(AppState.INSIGHT)} />
      )}

      {state === AppState.MENTOR_PROFILE && selectedMentor && snapshot && (
        <State4_5MentorProfile mentor={selectedMentor} snapshot={snapshot} onAccept={() => navigateTo(AppState.CONNECTION)} onBack={() => navigateTo(AppState.MARKETPLACE)} />
      )}

      {state === AppState.CONNECTION && snapshot && selectedMentor && (
        <>
          <State5Workspace 
            snapshot={snapshot} 
            mentor={selectedMentor} 
            onBookSession={() => setShowBooking(true)} 
            onBack={() => navigateTo(AppState.MENTOR_PROFILE)} 
            sessionData={currentSession}
            onSendMessage={handleSendCollaborationMessage}
          />
          {showBooking && <State6Booking mentor={selectedMentor} existingSessions={sessions} onClose={() => setShowBooking(false)} onComplete={(t, c) => { setShowBooking(false); if (currentSessionId) setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, bookedTime: t, consentGiven: c } : s)); }} />}
        </>
      )}

      {state === AppState.APPOINTMENT_DETAILS && currentSessionId && sessions.find(s => s.id === currentSessionId) && (
        <State7AppointmentDetails session={sessions.find(s => s.id === currentSessionId)!} onBack={() => navigateTo(AppState.USER_DASHBOARD)} onReschedule={(t, c) => setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, bookedTime: t, consentGiven: c } : s))} allSessions={sessions} />
      )}

      {state === AppState.MENTOR_DASHBOARD && currentUser && (
        <MentorDashboard user={currentUser} allSessions={sessions} onUpdateProfile={handleUpdateMentorProfile} onBack={() => navigateTo(AppState.LANDING)} />
      )}

      {state === AppState.USER_DASHBOARD && currentUser && (
        <UserDashboard 
          user={currentUser} sessions={sessions.filter(s => s.userId === currentUser.id)} onUpdateUser={handleUpdateUser}
          onViewSession={(s) => { setCurrentSessionId(s.id); setHistory(s.history); setSnapshot(s.snapshot); navigateTo(AppState.CONNECTION); }}
          onViewAppointment={(s) => { setCurrentSessionId(s.id); setHistory(s.history); setSnapshot(s.snapshot); navigateTo(AppState.APPOINTMENT_DETAILS); }}
          onBack={() => navigateTo(AppState.LANDING)} 
        />
      )}
    </div>
  );
};

export default App;
