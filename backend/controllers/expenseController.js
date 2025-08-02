const Expense = require('../models/Expense');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Add at the top of the file
const NodeCache = require('node-cache');

// Simple in-memory cache with 10-minute TTL
const expenseCache = new NodeCache({ stdTTL: 600 }); // 10 minutes

// @desc    Get all expenses for user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 10, search, currency } = req.query;
    
    console.log('Query params:', req.query); // Debug log
    
    // Create a cache key based on user ID and query parameters
    const cacheKey = `expenses_${req.user.id}_${currency || ''}_${category || ''}_${page}_${limit}_${search || ''}_${startDate || ''}_${endDate || ''}`;
    
    // Check if we have cached results
    const cachedData = expenseCache.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        data: cachedData,
        fromCache: true
      });
    }
    
    // Build filter object - always filter by userId
    const filter = { userId: req.user.id };
    
    // Currency filter is required for efficiency
    if (currency) {
      filter.currency = currency;
      console.log(`Filtering expenses by currency: ${currency} for user ${req.user.id}`);
    } else {
      console.log(`No currency filter provided for user ${req.user.id}`);
    }
    
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
    
    // Get expenses with pagination - use .lean() for better performance
    const expenses = await Expense.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v') // Exclude version field
      .lean() // Return plain JavaScript objects instead of Mongoose documents
      .maxTimeMS(5000); // Set a 5-second timeout for the database query
    
    // Get total count for pagination
    const total = await Expense.countDocuments(filter).maxTimeMS(3000);
    
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
    
    const summaryResult = await Expense.aggregate(summaryPipeline).option({ maxTimeMS: 3000 });
    const summary = summaryResult[0] || {
      totalAmount: 0,
      avgAmount: 0,
      maxAmount: 0,
      minAmount: 0
    };
    
    // After preparing the response data
    const responseData = {
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
    };
    
    // Cache the results
    expenseCache.set(cacheKey, responseData);
    
    res.json({
      success: true,
      data: responseData
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
    
    const { title, amount, category, date, description, currency } = req.body;
    
    // Create expense
    const expense = new Expense({
      userId: req.user.id,
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      currency: currency || 'USD', // Extract currency from request body
      date: date ? new Date(date) : new Date(),
      description: description?.trim() || ''
    });
    
    await expense.save();
    
    // Populate user data for response
    await expense.populate('userId', 'name email');
    
    // Clear cache for this user's expenses
    const cachePattern = `expenses_${req.user.id}_*`;
    expenseCache.del(cachePattern);
    
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
    
    const { title, amount, category, date, description, currency } = req.body;
    
    // Find expense by ID
    let expense = await Expense.findById(req.params.id);
    
    // Check if expense exists
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    
    // Check if expense belongs to user
    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this expense'
      });
    }
    
    // Update expense
    expense.title = title.trim();
    expense.amount = parseFloat(amount);
    expense.category = category;
    expense.currency = currency || expense.currency; // Update currency if provided
    expense.date = date ? new Date(date) : expense.date;
    expense.description = description?.trim() || '';
    
    await expense.save();
    
    // Clear cache for this user's expenses
    const cachePattern = `expenses_${req.user.id}_*`;
    expenseCache.del(cachePattern);
    
    // Populate user data for response
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
// In getExpenseStats function - around line 270
const getExpenseStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { currency } = req.query;
    
    // Base filter
    const filter = { userId };
    
    // Add currency filter if provided
    if (currency) {
      filter.currency = currency;
    }
    
    // Get category-wise expenses
    const categoryStats = await Expense.aggregate([
      { $match: filter },
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
          ...filter,
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
    const recentExpenses = await Expense.find(filter)
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