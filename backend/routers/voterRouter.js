const express = require('express');
const router = express.Router();
const Voter = require('../models/VoterModel');

// Get all registered voters
router.get('/', async (req, res) => {
  try {
    const voters = await Voter.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select('-verificationDocuments'); // Exclude sensitive data
    
    res.json(voters);
  } catch (error) {
    console.error('Error fetching voters:', error);
    res.status(500).json({ error: error.message });
  }
});

// Register new voter
router.post('/', async (req, res) => {
  try {
    const { walletAddress, name, email, registeredBy } = req.body;
    
    // Check if voter already exists
    const existingVoter = await Voter.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (existingVoter) {
      return res.status(400).json({ error: 'Voter with this wallet address already registered' });
    }
    
    const voter = new Voter({
      walletAddress: walletAddress.toLowerCase(),
      name,
      email,
      registeredBy: registeredBy.toLowerCase()
    });
    
    const savedVoter = await voter.save();
    res.status(201).json(savedVoter);
  } catch (error) {
    console.error('Error registering voter:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get voter by wallet address
router.get('/address/:address', async (req, res) => {
  try {
    const voter = await Voter.findOne({ 
      walletAddress: req.params.address.toLowerCase(),
      isActive: true 
    }).populate('votes.electionId votes.candidateId');
    
    if (!voter) {
      return res.status(404).json({ error: 'Voter not found' });
    }
    
    res.json(voter);
  } catch (error) {
    console.error('Error fetching voter:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update voter status (mark as voted)
router.put('/:address/vote', async (req, res) => {
  try {
    const { candidateId, candidateBlockchainId, transactionHash, electionId } = req.body;
    
    const voter = await Voter.findOneAndUpdate(
      { walletAddress: req.params.address.toLowerCase() },
      { 
        hasVoted: true, 
        votedAt: new Date(),
        $push: {
          votes: {
            electionId,
            candidateId,
            candidateBlockchainId,
            transactionHash
          }
        }
      },
      { new: true }
    );
    
    if (!voter) {
      return res.status(404).json({ error: 'Voter not found' });
    }
    
    res.json(voter);
  } catch (error) {
    console.error('Error updating voter status:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get voter statistics
router.get('/stats', async (req, res) => {
  try {
    const totalVoters = await Voter.countDocuments({ isActive: true });
    const votedCount = await Voter.countDocuments({ hasVoted: true, isActive: true });
    const notVotedCount = totalVoters - votedCount;
    
    const stats = {
      totalVoters,
      votedCount,
      notVotedCount,
      turnoutPercentage: totalVoters > 0 ? (votedCount / totalVoters * 100).toFixed(2) : 0
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching voter stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Reset voter status (for testing)
router.put('/:address/reset', async (req, res) => {
  try {
    const voter = await Voter.findOneAndUpdate(
      { walletAddress: req.params.address.toLowerCase() },
      { 
        hasVoted: false, 
        votedAt: null,
        $unset: { votes: 1 }
      },
      { new: true }
    );
    
    if (!voter) {
      return res.status(404).json({ error: 'Voter not found' });
    }
    
    res.json(voter);
  } catch (error) {
    console.error('Error resetting voter status:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete voter
router.delete('/:address', async (req, res) => {
  try {
    const voter = await Voter.findOneAndUpdate(
      { walletAddress: req.params.address.toLowerCase() },
      { isActive: false },
      { new: true }
    );
    
    if (!voter) {
      return res.status(404).json({ error: 'Voter not found' });
    }
    
    res.json({ message: 'Voter deactivated successfully' });
  } catch (error) {
    console.error('Error deleting voter:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;