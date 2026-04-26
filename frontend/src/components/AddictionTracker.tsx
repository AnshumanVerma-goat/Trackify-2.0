import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Plus, RotateCcw, TrendingDown } from 'lucide-react';
import api from '../api';

export default function AddictionTracker() {
  const [addictions, setAddictions] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newGoal, setNewGoal] = useState('');

  const fetchAddictions = async () => {
    try {
      const res = await api.get('/addictions');
      setAddictions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAddictions();
  }, []);

  const addAddiction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await api.post('/addictions', { title: newTitle, reduction_goal: newGoal });
      setNewTitle('');
      setNewGoal('');
      fetchAddictions();
    } catch (err) {
      console.error(err);
    }
  };

  const relapseAddiction = async (id: number) => {
    try {
      await api.put(`/addictions/${id}/relapse`);
      fetchAddictions();
    } catch (err) {
      console.error(err);
    }
  };

  const incrementStreak = async (id: number) => {
    try {
      await api.put(`/addictions/${id}/increment_streak`);
      fetchAddictions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
        <ShieldAlert className="text-red-500" /> Addiction Tracker
      </h3>
      <p className="text-slate-400 text-sm mb-4">Track bad habits and monitor your reduction progress.</p>

      <form onSubmit={addAddiction} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="What to reduce? (e.g. Scrolling)"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Goal (e.g. Under 1 hr)"
          className="w-1/3 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />
        <button type="submit" className="bg-red-500/20 text-red-400 p-2 rounded-xl border border-red-500/30 hover:bg-red-500/30 transition-colors">
          <Plus size={20} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
        {addictions.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">No addictions tracked yet. Stay focused!</p>
        ) : (
          addictions.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl border bg-white/5 border-white/5 relative overflow-hidden group hover:border-red-500/30 transition-colors"
            >
              <div className="absolute right-0 top-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 pointer-events-none"></div>

              <div>
                <p className="font-medium text-slate-200">{a.title}</p>
                {a.reduction_goal && (
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <TrendingDown size={12} /> {a.reduction_goal}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                    {a.current_streak} days free
                  </span>
                  <button onClick={() => incrementStreak(a.id)} className="text-xs text-slate-500 hover:text-white px-2 rounded bg-white/5 border border-white/10 transition-colors">
                    +1 day
                  </button>
                </div>
              </div>

              <button
                onClick={() => relapseAddiction(a.id)}
                title="I relapsed"
                className="p-3 rounded-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/20"
              >
                <RotateCcw size={20} />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
