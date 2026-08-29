const express = require('express');
const router = express.Router();
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const TripRecap = require('../models/TripRecap');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');

const authenticate = passport.authenticate('jwt', { session: false });

// Generate trip recap
router.post('/generate/:tripId', authenticate, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId)
      .populate('expenses')
      .populate('members.userId', 'name email avatar');

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (trip.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only trip owner can generate recap' });
    }

    // Calculate total and by category
    const expensesByCategory = {
      accommodation: 0,
      food: 0,
      transport: 0,
      activities: 0,
      shopping: 0,
      utilities: 0,
      entertainment: 0,
      other: 0
    };

    trip.expenses.forEach(exp => {
      expensesByCategory[exp.category] += exp.amount;
    });

    // Calculate member breakdown
    const memberBreakdown = {};
    trip.members.forEach(member => {
      memberBreakdown[member.userId._id] = {
        userId: member.userId._id,
        name: member.userId.name,
        totalSpent: 0,
        owes: 0,
        isOwed: 0,
        expenseCount: 0
      };
    });

    trip.expenses.forEach(exp => {
      memberBreakdown[exp.paidBy].totalSpent += exp.amount;
      memberBreakdown[exp.paidBy].expenseCount += 1;

      exp.splits.forEach(split => {
        if (memberBreakdown[split.userId]) {
          memberBreakdown[split.userId].owes += split.amount;
        }
      });
    });

    // Convert to array and calculate balances
    const memberSummary = Object.values(memberBreakdown).map(member => ({
      ...member,
      balance: member.totalSpent - member.owes
    }));

    // Generate highlights
    const highlights = [];
    const maxExpense = trip.expenses.reduce((max, exp) => exp.amount > max.amount ? exp : max, trip.expenses[0] || {});
    if (maxExpense.description) {
      highlights.push(`Highest expense: ${maxExpense.description} (₹${maxExpense.amount})`);
    }

    const foodTotal = expensesByCategory.food;
    if (foodTotal > 0) {
      highlights.push(`Food expenses: ₹${foodTotal}`);
    }

    const activitiesTotal = expensesByCategory.activities;
    if (activitiesTotal > 0) {
      highlights.push(`Activities & entertainment: ₹${activitiesTotal}`);
    }

    highlights.push(`Trip completed with ${trip.members.length} members`);

    // Create recap
    let recap = await TripRecap.findOne({ tripId: req.params.tripId });

    if (!recap) {
      recap = new TripRecap({
        tripId: req.params.tripId,
        sharableLink: `${process.env.FRONTEND_URL}/recap/${uuidv4()}`,
        totalExpenses: trip.totalSpent,
        expensesByCategory,
        memberBreakdown: memberSummary,
        highlights
      });
    } else {
      recap.totalExpenses = trip.totalSpent;
      recap.expensesByCategory = expensesByCategory;
      recap.memberBreakdown = memberSummary;
      recap.highlights = highlights;
    }

    await recap.save();

    res.json({
      message: 'Trip recap generated successfully',
      recap
    });
  } catch (error) {
    console.error('Recap error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get trip recap
router.get('/:tripId', authenticate, async (req, res) => {
  try {
    const recap = await TripRecap.findOne({ tripId: req.params.tripId });

    if (!recap) {
      return res.status(404).json({ error: 'Recap not found. Generate it first.' });
    }

    res.json(recap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get public recap by share link
router.get('/share/:recapId', async (req, res) => {
  try {
    // You could use the sharableLink instead of recapId
    const recap = await TripRecap.findById(req.params.recapId)
      .populate({
        path: 'tripId',
        select: 'name destination startDate endDate'
      });

    if (!recap) {
      return res.status(404).json({ error: 'Recap not found' });
    }

    // Convert to public format
    const publicRecap = {
      trip: {
        name: recap.tripId.name,
        destination: recap.tripId.destination,
        startDate: recap.tripId.startDate,
        endDate: recap.tripId.endDate
      },
      totalExpenses: recap.totalExpenses,
      expensesByCategory: recap.expensesByCategory,
      highlights: recap.highlights,
      bestMoments: recap.bestMoments
    };

    res.json(publicRecap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add photo to recap highlights
router.post('/:tripId/photo', authenticate, async (req, res) => {
  try {
    const { photoUrl, caption } = req.body;

    const recap = await TripRecap.findOne({ tripId: req.params.tripId });
    if (!recap) {
      return res.status(404).json({ error: 'Recap not found. Generate it first.' });
    }

    recap.bestMoments.push({
      photoUrl,
      caption,
      date: new Date()
    });

    await recap.save();

    res.json({
      message: 'Photo added to trip recap',
      recap
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trip statistics
router.get('/:tripId/stats', authenticate, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId).populate('expenses');

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const isMember = trip.members.some(m => m.userId.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ error: 'You are not a member of this trip' });
    }

    const stats = {
      totalExpenses: trip.totalSpent,
      expenseCount: trip.expenses.length,
      avgExpense: trip.expenses.length > 0 ? Math.round(trip.totalSpent / trip.expenses.length * 100) / 100 : 0,
      memberCount: trip.members.length,
      dayCount: Math.ceil((trip.endDate - trip.startDate) / (1000 * 60 * 60 * 24)),
      perDayAverage: Math.round(trip.totalSpent / Math.ceil((trip.endDate - trip.startDate) / (1000 * 60 * 60 * 24)) * 100) / 100,
      perPersonAverage: Math.round(trip.totalSpent / trip.members.length * 100) / 100
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
