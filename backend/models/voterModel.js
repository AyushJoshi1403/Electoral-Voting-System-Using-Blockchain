const { model, Schema } = require('../connection');

const mySchema = new Schema({
    id: string,                      // Unique voter ID (hashed from government ID)
    publicKey: string,               // Voter's public key for verification
    votingDistrict: string,          // Electoral district/precinct identifier
    votingStatus: VotingStatus,      // Current voting status
    nonce: string,                   // One-time use value to prevent replay attacks
    registrationTimestamp: number,   // When voter was registered on the blockchain
    lastAuthTimestamp: number        // Last authentication timestamp
});

module.exports = model('voters', mySchema);