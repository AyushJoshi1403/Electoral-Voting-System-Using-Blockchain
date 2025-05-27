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

module.exports = mongoose.model('Candidate', candidateSchema);