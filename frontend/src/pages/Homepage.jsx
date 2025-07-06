import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Homepage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI ExpenseTracker
                </h1>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#home" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Home
                </a>
                <a href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Pricing
                </a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Contact
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Track Your Expenses
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Smarter with AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Revolutionize your financial management with AI-powered categorization, 
              real-time insights, and intelligent expense tracking across all your devices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Get Started Free
              </button>
              <button className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200">
                Watch Demo
              </button>
            </div>
          </div>
          
          {/* Dashboard Mockup */}
          <div className="mt-20">
            <div className="relative max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Dashboard</h3>
                    <p className="text-gray-600">Smart insights and automated categorization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="block text-blue-600">Smart Expense Management</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of expense tracking with AI-driven insights and seamless automation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-5xl mb-6">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Categorization</h3>
              <p className="text-gray-600">Automatically categorize expenses with 95% accuracy using advanced machine learning.</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-5xl mb-6">🏷️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Auto-Tagging</h3>
              <p className="text-gray-600">Intelligent tagging system that learns from your spending patterns and preferences.</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-5xl mb-6">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real-Time Tracking</h3>
              <p className="text-gray-600">Monitor your expenses instantly with live updates and real-time notifications.</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-5xl mb-6">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Multi-Device Sync</h3>
              <p className="text-gray-600">Access your data seamlessly across all devices with cloud synchronization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. Upgrade or downgrade at any time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
                <div className="text-5xl font-bold text-gray-900 mb-2">$0</div>
                <p className="text-gray-600 mb-8">per month</p>
                
                <ul className="text-left space-y-4 mb-8">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Up to 100 transactions/month</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Basic AI categorization</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Mobile app access</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Email support</span>
                  </li>
                </ul>
                
                <button
                  onClick={handleGetStarted}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-2xl font-semibold transition-all duration-200"
                >
                  Get Started
                </button>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Pro</h3>
                <div className="text-5xl font-bold mb-2">$19</div>
                <p className="text-blue-100 mb-8">per month</p>
                
                <ul className="text-left space-y-4 mb-8">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Unlimited transactions</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Advanced AI insights</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Custom categories & tags</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Export & reporting</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>API access</span>
                  </li>
                </ul>
                
                <button
                  onClick={handleGetStarted}
                  className="w-full bg-white text-blue-600 hover:bg-gray-50 py-3 rounded-2xl font-semibold transition-all duration-200"
                >
                  Start Pro Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join the growing community of users who've transformed their financial management.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-3xl p-8">
              <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-6 italic">
                "AI ExpenseTracker has completely revolutionized how I manage my finances. The AI categorization is incredibly accurate!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  JS
                </div>
                <div>
                  <div className="font-semibold text-gray-900">John Smith</div>
                  <div className="text-gray-600 text-sm">Freelance Designer</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-3xl p-8">
              <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-6 italic">
                "The real-time tracking and multi-device sync make it perfect for our team. Highly recommended for businesses!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  MJ
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Maria Johnson</div>
                  <div className="text-gray-600 text-sm">Startup Founder</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-3xl p-8">
              <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-6 italic">
                "Simple, intuitive, and powerful. The AI insights have helped me save over $500 this month alone!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  DL
                </div>
                <div>
                  <div className="font-semibold text-gray-900">David Lee</div>
                  <div className="text-gray-600 text-sm">Software Engineer</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Company Logos */}
          <div className="mt-20">
            <p className="text-center text-gray-500 mb-8">Trusted by teams at</p>
            <div className="flex justify-center items-center space-x-12 opacity-60">
              <div className="text-2xl font-bold text-gray-400">TechCorp</div>
              <div className="text-2xl font-bold text-gray-400">StartupXYZ</div>
              <div className="text-2xl font-bold text-gray-400">InnovateLab</div>
              <div className="text-2xl font-bold text-gray-400">DigitalFlow</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                AI ExpenseTracker
              </h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Transform your financial management with AI-powered expense tracking. 
                Smart, simple, and secure.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="text-2xl">📘</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="text-2xl">🐦</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="text-2xl">💼</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="text-2xl">📧</span>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 AI ExpenseTracker. All rights reserved. Built with ❤️ for better financial management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;