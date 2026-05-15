const { spawn } = require('child_process');
const path = require('path');

const SCRIPT_PATH = path.join(__dirname, '../deepface_analyze.py');
const PYTHON_BIN = process.env.PYTHON_BIN || 'python3';

function analyzeWithDeepFace(imagePath) {
  return new Promise((resolve, reject) => {
    const python = spawn(PYTHON_BIN, [SCRIPT_PATH, imagePath]);

    let stdout = '';
    let stderr = '';

    python.stdout.on('data', (data) => { stdout += data.toString(); });
    python.stderr.on('data', (data) => { stderr += data.toString(); });

    python.on('close', (code) => {
      try {
        const parsed = JSON.parse(stdout.trim());
        if (parsed.error) {
          console.error('[DeepFace] Error:', parsed.error);
          return resolve({ age: null, gender: null });
        }
        resolve({ age: parsed.age ?? null, gender: parsed.gender ?? null });
      } catch {
        console.error('[DeepFace] Failed to parse output:', stdout, stderr);
        resolve({ age: null, gender: null });
      }
    });

    python.on('error', (err) => {
      console.error('[DeepFace] Spawn error:', err.message);
      resolve({ age: null, gender: null });
    });
  });
}

module.exports = { analyzeWithDeepFace };
