import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

const SummaryCards = () => {
  const { isDarkMode } = useTheme();

  const cards = [
    {
      title: 'Total Expenses',
      value: '$2,847.50',
      change: '+12.5%',
      changeType: 'increase',
      icon: CreditCard,
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Total Income',
      value: '$5,240.00',
      change: '+8.2%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Monthly Balance',
      value: '$2,392.50',
      change: '+15.3%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Savings Rate',
      value: '45.6%',
      change: '-2.1%',
      changeType: 'decrease',
      icon: TrendingDown,
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`
              relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105
              ${isDarkMode 
                ? 'bg-slate-800 border border-slate-700 shadow-lg' 
                : 'bg-white border border-gray-200 shadow-lg hover:shadow-xl'
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
                <div className="flex items-center mt-2">
                  {card.changeType === 'increase' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    card.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {card.change}
                  </span>
                  <span className={`text-sm ml-1 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    vs last month
                  </span>
                </div>
              </div>
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                bg-gradient-to-r ${card.color}
              `}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;