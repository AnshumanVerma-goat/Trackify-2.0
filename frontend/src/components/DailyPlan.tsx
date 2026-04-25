import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import api from '../api';

export default function DailyPlan() {
  const [planText, setPlanText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const res = await api.get('/ai/daily-plan');
      setPlanText(res.data.plan);
    } catch (err) {
      setPlanText('Failed to generate plan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const lines = planText ? planText.split('\n').filter(l => l.trim()) : [];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="text-emerald-400" /> Today's Smart Plan
        </h3>
        <button
          onClick={fetchPlan}
          disabled={loading}
          className="text-slate-400 hover:text-emerald-400 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3">
            <Sparkles size={32} className="text-emerald-500/50 animate-pulse" />
            <p className="text-sm">Generating your optimal day...</p>
          </div>
        ) : lines.length > 0 ? lines.map((line, idx) => {
          const isTimeBlock = line.includes('-') && line.includes(':');
          if (isTimeBlock) {
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group shadow-sm hover:bg-emerald-500/5"
              >
                <div className="flex flex-col items-center justify-center text-emerald-400">
                  <Clock size={20} className="group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-200 text-sm">{line.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '')}</p>
                </div>
              </motion.div>
            );
          }
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-slate-400 text-sm pl-2 border-l-2 border-emerald-500/30 ml-4 py-1"
            >
              {line.replace(/\*\*/g, '')}
            </motion.div>
          );
        }) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <Calendar size={48} className="mb-4 opacity-20" />
            <p>No plan available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
