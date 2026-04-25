import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, Circle, Clock, Tag, Zap, CheckSquare } from 'lucide-react';
import api from '../api';

type Task = { id: number, title: string, subject_tag: string, status: string, estimated_minutes: number, ai_priority_score?: number };

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [subject_tag, setSubjectTag] = useState('');
  const [estimated_minutes, setEstimatedMinutes] = useState(30);
  const [isPrioritizing, setIsPrioritizing] = useState(false);

  const fetchTasks = async () => {
    const res = await api.get('/tasks');
    setTasks(res.data.sort((a: Task, b: Task) => (b.ai_priority_score || 0) - (a.ai_priority_score || 0)));
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await api.post('/tasks', { title, subject_tag: subject_tag || 'General', estimated_minutes });
    setTitle('');
    setSubjectTag('');
    setEstimatedMinutes(30);
    fetchTasks();
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    await api.put(`/tasks/${task.id}/status?status=${newStatus}`);
    fetchTasks();
  };

  const autoPrioritize = async () => {
    setIsPrioritizing(true);
    await api.post('/ai/prioritize');
    await fetchTasks();
    setIsPrioritizing(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <CheckCircle2 className="text-indigo-400" /> Task Manager
        </h3>
        <button 
          onClick={autoPrioritize}
          disabled={isPrioritizing}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass border-indigo-500/50 hover:bg-indigo-500/20 text-indigo-300 transition-all font-medium text-sm disabled:opacity-50"
        >
          {isPrioritizing ? <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin"/> : <Sparkles size={16} />}
          {isPrioritizing ? 'Prioritizing...' : 'Auto Prioritize'}
        </button>
      </div>

      <form onSubmit={addTask} className="flex flex-wrap gap-3 mb-6">
        <input 
          type="text" placeholder="What needs to be done?" value={title} onChange={e => setTitle(e.target.value)}
          className="flex-1 min-w-[200px] bg-[#0b0f19]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
        <div className="flex gap-3">
          <input 
            type="text" placeholder="Subject" value={subject_tag} onChange={e => setSubjectTag(e.target.value)}
            className="w-28 bg-[#0b0f19]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <input 
            type="number" placeholder="Mins" value={estimated_minutes} onChange={e => setEstimatedMinutes(parseInt(e.target.value))}
            className="w-20 bg-[#0b0f19]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all transform hover:-translate-y-0.5">
            Add
          </button>
        </div>
      </form>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar min-h-[300px]">
        <AnimatePresence>
          {tasks.map(t => (
            <motion.div 
              key={t.id} 
              layout
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.08)' }}
              className={`p-4 rounded-2xl border transition-all ${t.status === 'completed' ? 'glass border-white/5 opacity-60' : 'bg-[#0b0f19]/80 border-indigo-500/20 shadow-lg'}`}
            >
              <div className="flex items-start gap-4">
                <button onClick={() => toggleStatus(t)} className="mt-1">
                  {t.status === 'completed' ? <CheckCircle2 className="text-indigo-400" size={22} /> : <Circle className="text-slate-500 hover:text-indigo-400 transition-colors" size={22} />}
                </button>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className={`font-medium text-base ${t.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {t.title}
                    </p>
                    {t.ai_priority_score ? (
                      <span className="flex items-center gap-1 text-xs font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-md border border-indigo-500/30">
                        <Zap size={12} /> {(t.ai_priority_score).toFixed(1)}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Tag size={12} /> {t.subject_tag}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {t.estimated_minutes}m</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
           <div className="h-full flex flex-col items-center justify-center text-slate-500">
             <CheckSquare size={48} className="mb-4 opacity-20" />
             <p>No tasks yet. Create one to get started!</p>
           </div>
        )}
      </div>
    </div>
  );
}
