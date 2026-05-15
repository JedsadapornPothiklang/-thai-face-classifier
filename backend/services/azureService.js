const axios = require('axios');
const fs = require('fs');

/**
 * Sends the image to Azure Face API and returns { age, gender }.
 * Throws a structured error if no face is detected or the API fails.
 */
async function detectFace(imagePath) {
  const endpoint = process.env.AZURE_FACE_ENDPOINT;
  const apiKey = process.env.AZURE_FACE_API_KEY;

  if (!endpoint || !apiKey) {
    const err = new Error('Azure Face API credentials are not configured.');
    err.code = 'AZURE_CONFIG_ERROR';
    err.statusCode = 500;
    throw err;
  }

  const imageBuffer = fs.readFileSync(imagePath);

  let response;
  try {
    response = await axios.post(
      `${endpoint}/face/v1.0/detect`,
      imageBuffer,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-Type': 'application/octet-stream',
        },
        params: {
          detectionModel: 'detection_01',
          recognitionModel: 'recognition_04',
        },
        timeout: 15000,
      }
    );
  } catch (axiosErr) {
    const status = axiosErr.response?.status;
    const message = axiosErr.response?.data?.error?.message || axiosErr.message;

    console.error('[Azure DEBUG] Status:', status);
    console.error('[Azure DEBUG] Full response:', JSON.stringify(axiosErr.response?.data, null, 2));

    const err = new Error(`Azure Face API error: ${message}`);
    err.code = 'AZURE_ERROR';
    err.statusCode = status || 502;
    throw err;
  }

  const faces = response.data;

  if (!Array.isArray(faces) || faces.length === 0) {
    const err = new Error('No face was detected in the uploaded image.');
    err.code = 'NO_FACE_DETECTED';
    err.statusCode = 422;
    throw err;
  }

  return { age: null, gender: null };
}

module.exports = { detectFace };
