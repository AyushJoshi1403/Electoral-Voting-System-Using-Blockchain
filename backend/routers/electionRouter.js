// backend/routes/elections.js
const express = require('express');
const router = express.Router();
const Election = require('../models/ElectionModel');
const Candidate = require('../models/CandidateModel');
const Vote = require('../models/VoteModel');

// Get all elections
router.get('/', async (req, res) => {
  try {
    const elections = await Election.find()
      .sort({ createdAt: -1 })
      .populate('winner.candidateId');
    
    res.json(elections);
  } catch (error) {
    console.error('Error fetching elections:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get active election
router.get('/active', async (req, res) => {
  try {
    const activeElection = await Election.findOne({ isActive: true })
      .populate('winner.candidateId');
    
    if (!activeElection) {
      return res.status(404).json({ error: 'No active election found' });
    }
    
    res.json(activeElection);
  } catch (error) {
    console.error('Error fetching active election:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new election (sync with blockchain)
router.post('/', async (req, res) => {
  try {
    const { 
      blockchainId, 
      name, 
      description, 
      startTime, 
      endTime, 
      contractAddress, 
      createdBy,
      votingDuration,
      maxVoters
    } = req.body;
    
    // Check if election with this blockchainId already exists
    const existingElection = await Election.findOne({ blockchainId });
    if (existingElection) {
      return res.status(400).json({ error: 'Election with this blockchain ID already exists' });
    }
    
    const election = new Election({
      blockchainId,
      name,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      contractAddress,
      createdBy,
      votingDuration: votingDuration || 30,
      maxVoters
    });
    
    const savedElection = await election.save();
    res.status(201).json(savedElection);
  } catch (error) {
    console.error('Error creating election:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get election by ID
router.get('/:id', async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate('winner.candidateId');
    
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }
    
    // Get additional stats
    const candidates = await Candidate.find({ electionId: election._id });
    const totalVotes = await Vote.countDocuments({ electionId: election._id });
    
    const electionWithStats = {
      ...election.toObject(),
      candidateCount: candidates.length,
      totalVotes
    };
    
    res.json(electionWithStats);
  } catch (error) {
    console.error('Error fetching election:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update election
router.put('/:id', async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }
    
    res.json(election);
  } catch (error) {
    console.error('Error updating election:', error);
    res.status(400).json({ error: error.message });
  }
});

// Start election
router.post('/:id/start', async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      { 
        isActive: true, 
        startTime: new Date(),
        endTime: new Date(Date.now() + (req.body.duration || 30) * 60 * 1000)
      },
      { new: true }
    );
    
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }
    
    res.json(election);
  } catch (error) {
    console.error('Error starting election:', error);
    res.status(400).json({ error: error.message });
  }
});

// End election
router.post('/:id/end', async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }
    
    // Calculate winner
    const candidates = await Candidate.find({ electionId: election._id })
      .sort({ voteCount: -1 });
    
    const winner = candidates.length > 0 ? candidates[0] : null;
    
    const updatedElection = await Election.findByIdAndUpdate(
      req.params.id,
      { 
        isActive: false,
        isCompleted: true,
        endTime: new Date(),
        winner: winner ? {
          candidateId: winner._id,
          candidateName: winner.name,
          voteCount: winner.voteCount
        } : null
      },
      { new: true }
    );
    
    res.json(updatedElection);
  } catch (error) {
    console.error('Error ending election:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get election results
router.get('/:id/results', async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }
    
    const candidates = await Candidate.find({ electionId: election._id })
      .sort({ voteCount: -1 });
    
    const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);
    
    const results = {
      election,
      candidates: candidates.map(candidate => ({
        ...candidate.toObject(),
        percentage: totalVotes > 0 ? (candidate.voteCount / totalVotes * 100).toFixed(2) : 0
      })),
      totalVotes,
      winner: candidates.length > 0 ? candidates[0] : null
    };
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching election results:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete election
router.delete('/:id', async (req, res) => {
  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }
    
    // Also delete related candidates and votes
    await Candidate.deleteMany({ electionId: req.params.id });
    await Vote.deleteMany({ electionId: req.params.id });
    
    res.json({ message: 'Election deleted successfully' });
  } catch (error) {
    console.error('Error deleting election:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;