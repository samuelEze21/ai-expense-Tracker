import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useTheme } from '../context/ThemeContext.jsx';
import { useExpense } from '../context/ExpenseContext.jsx';

const Charts = () => {
  const { isDarkMode } = useTheme();
  const { expenses } = useExpense();

  // Don't render if no expenses
  if (!expenses || expenses.length === 0) {
    return null;
  }

  // Process real expense data for charts
  const processMonthlyData = () => {
    const monthlyExpenses = {};
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyExpenses[monthKey]) {
        monthlyExpenses[monthKey] = { month: monthName, expenses: 0 };
      }
      monthlyExpenses[monthKey].expenses += expense.amount;
    });
    
    return Object.values(monthlyExpenses).slice(-6); // Last 6 months
  };

  const processCategoryData = () => {
    const categoryTotals = {};
    expenses.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });
    
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }));
  };

  const monthlyData = processMonthlyData();
  const categoryData = processCategoryData();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  const chartTheme = {
    textColor: isDarkMode ? '#e2e8f0' : '#374151',
    gridColor: isDarkMode ? '#374151' : '#e5e7eb',
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Monthly Trends */}
      <div className={`
        rounded-2xl p-6 transition-all duration-300
        ${isDarkMode 
          ? 'bg-slate-800 border border-slate-700' 
          : 'bg-white border border-gray-200 shadow-lg'
        }
      `}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Monthly Expense Trends
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
            <XAxis dataKey="month" stroke={chartTheme.textColor} />
            <YAxis stroke={chartTheme.textColor} />
            <Tooltip 
              contentStyle={{
                backgroundColor: chartTheme.backgroundColor,
                border: `1px solid ${chartTheme.gridColor}`,
                borderRadius: '8px',
                color: chartTheme.textColor
              }}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorExpenses)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className={`
        rounded-2xl p-6 transition-all duration-300
        ${isDarkMode 
          ? 'bg-slate-800 border border-slate-700' 
          : 'bg-white border border-gray-200 shadow-lg'
        }
      `}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Expense Categories
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: chartTheme.backgroundColor,
                border: `1px solid ${chartTheme.gridColor}`,
                borderRadius: '8px',
                color: chartTheme.textColor
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;