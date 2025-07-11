import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';

const ExpenseContext = createContext();

// Categories for dropdown
export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Bills & Utilities',
  'Education',
  'Travel',
  'Personal Care',
  'Other'
];

// Initial state
const initialState = {
  expenses: [],
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false
  },
  summary: {
    totalAmount: 0,
    avgAmount: 0,
    maxAmount: 0,
    minAmount: 0,
    count: 0
  },
  filters: {
    category: 'all',
    startDate: '',
    endDate: '',
    search: ''
  },
  stats: {
    categoryStats: [],
    monthlyStats: [],
    recentExpenses: []
  }
};

// Action types
const EXPENSE_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_EXPENSES: 'SET_EXPENSES',
  ADD_EXPENSE: 'ADD_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  SET_STATS: 'SET_STATS',
  RESET_STATE: 'RESET_STATE'
};

// Reducer
const expenseReducer = (state, action) => {
  switch (action.type) {
    case EXPENSE_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case EXPENSE_ACTIONS.SET_EXPENSES:
      return {
        ...state,
        expenses: action.payload.expenses,
        pagination: action.payload.pagination,
        summary: action.payload.summary,
        loading: false,
        error: null
      };
    case EXPENSE_ACTIONS.ADD_EXPENSE:
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
        summary: {
          ...state.summary,
          totalAmount: state.summary.totalAmount + action.payload.amount,
          count: state.summary.count + 1
        }
      };
    case EXPENSE_ACTIONS.UPDATE_EXPENSE:
      const updatedExpenses = state.expenses.map(expense =>
        expense._id === action.payload._id ? action.payload : expense
      );
      return {
        ...state,
        expenses: updatedExpenses
      };
    case EXPENSE_ACTIONS.DELETE_EXPENSE:
      const deletedExpense = state.expenses.find(e => e._id === action.payload);
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense._id !== action.payload),
        summary: {
          ...state.summary,
          totalAmount: state.summary.totalAmount - (deletedExpense?.amount || 0),
          count: state.summary.count - 1
        }
      };
    case EXPENSE_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case EXPENSE_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case EXPENSE_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    case EXPENSE_ACTIONS.SET_STATS:
      return {
        ...state,
        stats: action.payload
      };
    case EXPENSE_ACTIONS.RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

// Provider component
export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Get expenses with filters and pagination
  const getExpenses = useCallback(async (page = 1, customFilters = {}) => {
    try {
      dispatch({ type: EXPENSE_ACTIONS.SET_LOADING, payload: true });
      
      const filters = { ...state.filters, ...customFilters };
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...filters
      });
      
      // Remove empty values
      for (const [key, value] of params.entries()) {
        if (!value || value === 'all') {
          params.delete(key);
        }
      }
      
      const response = await axios.get(`/api/expenses?${params}`);
      
      dispatch({
        type: EXPENSE_ACTIONS.SET_EXPENSES,
        payload: response.data.data
      });
    } catch (error) {
      dispatch({
        type: EXPENSE_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch expenses'
      });
    }
  }, [state.filters]);

  // Add expense
  const addExpense = async (expenseData) => {
    try {
      const response = await axios.post('/api/expenses', expenseData);
      
      dispatch({
        type: EXPENSE_ACTIONS.ADD_EXPENSE,
        payload: response.data.data
      });
      
      // Refresh stats after adding
      await getExpenseStats();
      
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add expense';
      dispatch({ type: EXPENSE_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message, errors: error.response?.data?.errors };
    }
  };

  // Update expense
  const updateExpense = async (id, expenseData) => {
    try {
      const response = await axios.put(`/api/expenses/${id}`, expenseData);
      
      dispatch({
        type: EXPENSE_ACTIONS.UPDATE_EXPENSE,
        payload: response.data.data
      });
      
      // Refresh stats after updating
      await getExpenseStats();
      
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update expense';
      dispatch({ type: EXPENSE_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message, errors: error.response?.data?.errors };
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`);
      
      dispatch({
        type: EXPENSE_ACTIONS.DELETE_EXPENSE,
        payload: id
      });
      
      // Refresh stats after deleting
      await getExpenseStats();
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete expense';
      dispatch({ type: EXPENSE_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  // Get expense statistics
  const getExpenseStats = async () => {
    try {
      const response = await axios.get('/api/expenses/stats');
      
      dispatch({
        type: EXPENSE_ACTIONS.SET_STATS,
        payload: response.data.data
      });
      
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Failed to fetch expense stats:', error);
      return { success: false };
    }
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({ type: EXPENSE_ACTIONS.SET_FILTERS, payload: filters });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: EXPENSE_ACTIONS.CLEAR_ERROR });
  };

  // Reset state (useful for logout)
  const resetState = () => {
    dispatch({ type: EXPENSE_ACTIONS.RESET_STATE });
  };

  const value = {
    ...state,
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseStats,
    setFilters,
    clearError,
    resetState
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook
export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};