// const express = require('express');
// const Poll = require('../models/Poll');

// const router = express.Router();

// // Create a poll
// router.post('/', async (req, res) => {
//   try {
//     const { question, options, startDate, endDate } = req.body;
//     const poll = new Poll({ question, options, startDate, endDate });
//     await poll.save();
//     res.status(201).json(poll);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get all polls
// router.get('/', async (req, res) => {
//   try {
//     const polls = await Poll.find();
//     res.status(200).json(polls);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Vote on a poll
// router.post('/:id/vote', async (req, res) => {
//   try {
//     const poll = await Poll.findById(req.params.id);
//     if (!poll) {
//       return res.status(404).json({ message: 'Poll not found' });
//     }

//     const optionIndex = req.body.optionIndex;
//     if (poll.options[optionIndex]) {
//       poll.options[optionIndex].votes += 1;
//       await poll.save();
//       res.json(poll);
//     } else {
//       res.status(400).json({ message: 'Invalid option index' });
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;











const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const PollResult = require('../models/PollResult');

// Create a new poll
router.post('/polls', async (req, res) => {
  try {
    const poll = new Poll(req.body);
    await poll.save();
    res.status(201).send(poll);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all polls
router.get('/polls', async (req, res) => {
  try {
    const polls = await Poll.find({ status: 'open' });
    res.send(polls);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Vote on a poll
router.post('/polls/:id/vote', async (req, res) => {
  const { id } = req.params;
  const { optionIndex } = req.body;

  try {
    const poll = await Poll.findById(id);

    if (!poll || poll.status !== 'open') {
      return res.status(404).send({ message: 'Poll not found or closed' });
    }

    if (new Date() > new Date(poll.endDate)) {
      poll.status = 'closed';
      await poll.save();
      return res.status(400).send({ message: 'Poll has ended' });
    }

    poll.options[optionIndex].votes += 1;
    await poll.save();

    res.send(poll);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get poll results
router.get('/polls/:id/results', async (req, res) => {
  const { id } = req.params;

  try {
    const pollResult = await PollResult.findOne({ pollId: id });

    if (!pollResult) {
      return res.status(404).send({ message: 'Poll result not found' });
    }

    res.send(pollResult);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Close poll and save result
router.post('/polls/:id/close', async (req, res) => {
  const { id } = req.params;

  try {
    const poll = await Poll.findById(id);

    if (!poll || poll.status !== 'open') {
      return res.status(404).send({ message: 'Poll not found or already closed' });
    }

    poll.status = 'closed';
    await poll.save();

    const pollResult = new PollResult({
      pollId: poll._id,
      question: poll.question,
      options: poll.options,
      expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    await pollResult.save();

    res.send(pollResult);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
