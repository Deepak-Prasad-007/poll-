const mongoose = require('mongoose');

const pollResultSchema = new mongoose.Schema({
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
  question: String,
  options: [{ text: String, image: String, votes: Number }],
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, expires: '24h', default: Date.now } // Automatically delete after 24 hours
});

module.exports = mongoose.model('PollResult', pollResultSchema);
