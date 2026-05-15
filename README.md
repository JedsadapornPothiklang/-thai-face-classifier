# Thai Regional Face Classifier

A full-stack web application that uses AI to estimate a person's Thai regional background, age, and gender from an uploaded face image.

> **Important Disclaimer:** All predictions are probabilistic estimates for educational and research purposes only. This tool does not make definitive identity claims and should not be used for discriminatory purposes.

---

## Features

- **Image Upload** — Drag & drop or click-to-upload interface
- **Face Detection** — Detects whether a face exists in the image
- **Thai Region Estimation** — Predicts one of four regions: Northern, Northeastern (Isan), Central, or Southern using Google Teachable Machine
- **Age & Gender Estimation** — Uses Microsoft Azure Face API
- **Confidence Visualization** — Displays prediction confidence as a percentage bar
- **Dark Mode** — Full dark/light mode support
- **Error Handling** — User-friendly messages for all failure cases

---

## Tech Stack

| Layer     | Technology                                |
|-----------|-------------------------------------------|
| Frontend  | React 18, Vite, TailwindCSS               |
| Backend   | Node.js, Express                          |
| Region AI | Google Teachable Machine (TensorFlow.js)  |
| Face AI   | Microsoft Azure Face API                  |
| Upload    | Multer (multipart/form-data)              |

---

## System Architecture

```
User Browser
     │
     │  POST /predict (multipart image)
     ▼
┌─────────────────────────────────┐
│         Express Backend          │
│                                  │
│  ┌─────────────┐                 │
│  │   Multer    │  ← validates    │
│  │  Middleware │    file type    │
│  └──────┬──────┘                 │
│         │                        │
│  ┌──────▼──────────────────┐     │
│  │   Predict Controller    │     │
│  └──────┬──────────────────┘     │
│         │                        │
│    ┌────┴────┐                   │
│    │         │                   │
│  ┌─▼──┐  ┌──▼────────────────┐  │
│  │ TM │  │  Azure Face API   │  │
│  │ AI │  │  (age + gender)   │  │
│  └─┬──┘  └──────────┬────────┘  │
│    │                 │           │
│    └────────┬────────┘           │
│             │                    │
│  ┌──────────▼──────────────┐     │
│  │   Combined JSON Result  │     │
│  └─────────────────────────┘     │
└─────────────────────────────────┘
     │
     │  { region, confidence, age, gender }
     ▼
React Frontend (displays result cards)
```

---

## AI Workflow

### Teachable Machine (Region Prediction)
1. The model is pre-trained in Google Teachable Machine with Thai face images categorized into 4 regions
2. The exported model files (`model.json`, `weights.bin`, `metadata.json`) are placed in `backend/models/`
3. The backend loads the model once using `@tensorflow/tfjs-node`
4. Uploaded images are preprocessed (resized to 224×224, normalized) and fed to the model
5. The class with the highest probability becomes the predicted region

### Azure Face API (Age & Gender)
1. The uploaded image is forwarded from the backend to Azure's Cognitive Services endpoint
2. The API returns face bounding boxes along with attributes: `age` and `gender`
3. Only the first detected face is used for predictions
4. If no face is detected, the API returns a "no face found" error

---

## Folder Structure

```
thai-face-classifier/
├── README.md
├── .env.example
├── docs/
│   ├── system-architecture.md
│   ├── api-flow.md
│   └── ai-model-explanation.md
│
├── backend/
│   ├── server.js               ← Entry point
│   ├── app.js                  ← Express app setup
│   ├── package.json
│   ├── controllers/
│   │   └── predictController.js
│   ├── routes/
│   │   └── predict.js
│   ├── services/
│   │   ├── azureService.js     ← Azure Face API calls
│   │   └── teachableMachineService.js ← TM model inference
│   ├── middleware/
│   │   ├── upload.js           ← Multer config
│   │   └── errorHandler.js     ← Global error handler
│   ├── utils/
│   │   └── imageUtils.js       ← File cleanup helpers
│   ├── models/                 ← Place TM model files here
│   │   └── README.md
│   └── uploads/                ← Temporary upload storage
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        │   ├── Header.jsx
        │   ├── UploadArea.jsx
        │   ├── ResultCard.jsx
        │   ├── ConfidenceBar.jsx
        │   ├── LoadingSpinner.jsx
        │   └── ErrorMessage.jsx
        ├── pages/
        │   └── Home.jsx
        ├── services/
        │   └── api.js
        ├── hooks/
        │   └── useImageUpload.js
        └── utils/
            └── validation.js
```

---

## Installation Guide

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher
- A Microsoft Azure account with Face API enabled
- A trained Google Teachable Machine image model (exported as TensorFlow.js)

---

### Step 1 — Clone / Download the Project

```bash
# If using Git
git clone <your-repo-url>
cd thai-face-classifier

# Or just navigate to your project folder
cd "C:\Users\oakje\OneDrive\Desktop\AI project"
```

---

### Step 2 — Environment Variable Setup

Copy the example env file and fill in your credentials:

```bash
cp .env.example backend/.env
```

Open `backend/.env` and set the following values:

```env
PORT=5000
AZURE_FACE_ENDPOINT=https://<your-resource>.cognitiveservices.azure.com
AZURE_FACE_API_KEY=your_azure_key_here
ALLOWED_ORIGIN=http://localhost:5173
```

> Never commit `.env` to version control. It is already in `.gitignore`.

---

### Step 3 — Azure Face API Setup

