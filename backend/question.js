// backend/models/question.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  topic: { type: String, required: true },
  difficulty: { type: Number, required: true },
  content: { type: String, required: true },
});

module.exports = mongoose.model('Question', questionSchema);