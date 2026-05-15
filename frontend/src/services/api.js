import axios from 'axios';

// In development, Vite proxies /predict to localhost:5000.
// In production, set VITE_API_URL to your deployed backend URL.
const BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Sends the image file to the backend /predict endpoint.
 * Returns the parsed JSON result or throws an error with a code field.
 */
export async function predictFace(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const { data } = await axios.post(`${BASE_URL}/predict`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'ngrok-skip-browser-warning': 'true',
      },
      timeout: 120000,
    });
    return data;
  } catch (err) {
    if (err.response?.data) {
      // Backend returned a structured error — rethrow it as-is
      throw err.response.data;
    }
    if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
      throw { code: 'NETWORK_ERROR', message: 'Cannot connect to the backend server.' };
    }
    throw { code: 'SERVER_ERROR', message: err.message || 'Unexpected error.' };
  }
}
