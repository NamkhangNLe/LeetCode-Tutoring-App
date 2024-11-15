// backend/routes/index.js
const express = require('express');
const router = express.Router();
const { getTopicQuestions, updateUserProgress } = require('../controllers/index');

router.get('/questions/:topic', getTopicQuestions);
router.post('/progress', updateUserProgress);

module.exports = router;