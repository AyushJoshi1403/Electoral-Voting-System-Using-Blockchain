const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  voterAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  transactionHash: {
    type: String,
    required: true,
    unique: true
  },
  blockNumber: Number,
  gasUsed: Number,
  // Verification info
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  // Additional metadata
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
voteSchema.index({ electionId: 1 });
voteSchema.index({ candidateId: 1 });
voteSchema.index({ voterAddress: 1 });
voteSchema.index({ transactionHash: 1 });

// Check if model already exists before compiling
module.exports = mongoose.models.Vote || mongoose.model('Vote', voteSchema);