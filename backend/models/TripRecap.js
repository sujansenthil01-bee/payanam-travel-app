const mongoose = require('mongoose');

const tripRecapSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    unique: true
  },
  totalExpenses: {
    type: Number,
    required: true
  },
  expensesByCategory: {
    accommodation: Number,
    food: Number,
    transport: Number,
    activities: Number,
    shopping: Number,
    utilities: Number,
    entertainment: Number,
    other: Number
  },
  memberBreakdown: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    totalSpent: Number,
    owes: Number,
    isOwed: Number,
    expenseCount: Number
  }],
  highlights: [String],
  bestMoments: [{
    photoUrl: String,
    caption: String,
    date: Date
  }],
  map: {
    placesVisited: [{
      name: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      date: Date
    }]
  },
  sharableLink: String,
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TripRecap', tripRecapSchema);
