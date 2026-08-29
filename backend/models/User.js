const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: String, // hashed, optional if using Google
  name: {
    type: String,
    required: true
  },
  avatar: String,
  phone: String,
  upiId: String, // For settling up
  bankAccount: {
    accountNumber: String,
    ifscCode: String,
    accountHolder: String
  },
  preferences: {
    currency: { type: String, default: 'INR' },
    language: { type: String, default: 'en' },
    theme: { type: String, default: 'light' }
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
