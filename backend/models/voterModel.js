const { model, Schema } = require('../connection');

const mySchema = new Schema({
    voterId: String,                      // Unique voter ID (hashed from government ID)
    publicKey: String,               // Voter's public key for verification
    votingDistrict: String,          // Electoral district/precinct identifier
    votingStatus: String,            // Current voting status
    nonce: String,                   // One-time use value to prevent replay attacks
    registrationTimestamp: Number,   // When voter was registered on the blockchain
    lastAuthTimestamp: Number    // Last authentication timestamp
});

module.exports = model('voters', mySchema);