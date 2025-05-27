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
    required: true
  },
  description: {
    type: String,
    required: true
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
    required: true
  },
  createdBy: {
    type: String, // wallet address
    required: true
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  voters: [{
    walletAddress: String,
    transactionHash: String,
    votedAt: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Election', electionSchema);