import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

export default function Onboarding() {
  const [studyHours, setStudyHours] = useState('2');
  const [subjects, setSubjects] = useState('');
  const [preferredTime, setPreferredTime] = useState('evening');
  const [productivityStyle, setProductivityStyle] = useState('pomodoro');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/user/onboard', {
        study_hours: parseFloat(studyHours),
        subjects,
        preferred_time: preferredTime,
        productivity_style: productivityStyle
      });
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl glass-panel border border-white/10 rounded-3xl p-8 shadow-2xl z-10"
      >
        <div className="mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xl text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] mb-4">T</div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Let's personalize your experience</h2>
          <p className="text-slate-400">Tell us how you work best, and we'll handle the rest.</p>
        </div>
        <form onSubmit={handleOnboard} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Daily Study Hours</label>
              <input type="number" min="0.5" step="0.5" required
                value={studyHours} onChange={(e) => setStudyHours(e.target.value)}
                className="w-full bg-[#0b0f19]/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Study Time</label>
              <select 
                value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full bg-[#0b0f19]/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Late Night</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Key Subjects (comma separated)</label>
            <input type="text" required
              value={subjects} onChange={(e) => setSubjects(e.target.value)}
              placeholder="e.g., Data Structures, Calculus, Physics"
              className="w-full bg-[#0b0f19]/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Productivity Style</label>
            <select 
              value={productivityStyle} onChange={(e) => setProductivityStyle(e.target.value)}
              className="w-full bg-[#0b0f19]/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            >
              <option value="pomodoro">Pomodoro (25m work / 5m break)</option>
              <option value="deep_work">Deep Work (90m continuous)</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transform transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none mt-4"
          >
            {loading ? 'Generating AI Study Plan...' : 'Generate My Plan'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
