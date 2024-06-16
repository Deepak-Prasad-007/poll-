const Poll = require('../models/Poll');

exports.createPoll = async (req, res) => {
  const { question, options, startDate, endDate } = req.body;
  const poll = new Poll({
    question,
    options,
    startDate,
    endDate,
    resultDisplayedUntil: new Date(endDate.getTime() + 24 * 60 * 60 * 1000),
  });
  try {
    await poll.save();
    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ error: 'Error creating poll' });
  }
};

exports.getPolls = async (req, res) => {
  try {
    const polls = await Poll.find({
      $or: [
        { endDate: { $gte: new Date() } },
        { resultDisplayedUntil: { $gte: new Date() } },
      ],
    });
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching polls' });
  }
};

exports.votePoll = async (req, res) => {
  const { pollId, optionIndex } = req.body;
  try {
    const poll = await Poll.findById(pollId);
    if (poll.endDate < new Date()) {
      return res.status(400).json({ error: 'Poll has ended' });
    }
    poll.options[optionIndex].votes += 1;
    await poll.save();
    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({ error: 'Error voting on poll' });
  }
};
