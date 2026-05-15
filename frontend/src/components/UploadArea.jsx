import { useRef, useState } from 'react';
import { validateImageFile } from '../utils/validation';

export default function UploadArea({ onFileSelect, isLoading, preview }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState(null);

  function handleFile(file) {
    const error = validateImageFile(file);
    if (error) { setValidationError(error); return; }
    setValidationError(null);
    onFileSelect(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e) {
    const file = e.target.files[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload image area"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isLoading && inputRef.current.click()}
        onKeyDown={(e) => e.key === 'Enter' && !isLoading && inputRef.current.click()}
        className={[
          'relative flex flex-col items-center justify-center gap-4',
          'w-full min-h-[240px] rounded-2xl border-2 border-dashed cursor-pointer',
          'transition-all duration-200 overflow-hidden group',
          isLoading
            ? 'cursor-not-allowed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30'
            : dragOver
            ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20 scale-[1.01] shadow-lg shadow-brand-500/10'
            : 'border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 bg-gray-50/50 dark:bg-gray-900/30 hover:bg-brand-50/30 dark:hover:bg-brand-900/10',
        ].join(' ')}
      >
        {preview ? (
          <>
            <img src={preview} alt="Selected face" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full">Click to change</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 ${dragOver ? 'bg-brand-100 dark:bg-brand-900/40 scale-110' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 transition-colors ${dragOver ? 'text-brand-500' : 'text-gray-400 group-hover:text-brand-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className={`text-sm font-semibold transition-colors ${dragOver ? 'text-brand-600 dark:text-brand-400' : 'text-gray-600 dark:text-gray-300'}`}>
                {dragOver ? 'Drop image here' : 'Upload a face photo'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">
                JPEG, PNG, WEBP — max 4 MB
              </p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium text-brand-600 dark:text-brand-400">Analyzing…</span>
            </div>
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleChange} disabled={isLoading} />

      {validationError && (
        <p className="text-xs text-red-500 dark:text-red-400 text-center bg-red-50 dark:bg-red-900/20 rounded-lg py-2 px-3">
          {validationError}
        </p>
      )}
    </div>
  );
}
