// backend/controllers/index.js
const User = require('../models/user');
const Question = require('../models/question');

exports.getTopicQuestions = async (req, res) => {
  const { topic } = req.params;
  const userId = req.query.userId;

  try {
    const user = await User.findById(userId);
    const difficulty = user.progress.get(topic) || 1;
    const questions = await Question.find({ topic, difficulty });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};