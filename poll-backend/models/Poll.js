// const mongoose = require('mongoose');

// const OptionSchema = new mongoose.Schema({
//   text: String,
//   image: String,
//   votes: { type: Number, default: 0 },
// });

// const PollSchema = new mongoose.Schema({
//   question: { type: String, required: true },
//   options: [OptionSchema],
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
//   createdAt: { type: Date, default: Date.now },
//   hasEnded: { type: Boolean, default: false },
// });

// PollSchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });

// module.exports = mongoose.model('Poll', PollSchema);










const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: String,
  image: String,
  votes: { type: Number, default: 0 }
});

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [optionSchema],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'open' } // open, closed, result
});

module.exports = mongoose.model('Poll', pollSchema);
