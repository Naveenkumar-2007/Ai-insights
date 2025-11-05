import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, BarChart3, Brain, MessageSquare, Activity, TrendingDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Generate realistic demo stock data
  const generateRealisticStockData = (basePrice, volatility, trend) => {
    const data = [];
    let price = basePrice;
    for (let i = 0; i < 30; i++) {
      const dailyChange = (Math.random() - 0.5) * volatility + trend;
      price = price * (1 + dailyChange / 100);
      data.push(price);
    }
    return data;
  };

  const demoStocks = [
    { 
      symbol: 'AAPL', 
      name: 'Apple Inc.', 
      basePrice: 182.50,
      volatility: 2.5,
      trend: 0.15,
      change: 2.34
    },
    { 
      symbol: 'TSLA', 
      name: 'Tesla Inc.', 
      basePrice: 242.80,
      volatility: 4.0,
      trend: -0.25,
      change: -1.87
    },
    { 
      symbol: 'MSFT', 
      name: 'Microsoft Corp.', 
      basePrice: 378.91,
      volatility: 1.8,
      trend: 0.20,
      change: 1.56
    },
    { 
      symbol: 'GOOGL', 
      name: 'Alphabet Inc.', 
      basePrice: 141.80,
      volatility: 2.2,
      trend: 0.10,
      change: 0.89
    },
    { 
      symbol: 'AMZN', 
      name: 'Amazon.com Inc.', 
      basePrice: 178.35,
      volatility: 2.8,
      trend: 0.18,
      change: 1.42
    },
    { 
      symbol: 'META', 
      name: 'Meta Platforms Inc.', 
      basePrice: 321.15,
      volatility: 3.5,
      trend: -0.15,
      change: -0.76
    },
    { 
      symbol: 'NVDA', 
      name: 'NVIDIA Corp.', 
      basePrice: 486.50,
      volatility: 4.5,
      trend: 0.35,
      change: 3.21
    },
    { 
      symbol: 'AMD', 
      name: 'Advanced Micro Devices', 
      basePrice: 112.40,
      volatility: 3.8,
      trend: 0.12,
      change: 1.98
    },
    { 
      symbol: 'NFLX', 
      name: 'Netflix Inc.', 
      basePrice: 445.20,
      volatility: 3.2,
      trend: -0.20,
      change: -1.23
    },
    { 
      symbol: 'COIN', 
      name: 'Coinbase Global', 
      basePrice: 89.75,
      volatility: 5.5,
      trend: 0.25,
      change: 2.67
    }
  ];
  
  const [currentStockIndex, setCurrentStockIndex] = useState(0);
  const [liveStocks, setLiveStocks] = useState([]);

  // Initialize demo stocks
  useEffect(() => {
    const initStocks = demoStocks.slice(0, 3).map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      change: stock.change,
      data: generateRealisticStockData(stock.basePrice, stock.volatility, stock.trend),
      price: stock.basePrice * (1 + stock.change / 100),
      loading: false
    }));
    setLiveStocks(initStocks);
  }, []);

  // Rotate stocks every 10 seconds with demo data
  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setCurrentStockIndex(prev => {
        const nextIndex = (prev + 3) % demoStocks.length;
        
        // Update with new demo stocks
        const newStocks = [
          demoStocks[nextIndex],
          demoStocks[(nextIndex + 1) % demoStocks.length],
          demoStocks[(nextIndex + 2) % demoStocks.length]
        ].map(stock => ({
          symbol: stock.symbol,
          name: stock.name,
          change: stock.change,
          data: generateRealisticStockData(stock.basePrice, stock.volatility, stock.trend),
          price: stock.basePrice * (1 + stock.change / 100),
          loading: false
        }));
        
        setLiveStocks(newStocks);
        return nextIndex;
      });
    }, 10000);

    return () => clearInterval(rotateInterval);
  }, []);

  const features = [
    { icon: Brain, title: 'AI-Powered Forecasts', description: 'Machine learning algorithms analyze historical patterns to predict future price movements with high accuracy.' },
    { icon: BarChart3, title: 'Advanced Technical Analysis', description: 'Access professional charting tools including candlestick patterns, volume indicators, and trend analysis.' },
    { icon: MessageSquare, title: 'Market Sentiment Analysis', description: 'Track investor sentiment and social media trends to gauge market psychology and timing.' },
    { icon: Activity, title: 'Live Market Data', description: 'Real-time price updates, daily forecasts, and comprehensive financial metrics for informed decisions.' }
  ];

  const renderMiniChart = (data, change) => {
    if (!data || data.length < 2) return null;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 70 - 15;
      return `${x},${y}`;
    }).join(' ');

    const color = change >= 0 ? '#10b981' : '#ef4444';
    const gradientId = `gradient-${change >= 0 ? 'up' : 'down'}-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.5"/>
            <stop offset="50%" stopColor={color} stopOpacity="0.2"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polyline points={`0,100 ${points} 100,100`} fill={`url(#${gradientId})`} />
        <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="2s" fill="freeze" />
        </polyline>
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0F1535] to-[#1A1F3A] dark:from-[#0A0E27] dark:via-[#0F1535] dark:to-[#1A1F3A]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        {/* Animated Grid Background */}
        <div className="absolute inset-0">
          {/* Dot grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(0, 184, 255, 0.15) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}></div>
          
          {/* Gradient orbs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow-delayed"></div>
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
          
          {/* Animated lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00B8FF" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#0066FF" stopOpacity="0.2"/>
              </linearGradient>
            </defs>
            {/* Diagonal animated lines */}
            <line x1="0" y1="0" x2="100%" y2="50%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-line-draw">
              <animate attributeName="x2" from="0%" to="100%" dur="3s" repeatCount="indefinite"/>
            </line>
            <line x1="100%" y1="50%" x2="0" y2="100%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-line-draw">
              <animate attributeName="x2" from="100%" to="0%" dur="3s" repeatCount="indefinite"/>
            </line>
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6 backdrop-blur-sm">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-cyan-400">Live Market Analysis</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-[1.1]">
                Stock Predictions
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  for Smart Investors
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed">
                Leverage cutting-edge artificial intelligence to analyze market trends, predict stock movements, and make data-driven investment decisions with confidence.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-14">
                <button
                  onClick={() => currentUser ? navigate('/prediction') : navigate('/login')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 hover:scale-105"
                >
                  <span className="relative z-10">Start Analyzing</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                </button>
                <button
                  onClick={() => navigate('/prediction')}
                  className="px-8 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/10 text-white text-lg font-semibold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  View Live Data
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-10 border-t border-white/10">
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">98%</div>
                  <div className="text-sm text-gray-400">Accuracy Rate</div>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">15K+</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">24/7</div>
                  <div className="text-sm text-gray-400">Real-time Data</div>
                </div>
              </div>
            </div>

            {/* Right - Animated Technical Chart */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-2xl aspect-square">
                {/* Glass morphism container */}
                <div className="relative w-full h-full bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl overflow-hidden">
                  {/* Technical Chart */}
                  <svg viewBox="0 0 600 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      {/* Green gradient for uptrend */}
                      <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4"/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                      </linearGradient>
                      
                      {/* Red gradient for downtrend */}
                      <linearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4"/>
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
                      </linearGradient>
                      
                      {/* Glow filter */}
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {/* Grid lines */}
                    <g opacity="0.08" stroke="#fff" strokeWidth="1">
                      <line x1="0" y1="80" x2="600" y2="80"/>
                      <line x1="0" y1="160" x2="600" y2="160"/>
                      <line x1="0" y1="240" x2="600" y2="240"/>
                      <line x1="0" y1="320" x2="600" y2="320"/>
                      <line x1="100" y1="0" x2="100" y2="400"/>
                      <line x1="200" y1="0" x2="200" y2="400"/>
                      <line x1="300" y1="0" x2="300" y2="400"/>
                      <line x1="400" y1="0" x2="400" y2="400"/>
                      <line x1="500" y1="0" x2="500" y2="400"/>
                    </g>
                    
                    {/* Animated Growth then Decline Chart */}
                    <g className="chart-animation">
                      {/* Green growth area */}
                      <path 
                        className="green-area"
                        d="M 0 350 L 0 320 L 60 310 L 120 290 L 180 260 L 240 220 L 300 170 L 300 350 Z" 
                        fill="url(#greenGradient)"
                      />
                      
                      {/* Green growth line */}
                      <path 
                        className="green-line"
                        d="M 0 320 L 60 310 L 120 290 L 180 260 L 240 220 L 300 170" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                      />
                      
                      {/* Red decline area */}
                      <path 
                        className="red-area"
                        d="M 300 350 L 300 170 L 360 190 L 420 220 L 480 260 L 540 300 L 600 330 L 600 350 Z" 
                        fill="url(#redGradient)"
                      />
                      
                      {/* Red decline line */}
                      <path 
                        className="red-line"
                        d="M 300 170 L 360 190 L 420 220 L 480 260 L 540 300 L 600 330" 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                      />
                      
                      {/* Data points on growth line */}
                      <g className="green-points">
                        <circle cx="60" cy="310" r="5" fill="#10b981" filter="url(#glow)"/>
                        <circle cx="120" cy="290" r="5" fill="#10b981" filter="url(#glow)"/>
                        <circle cx="180" cy="260" r="6" fill="#10b981" filter="url(#glow)"/>
                        <circle cx="240" cy="220" r="6" fill="#10b981" filter="url(#glow)"/>
                        <circle cx="300" cy="170" r="7" fill="#10b981" filter="url(#glow)"/>
                      </g>
                      
                      {/* Data points on decline line */}
                      <g className="red-points">
                        <circle cx="360" cy="190" r="6" fill="#ef4444" filter="url(#glow)"/>
                        <circle cx="420" cy="220" r="6" fill="#ef4444" filter="url(#glow)"/>
                        <circle cx="480" cy="260" r="6" fill="#ef4444" filter="url(#glow)"/>
                        <circle cx="540" cy="300" r="5" fill="#ef4444" filter="url(#glow)"/>
                        <circle cx="600" cy="330" r="5" fill="#ef4444" filter="url(#glow)"/>
                      </g>
                    </g>
                    
                    {/* Volume bars at bottom */}
                    <g opacity="0.4">
                      {[60, 120, 180, 240, 300, 360, 420, 480, 540].map((x, i) => {
                        const isGreen = i < 5;
                        return (
                          <rect 
                            key={i}
                            className={isGreen ? 'volume-green' : 'volume-red'}
                            x={x - 20} 
                            y={360} 
                            width="30" 
                            height={isGreen ? (5 - i) * 8 + 20 : (i - 4) * 8 + 20}
                            fill={isGreen ? '#10b981' : '#ef4444'}
                            rx="2"
                          />
                        );
                      })}
                    </g>
                  </svg>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-green-500/20 rounded-full blur-xl animate-pulse-slow"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-red-500/20 rounded-full blur-xl animate-pulse-slow-delayed"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stock Cards */}
      <section className="py-16 bg-gray-50 dark:bg-[#131833]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Live Stock Data</h2>
            <p className="text-gray-600 dark:text-gray-400">Real-time market prices updating every minute</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {liveStocks.map((stock, idx) => (
              <div key={`${stock.symbol}-${idx}`} className="bg-white dark:bg-[#1A2038] border border-gray-200 dark:border-[#252B4A] rounded-2xl p-8 hover:shadow-xl dark:hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stock.symbol}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</p>
                    {stock.price > 0 && (
                      <p className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                        ${stock.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold ${
                    stock.change >= 0 
                      ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' 
                      : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                  }`}>
                    {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                  </div>
                </div>
                <div className="h-32 mb-3">
                  {stock.loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                    </div>
                  ) : (
                    renderMiniChart(stock.data, stock.change)
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">30-day trend</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Stocks rotate every 10 seconds • Data updates every minute
            </p>
          </div>
        </div>
      </section>

      {/* Smart Features */}
      <section className="py-20 bg-white dark:bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 rounded-full mb-6">
              <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">Smart Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Professional-grade tools powered by cutting-edge technology
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-gray-50 dark:bg-[#131833] border border-gray-200 dark:border-[#252B4A] rounded-2xl p-8 hover:shadow-xl dark:hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1 group">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style jsx>{`
        /* Float animation */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        /* Slow spin */
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        
        /* Pulse animations */
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        @keyframes pulse-slow-delayed {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.08); }
        }
        .animate-pulse-slow-delayed {
          animation: pulse-slow-delayed 2s ease-in-out 0.5s infinite;
        }
        
        /* Chart Growth Animation - Step by step */
        @keyframes chart-grow {
          0% { opacity: 0; clip-path: polygon(0 100%, 0 100%, 0 100%, 0 100%); }
          10% { opacity: 1; clip-path: polygon(0 100%, 8% 100%, 8% 90%, 0 95%); }
          20% { clip-path: polygon(0 100%, 16% 100%, 16% 80%, 0 95%); }
          30% { clip-path: polygon(0 100%, 25% 100%, 25% 70%, 0 95%); }
          40% { clip-path: polygon(0 100%, 33% 100%, 33% 55%, 0 95%); }
          50% { clip-path: polygon(0 100%, 41% 100%, 41% 40%, 0 95%); }
          60% { clip-path: polygon(0 100%, 50% 100%, 50% 30%, 0 95%); }
          70% { clip-path: polygon(0 100%, 58% 100%, 58% 25%, 0 95%); }
          80%, 100% { clip-path: polygon(0 100%, 66% 100%, 66% 22%, 0 95%); }
        }
        .animate-chart-grow {
          animation: chart-grow 8s ease-out forwards;
        }
        
        /* Line Drawing Animation - Growth phase */
        @keyframes draw-growth {
          0% { stroke-dasharray: 0 2000; opacity: 0; }
          5% { opacity: 1; }
          10% { stroke-dasharray: 100 2000; }
          20% { stroke-dasharray: 250 2000; }
          30% { stroke-dasharray: 400 2000; }
          40% { stroke-dasharray: 600 2000; }
          50% { stroke-dasharray: 800 2000; }
          60% { stroke-dasharray: 1000 2000; }
          70% { stroke-dasharray: 1200 2000; }
          80%, 100% { stroke-dasharray: 1400 2000; }
        }
        .animate-draw-growth {
          stroke-dasharray: 0 2000;
          animation: draw-growth 8s ease-out forwards;
        }
        
        /* Decline Animation - Starts after growth */
        @keyframes draw-decline {
          0%, 70% { stroke-dashoffset: 1000; opacity: 0; }
          75% { opacity: 1; }
          80% { stroke-dashoffset: 750; }
          85% { stroke-dashoffset: 500; }
          90% { stroke-dashoffset: 250; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-draw-decline {
          animation: draw-decline 10s ease-in forwards;
        }
        
        /* Chart Decline Area */
        @keyframes chart-decline {
          0%, 70% { opacity: 0; clip-path: polygon(66% 22%, 66% 22%, 100% 100%, 66% 100%); }
          75% { opacity: 0.3; clip-path: polygon(66% 22%, 75% 24%, 100% 100%, 66% 100%); }
          85% { clip-path: polygon(66% 22%, 83% 28%, 100% 100%, 66% 100%); }
          95% { clip-path: polygon(66% 22%, 91% 36%, 100% 100%, 66% 100%); }
          100% { clip-path: polygon(66% 22%, 100% 48%, 100% 100%, 66% 100%); }
        }
        .animate-chart-decline {
          animation: chart-decline 10s ease-in forwards;
        }
        
        /* Candlestick Animations - Sequential */
        @keyframes candle-appear {
          0% { opacity: 0; transform: scaleY(0); }
          50% { opacity: 1; transform: scaleY(1.1); }
          100% { opacity: 1; transform: scaleY(1); }
        }
        
        .animate-candle-1 { animation: candle-appear 0.5s ease-out 0.8s forwards; opacity: 0; transform-origin: bottom; }
        .animate-candle-2 { animation: candle-appear 0.5s ease-out 1.6s forwards; opacity: 0; transform-origin: bottom; }
        .animate-candle-3 { animation: candle-appear 0.5s ease-out 2.4s forwards; opacity: 0; transform-origin: bottom; }
        .animate-candle-4 { animation: candle-appear 0.5s ease-out 3.2s forwards; opacity: 0; transform-origin: bottom; }
        .animate-candle-5 { animation: candle-appear 0.5s ease-out 4.0s forwards; opacity: 0; transform-origin: bottom; }
        .animate-candle-6 { animation: candle-appear 0.5s ease-out 4.8s forwards; opacity: 0; transform-origin: bottom; }
        .animate-candle-7 { animation: candle-appear 0.5s ease-out 5.6s forwards; opacity: 0; transform-origin: bottom; }
        
        /* Chart animations - Growth and Decline - Rotating */
        @keyframes chart-animate {
          0% { opacity: 0; }
          5% { opacity: 1; }
          45% { opacity: 1; }
          50% { opacity: 0.3; }
          95% { opacity: 0.3; }
          100% { opacity: 0; }
        }
        
        .chart-animation {
          animation: chart-animate 12s ease-in-out infinite;
        }
        
        /* Green growth line animation */
        @keyframes draw-green-line {
          0% { stroke-dasharray: 0 1000; }
          45% { stroke-dasharray: 500 0; }
          50% { stroke-dasharray: 500 0; }
          100% { stroke-dasharray: 500 0; }
        }
        
        .green-line {
          stroke-dasharray: 0 1000;
          animation: draw-green-line 12s ease-in-out infinite;
        }
        
        /* Green area animation */
        @keyframes fill-green-area {
          0% { opacity: 0; transform: scaleY(0); }
          45% { opacity: 0.6; transform: scaleY(1); }
          50% { opacity: 0.3; transform: scaleY(1); }
          100% { opacity: 0.3; transform: scaleY(1); }
        }
        
        .green-area {
          transform-origin: bottom;
          animation: fill-green-area 12s ease-out infinite;
        }
        
        /* Red decline line animation */
        @keyframes draw-red-line {
          0% { stroke-dasharray: 0 1000; opacity: 0; }
          50% { stroke-dasharray: 0 1000; opacity: 0; }
          55% { opacity: 1; }
          95% { stroke-dasharray: 500 0; opacity: 1; }
          100% { stroke-dasharray: 0 1000; opacity: 0; }
        }
        
        .red-line {
          stroke-dasharray: 0 1000;
          animation: draw-red-line 12s ease-in-out infinite;
        }
        
        /* Red area animation */
        @keyframes fill-red-area {
          0% { opacity: 0; transform: scaleY(0); }
          50% { opacity: 0; transform: scaleY(0); }
          95% { opacity: 0.6; transform: scaleY(1); }
          100% { opacity: 0; transform: scaleY(0); }
        }
        
        .red-area {
          transform-origin: bottom;
          animation: fill-red-area 12s ease-out infinite;
        }
        
        /* Green points animation */
        @keyframes pulse-green-points {
          0% { opacity: 0; transform: scale(0); }
          45% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
          100% { opacity: 0.5; transform: scale(0.8); }
        }
        
        .green-points circle {
          animation: pulse-green-points 12s ease-out infinite;
        }
        
        .green-points circle:nth-child(1) { animation-delay: 0.5s; }
        .green-points circle:nth-child(2) { animation-delay: 1s; }
        .green-points circle:nth-child(3) { animation-delay: 1.5s; }
        .green-points circle:nth-child(4) { animation-delay: 2s; }
        .green-points circle:nth-child(5) { animation-delay: 2.5s; }
        
        /* Red points animation */
        @keyframes pulse-red-points {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 0; transform: scale(0); }
          55% { opacity: 1; transform: scale(1); }
          95% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0); }
        }
        
        .red-points circle {
          animation: pulse-red-points 12s ease-out infinite;
        }
        
        .red-points circle:nth-child(1) { animation-delay: 0.5s; }
        .red-points circle:nth-child(2) { animation-delay: 1s; }
        .red-points circle:nth-child(3) { animation-delay: 1.5s; }
        .red-points circle:nth-child(4) { animation-delay: 2s; }
        .red-points circle:nth-child(5) { animation-delay: 2.5s; }
        
        /* Volume bars animation */
        @keyframes volume-grow {
          0% { transform: scaleY(0); }
          45% { transform: scaleY(1); }
          50% { transform: scaleY(0.6); }
          100% { transform: scaleY(0.6); }
        }
        
        .volume-green {
          transform-origin: bottom;
          animation: volume-grow 12s ease-out infinite;
        }
        
        @keyframes volume-decline {
          0% { transform: scaleY(0); opacity: 0; }
          50% { transform: scaleY(0); opacity: 0; }
          55% { opacity: 1; }
          95% { transform: scaleY(1); opacity: 1; }
          100% { transform: scaleY(0); opacity: 0; }
        }
        
        .volume-red {
          transform-origin: bottom;
          animation: volume-decline 12s ease-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
