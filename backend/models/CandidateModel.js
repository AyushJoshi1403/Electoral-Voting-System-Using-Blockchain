// backend/models/Candidate.js
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  blockchainId: {
    type: Number,
    required: true
  },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  electionBlockchainId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  party: {
    type: String,
    required: true
  },
  description: String,
  imageUrl: String,
  voteCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for unique candidates per election
candidateSchema.index({ electionId: 1, blockchainId: 1 }, { unique: true });
candidateSchema.index({ electionBlockchainId: 1, blockchainId: 1 });

// Check if model already exists before compiling
module.exports = mongoose.models.Candidate || mongoose.model('Candidate', candidateSchema);