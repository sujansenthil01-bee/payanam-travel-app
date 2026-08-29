const express = require('express');
const router = express.Router();
const passport = require('passport');
const Trip = require('../models/Trip');
const User = require('../models/User');

// Middleware to check authentication
const authenticate = passport.authenticate('jwt', { session: false });

// Create a new trip
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, startDate, endDate, destination, budget } = req.body;

    const trip = new Trip({
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      destination,
      budget,
      owner: req.user._id,
      members: [{ userId: req.user._id, isAdmin: true }]
    });

    await trip.save();
    await trip.populate('owner', 'name email avatar');
    await trip.populate('members.userId', 'name email avatar');

    res.status(201).json({
      message: 'Trip created successfully',
      trip
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all trips for the user
router.get('/', authenticate, async (req, res) => {
  try {
    const trips = await Trip.find({
      'members.userId': req.user._id
    })
      .populate('owner', 'name email avatar')
      .populate('members.userId', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({
      trips,
      count: trips.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific trip
router.get('/:tripId', authenticate, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId)
      .populate('owner', 'name email avatar')
      .populate('members.userId', 'name email avatar')
      .populate('expenses');

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check if user is a member
    const isMember = trip.members.some(m => m.userId._id.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ error: 'You are not a member of this trip' });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update trip
router.put('/:tripId', authenticate, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (trip.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only owner can update the trip' });
    }

    const { name, description, startDate, endDate, destination, budget, status } = req.body;

    if (name) trip.name = name;
    if (description) trip.description = description;
    if (startDate) trip.startDate = new Date(startDate);
    if (endDate) trip.endDate = new Date(endDate);
    if (destination) trip.destination = destination;
    if (budget) trip.budget = budget;
    if (status) trip.status = status;

    trip.updatedAt = new Date();
    await trip.save();
    await trip.populate('owner', 'name email avatar');
    await trip.populate('members.userId', 'name email avatar');

    res.json({
      message: 'Trip updated successfully',
      trip
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete trip
router.delete('/:tripId', authenticate, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (trip.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only owner can delete the trip' });
    }

    await Trip.findByIdAndDelete(req.params.tripId);

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trip summary (for settleup)
router.get('/:tripId/summary', authenticate, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId).populate('expenses');

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const isMember = trip.members.some(m => m.userId.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ error: 'You are not a member of this trip' });
    }

    // Calculate who owes whom
    const memberBalance = {};
    trip.members.forEach(member => {
      memberBalance[member.userId] = { paid: 0, owes: 0 };
    });

    trip.expenses.forEach(expense => {
      // Add to paid amount
      memberBalance[expense.paidBy].paid += expense.amount;

      // Calculate splits
      expense.splits.forEach(split => {
        if (!memberBalance[split.userId]) {
          memberBalance[split.userId] = { paid: 0, owes: 0 };
        }
        memberBalance[split.userId].owes += split.amount;
      });
    });

    const summary = Object.entries(memberBalance).map(([userId, balance]) => ({
      userId,
      paid: balance.paid,
      owes: balance.owes,
      balance: balance.paid - balance.owes
    }));

    res.json({
      trip: {
        name: trip.name,
        totalExpenses: trip.totalSpent
      },
      memberBalance: summary
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
