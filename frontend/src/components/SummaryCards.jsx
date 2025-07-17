import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useExpense } from '../context/ExpenseContext.jsx';

const SummaryCards = () => {
  const { isDarkMode } = useTheme();
  const { expenses, stats } = useExpense();

  // Don't render if no expenses
  if (!expenses || expenses.length === 0) {
    return null;
  }

  // Calculate summary data from expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  }).reduce((sum, expense) => sum + expense.amount, 0);
  
  const avgDaily = thisMonthExpenses / new Date().getDate();
  const expenseCount = expenses.length;

  const cards = [
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-blue-500 to-cyan-500',
      change: '+12.5%'
    },
    {
      title: 'This Month',
      value: `$${thisMonthExpenses.toFixed(2)}`,
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      change: '+8.2%'
    },
    {
      title: 'Daily Average',
      value: `$${avgDaily.toFixed(2)}`,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      change: '+15.3%'
    },
    {
      title: 'Total Transactions',
      value: expenseCount.toString(),
      icon: TrendingDown,
      color: 'from-orange-500 to-red-500',
      change: '+23.1%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`
            rounded-2xl p-6 transition-all duration-300 hover:scale-105
            ${isDarkMode 
              ? 'bg-slate-800 border border-slate-700 shadow-xl' 
              : 'bg-white border border-gray-200 shadow-lg'
            }
          `}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>
                {card.title}
              </p>
              <p className={`text-2xl font-bold mt-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {card.value}
              </p>
              <p className="text-sm text-green-500 mt-1">
                {card.change} from last month
              </p>
            </div>
            <div className={`
              w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} 
              flex items-center justify-center shadow-lg
            `}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;