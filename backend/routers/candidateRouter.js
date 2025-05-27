const express = require('express');
const router = express.Router();
const Candidate = require('../models/CandidateModel');

// Get all candidates for an election
router.get('/election/:electionId', async (req, res) => {
  try {
    const candidates = await Candidate.find({ electionId: req.params.electionId })
      .sort({ blockchainId: 1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new candidate
router.post('/', async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    const savedCandidate = await candidate.save();
    res.status(201).json(savedCandidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update candidate vote count
router.put('/:id/vote', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { $inc: { voteCount: 1 } },
      { new: true }
    );
    res.json(candidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;