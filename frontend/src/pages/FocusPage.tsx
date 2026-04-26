import FocusTimer from '../components/FocusTimer';

export default function FocusPage() {
  return (
    <div className="h-full w-full glass-panel rounded-3xl p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <FocusTimer />
      </div>
    </div>
  );
}
