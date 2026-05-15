import UploadArea from '../components/UploadArea';
import ResultCard from '../components/ResultCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useImageUpload } from '../hooks/useImageUpload';

const REGIONS = [
  { emoji: '⛰️', label: 'Northern',     color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' },
  { emoji: '🌾', label: 'Northeastern', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800' },
  { emoji: '🏙️', label: 'Central',      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
  { emoji: '🌊', label: 'Southern',     color: 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800' },
];

export default function Home() {
  const { file, preview, result, error, isLoading, selectFile, submit, reset } = useImageUpload();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="text-center space-y-3 pt-2 pb-1">
        <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-3 py-1 rounded-full text-xs font-semibold border border-brand-200 dark:border-brand-800">
          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
          AI-Powered · DeepFace + Teachable Machine
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
          Thai Regional<br />Face Classifier
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          Upload a face photo to estimate Thai regional background, age &amp; gender
        </p>
      </div>

      {/* Upload card */}
      <div className="card p-6 space-y-4">
        <UploadArea onFileSelect={selectFile} isLoading={isLoading} preview={preview} />
        <div className="flex gap-3 justify-end">
          {(file || result || error) && (
            <button onClick={reset} className="btn-secondary" disabled={isLoading}>
              Clear
            </button>
          )}
          <button onClick={submit} disabled={!file || isLoading} className="btn-primary">
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing…
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Analyze Face
              </>
            )}
          </button>
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && !isLoading && <ErrorMessage error={error} onRetry={submit} />}
      {result && !isLoading && <ResultCard result={result} />}

      {/* Region pills — show only when idle */}
      {!file && !result && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {REGIONS.map(({ emoji, label, color }) => (
            <div key={label} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium ${color}`}>
              <span className="text-base">{emoji}</span>
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
