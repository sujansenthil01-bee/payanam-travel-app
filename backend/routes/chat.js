const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Configuration, OpenAIApi } = require('openai');
const ChatMessage = require('../models/ChatMessage');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');

const authenticate = passport.authenticate('jwt', { session: false });

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  })
);

// Travel Buddy AI system prompt
const TRAVEL_BUDDY_SYSTEM = `You are Travel Buddy, a friendly AI assistant for expense tracking during trips. Your role is to:
1. Help users log and manage expenses
2. Suggest fair ways to split costs
3. Provide budget recommendations
4. Remind about settling payments
5. Give travel tips for India
6. Answer questions about the trip

Keep responses concise, friendly, and helpful. Use rupees (₹) for currency. Always be encouraging and make expense tracking fun!`;

// Send message to Travel Buddy
router.post('/message', authenticate, async (req, res) => {
  try {
    const { tripId, message } = req.body;

    if (!tripId || !message) {
      return res.status(400).json({ error: 'tripId and message are required' });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const isMember = trip.members.some(m => m.userId.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ error: 'You are not a member of this trip' });
    }

    // Save user message
    const userMessage = new ChatMessage({
      tripId,
      userId: req.user._id,
      sender: 'user',
      message,
      messageType: 'text'
    });
    await userMessage.save();

    // Get recent chat history for context
    const chatHistory = await ChatMessage.find({ tripId })
      .sort({ createdAt: -1 })
      .limit(10);

    // Prepare context about the trip
    const tripExpenses = await Expense.find({ tripId });
    const tripContext = `
Trip: ${trip.name}
Destination: ${trip.destination?.place}
Total Spent: ₹${trip.totalSpent}
Members: ${trip.members.length}
Status: ${trip.status}
`;

    // Build conversation for OpenAI
    const conversationMessages = [
      { role: 'system', content: TRAVEL_BUDDY_SYSTEM + '\n' + tripContext }
    ];

    // Add chat history (reverse order for chronological)
    chatHistory.reverse().forEach(msg => {
      conversationMessages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message
      });
    });

    // Add current message
    conversationMessages.push({
      role: 'user',
      content: message
    });

    // Get response from OpenAI
    const response = await openai.createChatCompletion({
      model: process.env.AI_MODEL || 'gpt-3.5-turbo',
      messages: conversationMessages,
      temperature: 0.7,
      max_tokens: 500
    });

    const aiResponse = response.data.choices[0].message.content;

    // Save AI response
    const assistantMessage = new ChatMessage({
      tripId,
      userId: req.user._id,
      sender: 'assistant',
      message: aiResponse,
      messageType: 'text'
    });
    await assistantMessage.save();

    res.json({
      message: aiResponse,
      messageId: assistantMessage._id
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to get response from Travel Buddy' });
  }
});

// Get chat history for a trip
router.get('/trip/:tripId', authenticate, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const isMember = trip.members.some(m => m.userId.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ error: 'You are not a member of this trip' });
    }

    const messages = await ChatMessage.find({ tripId: req.params.tripId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: 1 });

    res.json({
      messages,
      count: messages.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get expense suggestions from Travel Buddy
router.get('/trip/:tripId/suggestions', authenticate, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const isMember = trip.members.some(m => m.userId.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ error: 'You are not a member of this trip' });
    }

    const expenses = await Expense.find({ tripId: req.params.tripId });

    // Calculate category breakdown
    const categoryTotals = {};
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    // Generate suggestions
    const prompt = `Based on this travel expense data for a trip to ${trip.destination?.place}, provide 2-3 tips for budget management:
Trip Duration: ${Math.ceil((trip.endDate - trip.startDate) / (1000 * 60 * 60 * 24))} days
Total Spent: ₹${trip.totalSpent}
Members: ${trip.members.length}
Expenses by Category: ${JSON.stringify(categoryTotals)}

Provide practical, friendly advice.`;

    const response = await openai.createChatCompletion({
      model: process.env.AI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 300
    });

    const suggestions = response.data.choices[0].message.content;

    res.json({
      suggestions,
      expenseBreakdown: categoryTotals
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

module.exports = router;
