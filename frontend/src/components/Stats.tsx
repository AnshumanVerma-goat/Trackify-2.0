import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { Sparkles, BarChart2 } from 'lucide-react';
import api from '../api';

export default function Stats() {
  const [insights, setInsights] = useState('Loading insights...');
  const [data, setData] = useState<any[]>([]);
  const [subjectData, setSubjectData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/ai/insights');
        setInsights(res.data.insights);
        
        // Mocking chart data for visual since no complex aggregation endpoints exist yet
        setData([
          { day: 'Mon', hours: 2.5 },
          { day: 'Tue', hours: 3.8 },
          { day: 'Wed', hours: 1.5 },
          { day: 'Thu', hours: 4.2 },
          { day: 'Fri', hours: 3.0 },
          { day: 'Sat', hours: 5.5 },
          { day: 'Sun', hours: 2.0 },
        ]);
        
        setSubjectData([
          { name: 'Math', value: 400 },
          { name: 'Physics', value: 300 },
          { name: 'CS', value: 300 },
          { name: 'History', value: 200 },
        ]);
      } catch (e) {
        setInsights("Could not load AI insights.");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="space-y-6 flex flex-col h-full">
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-colors"></div>
          <h3 className="text-xl font-bold text-indigo-300 mb-4 flex items-center gap-2">
            <Sparkles size={24} className="text-indigo-400" /> AI Weekly Insights
          </h3>
          <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed pr-4 custom-scrollbar max-h-48 overflow-y-auto">
            {insights}
          </div>
        </div>

        <div className="bg-[#0b0f19]/80 border border-white/5 rounded-3xl p-6 flex-1">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <BarChart2 size={20} className="text-purple-400" /> Subject Distribution
          </h3>
          <div className="h-[200px] w-full">
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
          </div>
        </div>
      </div>

      <div className="bg-[#0b0f19]/80 border border-white/5 rounded-3xl p-6 flex flex-col h-full">
        <h3 className="text-lg font-bold text-white mb-6">Study Time Trend (Hours)</h3>
        <div className="flex-1 min-h-[300px] w-full">
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
        </div>
      </div>
    </div>
  );
}
