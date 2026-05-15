const fs = require('fs');
const path = require('path');

const MODEL_DIR = path.join(__dirname, '../models');
const MODEL_PATH = path.join(MODEL_DIR, 'model.json');

// Cached after first load
let cachedModel = null;
let cachedLabels = null;

const MOCK_LABELS = ['Northern', 'Northeastern', 'Central', 'Southern'];

function modelExists() {
  return fs.existsSync(MODEL_PATH);
}

/**
 * Returns random mock predictions when model files are not present.
 * isMock: true triggers a warning banner in the frontend.
 */
function mockClassify() {
  console.warn('[TeachableMachine] Model files not found — returning MOCK predictions.');
  const raw = MOCK_LABELS.map(() => Math.random());
  const sum = raw.reduce((a, b) => a + b, 0);
  const allPredictions = MOCK_LABELS
    .map((label, i) => ({ label, confidence: raw[i] / sum }))
    .sort((a, b) => b.confidence - a.confidence);

  return {
    region: allPredictions[0].label,
    confidence: allPredictions[0].confidence,
    allPredictions,
    isMock: true,
  };
}

/**
 * Loads the TensorFlow.js model once and caches it.
 * Uses pure-JS @tensorflow/tfjs — no native bindings required.
 */
async function loadModel() {
  if (cachedModel && cachedLabels) return { model: cachedModel, labels: cachedLabels };

  const tf = require('@tensorflow/tfjs');
  const metadataPath = path.join(MODEL_DIR, 'metadata.json');

  try {
    // Load model files manually via fs to avoid file:// URI issues in Node.js
    const modelJSON = JSON.parse(fs.readFileSync(MODEL_PATH, 'utf8'));
    const weightsFileName = modelJSON.weightsManifest[0].paths[0];
    const weightsPath = path.join(MODEL_DIR, weightsFileName);
    const weightData = fs.readFileSync(weightsPath);

    const modelArtifacts = {
      modelTopology: modelJSON.modelTopology,
      weightSpecs: modelJSON.weightsManifest[0].weights,
      weightData: weightData.buffer.slice(weightData.byteOffset, weightData.byteOffset + weightData.byteLength),
    };

    cachedModel = await tf.loadLayersModel(tf.io.fromMemory(modelArtifacts));

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    cachedLabels = metadata.labels.map(l => l.trim());

    console.log(`[TeachableMachine] Model loaded. Classes: ${cachedLabels.join(', ')}`);
    return { model: cachedModel, labels: cachedLabels };
  } catch (err) {
    const e = new Error(`Failed to load model: ${err.message}`);
    e.code = 'MODEL_LOAD_ERROR';
    e.statusCode = 500;
    throw e;
  }
}

/**
 * Reads an image with Jimp (pure JS, no native deps), resizes to 224x224,
 * and returns a [1, 224, 224, 3] Float32 tensor normalized to [-1, 1].
 */
async function imageToTensor(tf, imagePath) {
  const Jimp = require('jimp');
  const image = await Jimp.read(imagePath);
  image.resize(224, 224);

  const { data } = image.bitmap; // raw RGBA buffer
  const pixels = new Float32Array(224 * 224 * 3);
  let out = 0;

  for (let i = 0; i < data.length; i += 4) {
    pixels[out++] = (data[i]     / 127.5) - 1; // R
    pixels[out++] = (data[i + 1] / 127.5) - 1; // G
    pixels[out++] = (data[i + 2] / 127.5) - 1; // B
    // skip alpha (i + 3)
  }

  return tf.tensor4d(pixels, [1, 224, 224, 3]);
}

/**
 * Main entry point — classifies the uploaded image into a Thai region.
 * Falls back to mock data when model files are absent.
 */
async function classifyRegion(imagePath) {
  if (!modelExists()) return mockClassify();

  const tf = require('@tensorflow/tfjs');
  const { model, labels } = await loadModel();

  let tensor;
  let predictionTensor;

  try {
    tensor = await imageToTensor(tf, imagePath);
    predictionTensor = model.predict(tensor);
    const probabilities = await predictionTensor.data();

    const allPredictions = labels
      .map((label, i) => ({ label, confidence: probabilities[i] }))
      .sort((a, b) => b.confidence - a.confidence);

    return {
      region: allPredictions[0].label,
      confidence: allPredictions[0].confidence,
      allPredictions,
    };
  } catch (err) {
    console.error('[TeachableMachine] Inference error:', err.message);
    const e = new Error(`Model inference failed: ${err.message}`);
    e.code = 'MODEL_ERROR';
    e.statusCode = 500;
    throw e;
  } finally {
    if (tensor) tensor.dispose();
    if (predictionTensor) predictionTensor.dispose();
  }
}

module.exports = { classifyRegion, loadModel };
