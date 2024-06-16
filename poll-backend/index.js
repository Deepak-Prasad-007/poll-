// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const pollRoutes = require('./routes/pollRoutes');

// const app = express();
// const PORT = process.env.PORT || 5000;

// mongoose.connect('mongodb://localhost:27017/pollDB', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// app.use(cors());
// app.use(bodyParser.json());
// app.use('/api/polls', pollRoutes);

// const Poll = require('./models/Poll');

// Check and update poll status
//--------------------------------------------------------------



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const pollRoutes = require('./routes/pollRoutes');
const Poll = require('./models/Poll');
const PollResult = require('./models/PollResult');

const app = express();

mongoose.connect('mongodb://localhost:27017/pollDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true, // Use the new server discovery and monitoring engine
  // Remove the useFindAndModify option
});

app.use(cors());
app.use(express.json());
app.use('/api', pollRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

// Scheduled task to close polls and save results
setInterval(async () => {
  const now = new Date();
  const polls = await Poll.find({ status: 'open', endDate: { $lte: now } });

  for (const poll of polls) {
    poll.status = 'closed';
    await poll.save();

    const pollResult = new PollResult({
      pollId: poll._id,
      question: poll.question,
      options: poll.options,
      expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    await pollResult.save();
  }
}, 60 * 1000); // Run every minute
