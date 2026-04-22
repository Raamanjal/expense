const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/expense
// @desc    Add new expense
// @access  Private
router.post('/expense', protect, async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        if (!title || !amount || !category) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const expense = await Expense.create({
            userId: req.user.id,
            title,
            amount,
            category,
            date: date ? new Date(date) : Date.now()
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/expenses
// @desc    Get all expenses of logged-in user
// @access  Private
router.get('/expenses', protect, async (req, res) => {
    try {
        // Optional filtering by category
        const { category } = req.query;
        let query = { userId: req.user.id };
        
        if (category && category !== 'All') {
            query.category = category;
        }

        const expenses = await Expense.find(query).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
