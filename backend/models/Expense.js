const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Food & Dining', 'Transportation', 'Entertainment', 'Healthcare', 'Shopping', 'Bills & Utilities', 'Education', 'Travel', 'Personal Care', 'Other'],
      message: 'Invalid category selected'
    }
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });
expenseSchema.index({ userId: 1, createdAt: -1 });

// Virtual for formatted amount
expenseSchema.virtual('formattedAmount').get(function() {
  return `$${this.amount.toFixed(2)}`;
});

// Virtual for formatted date
expenseSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString();
});

module.exports = mongoose.model('Expense', expenseSchema);