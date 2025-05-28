const express = require('express');
const router = express.Router();
const Candidate = require('../models/CandidateModel');
const Election = require('../models/ElectionModel');

// Get all candidates for an election
router.get('/election/:electionId', async (req, res) => {
  try {
    const candidates = await Candidate.find({ 
      electionId: req.params.electionId,
      isActive: true 
    }).sort({ blockchainId: 1 });
    
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all candidates (for admin)
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .populate('electionId', 'name description')
      .sort({ createdAt: -1 });
    
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching all candidates:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new candidate
router.post('/', async (req, res) => {
  try {
    const candidateData = req.body;
    
    // Verify election exists
    const election = await Election.findById(candidateData.electionId);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }
    
    // Check for duplicate blockchain ID in the same election
    const existingCandidate = await Candidate.findOne({
      electionId: candidateData.electionId,
      blockchainId: candidateData.blockchainId
    });
    
    if (existingCandidate) {
      return res.status(400).json({ error: 'Candidate with this blockchain ID already exists in this election' });
    }
    
    const candidate = new Candidate(candidateData);
    const savedCandidate = await candidate.save();
    
    res.status(201).json(savedCandidate);
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get candidate by ID
router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate('electionId');
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update candidate
router.put('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json(candidate);
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update candidate vote count (called when vote is cast)
router.put('/:id/vote', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { $inc: { voteCount: 1 } },
      { new: true }
    );
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    // Also update total votes in election
    await Election.findByIdAndUpdate(
      candidate.electionId,
      { $inc: { totalVotes: 1 } }
    );
    
    res.json(candidate);
  } catch (error) {
    console.error('Error updating candidate vote count:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get candidate leaderboard for an election
router.get('/election/:electionId/leaderboard', async (req, res) => {
  try {
    const candidates = await Candidate.find({ 
      electionId: req.params.electionId,
      isActive: true 
    })
    .sort({ voteCount: -1 })
    .select('name party voteCount');
    
    const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);
    
    const leaderboard = candidates.map((candidate, index) => ({
      ...candidate.toObject(),
      rank: index + 1,
      percentage: totalVotes > 0 ? (candidate.voteCount / totalVotes * 100).toFixed(2) : 0
    }));
    
    res.json({
      leaderboard,
      totalVotes,
      totalCandidates: candidates.length
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete candidate
router.delete('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;