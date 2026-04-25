import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import AppLayout from '../components/AppLayout';
import Tasks from '../components/Tasks';
import FocusTimer from '../components/FocusTimer';
import Stats from '../components/Stats';
import AIChat from '../components/AIChat';
import { Sparkles, TrendingUp, Flame } from 'lucide-react';
import ProductivityMeter from '../components/ProductivityMeter';
import DailyPlan from '../components/DailyPlan';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [pref, setPref] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await api.get('/user/me');
        setUser(userRes.data);
        const prefRes = await api.get('/user/preferences');
        setPref(prefRes.data);
      } catch (e) {
        navigate('/login');
      }
    };
    loadData();
  }, [navigate]);

  if (!user) return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <AppLayout user={user}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full pb-20">

        {/* Greeting & Header */}
        <div className="md:col-span-12 flex flex-col md:flex-row gap-4 justify-between items-end mb-4">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold mb-2 tracking-tight"
            >
              Welcome back, <span className="neon-text">{user.email.split('@')[0]}</span>
            </motion.h2>
            <p className="text-slate-400">Ready to conquer your goals today?</p>
          </div>
        </div>

        {/* AI Study Plan (Bento Main) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="md:col-span-8 glass-panel rounded-3xl p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
            <Sparkles size={120} className="text-indigo-400" />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
              <Sparkles size={20} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold">AI Study Plan</h3>
          </div>
          <div className="prose prose-invert prose-indigo max-w-none text-slate-300 text-sm md:text-base leading-relaxed custom-scrollbar max-h-64 overflow-y-auto pr-4">
            {pref?.study_plan ? (
              <div dangerouslySetInnerHTML={{ __html: pref.study_plan.replace(/\n/g, '<br/>') }} />
            ) : (
              "No plan generated yet. Update your onboarding preferences!"
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="md:col-span-4 grid grid-cols-1 gap-6"
        >
          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>
            <div className="flex items-center gap-4 mb-2">
              <Flame size={24} className="text-orange-500" />
              <h4 className="text-slate-400 font-medium">Daily Streak</h4>
            </div>
            <p className="text-4xl font-bold">{user.streak} <span className="text-lg text-slate-500 font-normal">days</span></p>
          </div>

          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden group hover:border-purple-500/50 transition-colors">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors"></div>
            <div className="flex items-center gap-4 mb-2">
              <TrendingUp size={24} className="text-purple-500" />
              <h4 className="text-slate-400 font-medium">Total XP</h4>
            </div>
            <p className="text-4xl font-bold">{user.xp} <span className="text-lg text-slate-500 font-normal">xp</span></p>
          </div>
        </motion.div>

        {/* Focus Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="md:col-span-5 glass-panel rounded-3xl p-6"
        >
          <FocusTimer />
        </motion.div>

        {/* Task Manager */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="md:col-span-7 glass-panel rounded-3xl p-6"
        >
          <Tasks />
        </motion.div>

        {/* Weekly Chart & Analytics Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="md:col-span-12 glass-panel rounded-3xl p-6"
        >
          <Stats />
        </motion.div>

        {/* Productivity Meter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="md:col-span-6 glass-panel rounded-3xl p-6"
        >
          <ProductivityMeter />
        </motion.div>

        {/* Daily Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="md:col-span-6 glass-panel rounded-3xl p-6"
        >
          <DailyPlan />
        </motion.div>
      </div>

      {/* Floating AI Assistant */}
      <AIChat />
    </AppLayout>
  );
}
