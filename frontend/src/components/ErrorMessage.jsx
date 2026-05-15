const FRIENDLY_MESSAGES = {
  NO_FACE_DETECTED: 'No face detected. Try a clearer, well-lit frontal photo.',
  INVALID_FORMAT:   'Unsupported file type. Please upload JPEG, PNG, or WEBP.',
  FILE_TOO_LARGE:   'Image too large. Please use an image under 4 MB.',
  AZURE_ERROR:      'Face API request failed. Check your Azure credentials.',
  MODEL_ERROR:      'Region model failed. Ensure model files are in backend/models/.',
  MODEL_NOT_FOUND:  'Model files not found. Place model.json and weights.bin in backend/models/.',
  RATE_LIMIT:       'Too many requests. Please wait a moment and try again.',
  NETWORK_ERROR:    'Cannot reach the backend. Make sure it is running on port 5000.',
};

export default function ErrorMessage({ error, onRetry }) {
  const code = error?.code || error?.error;
  const message = FRIENDLY_MESSAGES[code] || error?.message || 'Something went wrong. Please try again.';

  return (
    <div className="card border-red-200/70 dark:border-red-900/50 animate-fade-in overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-red-500 to-rose-400" />
      <div className="p-5 flex gap-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <div className="flex-1 space-y-1 min-w-0">
          <p className="font-semibold text-sm text-red-600 dark:text-red-400">{code || 'Error'}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
        </div>
      </div>
      {onRetry && (
        <div className="px-5 pb-4 flex justify-end">
          <button onClick={onRetry} className="btn-primary text-xs px-4 py-2">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
