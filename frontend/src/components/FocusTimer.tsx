import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import api from '../api';

const MODES = {
  'Deep Work': 50,
  'Revision': 25,
  'Light Study': 15,
};

export default function FocusTimer() {
  const [mode, setMode] = useState<keyof typeof MODES>('Deep Work');
  const [timeLeft, setTimeLeft] = useState(MODES['Deep Work'] * 60);
  const [isActive, setIsActive] = useState(false);
  const [subject_tag, setSubjectTag] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      handleSessionComplete();
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (!isActive) setTimeLeft(MODES[mode] * 60);
  }, [mode, isActive]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode] * 60);
  };

  const handleSessionComplete = async () => {
    const duration = MODES[mode];
    const focus_score = 9; // simple mock score
    try {
      await api.post('/sessions', { 
        subject_tag: subject_tag || 'General', 
        duration_minutes: duration, 
        focus_score, 
        focus_mode: mode 
      });
      let multiplier = 1;
      if (mode === 'Deep Work') multiplier = 2;
      else if (mode === 'Revision') multiplier = 1.5;
      
      setXpEarned(Math.floor(duration * multiplier));
      setShowReward(true);
      setTimeout(() => setShowReward(false), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((MODES[mode] * 60 - timeLeft) / (MODES[mode] * 60)) * 100;

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      <AnimatePresence>
        {showReward && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: -50, scale: 1.2 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute inset-0 m-auto w-48 h-48 flex flex-col items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-24 h-24 flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.8)] mb-4 border-4 border-white/20">
              <span className="text-3xl font-bold text-white">+{xpEarned}</span>
            </div>
            <span className="text-xl font-bold neon-text">XP Earned!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Clock className="text-indigo-400" /> Focus Timer
        </h3>
        <div className="flex gap-2">
           {Object.keys(MODES).map((m) => (
             <button
               key={m}
               onClick={() => { if (!isActive) setMode(m as keyof typeof MODES); }}
               className={`px-3 py-1 text-xs rounded-full transition-all border ${mode === m ? 'bg-indigo-500 text-white border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}
             >
               {m}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative my-4">
        {/* Circular SVG Timer */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="128" cy="128" r="120" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
            <circle 
              cx="128" cy="128" r="120" 
              stroke="url(#gradient)" 
              strokeWidth="6" 
              fill="transparent" 
              strokeDasharray={2 * Math.PI * 120} 
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>
          <div className="flex flex-col items-center z-10">
            <motion.span 
              key={timeLeft}
              initial={{ opacity: 0.5, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400"
            >
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </motion.span>
            <span className="text-slate-400 font-medium mt-2 tracking-widest uppercase text-xs">{mode}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 z-10">
        <input 
          type="text" 
          placeholder="Subject tag..." 
          value={subject_tag} 
          onChange={e => setSubjectTag(e.target.value)}
          disabled={isActive}
          className="bg-[#0b0f19]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 w-32 transition-all disabled:opacity-50"
        />
        
        <button 
          onClick={toggleTimer}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_rgba(99,102,241,0.7)] transition-all transform hover:scale-105"
        >
          {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
        
        <button 
          onClick={resetTimer}
          className="w-12 h-12 rounded-full glass border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
}
