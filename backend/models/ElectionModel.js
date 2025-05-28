// backend/models/Election.js
const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  blockchainId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  contractAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  createdBy: {
    type: String, // wallet address
    required: true,
    lowercase: true
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  voters: [{
    walletAddress: {
      type: String,
      lowercase: true
    },
    transactionHash: String,
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Additional metadata
  maxVoters: {
    type: Number,
    default: null
  },
  votingDuration: {
    type: Number, // in minutes
    default: 30
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  winner: {
    candidateId: mongoose.Schema.Types.ObjectId,
    candidateName: String,
    voteCount: Number
  }
}, {
  timestamps: true
});

// Indexes
electionSchema.index({ blockchainId: 1 });
electionSchema.index({ isActive: 1 });
electionSchema.index({ createdBy: 1 });

// Check if model already exists before compiling
module.exports = mongoose.models.Election || mongoose.model('Election', electionSchema);