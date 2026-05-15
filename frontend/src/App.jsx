import { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';

export default function App() {
  // Persist dark mode preference in localStorage
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header dark={dark} onToggleDark={() => setDark((d) => !d)} />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <Home />
      </main>
      <footer className="text-center text-xs text-gray-300 dark:text-gray-700 py-5">
        For educational and research purposes only · Predictions are probabilistic estimates
      </footer>
    </div>
  );
}
