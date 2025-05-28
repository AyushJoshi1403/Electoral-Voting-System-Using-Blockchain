const express = require('express');
const router = express.Router();
const Vote = require('../models/VoteModel');
const Voter = require('../models/voterModel');
const Candidate = require('../models/CandidateModel');

// Record a new vote
router.post('/', async (req, res) => {
  try {
    const { 
      electionId, 
      candidateId, 
      voterAddress, 
      transactionHash,
      blockNumber,
      gasUsed 
    } = req.body;
    
    // Check if vote with this transaction hash already exists
    const existingVote = await Vote.findOne({ transactionHash });
    if (existingVote) {
      return res.status(400).json({ error: 'Vote with this transaction hash already recorded' });
    }
    
    // Verify candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    const vote = new Vote({
      electionId,
      candidateId,
      voterAddress: voterAddress.toLowerCase(),
      transactionHash,
      blockNumber,
      gasUsed,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    const savedVote = await vote.save();
    
    // Update candidate vote count
    await Candidate.findByIdAndUpdate(candidateId, {
      $inc: { voteCount: 1 }
    });
    
    // Update voter status
    await Voter.findOneAndUpdate(
      { walletAddress: voterAddress.toLowerCase() },
      { 
        hasVoted: true, 
        votedAt: new Date(),
        $push: {
          votes: {
            electionId,
            candidateId,
            transactionHash
          }
        }
      }
    );
    
    res.status(201).json(savedVote);
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all votes for an election
router.get('/election/:electionId', async (req, res) => {
  try {
    const votes = await Vote.find({ electionId: req.params.electionId })
      .populate('candidateId', 'name party')
      .sort({ createdAt: -1 });
    
    res.json(votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get vote statistics for an election
router.get('/election/:electionId/stats', async (req, res) => {
  try {
    const totalVotes = await Vote.countDocuments({ electionId: req.params.electionId });
    
    const candidateVotes = await Vote.aggregate([
      { $match: { electionId: mongoose.Types.ObjectId(req.params.electionId) } },
      { $group: { _id: '$candidateId', count: { $sum: 1 } } },
      { $lookup: { from: 'candidates', localField: '_id', foreignField: '_id', as: 'candidate' } },
      { $unwind: '$candidate' },
      { $project: { candidateName: '$candidate.name', party: '$candidate.party', voteCount: '$count' } },
      { $sort: { voteCount: -1 } }
    ]);
    
    res.json({
      totalVotes,
      candidateVotes
    });
  } catch (error) {
    console.error('Error fetching vote stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify vote by transaction hash
router.get('/verify/:transactionHash', async (req, res) => {
  try {
    const vote = await Vote.findOne({ transactionHash: req.params.transactionHash })
      .populate('electionId candidateId');
    
    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }
    
    res.json({
      ...vote.toObject(),
      isVerified: true
    });
  } catch (error) {
    console.error('Error verifying vote:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;