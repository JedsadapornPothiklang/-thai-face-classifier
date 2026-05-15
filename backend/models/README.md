# Teachable Machine Model Files

Place your exported Teachable Machine model files here:

```
models/
├── model.json           ← Model architecture + weight manifest
├── weights.bin          ← Trained weights (may be named group1-shard1of1.bin)
└── metadata.json        ← Class labels and model metadata
```

## How to export from Teachable Machine

1. Open your project at teachablemachine.withgoogle.com
2. Click **Export Model**
3. Select **TensorFlow.js** tab
4. Click **Download my model**
5. Unzip and copy all files into this folder

## Expected metadata.json format

```json
{
  "tfjsVersion": "...",
  "tmVersion": "...",
  "packageVersion": "...",
  "packageName": "@teachablemachine/image",
  "labels": ["Northern", "Northeastern", "Central", "Southern"]
}
```

The `labels` array must match your trained classes exactly.
