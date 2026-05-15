export default function ConfidenceBar({ value, light = false }) {
  const pct = Math.round(value * 100);
  const color = pct >= 80 ? 'bg-green-400' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400';

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className={light ? 'text-white/70 font-medium' : 'text-gray-500 dark:text-gray-400 font-medium'}>Confidence</span>
        <span className={`font-bold ${light ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>{pct}%</span>
      </div>
      <div
        className={`w-full h-2 rounded-full overflow-hidden ${light ? 'bg-white/25' : 'bg-gray-100 dark:bg-gray-800'}`}
        role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${light ? 'bg-white' : color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
