const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  hasVoted: {
    type: Boolean,
    default: false
  },
  votedAt: {
    type: Date
  },
  registeredBy: {
    type: String, // admin wallet address
    required: true,
    lowercase: true
  },
  // Vote history
  votes: [{
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Election'
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate'
    },
    candidateBlockchainId: Number,
    transactionHash: String,
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  // Additional voter verification info
  idVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [String]
}, {
  timestamps: true
});

// Indexes
voterSchema.index({ walletAddress: 1 });
voterSchema.index({ hasVoted: 1 });
voterSchema.index({ registeredBy: 1 });

// Check if model already exists before compiling
module.exports = mongoose.models.Voter || mongoose.model('Voter', voterSchema);