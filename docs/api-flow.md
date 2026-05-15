# API Flow Documentation

## Endpoint: `POST /predict`

This is the only public endpoint. It accepts a multipart image upload and returns combined AI predictions.

---

## Request Journey (Step by Step)

```
Client                   Express              Multer             predictController
  │                         │                   │                       │
  │── POST /predict ────────►│                   │                       │
  │   Content-Type:         │                   │                       │
  │   multipart/form-data   │                   │                       │
  │                         │─── runs upload ───►│                       │
  │                         │   middleware       │                       │
  │                         │                   │ validate MIME + ext   │
  │                         │                   │ validate size ≤4MB    │
  │                         │                   │ save to uploads/      │
  │                         │                   │────────────────────────►│
  │                         │                   │   req.file.path       │
  │                         │                   │                       │
  │                         │                   │         Promise.all([azureService, tmService])
  │                         │                   │                       │─────────────────────────►
  │                         │                   │                   Azure API  +  TF Model
  │                         │                   │                       │◄─────────────────────────
  │                         │                   │         deleteFile(req.file.path)
  │                         │                   │                       │
  │◄── 200 JSON ────────────◄────────────────────◄───────────────────────│
```

---

## Response Shape

### Success — HTTP 200

```json
{
  "region": "Northern",
  "confidence": 0.9143,
  "age": 24,
  "gender": "Female",
  "allRegionPredictions": [
    { "label": "Northern",     "confidence": 0.9143 },
    { "label": "Central",      "confidence": 0.0521 },
    { "label": "Northeastern", "confidence": 0.0289 },
    { "label": "Southern",     "confidence": 0.0047 }
  ]
}
```

### Error — HTTP 4xx / 5xx

```json
{
  "error": "NO_FACE_DETECTED",
  "message": "No face was detected in the uploaded image."
}
```

---

## Error Code Reference

| HTTP | `error` code | When it occurs |
|------|--------------|----------------|
| 400 | `NO_IMAGE` | No `image` field in the multipart body |
| 400 | `INVALID_FORMAT` | File is not JPEG/PNG/WEBP |
| 400 | `FILE_TOO_LARGE` | File exceeds 4 MB |
| 422 | `NO_FACE_DETECTED` | Azure found no faces in the image |
| 500 | `AZURE_CONFIG_ERROR` | `AZURE_FACE_ENDPOINT` or `AZURE_FACE_API_KEY` not set |
| 502 | `AZURE_ERROR` | Azure API returned an error or timed out |
| 500 | `MODEL_NOT_FOUND` | `model.json` missing from `backend/models/` |
| 500 | `MODEL_LOAD_ERROR` | TensorFlow failed to parse the model |
| 500 | `MODEL_ERROR` | TF inference threw during prediction |
| 429 | `RATE_LIMIT` | IP exceeded 100 requests per 15 minutes |
| 500 | `SERVER_ERROR` | Any other unhandled error |

---

## Azure Face API Sub-Flow

```
predictController
        │
        │── readFileSync(imagePath) → Buffer
        │
        │── axios.post(
        │     `${AZURE_ENDPOINT}/face/v1.0/detect`,
        │     imageBuffer,
        │     headers: { 'Ocp-Apim-Subscription-Key': KEY,
        │                'Content-Type': 'application/octet-stream' }
        │     params: { returnFaceAttributes: 'age,gender' }
        │   )
        │
        │── response.data = [ { faceId, faceAttributes: { age, gender } } ]
        │
        └── returns { age: Math.round(...), gender: "Male"|"Female" }
```

---

## Teachable Machine Sub-Flow

```
predictController
        │
        │── loadModel() (cached after first call)
        │       │── tf.loadLayersModel('file://backend/models/model.json')
        │       └── parse metadata.json → labels[]
        │
        │── imageToTensor(imagePath)
        │       │── tf.node.decodeImage(buffer, 3)
        │       │── resizeBilinear([224, 224])
        │       │── expandDims(0)
        │       └── div(127.5).sub(1)   ← normalize to [-1, 1]
        │
        │── model.predict(tensor) → Float32Array
        │
        │── map probabilities → [{ label, confidence }]
        │
        └── sort descending → top prediction is result.region
```

---

## CORS Policy

```
Origin allowed: process.env.ALLOWED_ORIGIN (default: http://localhost:5173)
Methods: GET, POST
```

Any request from a different origin is rejected by the browser's preflight check.

---

## Rate Limiting

```
Window:  15 minutes
Max:     100 requests per IP
Headers: RateLimit-* (standard headers)
```

When exceeded, returns HTTP 429 with `{ "error": "RATE_LIMIT", "message": "..." }`.
