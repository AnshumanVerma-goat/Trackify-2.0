import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import AIChat from './AIChat';

export default function AppLayout({ children, user }: { children: React.ReactNode, user: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="min-h-screen flex bg-[#030712] text-slate-100 overflow-hidden">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} user={user} />

      <div className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <header className="h-20 border-b border-white/5 glass backdrop-blur-md px-8 flex items-center justify-between z-40 sticky top-0 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {getPageTitle()}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-sm text-slate-400">Level {user?.level || 1}</span>
              <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden mt-1 border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(user?.xp || 0) % 100}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                />
              </div>
            </div>
            <div className="glass px-4 py-2 rounded-full flex items-center gap-2 border-indigo-500/20">
              <span className="text-sm font-medium text-indigo-200">{user?.xp || 0} XP</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-8 relative">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 max-w-7xl mx-auto h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AIChat />
    </div>
  );
}
