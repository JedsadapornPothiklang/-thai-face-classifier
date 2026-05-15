const fs = require('fs');

/**
 * Safely deletes a file from disk.
 * Swallows errors so a missing file never crashes the process.
 */
function deleteFile(filePath) {
  if (!filePath) return;
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.warn(`[imageUtils] Could not delete temp file: ${filePath}`, err.message);
    }
  });
}

module.exports = { deleteFile };
