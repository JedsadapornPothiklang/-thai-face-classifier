export default function Header({ dark, onToggleDark }) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800/60 shadow-sm">
      <div className="h-0.5 bg-gradient-to-r from-red-500 via-brand-500 to-indigo-500" />
      <div className="container mx-auto px-4 max-w-3xl flex items-center justify-between h-14">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-px w-7 overflow-hidden rounded-sm">
            <div className="h-1.5 bg-red-500" />
            <div className="h-1.5 bg-white border-y border-gray-200 dark:border-gray-600" />
            <div className="h-2.5 bg-blue-700" />
            <div className="h-1.5 bg-white border-y border-gray-200 dark:border-gray-600" />
            <div className="h-1.5 bg-red-500" />
          </div>
          <div>
            <p className="font-bold text-sm md:text-base leading-tight bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">
              Thai Face Classifier
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-none tracking-wide uppercase">
              Regional Analysis AI
            </p>
          </div>
        </div>

        <button
          onClick={onToggleDark}
          aria-label="Toggle dark mode"
          className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-110 transition-all duration-150"
        >
          {dark ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
