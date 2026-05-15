export default function LoadingSpinner() {
  return (
    <div className="card p-10 flex flex-col items-center gap-5 animate-fade-in">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-gray-800" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500 border-r-violet-400 animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-brand-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
      <div className="text-center space-y-1">
        <p className="font-semibold text-sm bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">
          Analyzing face…
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Running region model · Detecting age &amp; gender
        </p>
      </div>
    </div>
  );
}
