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
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 animate-pulse" />
              <span className="text-sm font-semibold uppercase tracking-wider bg-white bg-opacity-20 px-4 py-2 rounded-full">
                AI-Powered Stock Analysis
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Predict Stock Prices with
              <span className="block bg-gradient-to-r from-brand-100 to-white text-transparent bg-clip-text">
                Artificial Intelligence
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-10 text-brand-50 max-w-3xl mx-auto">
              Harness the power of advanced AI intelligence and comprehensive market analysis 
              to make informed investment decisions with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handlePredictClick}
                className="group bg-white text-brand-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-50 transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2"
              >
                Let's Predict
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <Link
                to="/about"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-brand-700 transition-all transform hover:scale-105"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white/30">
                  <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-brand-50">{stat.label}</div>
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
  <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for Smart Trading
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with comprehensive market analysis 
              to give you the edge in stock trading.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-white to-brand-50 p-8 rounded-2xl border border-brand-50 hover:border-brand-400 transition-all hover:shadow-xl transform hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-brand-500 to-brand-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
  <section className="py-20 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started with stock predictions in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-50 hover:shadow-2xl transition-shadow">
                  <div className="text-6xl font-bold text-brand-200 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-brand-500" />
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
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
  <section className="py-20 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Make Smarter Investments?
          </h2>
          <p className="text-xl text-brand-50 mb-10">
            Join thousands of traders using AI-powered predictions to maximize their returns
          </p>
          <Link
            to="/prediction"
            className="inline-flex items-center gap-3 bg-white text-brand-700 px-10 py-5 rounded-xl font-bold text-xl hover:bg-brand-50 transition-all transform hover:scale-105 shadow-2xl"
          >
            Start Predicting Now
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;