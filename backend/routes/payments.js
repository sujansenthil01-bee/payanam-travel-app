const express = require('express');
const router = express.Router();
const passport = require('passport');
const Payment = require('../models/Payment');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');

const authenticate = passport.authenticate('jwt', { session: false });

// Create payment (mark as settled)
router.post('/', authenticate, async (req, res) => {
  try {
    const { tripId, toUser, amount, paymentMethod, reason } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const isMember = trip.members.some(m => m.userId.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ error: 'You are not a member of this trip' });
    }

    const payment = new Payment({
      tripId,
      fromUser: req.user._id,
      toUser,
      amount: parseFloat(amount),
      paymentMethod: paymentMethod || 'upi',
      reason,
      status: 'pending'
    });

    await payment.save();
    await payment.populate('fromUser', 'name email upiId');
    await payment.populate('toUser', 'name email upiId');

    res.status(201).json({
      message: 'Payment recorded successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment summary for a trip
router.get('/trip/:tripId', authenticate, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId).populate('expenses');
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const isMember = trip.members.some(m => m.userId.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ error: 'You are not a member of this trip' });
    }

    // Calculate balances
    const balances = {};
    trip.members.forEach(member => {
      balances[member.userId] = { paid: 0, owes: 0 };
    });

    trip.expenses.forEach(expense => {
      balances[expense.paidBy].paid += expense.amount;
      expense.splits.forEach(split => {
        if (!balances[split.userId]) {
          balances[split.userId] = { paid: 0, owes: 0 };
        }
        balances[split.userId].owes += split.amount;
      });
    });

    const payments = await Payment.find({ tripId: req.params.tripId })
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email');

    const summary = {
      balances,
      payments,
      pendingPayments: payments.filter(p => p.status === 'pending')
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept payment (mark as completed)
router.put('/:paymentId/accept', authenticate, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only receiver can accept payment' });
    }

    payment.status = 'completed';
    payment.completedAt = new Date();
    await payment.save();

    await payment.populate('fromUser', 'name email');
    await payment.populate('toUser', 'name email');

    res.json({
      message: 'Payment accepted',
      payment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject payment
router.put('/:paymentId/reject', authenticate, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only receiver can reject payment' });
    }

    payment.status = 'rejected';
    await payment.save();

    res.json({
      message: 'Payment rejected',
      payment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payments for a user
router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    const payments = await Payment.find({
      $or: [
        { fromUser: req.params.userId },
        { toUser: req.params.userId }
      ]
    })
      .populate('tripId', 'name')
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      payments,
      count: payments.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
