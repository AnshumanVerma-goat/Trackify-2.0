import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { Sparkles, BarChart2, Target, Brain, Flame, ActivitySquare } from 'lucide-react';
import api from '../api';

export default function Stats() {
  const [insights, setInsights] = useState('Loading insights...');
  const [data, setData] = useState<any[]>([]);
  const [subjectData, setSubjectData] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [focusTrend, setFocusTrend] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [insightsRes, analyticsRes] = await Promise.all([
          api.get('/ai/insights'),
          api.get('/user/analytics')
        ]);
        
        setInsights(insightsRes.data.insights || insightsRes.data.data?.insights);
        setAnalytics(analyticsRes.data);
        
        if (analyticsRes.data.subject_breakdown) {
            const formattedSubjects = Object.keys(analyticsRes.data.subject_breakdown).map(key => ({
                name: key,
                value: analyticsRes.data.subject_breakdown[key]
            }));
            setSubjectData(formattedSubjects);
        }

        // Mock focus trend for the UI since we don't have a specific historical /sessions API for it in the payload yet
        setFocusTrend([
            { day: 'Mon', fqi: 65, load: 30 },
            { day: 'Tue', fqi: 70, load: 45 },
            { day: 'Wed', fqi: 85, load: 40 },
            { day: 'Thu', fqi: 75, load: 60 },
            { day: 'Fri', fqi: analyticsRes.data.cognitive_metrics?.average_fqi || 75, load: analyticsRes.data.cognitive_metrics?.burnout_score || 50 }
        ]);

      } catch (e) {
        setInsights("Could not load AI insights.");
      }
    };
    fetchData();
  }, []);

  const burnout = analytics?.cognitive_metrics?.burnout_score || 0;
  const fqi = analytics?.cognitive_metrics?.average_fqi || 0;
  const relapseRisk = (analytics?.cognitive_metrics?.relapse_risk || 0) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="space-y-6 flex flex-col h-full">
        {/* Cognitive AI Insights Box */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-[2rem] p-8 backdrop-blur-xl relative overflow-hidden group shadow-lg">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-colors"></div>
          <h3 className="text-xl font-bold text-indigo-300 mb-4 flex items-center gap-2 relative z-10">
            <Sparkles size={24} className="text-indigo-400" /> Behavioral Insights
          </h3>
          <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed pr-4 custom-scrollbar max-h-40 overflow-y-auto relative z-10">
            {insights}
          </div>
        </div>

        {/* Cognitive Load & Risk Tracker */}
        {analytics && (
          <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-center shadow-lg">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Brain size={20} className="text-indigo-400" /> Cognitive Stability Metrics
            </h3>
            
            <div className="space-y-6 relative z-10">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Burnout Risk (Stress factor)</span>
                  <span className={`font-semibold ${burnout > 70 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {burnout.toFixed(1)} / 100
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-800/80 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-1000 ${burnout > 70 ? 'bg-gradient-to-r from-rose-500 to-red-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}
                    style={{ width: `${Math.min(100, burnout)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Addiction Relapse Probability</span>
                  <span className={`font-semibold ${relapseRisk > 50 ? 'text-rose-400' : 'text-indigo-400'}`}>
                    {relapseRisk.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-800/80 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-1000 ${relapseRisk > 50 ? 'bg-gradient-to-r from-orange-500 to-rose-400' : 'bg-gradient-to-r from-indigo-500 to-purple-400'}`}
                    style={{ width: `${Math.min(100, relapseRisk)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subject Breakdown */}
        <div className="glass-panel rounded-[2rem] p-8 flex-1 min-h-[250px] shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <BarChart2 size={20} className="text-purple-400" /> Subject Focus Distribution (Mins)
          </h3>
          <div className="h-[200px] w-full flex items-center justify-center">
            {subjectData && subjectData.length > 0 ? (
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
                  <Bar dataKey="value" fill="#818cf8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400">Log sessions to see subject spread.</div>
            )}
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[2rem] p-8 flex flex-col h-full shadow-lg">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
           <ActivitySquare size={20} className="text-indigo-400"/> Focus Quality Index (FQI)
        </h3>
        <p className="text-sm text-slate-400 mb-8">Daily trend of your deep work quality versus cognitive load.</p>
        
        <div className="flex-1 min-h-[300px] w-full flex items-center justify-center">
          {focusTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={focusTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFQI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                <XAxis dataKey="day" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="fqi" name="Focus Quality Mode" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorFQI)" />
                <Area type="monotone" dataKey="load" name="Burnout Strain" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-400">Complete tasks to analyze Focus Quality.</div>
          )}
        </div>

        <div className="mt-8 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
           <p className="text-sm text-indigo-200">
             <span className="font-semibold text-indigo-400">Current Average FQI:</span> {fqi.toFixed(1)} <br/>
             {fqi > 70 ? 'You are sustaining high cognitive yield.' : 'Focus is struggling. Suggest Pomodoro recovery rounds.'}
           </p>
        </div>
      </div>
    </div>
  );
}
