const { model, Schema } = require('../connection');

const mySchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phoneNumber: { type: String, required: true },
    age: { type: Number, required: true },
    dateOfBirth: { type: Date, required: true },
    aadharNumber: { type: String, required: true },
    voterId: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, default: 'Unknown', required: true },
    pinCode: { type: Number, required: true },
    profilePicture: { type: String, default: '/file.svg' },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('users', mySchema);