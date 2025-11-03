import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp, BarChart3, Brain, Zap, Shield, Target,
  ArrowRight, CheckCircle, Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Predictions',
  description: 'Proprietary AI models analyze historical trends to forecast future stock prices with high confidence.'
    },
    {
      icon: BarChart3,
      title: 'Technical Analysis',
  description: 'Comprehensive technical indicators presented in a clear, trader-friendly dashboard for informed decisions.'
    },
    {
      icon: Zap,
      title: 'Real-Time Data',
  description: 'Live stock prices and market data with continuous refresh for up-to-date information.'
    },
    {
      icon: Shield,
      title: 'Sentiment Analysis',
  description: 'AI-driven sentiment analysis from curated news and social channels to gauge market momentum.'
    },
    {
      icon: Target,
      title: 'Trading Signals',
      description: 'Clear BUY, SELL, or HOLD signals based on comprehensive analysis to guide your trading strategy.'
    },
    {
      icon: TrendingUp,
      title: 'Multi-Day Forecasts',
      description: 'Predict stock prices up to 30 days ahead with detailed profit/loss projections and confidence scores.'
    }
  ];

  const stats = [
    { value: '95%', label: 'Prediction Accuracy' },
    { value: '10K+', label: 'Active Users' },
    { value: '500+', label: 'Stocks Tracked' },
    { value: '24/7', label: 'Market Monitoring' }
  ];

  const handlePredictClick = () => {
    if (currentUser) {
      navigate('/prediction');
    } else {
      navigate('/login', { state: { from: { pathname: '/prediction' } } });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
  <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider bg-white bg-opacity-20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                AI-Powered Stock Analysis
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight px-2">
              Predict Stock Prices with
              <span className="block bg-gradient-to-r from-brand-100 to-white text-transparent bg-clip-text mt-2">
                Artificial Intelligence
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-2xl mb-8 sm:mb-10 text-brand-50 max-w-3xl mx-auto px-4">
              Harness the power of advanced AI intelligence and comprehensive market analysis 
              to make informed investment decisions with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <button
                onClick={handlePredictClick}
                className="group bg-white text-brand-700 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-brand-50 transition-all transform hover:scale-105 active:scale-95 shadow-2xl flex items-center justify-center gap-2 w-full sm:w-auto touch-target active-scale ripple"
              >
                Let's Predict
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <Link
                to="/about"
                className="bg-transparent border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white hover:text-brand-700 transition-all transform hover:scale-105 active:scale-95 w-full sm:w-auto text-center touch-target active-scale"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-10 sm:mt-16 max-w-4xl mx-auto px-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/30">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-brand-50">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="rgb(249, 250, 251)"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
  <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Powerful Features for Smart Trading
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Our platform combines cutting-edge AI technology with comprehensive market analysis 
              to give you the edge in stock trading.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-white to-brand-50 p-6 sm:p-8 rounded-2xl border border-brand-50 hover:border-brand-400 transition-all hover:shadow-xl transform hover:-translate-y-2 active-scale"
              >
                <div className="bg-gradient-to-br from-brand-500 to-brand-600 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
  <section className="py-12 sm:py-16 lg:py-20 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
              Get started with stock predictions in three simple steps
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: '01',
                title: 'Enter Stock Ticker',
                description: 'Simply type in the stock symbol you want to analyze (e.g., AAPL, TSLA, GOOGL)'
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI engine processes historical data, technical indicators, and market sentiment'
              },
              {
                step: '03',
                title: 'Get Predictions',
                description: 'Receive detailed price forecasts, trading signals, and comprehensive market insights'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-brand-50 hover:shadow-2xl transition-shadow active-scale">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-200 mb-3 sm:mb-4">{item.step}</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-brand-500 flex-shrink-0" />
                    <span>{item.title}</span>
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-brand-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
  <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-4">
            Ready to Make Smarter Investments?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-brand-50 mb-8 sm:mb-10 px-4">
            Join thousands of traders using AI-powered predictions to maximize their returns
          </p>
          <Link
            to="/prediction"
            className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-white text-brand-700 px-8 py-4 sm:px-10 sm:py-5 rounded-xl font-bold text-lg sm:text-xl hover:bg-brand-50 transition-all transform hover:scale-105 shadow-2xl w-full sm:w-auto max-w-md mx-auto touch-target active-scale"
          >
            Start Predicting Now
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;