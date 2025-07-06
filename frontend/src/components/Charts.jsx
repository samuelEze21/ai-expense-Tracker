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

const Charts = () => {
  const { isDarkMode } = useTheme();

  // Sample data
  const monthlyData = [
    { month: 'Jan', expenses: 2400, income: 4000 },
    { month: 'Feb', expenses: 1398, income: 3000 },
    { month: 'Mar', expenses: 9800, income: 2000 },
    { month: 'Apr', expenses: 3908, income: 2780 },
    { month: 'May', expenses: 4800, income: 1890 },
    { month: 'Jun', expenses: 3800, income: 2390 },
    { month: 'Jul', expenses: 4300, income: 3490 }
  ];

  const categoryData = [
    { name: 'Food & Dining', value: 400, color: '#8884d8' },
    { name: 'Transportation', value: 300, color: '#82ca9d' },
    { name: 'Shopping', value: 300, color: '#ffc658' },
    { name: 'Entertainment', value: 200, color: '#ff7300' },
    { name: 'Bills & Utilities', value: 150, color: '#00ff88' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const chartTheme = {
    textColor: isDarkMode ? '#e2e8f0' : '#374151',
    gridColor: isDarkMode ? '#374151' : '#e5e7eb',
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
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
            <Area
              type="monotone"
              dataKey="income"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorIncome)"
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

      {/* Weekly Spending */}
      <div className={`
        lg:col-span-2 rounded-2xl p-6 transition-all duration-300
        ${isDarkMode 
          ? 'bg-slate-800 border border-slate-700' 
          : 'bg-white border border-gray-200 shadow-lg'
        }
      `}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Weekly Spending Comparison
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
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
            <Legend />
            <Bar dataKey="expenses" fill="#8884d8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="income" fill="#82ca9d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;