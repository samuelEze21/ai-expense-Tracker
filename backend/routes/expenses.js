const express = require('express');
const { body, param } = require('express-validator');
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules for expense creation/update
const expenseValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),
  body('category')
    .isIn(['Food & Dining', 'Transportation', 'Entertainment', 'Healthcare', 'Shopping', 'Bills & Utilities', 'Education', 'Travel', 'Personal Care', 'Other'])
    .withMessage('Invalid category selected'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
];

// ID validation
const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid expense ID')
];

// Apply protection middleware to all routes
router.use(protect);

// Routes
router.route('/')
  .get(getExpenses)
  .post(expenseValidation, createExpense);

router.get('/stats', getExpenseStats);

router.route('/:id')
  .put([...idValidation, ...expenseValidation], updateExpense)
  .delete(idValidation, deleteExpense);

module.exports = router;