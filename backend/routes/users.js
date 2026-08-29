const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

const authenticate = passport.authenticate('jwt', { session: false });

// Get user profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('friends', 'name email avatar');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/me', authenticate, async (req, res) => {
  try {
    const { name, phone, upiId, bankAccount, preferences, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (upiId) user.upiId = upiId;
    if (avatar) user.avatar = avatar;
    if (bankAccount) user.bankAccount = bankAccount;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    user.updatedAt = new Date();
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        upiId: user.upiId,
        bankAccount: user.bankAccount,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search users by email
router.get('/search/:email', authenticate, async (req, res) => {
  try {
    const users = await User.find({
      email: new RegExp(req.params.email, 'i'),
      _id: { $ne: req.user._id }
    }).select('name email avatar');

    res.json({
      users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add friend
router.post('/friends/:userId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const friend = await User.findById(req.params.userId);

    if (!friend) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.friends.includes(req.params.userId)) {
      user.friends.push(req.params.userId);
      await user.save();
    }

    res.json({ message: 'Friend added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user friends
router.get('/friends', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'name email avatar');

    res.json({
      friends: user.friends,
      count: user.friends.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove friend
router.delete('/friends/:userId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.friends = user.friends.filter(f => f.toString() !== req.params.userId);
    await user.save();

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
