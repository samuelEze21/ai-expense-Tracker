const Expense = require('../models/Expense');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// @desc    Get all expenses for user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 10, search } = req.query;
    
    // Build filter object
    const filter = { userId: req.user.id };
    
    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get expenses with pagination
    const expenses = await Expense.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email');
    
    // Get total count for pagination
    const total = await Expense.countDocuments(filter);
    
    // Calculate summary statistics
    const summaryPipeline = [
      { $match: filter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          avgAmount: { $avg: '$amount' },
          maxAmount: { $max: '$amount' },
          minAmount: { $min: '$amount' }
        }
      }
    ];
    
    const summaryResult = await Expense.aggregate(summaryPipeline);
    const summary = summaryResult[0] || {
      totalAmount: 0,
      avgAmount: 0,
      maxAmount: 0,
      minAmount: 0
    };
    
    res.json({
      success: true,
      data: {
        expenses,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        summary: {
          ...summary,
          count: total
        }
      }
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching expenses'
    });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { title, amount, category, date, description } = req.body;
    
    // Create expense
    const expense = new Expense({
      userId: req.user.id,
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date: date ? new Date(date) : new Date(),
      description: description?.trim() || ''
    });
    
    await expense.save();
    
    // Populate user data for response
    await expense.populate('userId', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense
    });
  } catch (error) {
    console.error('Create expense error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Expense with this title already exists for today'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating expense'
    });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    
    const { title, amount, category, date, description } = req.body;
    
    // Update fields
    expense.title = title?.trim() || expense.title;
    expense.amount = amount ? parseFloat(amount) : expense.amount;
    expense.category = category || expense.category;
    expense.date = date ? new Date(date) : expense.date;
    expense.description = description?.trim() || expense.description;
    
    await expense.save();
    await expense.populate('userId', 'name email');
    
    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  } catch (error) {
    console.error('Update expense error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating expense'
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    
    await expense.deleteOne();
    
    res.json({
      success: true,
      message: 'Expense deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting expense'
    });
  }
};

// @desc    Get expense statistics
// @route   GET /api/expenses/stats
// @access  Private
const getExpenseStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    // Get category-wise expenses
    const categoryStats = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    // Get monthly expenses for current year
    const currentYear = new Date().getFullYear();
    const monthlyStats = await Expense.aggregate([
      {
        $match: {
          userId,
          date: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get recent expenses (last 5)
    const recentExpenses = await Expense.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name');
    
    res.json({
      success: true,
      data: {
        categoryStats,
        monthlyStats,
        recentExpenses
      }
    });
  } catch (error) {
    console.error('Get expense stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching expense statistics'
    });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
};