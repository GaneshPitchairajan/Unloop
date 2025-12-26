
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Message, LifeSnapshot, Mentor, SessionData, User } from './types';
import { createChatSession, generateLifeSnapshot, runWithRetry } from './services/geminiService';
import { Chat, GenerateContentResponse } from "@google/genai";
import { Menu as MenuIcon, Command, Sparkles } from 'lucide-react';

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

enum InternalState {
  PROCESSING = 99
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState | InternalState>(AppState.LOGIN);
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

  const navigateTo = (newState: AppState | InternalState) => {
    setIsNavigating(true);
    setTimeout(() => {
      setState(newState);
      setIsNavigating(false);
      window.scrollTo(0, 0);
    }, 400);
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
    if (state !== AppState.API_KEY_SELECTION && state !== AppState.LANDING && state !== AppState.LOGIN && state !== InternalState.PROCESSING) {
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
      else setHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', content: "Protocol hiccup. Recalibrating...", timestamp: Date.now() }]);
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
    navigateTo(InternalState.PROCESSING);
    try {
      const data = await generateLifeSnapshot(history.map(m => `${m.role}: ${m.content}`).join('\n'));
      setSnapshot(data);
      setSessionLabel(data.primary_theme);
      setTimeout(() => {
        navigateTo(AppState.INSIGHT);
      }, 1200);
    } catch (e: any) {
      alert("Organizing failed. Please check connection.");
      navigateTo(AppState.DISCOVERY);
    }
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
        return {
          ...s,
          editedSnapshot: { ...s.snapshot, ...edited },
          hiddenSnapshotFields: hiddenFields
        };
      }
      return s;
    }));
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <div className="antialiased text-high bg-void min-h-screen relative font-sans overflow-hidden">
      
      {/* Brand Watermark - Centered to prevent overlap with operational buttons */}
      {state !== AppState.LOGIN && state !== AppState.LANDING && state !== InternalState.PROCESSING && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[5] flex items-center gap-2 pointer-events-none opacity-20 transition-opacity duration-700">
          <Command size={14} className="text-resolution-indigo" />
          <span className="text-[9px] font-black uppercase tracking-[0.8em] text-high">UnLOOP</span>
        </div>
      )}

      {state !== AppState.LOGIN && state !== AppState.API_KEY_SELECTION && state !== InternalState.PROCESSING && (
        <button 
          onClick={() => setIsMenuOpen(true)} 
          className="fixed top-8 right-10 z-[60] p-3 bg-sanctuary border border-slate-800 rounded-2xl shadow-3xl hover:border-resolution-cyan transition-all text-dim hover:text-white"
          aria-label="Open Menu"
        >
          <MenuIcon size={20} />
        </button>
      )}

      {isNavigating && (
        <div className="fixed inset-0 z-[100] bg-void/80 backdrop-blur-[10px] flex flex-col items-center justify-center animate-fadeIn">
          <div className="brand-loader mb-4 !w-10 !h-10"></div>
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
      
      {state === InternalState.PROCESSING && (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-void text-high page-arrival px-10">
          <div className="relative mb-12">
            <div className="w-24 h-24 border-2 border-resolution-indigo/20 rounded-full animate-ping"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="text-resolution-cyan animate-pulse" size={40} />
            </div>
          </div>
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-black tracking-tight text-white uppercase tracking-[0.2em]">Organizing your thoughts...</h2>
            <p className="text-dim text-lg font-light italic opacity-80">Refining structural nodes for your clarity path.</p>
          </div>
          <div className="mt-16 w-48 h-1 bg-slate-900 rounded-full overflow-hidden">
             <div className="h-full bg-resolution-indigo animate-[loading_1.5s_ease-in-out_infinite]"></div>
          </div>
          <style>{`
            @keyframes loading {
              0% { width: 0%; transform: translateX(-100%); }
              100% { width: 100%; transform: translateX(100%); }
            }
          `}</style>
        </div>
      )}

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
        <State5Workspace 
          snapshot={snapshot} 
          mentor={selectedMentor} 
          onBookSession={() => setShowBooking(true)} 
          onBack={() => navigateTo(AppState.MENTOR_PROFILE)} 
          sessionData={currentSession}
          onSendMessage={handleSendCollaborationMessage}
        />
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
      
      {showBooking && selectedMentor && (
        <State6Booking mentor={selectedMentor} existingSessions={sessions} onClose={() => setShowBooking(false)} onComplete={(t, c) => { setShowBooking(false); if (currentSessionId) setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, bookedTime: t, consentGiven: c } : s)); }} />
      )}
    </div>
  );
};

export default App;
