import React, { useState, useEffect } from 'react';
import { AppState, Message, LifeSnapshot, Mentor } from './types';
import { createChatSession, generateLifeSnapshot } from './services/geminiService';
import { ChatSession } from "@google/genai";

import State1Entry from './components/State1Entry';
import State2Discovery from './components/State2Discovery';
import State3Dashboard from './components/State3Dashboard';
import State4Marketplace from './components/State4Marketplace';
import State5Workspace from './components/State5Workspace';
import State6Knowledge from './components/State6Knowledge';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.ENTRY);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [history, setHistory] = useState<Message[]>([]);
  const [snapshot, setSnapshot] = useState<LifeSnapshot | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize Chat Session on Mount
  useEffect(() => {
    try {
      const session = createChatSession();
      setChatSession(session);
    } catch (e) {
      console.error("Failed to init AI", e);
    }
  }, []);

  const handleEntryComplete = async (text: string) => {
    // Add first user message and move to discovery
    const initialMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    setHistory([initialMsg]);
    setState(AppState.DISCOVERY);
    
    // Trigger AI response for the first message
    await processMessage(text);
  };

  const processMessage = async (text: string) => {
    if (!chatSession) return;
    setIsProcessing(true);

    try {
      const result = await chatSession.sendMessage({ message: text });
      const responseText = result.text || "I'm listening.";
      
      // Safety Check (State 7 Protocol)
      if (responseText.includes("CRITICAL_SAFETY_PROTOCOL")) {
        // In a real app, strict redirection. Here, we alert.
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
      // Convert history to string block
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

  return (
    <div className="antialiased text-stone-800">
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
        />
      )}

      {state === AppState.MARKETPLACE && snapshot && (
        <State4Marketplace 
          snapshot={snapshot}
          onSelectMentor={(m) => {
            setSelectedMentor(m);
            setState(AppState.WORKSPACE);
          }}
        />
      )}

      {state === AppState.WORKSPACE && snapshot && selectedMentor && (
        <>
          <State5Workspace 
            snapshot={snapshot}
            mentor={selectedMentor}
            onGoToKnowledge={() => setShowKnowledge(true)}
          />
          {showKnowledge && (
            <State6Knowledge 
              snapshot={snapshot} 
              onClose={() => setShowKnowledge(false)} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;