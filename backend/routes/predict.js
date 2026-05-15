const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { predict } = require('../controllers/predictController');

// POST /predict  — accepts a single "image" field
router.post('/', upload.single('image'), predict);

module.exports = router;
