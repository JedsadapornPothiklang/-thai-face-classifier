# AI Model Explanation

## Overview

This application uses **two separate AI models**, each specialized for a different prediction task.

---

## Model 1 — Google Teachable Machine (Region Classification)

### What it is
Google Teachable Machine is a no-code platform for training image classification models using transfer learning on top of MobileNet v2, a lightweight convolutional neural network pre-trained on ImageNet.

### How it was trained
1. Images of Thai faces were collected and labeled by one of four regions: Northern, Northeastern (Isan), Central, Southern
2. Uploaded to teachablemachine.withgoogle.com
3. The model was fine-tuned (transfer learning) — only the final classification layer was retrained
4. Exported as a TensorFlow.js model bundle

### How it runs in this app
- The model files (`model.json`, `weights.bin`, `metadata.json`) are stored in `backend/models/`
- On the first request, the backend loads the model into memory using `@tensorflow/tfjs-node`
- The model is **cached** — subsequent requests reuse the same loaded model (no disk I/O on every request)
- The uploaded image is decoded, resized to **224×224 pixels**, and normalized to `[-1, 1]` range
- `model.predict()` outputs a probability distribution across all 4 classes
- The class with the **highest probability** is returned as `region`

### Input/Output
```
Input:  224×224×3 RGB tensor, normalized to [-1, 1]
Output: Float32Array of length 4 (one probability per class)

Example: [0.91, 0.05, 0.03, 0.01]
         Northern  Central  NE  Southern
```

### Limitations
- The model is only as good as its training data. If training images were biased (e.g., mostly urban faces, mostly a certain age group), the model will inherit those biases
- The model predicts visual patterns in the image, not actual ancestry or ethnicity
- Regional appearance differences in Thailand are subtle and overlapping — high confidence scores do not mean certainty
- The model performs best on clear, frontal face photos with good lighting

---

## Model 2 — Microsoft Azure Face API (Age & Gender Detection)

### What it is
Azure Face API is a cloud-based computer vision service from Microsoft Cognitive Services. It detects human faces in images and can return face attributes like estimated age and gender.

### How it works
Azure uses its own proprietary deep learning models (not exposed to developers) to:
1. Detect the location of faces in the image (bounding box)
2. Analyze each detected face for requested attributes
3. Return attribute values with confidence scores

### How it's called in this app
```
POST {AZURE_ENDPOINT}/face/v1.0/detect
Headers:
  Ocp-Apim-Subscription-Key: {API_KEY}
  Content-Type: application/octet-stream
Params:
  returnFaceAttributes: age,gender
  detectionModel: detection_03
  recognitionModel: recognition_04
Body: raw image bytes
```

The backend posts the image bytes directly (not a URL) for privacy.

### Input/Output
```
Input:  Raw image bytes (JPEG/PNG/WEBP), sent as octet-stream
Output: Array of detected face objects:
[
  {
    "faceId": "...",
    "faceRectangle": { "top": 50, "left": 100, "width": 200, "height": 200 },
    "faceAttributes": {
      "age": 24.3,
      "gender": "female"
    }
  }
]
```

Only the first face is used if multiple are detected.

### Limitations
- Age is an estimate, not a measurement — accuracy varies by face angle, lighting, and makeup
- Gender classification uses binary male/female categories only — this is a limitation of the Azure API v1
- Azure may return unexpected results for very young or very old faces
- Requires an active Azure subscription and valid API key
- Subject to Azure service downtime

---

## Ethical Considerations

### What this tool is
- An **educational demonstration** of AI-based facial attribute estimation
- A probabilistic prediction system — never deterministic fact

### What this tool is NOT
- An identity verification system
- A genealogy or ancestry tool
- A race classification system
- A system accurate enough for any legal, medical, or administrative purpose

### Bias Awareness
AI models trained on face images reflect the distribution and labeling decisions of their training data. If the Teachable Machine model was trained with:
- More images from one region → that region may be over-predicted
- Images with beauty filters → may perform poorly on unfiltered photos
- Limited age/gender diversity → predictions degrade outside the training distribution

Users should be aware that **any prediction is approximate and reflects statistical patterns, not ground truth**.

### Data Privacy
- Uploaded images are processed in memory and **deleted immediately** after the request completes
- No images are stored on disk long-term
- Images are sent to Azure's API — review [Microsoft's privacy policy](https://privacy.microsoft.com) for their data handling practices

---

## Model Performance Considerations

| Factor | Impact |
|--------|--------|
| Clear frontal face | Best accuracy |
| Side profile | Reduced accuracy |
| Multiple faces | Only first face used |
| Small face in large image | May not detect |
| Heavy filters / makeup | Reduced accuracy |
| Poor lighting | Reduced accuracy |
| JPEG compression artifacts | Minor accuracy reduction |
