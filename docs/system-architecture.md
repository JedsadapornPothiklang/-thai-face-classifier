# System Architecture

## Overview

The Thai Regional Face Classifier follows a standard client–server architecture with two independent AI sub-systems on the backend.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                  React + Vite Frontend                       │   │
│  │                                                              │   │
│  │  UploadArea ──► useImageUpload hook ──► api.js service       │   │
│  │                          │                    │              │   │
│  │                    ResultCard          axios POST /predict   │   │
│  └────────────────────────────────────────────────┬─────────────┘  │
└───────────────────────────────────────────────────┼─────────────────┘
                                                    │ HTTP multipart/form-data
                                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       NODE.JS / EXPRESS BACKEND                     │
│                                                                     │
│  ┌──────────┐    ┌─────────────────┐    ┌───────────────────────┐  │
│  │  Multer  │───►│ predictController│───►│ Promise.all([...])    │  │
│  │ (upload  │    │                 │    │                       │  │
│  │  valid.) │    └─────────────────┘    └──────┬────────────────┘  │
│  └──────────┘                                  │                   │
│                                     ┌──────────┴──────────┐        │
│                                     │                      │        │
│                           ┌─────────▼──────┐  ┌───────────▼─────┐ │
│                           │ Teachable Mach.│  │  Azure Face API │ │
│                           │   Service      │  │    Service      │ │
│                           │                │  │                 │ │
│                           │ @tfjs-node     │  │ axios → Azure   │ │
│                           │ model.json     │  │ endpoint        │ │
│                           └────────────────┘  └─────────────────┘ │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │               Global Error Handler Middleware                │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Responsibilities

### Frontend

| Component | Responsibility |
|-----------|---------------|
| `App.jsx` | Dark mode state, layout shell |
| `Home.jsx` | Orchestrates upload + results page |
| `UploadArea.jsx` | Drag-and-drop, file selection, preview |
| `ResultCard.jsx` | Renders region/age/gender results |
| `useImageUpload.js` | Upload lifecycle state (file, loading, result, error) |
| `api.js` | Single axios call to backend |
| `validation.js` | Client-side file type/size guard |

### Backend

| File | Responsibility |
|------|---------------|
| `server.js` | Starts HTTP server, loads `.env` |
| `app.js` | Mounts middleware, routes, error handler |
| `routes/predict.js` | Defines `POST /predict` route |
| `controllers/predictController.js` | Orchestrates parallel AI calls |
| `services/azureService.js` | Proxies request to Azure Cognitive Services |
| `services/teachableMachineService.js` | Loads TF model, runs inference |
| `middleware/upload.js` | Multer config + validation |
| `middleware/errorHandler.js` | Maps error codes → HTTP status |
| `utils/imageUtils.js` | Temp file deletion |

---

## Data Flow

```
1. User selects/drops an image in the browser
2. Frontend validates type and size client-side
3. User clicks "Analyze Face"
4. axios sends multipart POST to /predict
5. Multer validates and stores file in uploads/
6. predictController fires both AI services concurrently
7. azureService posts image bytes to Azure → returns { age, gender }
8. teachableMachineService runs TF inference → returns { region, confidence }
9. Controller merges results into one JSON object
10. Temp file is deleted (in finally block)
11. JSON response is sent to frontend
12. ResultCard renders all four predictions
```

---

## Security Boundaries

```
Browser                    Backend                     External
  │                           │                            │
  │  No API keys ever here    │                            │
  │  Only talks to /predict   │── AZURE_FACE_API_KEY ─────►│ Azure
  │                           │                            │
  │  File validation          │── Multer type guard        │
  │  (client-side, UX only)   │   (server-side, security)  │
```

The Azure key **never** leaves the backend process. The frontend only knows the `/predict` endpoint.
