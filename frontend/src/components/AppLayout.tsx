import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Menu, X, User as UserIcon, Flame } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function AppLayout({ children, user }: { children: React.ReactNode, user: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
  ];

  return (
    <div className="min-h-screen flex bg-[#030712] text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <motion.div 
        animate={{ width: isOpen ? 260 : 80 }}
        className="h-screen glass-panel relative border-r border-white/5 flex flex-col z-50"
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]">T</div>
                <span className="font-bold text-xl tracking-tight neon-text">Trackify</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400 hover:text-white transition-colors">
            {isOpen ? <X size={20} /> : <Menu size={24} className="mx-auto" />}
          </button>
        </div>

        <nav className="flex-1 px-4 mt-8 flex flex-col gap-2">
          {links.map(link => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link to={link.path} key={link.name}>
                <motion.div 
                  whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${isActive ? 'glass border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)] text-indigo-300' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <Icon size={20} className={isActive ? 'text-indigo-400' : ''} />
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-medium whitespace-nowrap">
                        {link.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* User profile snippet */}
        <div className="p-4 border-t border-white/5">
           <div className={`flex items-center gap-3 ${isOpen ? 'p-2' : 'justify-center'} rounded-xl glass border-white/5`}>
             <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-indigo-500/30">
               <UserIcon size={18} className="text-indigo-400"/>
             </div>
             {isOpen && (
               <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-medium truncate">{user?.email || 'Student'}</p>
                 <p className="text-xs text-slate-400 flex items-center gap-1"><Flame size={12} className="text-orange-500"/> {user?.streak || 0} Day Streak</p>
               </div>
             )}
           </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 border-b border-white/5 glass backdrop-blur-md px-8 flex items-center justify-between z-40 sticky top-0">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold capitalize bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {location.pathname.substring(1) || 'Dashboard'}
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

        {/* Page Content */}
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
    </div>
  );
}
