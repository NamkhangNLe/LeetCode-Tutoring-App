// backend/models/user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  progress: { type: Map, of: Number, default: {} }, // topic -> difficulty level
});

module.exports = mongoose.model('User', userSchema);