const express = require('express');
const router = express.Router();
const passport = require('passport');
const Expense = require('../models/Expense');
const Trip = require('../models/Trip');
const multer = require('multer');

const authenticate = passport.authenticate('jwt', { session: false });

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || 5242880) }
});

// Create expense
router.post('/', authenticate, upload.single('receipt'), async (req, res) => {
  try {
    const { tripId, description, amount, category, paidBy, splits, location, notes, date } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const isMember = trip.members.some(m => m.userId.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ error: 'You are not a member of this trip' });
    }

    const expenseData = {
      tripId,
      description,
      amount: parseFloat(amount),
      category: category || 'other',
      paidBy,
      splits: JSON.parse(splits || '[]'),
      location: location ? JSON.parse(location) : undefined,
      notes,
      date: date ? new Date(date) : new Date()
    };

    if (req.file) {
      expenseData.receipt = {
        photoUrl: `/uploads/${req.file.filename}`,
        uploadedAt: new Date()
      };
    }

    const expense = new Expense(expenseData);
    await expense.save();

    // Update trip's total spent
    trip.totalSpent += parseFloat(amount);
    trip.expenses.push(expense._id);
    await trip.save();

    await expense.populate('paidBy', 'name email avatar');
    await expense.populate('splits.userId', 'name email avatar');

    res.status(201).json({
      message: 'Expense added successfully',
      expense
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get expenses for a trip
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

    const expenses = await Expense.find({ tripId: req.params.tripId })
      .populate('paidBy', 'name email avatar')
      .populate('splits.userId', 'name email avatar')
      .sort({ date: -1 });

    res.json({
      expenses,
      count: expenses.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single expense
router.get('/:expenseId', authenticate, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.expenseId)
      .populate('paidBy', 'name email avatar')
      .populate('splits.userId', 'name email avatar');

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update expense
router.put('/:expenseId', authenticate, upload.single('receipt'), async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.expenseId);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const trip = await Trip.findById(expense.tripId);
    const isMember = trip.members.some(m => m.userId.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ error: 'You are not a member of this trip' });
    }

    const { description, amount, category, paidBy, splits, location, notes, date } = req.body;

    if (description) expense.description = description;
    if (amount) {
      trip.totalSpent = trip.totalSpent - expense.amount + parseFloat(amount);
      expense.amount = parseFloat(amount);
    }
    if (category) expense.category = category;
    if (paidBy) expense.paidBy = paidBy;
    if (splits) expense.splits = JSON.parse(splits);
    if (location) expense.location = JSON.parse(location);
    if (notes) expense.notes = notes;
    if (date) expense.date = new Date(date);

    if (req.file) {
      expense.receipt = {
        photoUrl: `/uploads/${req.file.filename}`,
        uploadedAt: new Date()
      };
    }

    expense.updatedAt = new Date();
    await expense.save();
    await trip.save();

    await expense.populate('paidBy', 'name email avatar');
    await expense.populate('splits.userId', 'name email avatar');

    res.json({
      message: 'Expense updated successfully',
      expense
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete expense
router.delete('/:expenseId', authenticate, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.expenseId);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const trip = await Trip.findById(expense.tripId);
    trip.totalSpent -= expense.amount;
    trip.expenses = trip.expenses.filter(e => e.toString() !== req.params.expenseId);
    await trip.save();

    await Expense.findByIdAndDelete(req.params.expenseId);

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get expenses by category
router.get('/trip/:tripId/category/:category', authenticate, async (req, res) => {
  try {
    const expenses = await Expense.find({
      tripId: req.params.tripId,
      category: req.params.category
    })
      .populate('paidBy', 'name email avatar')
      .populate('splits.userId', 'name email avatar');

    res.json({
      expenses,
      count: expenses.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
