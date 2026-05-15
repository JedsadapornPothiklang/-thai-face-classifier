const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

/**
 * Validates a File object before uploading.
 * Returns an error string if invalid, or null if the file is acceptable.
 */
export function validateImageFile(file) {
  if (!file) return 'No file selected.';

  if (!ALLOWED_TYPES.has(file.type)) {
    return 'Only JPEG, PNG, and WEBP images are accepted.';
  }

  if (file.size > MAX_SIZE_BYTES) {
    return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 4 MB.`;
  }

  return null;
}
