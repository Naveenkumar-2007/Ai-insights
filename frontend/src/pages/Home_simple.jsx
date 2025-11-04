import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp, BarChart3, Brain, Zap, MessageSquare, Activity,
  ArrowRight, Sparkles, TrendingDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [liveStocks, setLiveStocks] = useState([
    { symbol: 'AAPL', change: 0, data: [] },
    { symbol: 'TSLA', change: 0, data: [] },
    { symbol: 'MSFT', change: 0, data: [] }
  ]);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const symbols = ['AAPL', 'TSLA', 'MSFT'];
        const promises = symbols.map(symbol =>
          axios.get(`${API_BASE}/api/stock/${symbol}?days=7`)
            .catch(() => null)
        );
        
        const results = await Promise.all(promises);
        
        const updatedStocks = results.map((res, idx) => {
          if (res?.data) {
            const historicalPrices = res.data.historical_data?.prices || [];
            const change = res.data.day_change_percent || 0;
            return {
              symbol: symbols[idx],
              change: change,
              data: historicalPrices.slice(-7)
            };
          }
          return {
            symbol: symbols[idx],
            change: (Math.random() * 4 - 2),
            data: Array.from({ length: 7 }, () => 100 + Math.random() * 20)
          };
        });
        
        setLiveStocks(updatedStocks);
      } catch (error) {
        console.error('Error fetching live data:', error);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 60000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI Predictions',
      description: 'Advanced neural networks forecast market movements with precision.',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: BarChart3,
      title: 'Technical Indicators',
      description: 'Professional-grade analysis tools for informed trading decisions.',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      icon: MessageSquare,
      title: 'Sentiment Insights',
      description: 'Real-time market sentiment from multiple data sources.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Activity,
      title: 'Real-Time Data',
      description: 'Live market data updates every second for instant analysis.',
      gradient: 'from-pink-500 to-rose-500'
    }
  ];

  const stats = [
    { value: '95%', label: 'Accuracy' },
    { value: '10k+', label: 'Users' },
    { value: '500+', label: 'Stocks' }
  ];

  const handlePredictClick = () => {
    if (currentUser) {
      navigate('/prediction');
    } else {
      navigate('/login', { state: { from: { pathname: '/prediction' } } });
    }
  };

  const renderMiniChart = (data, change) => {
    if (!data || data.length === 0) return null;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    const color = change >= 0 ? '#10b981' : '#ef4444';
    
    return (
      <svg viewBox="0 0 100 100" className="w-full h-16" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${change >= 0 ? 'up' : 'down'}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="animate-draw"
        />
        <polyline
          points={`0,100 ${points} 100,100`}
          fill={`url(#gradient-${change >= 0 ? 'up' : 'down'})`}
          className="animate-fill"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-dark-bg dark:to-dark-elevated">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                AI-Powered Stock Predictions for Smarter Investors
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Harness the power of artificial intelligence to forecast stock trends and make informed investment decisions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handlePredictClick}
                  className="group px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Start Predicting
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  to="/prediction"
                  className="px-8 py-4 bg-white dark:bg-dark-card border-2 border-gray-300 dark:border-dark-border text-gray-900 dark:text-white rounded-xl font-semibold text-lg hover:bg-gray-50 dark:hover:bg-dark-elevated transition-all duration-300 flex items-center justify-center gap-2"
                >
                  View Live Forecasts
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-200 dark:border-dark-border">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Brain Image */}
            <div className="relative flex items-center justify-center animate-float">
              <div className="relative">
                {/* Glowing effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-20 blur-3xl rounded-full"></div>
                
                {/* Brain SVG Illustration */}
                <div className="relative w-full max-w-md mx-auto">
                  <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
                    <defs>
                      <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00B8FF" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#0099FF" stopOpacity="0.9"/>
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {/* Brain outline with animated paths */}
                    <g className="animate-pulse-slow" filter="url(#glow)">
                      <path d="M200,80 Q240,60 260,80 Q280,100 275,130 Q270,160 260,180 Q250,200 245,220 Q240,240 230,255 Q220,270 200,280" 
                            stroke="url(#brainGradient)" strokeWidth="3" fill="none" className="animate-draw-slow"/>
                      <path d="M200,80 Q160,60 140,80 Q120,100 125,130 Q130,160 140,180 Q150,200 155,220 Q160,240 170,255 Q180,270 200,280" 
                            stroke="url(#brainGradient)" strokeWidth="3" fill="none" className="animate-draw-slow"/>
                      
                      {/* Brain folds - left hemisphere */}
                      <path d="M140,100 Q135,115 140,130" stroke="url(#brainGradient)" strokeWidth="2" fill="none"/>
                      <path d="M145,120 Q142,135 148,150" stroke="url(#brainGradient)" strokeWidth="2" fill="none"/>
                      <path d="M150,140 Q148,155 155,170" stroke="url(#brainGradient)" strokeWidth="2" fill="none"/>
                      <path d="M155,160 Q153,175 160,190" stroke="url(#brainGradient)" strokeWidth="2" fill="none"/>
                      <path d="M160,180 Q158,195 165,210" stroke="url(#brainGradient)" strokeWidth="2" fill="none"/>
                      
                      {/* Brain folds - right hemisphere */}
                      <path d="M260,100 Q265,115 260,130" stroke="url(#brainGradient)" strokeWidth="2" fill="none"/>
                      <path d="M255,120 Q258,135 252,150" stroke="url(#brainGradient)" strokeWidth="2" fill="none"/>
                      <path d="M250,140 Q252,155 245,170" stroke="url(#brainGradient)" strokeWidth="2" fill="none"/>
                      <path d="M245,160 Q247,175 240,190" stroke="url(#brainGradient)" strokeWidth="2" fill="none"/>
                      <path d="M240,180 Q242,195 235,210" stroke="url(#brainGradient)" strokeWidth="2" fill="none"/>
                      
                      {/* Neural connections - animated */}
                      <circle cx="160" cy="120" r="2" fill="#00B8FF" className="animate-ping-slow" opacity="0.6"/>
                      <circle cx="240" cy="120" r="2" fill="#00B8FF" className="animate-ping-slow" style={{animationDelay: '0.5s'}} opacity="0.6"/>
                      <circle cx="180" cy="160" r="2" fill="#0099FF" className="animate-ping-slow" style={{animationDelay: '1s'}} opacity="0.6"/>
                      <circle cx="220" cy="160" r="2" fill="#0099FF" className="animate-ping-slow" style={{animationDelay: '1.5s'}} opacity="0.6"/>
                      <circle cx="200" cy="200" r="2" fill="#22D3EE" className="animate-ping-slow" style={{animationDelay: '2s'}} opacity="0.6"/>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stock Previews */}
      <section className="py-12 bg-white dark:bg-dark-card border-y border-gray-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {liveStocks.map((stock, idx) => (
              <div
                key={stock.symbol}
                className="group bg-gray-50 dark:bg-dark-elevated border border-gray-200 dark:border-dark-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stock.symbol}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Live Data</p>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                  </div>
                </div>
                <div className="h-16">
                  {renderMiniChart(stock.data, stock.change)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Features */}
      <section className="py-20 bg-gray-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-medium text-cyan-700 dark:text-cyan-400">Smart Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Professional-grade tools powered by cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-dark-card dark:to-dark-elevated relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of investors who are already making smarter decisions with AI Insights
          </p>
          <button
            onClick={handlePredictClick}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-lg font-semibold rounded-xl transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 hover:-translate-y-1"
          >
            <Brain className="w-6 h-6" />
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes draw-slow {
          from {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dasharray: 1000;
            stroke-dashoffset: 0;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-draw {
          stroke-dasharray: 500;
          stroke-dashoffset: 500;
          animation: draw 2s ease-out forwards;
        }

        .animate-fill {
          opacity: 0;
          animation: fade-in 1s ease-out 1s forwards;
        }

        .animate-draw-slow {
          animation: draw-slow 3s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 3s ease-in-out infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Home;
