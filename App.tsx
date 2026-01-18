
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import { AppView, ChatSession } from './types';

const STORAGE_KEY = 'golem_ai_chats_v2'; // Gunakan key baru untuk menghindari konflik data lama

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setChats(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chats", e);
      }
    }
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    }
  }, [chats]);

  const handleStartChat = () => {
    if (chats.length === 0) {
      handleNewChat();
    } else {
      setActiveChatId(chats[0].id);
    }
    setView(AppView.CHAT);
  };

  const handleNewChat = useCallback(() => {
    const newChat: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      lastModified: Date.now()
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setView(AppView.CHAT);
  }, []);

  const handleDeleteChat = useCallback((id: string) => {
    setChats(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (activeChatId === id) {
        setActiveChatId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  }, [activeChatId]);

  const updateChat = useCallback((updatedChat: ChatSession) => {
    setChats(prev => prev.map(c => c.id === updatedChat.id ? updatedChat : c));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] selection:bg-blue-500/30">
      <AnimatePresence mode="wait">
        {view === AppView.LANDING ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onStart={handleStartChat} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChatInterface 
              chats={chats} 
              activeChatId={activeChatId}
              onNewChat={handleNewChat}
              onSelectChat={setActiveChatId}
              onDeleteChat={handleDeleteChat}
              onUpdateChat={updateChat}
              onBackToLanding={() => setView(AppView.LANDING)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
