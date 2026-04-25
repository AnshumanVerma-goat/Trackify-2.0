import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Plus, CheckCircle2 } from 'lucide-react';
import api from '../api';

export default function HabitTracker() {
  const [habits, setHabits] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');

  const fetchHabits = async () => {
    try {
      const res = await api.get('/habits');
      setHabits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const addHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await api.post('/habits', { title: newTitle });
      setNewTitle('');
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  const completeHabit = async (id: number) => {
    try {
      await api.put(`/habits/${id}/complete`);
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
        <Flame className="text-orange-500" /> Habits & Consistency
      </h3>

      <form onSubmit={addHabit} className="flex gap-2 mb-4">
        <input 
          type="text" 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New habit (e.g. Drink Water)" 
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
        <button type="submit" className="bg-orange-500/20 text-orange-400 p-2 rounded-xl border border-orange-500/30 hover:bg-orange-500/30 transition-colors">
          <Plus size={20} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
        {habits.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">No habits yet. Start building streaks!</p>
        ) : (
          habits.map((h, i) => {
            const isCompletedToday = h.last_completed && new Date(h.last_completed).toDateString() === new Date().toDateString();
            
            return (
              <motion.div 
                key={h.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isCompletedToday ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/5 border-white/5'}`}
              >
                <div>
                  <p className={`font-medium ${isCompletedToday ? 'text-orange-100' : 'text-slate-200'}`}>{h.title}</p>
                  <p className="text-xs text-orange-400 flex items-center gap-1 mt-1">
                    <Flame size={12} /> {h.streak} day streak
                  </p>
                </div>
                <button 
                  onClick={() => completeHabit(h.id)}
                  disabled={isCompletedToday}
                  className={`p-2 rounded-full transition-all ${isCompletedToday ? 'text-orange-500 opacity-50 cursor-not-allowed' : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10'}`}
                >
                  <CheckCircle2 size={24} />
                </button>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  );
}
