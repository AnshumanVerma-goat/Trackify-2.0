
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Clock, Flame, Target, BarChart2, Bot, X, Menu, User as UserIcon } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen, user }: { isOpen: boolean, setIsOpen: (val: boolean) => void, user: any }) {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Focus', path: '/focus', icon: Clock },
    { name: 'Habits', path: '/habits', icon: Flame },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'AI Assistant', path: '/ai', icon: Bot },
  ];

  return (
    <motion.div 
      animate={{ width: isOpen ? 260 : 80 }}
      className="h-screen glass-panel relative border-r border-white/5 flex flex-col z-50 flex-shrink-0"
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

      <nav className="flex-1 px-4 mt-8 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
        {links.map(link => {
          const isActive = location.pathname.startsWith(link.path);
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
      <div className="p-4 border-t border-white/5 space-y-4">
         <div className={`flex items-center gap-3 ${isOpen ? 'p-2' : 'justify-center'} rounded-xl glass border-white/5`}>
           <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-indigo-500/30 shrink-0">
             <UserIcon size={18} className="text-indigo-400"/>
           </div>
           {isOpen && (
             <div className="flex-1 overflow-hidden">
               <p className="text-sm font-medium truncate">{user?.email || 'Student'}</p>
               <p className="text-xs text-slate-400 flex items-center gap-1"><Flame size={12} className="text-orange-500"/> {user?.streak || 0} Day Streak</p>
             </div>
           )}
         </div>
         <button 
           onClick={() => {
             localStorage.removeItem('token');
             window.location.href = '/login';
           }}
           className={`w-full flex items-center ${isOpen ? 'justify-start px-4' : 'justify-center'} py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors`}
         >
           <X size={18} className={isOpen ? 'mr-2' : ''} />
           {isOpen && <span>Logout</span>}
         </button>
      </div>
    </motion.div>
  );
}
