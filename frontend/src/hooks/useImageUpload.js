import { useState, useCallback } from 'react';
import { predictFace } from '../services/api';

/**
 * Manages the full upload → predict lifecycle.
 * Returns state + handlers to be consumed by the Home page.
 */
export function useImageUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectFile = useCallback((selected) => {
    setFile(selected);
    setResult(null);
    setError(null);
    // Build a local object URL for the image preview
    const url = URL.createObjectURL(selected);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev); // free previous blob URL
      return url;
    });
  }, []);

  const submit = useCallback(async () => {
    if (!file || isLoading) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await predictFace(file);
      setResult(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [file, isLoading]);

  const reset = useCallback(() => {
    setFile(null);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { file, preview, result, error, isLoading, selectFile, submit, reset };
}
