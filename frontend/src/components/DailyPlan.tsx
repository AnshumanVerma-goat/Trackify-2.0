import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';

export default function DailyPlan({ planText }: { planText: string }) {
  // Try to parse out timeline elements if any exist, or just show the raw plan if it's not structured.
  const lines = planText ? planText.split('\n').filter(l => l.trim()) : [];
  
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
        <Calendar className="text-emerald-400" /> Today's Smart Plan
      </h3>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {lines.length > 0 ? lines.map((line, idx) => {
          const isTimeBlock = line.includes('-') && line.includes(':');
          if (isTimeBlock) {
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group"
              >
                <div className="flex flex-col items-center justify-center text-emerald-400">
                  <Clock size={20} className="group-hover:scale-110 transition-transform"/>
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
              className="text-slate-400 text-sm pl-2 border-l-2 border-slate-700"
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
