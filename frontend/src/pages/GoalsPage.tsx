import { useState, useEffect } from 'react';
import api from '../api';
import { Target, TrendingUp, Calendar, Zap } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export default function GoalsPage() {
  const {} = useOutletContext<any>();
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    api.get('/user/analytics').then(res => setAnalytics(res.data)).catch(console.error);
  }, []);

  return (
    <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
      <div className="glass-panel rounded-3xl p-8 h-fit border border-white/5 shadow-lg">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
            <Target size={24} className="text-pink-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Focus Goals</h2>
        </div>
        
        {analytics ? (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-colors"></div>
              <div className="flex justify-between items-end mb-4 relative z-10">
                <div>
                  <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2"><Zap size={18} className="text-yellow-400"/> Daily Goal</h3>
                  <p className="text-slate-400 text-sm mt-1">{analytics.daily_goal} hours of focus</p>
                </div>
                <span className="text-2xl font-bold text-pink-300">
                  {Math.min(100, Math.round(((analytics.subject_breakdown.reduce((a:any,b:any)=>a+b.minutes,0)/60) / analytics.daily_goal) * 100))}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative z-10 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                  style={{ width: `${Math.min(100, Math.round(((analytics.subject_breakdown.reduce((a:any,b:any)=>a+b.minutes,0)/60) / analytics.daily_goal) * 100))}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-colors"></div>
              <div className="flex justify-between items-end mb-4 relative z-10">
                <div>
                  <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2"><Calendar size={18} className="text-indigo-400"/> Weekly Goal</h3>
                  <p className="text-slate-400 text-sm mt-1">{analytics.weekly_goal} hours of focus</p>
                </div>
                <span className="text-2xl font-bold text-rose-300">
                  {Math.min(100, Math.round(((analytics.subject_breakdown.reduce((a:any,b:any)=>a+b.minutes,0)/60) / analytics.weekly_goal) * 100))}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative z-10 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-rose-500 to-red-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                  style={{ width: `${Math.min(100, Math.round(((analytics.subject_breakdown.reduce((a:any,b:any)=>a+b.minutes,0)/60) / analytics.weekly_goal) * 100))}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 py-10">
            Start tracking to see insights
          </div>
        )}
      </div>

      <div className="glass-panel rounded-3xl p-8 h-fit border border-white/5 shadow-lg">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <TrendingUp size={24} className="text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Long-Term Milestones</h2>
        </div>
        <div className="bg-white/5 rounded-2xl p-10 border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:bg-white/10 transition-colors">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <Target size={48} className="text-indigo-500/50 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2 relative z-10">Semester Goals</h3>
          <p className="text-slate-400 text-sm relative z-10">
            Set long-term goals to track your progress over the semester.
          </p>
          <div className="mt-6 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium relative z-10 cursor-pointer hover:bg-indigo-500/30 transition-colors">
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}
