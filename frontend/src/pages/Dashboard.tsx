import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Activity, Zap } from 'lucide-react';
import { useOutletContext, Link } from 'react-router-dom';
import ProductivityMeter from '../components/ProductivityMeter';
import DailyPlan from '../components/DailyPlan';
import api from '../api';

export default function Dashboard() {
  const { user } = useOutletContext<any>();
  const [insight, setInsight] = useState<string>("Loading your personalized insights...");
  const [nextAction, setNextAction] = useState<string>("Analyzing your tasks...");
  const [score, setScore] = useState<number>(user?.xp ? Math.min(user.xp / 10, 100) : 0);

  useEffect(() => {
    api.get('/ai/study-recommendation').then(res => {
      setNextAction(res.data.recommendation);
    }).catch(() => setNextAction("Review your pending tasks."));

    api.get('/ai/micro-insight').then(res => {
      setInsight(res.data.insight);
    }).catch(() => setInsight("Consistency is the key to mastering your subjects."));

    api.get('/user/analytics').then(res => {
      setScore(res.data.productivity_score || 0);
    }).catch(console.error);
  }, []);

  return (
    <div className="h-full w-full flex flex-col gap-10 pb-20 max-w-5xl mx-auto">
      {/* 1. Welcome Section & Micro Insight */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center mt-12 mb-8 space-y-4"
      >
        <h2 className="text-5xl font-extrabold tracking-tight text-white">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{user?.email?.split('@')[0] || 'Student'}</span>
        </h2>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-slate-400 text-lg flex items-center gap-2 font-medium"
        >
          <Sparkles size={16} className="text-purple-400" />
          {insight}
        </motion.div>
      </motion.div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* 2. Next Best Action (AI-powered) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="md:col-span-8 glass-panel rounded-[2rem] p-8 border border-indigo-500/20 relative overflow-hidden group shadow-lg"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors pointer-events-none"></div>
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40 text-indigo-400">
              <Zap size={24} />
            </div>
            <h3 className="text-2xl font-semibold text-white">Next Best Action</h3>
          </div>
          
          <div className="relative z-10">
            <div className="prose prose-invert prose-indigo max-w-none text-slate-300 text-lg leading-relaxed">
              {nextAction.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
            
            <div className="mt-8">
              <Link to="/tasks" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors">
                Go to Tasks <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 3. Productivity Score */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="md:col-span-4 glass-panel rounded-[2rem] p-8 flex flex-col justify-center items-center relative overflow-hidden group shadow-lg border border-purple-500/10"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors pointer-events-none"></div>
          <div className="w-full flex items-center justify-between mb-2 relative z-10">
             <h3 className="text-xl font-semibold text-white flex items-center gap-2">
               <Activity size={20} className="text-purple-400"/> Score
             </h3>
          </div>
          <div className="flex-1 w-full flex items-center justify-center relative z-10">
             <ProductivityMeter score={score} />
          </div>
        </motion.div>

        {/* 4. Today's Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="md:col-span-12 glass-panel rounded-[2rem] p-8 border border-white/5 relative overflow-hidden shadow-lg"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-white">Today's Plan</h3>
            <Link to="/ai" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
              Adjust with AI <ArrowRight size={14} />
            </Link>
          </div>
          <DailyPlan />
        </motion.div>
      </div>
    </div>
  );
}
