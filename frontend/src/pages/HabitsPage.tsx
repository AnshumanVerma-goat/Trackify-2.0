import HabitTracker from '../components/HabitTracker';
import AddictionTracker from '../components/AddictionTracker';

export default function HabitsPage() {
  return (
    <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
      <div className="glass-panel rounded-[2rem] p-8 border border-white/5 relative overflow-hidden shadow-lg h-[80vh]">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <HabitTracker />
      </div>
      <div className="glass-panel rounded-[2rem] p-8 border border-white/5 relative overflow-hidden shadow-lg h-[80vh]">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <AddictionTracker />
      </div>
    </div>
  );
}
