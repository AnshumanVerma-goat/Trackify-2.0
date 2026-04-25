import { motion } from 'framer-motion';

export default function ProductivityMeter({ score }: { score: number }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = 'from-red-500 to-orange-500';
  let label = 'Low';
  if (score >= 80) {
    color = 'from-emerald-400 to-teal-500';
    label = 'Elite';
  } else if (score >= 50) {
    color = 'from-indigo-400 to-purple-500';
    label = 'Good';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-40 h-40 flex items-center justify-center mb-4">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle cx="80" cy="80" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent" />
          <motion.circle 
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="80" cy="80" r={radius} 
            stroke="url(#score-gradient)" 
            strokeWidth="12" 
            fill="transparent" 
            strokeDasharray={circumference} 
            strokeLinecap="round"
            className="drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          />
          <defs>
            <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {score >= 80 ? (
                <>
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </>
              ) : score >= 50 ? (
                <>
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#a855f7" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f97316" />
                </>
              )}
            </linearGradient>
          </defs>
        </svg>
        <div className="flex flex-col items-center z-10">
          <span className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
            {score}
          </span>
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-1">Productivity Score</h3>
      <div className={`px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${color} text-white shadow-lg`}>
        {label} Performance
      </div>
    </div>
  );
}