1. Go to [portal.azure.com](https://portal.azure.com)
2. Create a new resource → Search for **"Face"**
3. Select the **Free (F0)** tier for development
4. After creation, go to **Keys and Endpoint**
5. Copy **Key 1** → paste as `AZURE_FACE_API_KEY`
6. Copy **Endpoint** → paste as `AZURE_FACE_ENDPOINT`

---

### Step 4 — Teachable Machine Model Setup

1. Go to [teachablemachine.withgoogle.com](https://teachablemachine.withgoogle.com)
2. Open your trained image classification project
3. Click **Export Model** → Choose **TensorFlow.js** → **Download**
4. Unzip the downloaded file — you should have:
   - `model.json`
   - `weights.bin` (may be multiple shards like `group1-shard1of1.bin`)
   - `metadata.json`
5. Copy all these files into `backend/models/`

Your `backend/models/` should look like:
```
backend/models/
├── model.json
├── weights.bin        (or group1-shard1of1.bin, etc.)
└── metadata.json
```

The `metadata.json` must contain a `labels` array matching your 4 regions:
```json
{
  "labels": ["Northern", "Northeastern", "Central", "Southern"]
}
```

---

### Step 5 — Backend Setup

```bash
cd backend
npm install
npm run dev      # Development with nodemon
# or
npm start        # Production
```

The backend runs at: `http://localhost:5000`

---

### Step 6 — Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at: `http://localhost:5173`

---

## API Endpoint Documentation

### `POST /predict`

Accepts a multipart form upload and returns AI predictions.

**Request:**
```
Content-Type: multipart/form-data
Body: image (file field)
```

**Supported formats:** JPEG, JPG, PNG, WEBP  
**Max file size:** 4MB

**Success Response (200):**
```json
{
  "region": "Northern",
  "confidence": 0.91,
  "age": 24,
  "gender": "Female",
  "allRegionPredictions": [
    { "label": "Northern", "confidence": 0.91 },
    { "label": "Central", "confidence": 0.05 },
    { "label": "Northeastern", "confidence": 0.03 },
    { "label": "Southern", "confidence": 0.01 }
  ]
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `NO_IMAGE` | No image file was provided |
| 400 | `INVALID_FORMAT` | File must be JPEG, PNG, or WEBP |
| 400 | `FILE_TOO_LARGE` | File size exceeds 4MB limit |
| 422 | `NO_FACE_DETECTED` | No face was detected in the image |
| 500 | `AZURE_ERROR` | Azure Face API request failed |
| 500 | `MODEL_ERROR` | Teachable Machine model inference failed |
| 500 | `SERVER_ERROR` | Unexpected internal server error |

---

## Example Request (cURL)

```bash
curl -X POST http://localhost:5000/predict \
  -F "image=@/path/to/face.jpg"
```

---

## Error Handling Explanation

The system handles errors at multiple levels:

1. **Upload Validation** (Multer middleware) — Checks file type and size before the controller even runs
2. **Face Detection** — Azure returns an empty array if no face is found; we convert this to a 422 error
3. **Model Errors** — TensorFlow inference errors are caught and returned as 500
4. **Network Errors** — Azure API timeouts or credential errors are caught and returned with descriptive messages
5. **Global Handler** — Any unhandled error falls through to the global Express error handler

---

## Security Notes

- Azure API key is stored only in `backend/.env` — never sent to the browser
- The backend acts as a proxy; the frontend never touches Azure directly
- Uploaded files are deleted from disk immediately after processing
- File type validation uses both MIME type and file extension checks
- CORS is restricted to `ALLOWED_ORIGIN` only
- Multer limits file size to 4MB to prevent abuse
- Basic rate limiting (100 requests per 15 minutes per IP) is applied to the `/predict` endpoint

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Cannot find module '@tensorflow/tfjs-node'` | Run `npm install` in the backend folder |
| `AZURE_FACE_API_KEY not set` | Check your `backend/.env` file exists and has the correct key |
| `No face detected` | Try a clearer, well-lit frontal face photo |
| `Model files not found` | Make sure `model.json`, `weights.bin`, and `metadata.json` are in `backend/models/` |
| `CORS error in browser` | Ensure `ALLOWED_ORIGIN` in `.env` matches your frontend URL exactly |
| `Port already in use` | Change `PORT` in `.env` or kill the process on that port |
| TF native addon warning | Run `npm rebuild @tensorflow/tfjs-node --build-addon-from-source` |

---

## Deployment Guide

### Backend (e.g., Railway, Render, Heroku)
1. Push your `backend/` folder to a Git repo
2. Set environment variables in the platform dashboard (same as `.env`)
3. Set start command to: `node server.js`
4. Upload model files to the deployment or use a cloud storage URL

### Frontend (e.g., Vercel, Netlify)
1. Push your `frontend/` folder to a Git repo
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variable: `VITE_API_URL=https://your-backend-url.com`

---

## Future Improvements

- [ ] Add support for camera capture (webcam input)
- [ ] Support multiple face detection in one image
- [ ] Add dialect/language region mapping as educational content
- [ ] Improve model accuracy with more diverse training data
- [ ] Add image compression before upload to reduce bandwidth
- [ ] Implement user authentication and prediction history
- [ ] Add localization support (Thai / English)
- [ ] Export results as PDF report
- [ ] Add explainability visualization (Grad-CAM heatmaps)

---

## License

This project is for educational and research purposes only. Predictions are probabilistic estimates and must not be used for identity verification, discrimination, or any harmful purpose.
