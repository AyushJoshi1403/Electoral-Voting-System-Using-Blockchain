// backend/routes/elections.js
const express = require('express');
const router = express.Router();
const Election = require('../models/ElectionModel');
const Candidate = require('../models/CandidateModel');

// Get all elections
router.get('/', async (req, res) => {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });
    res.json(elections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new election (sync with blockchain)
router.post('/', async (req, res) => {
  try {
    const { blockchainId, name, description, startTime, endTime, contractAddress, createdBy } = req.body;
    
    const election = new Election({
      blockchainId,
      name,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      contractAddress,
      createdBy
    });
    
    const savedElection = await election.save();
    res.status(201).json(savedElection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get election by ID
router.get('/:id', async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }
    res.json(election);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update election
router.put('/:id', async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }
    res.json(election);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;