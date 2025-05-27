const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: String,
  email: String,
  hasVoted: {
    type: Boolean,
    default: false
  },
  votedAt: Date,
  registeredBy: {
    type: String, // admin wallet address
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Voter', voterSchema);