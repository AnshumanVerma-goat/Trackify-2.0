import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { Sparkles, BarChart2, Target } from 'lucide-react';
import api from '../api';

export default function Stats() {
  const [insights, setInsights] = useState('Loading insights...');
  const [data, setData] = useState<any[]>([]);
  const [subjectData, setSubjectData] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [insightsRes, analyticsRes] = await Promise.all([
          api.get('/ai/insights'),
          api.get('/user/analytics')
        ]);
        
        setInsights(insightsRes.data.insights);
        setAnalytics(analyticsRes.data);
        
        if (analyticsRes.data.subject_breakdown) {
          setSubjectData(analyticsRes.data.subject_breakdown.map((s: any) => ({
            name: s.subject,
            value: s.minutes
          })));
        }

        // Set empty array if no real time-series data
        setData([]);
      } catch (e) {
        setInsights("Could not load AI insights.");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="space-y-6 flex flex-col h-full">
        {/* AI Insights Box */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-colors"></div>
          <h3 className="text-xl font-bold text-indigo-300 mb-4 flex items-center gap-2">
            <Sparkles size={24} className="text-indigo-400" /> AI Weekly Insights
          </h3>
          <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed pr-4 custom-scrollbar max-h-32 overflow-y-auto">
            {insights}
          </div>
        </div>

        {/* Goals Tracker */}
        {analytics && (
          <div className="bg-white/5 border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Target size={20} className="text-pink-400" /> Goals System
            </h3>
            <div className="space-y-4 relative z-10">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Daily Goal ({analytics.daily_goal}h)</span>
                  <span className="text-pink-300 font-medium">
                    {Math.min(100, Math.round(((analytics.subject_breakdown.reduce((a:any,b:any)=>a+b.minutes,0)/60) / analytics.daily_goal) * 100))}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-400"
                    style={{ width: `${Math.min(100, Math.round(((analytics.subject_breakdown.reduce((a:any,b:any)=>a+b.minutes,0)/60) / analytics.daily_goal) * 100))}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Weekly Goal ({analytics.weekly_goal}h)</span>
                  <span className="text-rose-300 font-medium">
                    {Math.min(100, Math.round(((analytics.subject_breakdown.reduce((a:any,b:any)=>a+b.minutes,0)/60) / analytics.weekly_goal) * 100))}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 to-red-400"
                    style={{ width: `${Math.min(100, Math.round(((analytics.subject_breakdown.reduce((a:any,b:any)=>a+b.minutes,0)/60) / analytics.weekly_goal) * 100))}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subject Breakdown */}
        <div className="bg-[#0b0f19]/80 border border-white/5 rounded-3xl p-6 flex-1 min-h-[200px]">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <BarChart2 size={20} className="text-purple-400" /> Subject Distribution (Minutes)
          </h3>
          <div className="h-[200px] w-full flex items-center justify-center">
            {subjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#ffffff0a' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#c7d2fe' }}
                  />
                  <Bar dataKey="value" fill="#a855f7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400">Start tracking to see insights</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#0b0f19]/80 border border-white/5 rounded-3xl p-6 flex flex-col h-full">
        <h3 className="text-lg font-bold text-white mb-6">Study Time Trend (Hours)</h3>
        <div className="flex-1 min-h-[300px] w-full flex items-center justify-center">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                <XAxis dataKey="day" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#c7d2fe' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#818cf8" strokeWidth={4} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-400">Start tracking to see insights</div>
          )}
        </div>
      </div>
    </div>
  );
}
