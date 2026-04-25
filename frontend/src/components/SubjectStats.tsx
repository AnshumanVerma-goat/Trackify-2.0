import React from 'react';
import { motion } from 'framer-motion';

interface SubjectStatsProps {
  subjectName: string;
  totalTime: number; // in minutes
  progress: number; // percentage (0-100)
}

const SubjectStats: React.FC<SubjectStatsProps> = ({ subjectName, totalTime, progress }) => {
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel rounded-3xl p-6 flex flex-col gap-4"
    >
      <h3 className="text-xl font-semibold text-indigo-400">{subjectName}</h3>
      <p className="text-slate-400">
        Total Time Studied: {hours}h {minutes}m
      </p>
      <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
        <div
          className="bg-indigo-500 h-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-right text-slate-400 text-sm">{progress}% completed</p>
    </motion.div>
  );
};

export default SubjectStats;