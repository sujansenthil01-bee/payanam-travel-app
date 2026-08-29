const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'expense_suggestion', 'split_suggestion', 'location_recommendation', 'budget_alert'],
    default: 'text'
  },
  metadata: {
    expenseId: mongoose.Schema.Types.ObjectId,
    suggestionType: String,
    actionable: Boolean
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
