const { model, Schema } = require('../connection');

const mySchema = new Schema({
    voterId: { type: String, unique: true, required: true },                        // Unique voter ID (hashed from government ID)
    publicKey: { type: String, required: true },                                    // Voter's public key for verification
    votingDistrict: { type: String, required: true },                               // Electoral district/precinct identifier
    votingStatus: { type: String, enum: ['not_voted', 'voted'], required: true },   // Current voting status
    nonce: { type: String, required: true },                                        // One-time use value to prevent replay attacks
    registrationTimestamp: { type: Date, default: Date.now },                       // When voter was registered on the blockchain
    lastAuthTimestamp: { type: Date }                                               // Last authentication timestamp
});

module.exports = model('voters', mySchema);