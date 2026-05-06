import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Activity, Zap, Brain, Flame } from 'lucide-react';
import { useOutletContext, Link } from 'react-router-dom';
import ProductivityMeter from '../components/ProductivityMeter';
import api from '../api';

export default function Dashboard() {
  const { user } = useOutletContext<any>();
  const [insight, setInsight] = useState<string>("Loading cognitive insights...");
  const [nextAction, setNextAction] = useState<string>("Analyzing behavioral patterns...");
  const [score, setScore] = useState<number>(user?.xp ? Math.min(user.xp / 10, 100) : 0);
  const [burnoutScore, setBurnoutScore] = useState<number>(user?.current_burnout_score || 0);

  useEffect(() => {
    api.get('/ai/study-recommendation').then(res => {
      setNextAction(res.data.recommendation);
    }).catch(() => setNextAction("Review your pending tasks to maintain cognitive balance."));

    api.get('/ai/micro-insight').then(res => {
      setInsight(res.data.insight);
    }).catch(() => setInsight("Consistency is the mechanism for behavioral rewiring."));

    api.get('/user/analytics').then(res => {
      setScore(res.data.productivity_score || 0);
      if (res.data.cognitive_metrics) {
        setBurnoutScore(Math.round(res.data.cognitive_metrics.burnout_score));
      }
    }).catch(console.error);
  }, []);

  return (
    <div className="h-full w-full flex flex-col gap-8 pb-20 max-w-5xl mx-auto">
      {/* 1. Welcome Section & Cognitive Insight */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col text-left mt-8 mb-4 space-y-4"
      >
        <h2 className="text-5xl font-extrabold tracking-tight text-white">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{user?.email?.split('@')[0] || 'User'}</span>
        </h2>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-slate-400 text-lg flex items-center gap-3 font-medium bg-white/5 border border-white/10 rounded-2xl p-4 w-fit"
        >
          <Sparkles size={20} className="text-indigo-400" />
          <span className="italic">"{insight}"</span>
        </motion.div>
      </motion.div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* 2. Adaptive Recommendation (AI-powered) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="md:col-span-8 glass-panel rounded-[2rem] p-8 border border-indigo-500/20 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors pointer-events-none"></div>
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Brain size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white">Engine Assessment</h3>
              <p className="text-sm text-indigo-300 font-medium">Cognitive Stability Engine</p>
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="prose prose-invert prose-indigo max-w-none text-slate-300 text-lg leading-relaxed">
              {nextAction.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
            
            <div className="mt-8 flex items-center gap-4">
              <Link to="/tasks" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                Execute Action <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 3. Cognitive Overload & Productivity Score */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="md:col-span-4 flex flex-col gap-6"
        >
          {/* Burnout Risk Card */}
          <div className="glass-panel rounded-[2rem] p-6 border border-rose-500/20 flex items-center gap-4 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg z-10 ${burnoutScore > 60 ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' : 'bg-green-500/20 border-green-500/40 text-green-400'}`}>
              <Flame size={28} />
            </div>
            <div className="z-10">
              <p className="text-sm text-slate-400 font-medium mb-1">Burnout Risk</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white">{burnoutScore}</span>
                <span className="text-sm text-slate-400 mb-1">/ 100</span>
              </div>
            </div>
          </div>

          {/* Productivity Meter */}
          <div className="glass-panel rounded-[2rem] p-6 flex flex-col items-center justify-center flex-1 border border-purple-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
             <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4 w-full">
               <Activity size={20} className="text-purple-400"/> Current Score
             </h3>
             <ProductivityMeter score={score} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
