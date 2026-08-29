const express = require('express');
const router = express.Router();
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const Invite = require('../models/Invite');
const Trip = require('../models/Trip');
const User = require('../models/User');

const authenticate = passport.authenticate('jwt', { session: false });

// Create invite link
router.post('/', authenticate, async (req, res) => {
  try {
    const { tripId, maxUses, expiryDays } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check if user is trip owner
    if (trip.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only trip owner can create invites' });
    }

    const inviteCode = uuidv4().slice(0, 8).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (expiryDays || 7));

    const invite = new Invite({
      tripId,
      inviteCode,
      invitedBy: req.user._id,
      expiresAt,
      maxUses: maxUses || null,
      isActive: true
    });

    await invite.save();

    const inviteLink = `${process.env.FRONTEND_URL}/join-trip/${inviteCode}`;

    res.status(201).json({
      message: 'Invite created successfully',
      invite: {
        inviteCode,
        inviteLink,
        expiresAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept invite
router.post('/accept/:inviteCode', authenticate, async (req, res) => {
  try {
    const invite = await Invite.findOne({ inviteCode: req.params.inviteCode });

    if (!invite) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }

    if (!invite.isActive) {
      return res.status(400).json({ error: 'Invite is no longer active' });
    }

    if (new Date() > invite.expiresAt) {
      return res.status(400).json({ error: 'Invite has expired' });
    }

    if (invite.maxUses && invite.currentUses >= invite.maxUses) {
      return res.status(400).json({ error: 'Invite usage limit reached' });
    }

    const trip = await Trip.findById(invite.tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check if user is already a member
    const isMember = trip.members.some(m => m.userId.toString() === req.user._id.toString());
    if (isMember) {
      return res.status(400).json({ error: 'You are already a member of this trip' });
    }

    // Add user to trip
    trip.members.push({
      userId: req.user._id,
      isAdmin: false
    });
    await trip.save();

    // Mark invite as used
    invite.usedBy.push({
      userId: req.user._id,
      acceptedAt: new Date()
    });
    invite.currentUses += 1;
    await invite.save();

    await trip.populate('owner', 'name email avatar');
    await trip.populate('members.userId', 'name email avatar');

    res.json({
      message: 'Successfully joined the trip',
      trip
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all invites for a trip
router.get('/trip/:tripId', authenticate, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (trip.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only owner can view invites' });
    }

    const invites = await Invite.find({ tripId: req.params.tripId })
      .populate('invitedBy', 'name email')
      .populate('usedBy.userId', 'name email');

    res.json({
      invites,
      count: invites.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deactivate invite
router.put('/:inviteId/deactivate', authenticate, async (req, res) => {
  try {
    const invite = await Invite.findById(req.params.inviteId);
    if (!invite) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    const trip = await Trip.findById(invite.tripId);
    if (trip.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only trip owner can deactivate invites' });
    }

    invite.isActive = false;
    await invite.save();

    res.json({ message: 'Invite deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get invite details (public endpoint)
router.get('/details/:inviteCode', async (req, res) => {
  try {
    const invite = await Invite.findOne({ inviteCode: req.params.inviteCode })
      .populate('tripId', 'name destination startDate endDate');

    if (!invite) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    if (!invite.isActive || new Date() > invite.expiresAt) {
      return res.status(400).json({ error: 'Invite is no longer valid' });
    }

    res.json({
      tripName: invite.tripId.name,
      destination: invite.tripId.destination,
      startDate: invite.tripId.startDate,
      endDate: invite.tripId.endDate,
      usedCount: invite.currentUses,
      maxUses: invite.maxUses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
