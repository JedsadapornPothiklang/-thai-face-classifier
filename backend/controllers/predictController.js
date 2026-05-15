const { detectFace } = require('../services/azureService');
const { classifyRegion } = require('../services/teachableMachineService');
const { analyzeWithDeepFace } = require('../services/deepfaceService');
const { deleteFile } = require('../utils/imageUtils');

/**
 * POST /predict
 * Runs both AI models against the uploaded image and returns combined results.
 */
async function predict(req, res, next) {
  const filePath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'NO_IMAGE', message: 'No image file was provided.' });
    }

    // Azure validates face exists, DeepFace gets age/gender, TM classifies region
    await detectFace(filePath);

    const [regionResult, faceResult] = await Promise.all([
      classifyRegion(filePath),
      analyzeWithDeepFace(filePath),
    ]);

    return res.json({
      region: regionResult.region,
      confidence: parseFloat(regionResult.confidence.toFixed(4)),
      age: faceResult.age,
      gender: faceResult.gender,
      allRegionPredictions: regionResult.allPredictions,
    });
  } catch (err) {
    next(err);
  } finally {
    // Always clean up the temp upload regardless of success/failure
    if (filePath) deleteFile(filePath);
  }
}

module.exports = { predict };
