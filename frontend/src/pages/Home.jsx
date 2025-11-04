import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, BarChart3, Brain, MessageSquare, Activity, TrendingDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Extended list of stocks to rotate through
  const stockSymbols = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'AMD', 'NFLX', 'COIN'];
  const [currentStockIndex, setCurrentStockIndex] = useState(0);
  
  const [liveStocks, setLiveStocks] = useState([
    { symbol: 'AAPL', name: 'Apple Inc.', change: 0, data: [], price: 0, loading: true },
    { symbol: 'TSLA', name: 'Tesla Inc.', change: 0, data: [], price: 0, loading: true },
    { symbol: 'MSFT', name: 'Microsoft Corp.', change: 0, data: [], price: 0, loading: true }
  ]);

  // Rotate stocks every 10 seconds
  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setCurrentStockIndex(prev => {
        const nextIndex = (prev + 3) % stockSymbols.length;
        return nextIndex;
      });
    }, 10000);

    return () => clearInterval(rotateInterval);
  }, []);

  // Fetch live data for current stocks
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const currentSymbols = [
          stockSymbols[currentStockIndex],
          stockSymbols[(currentStockIndex + 1) % stockSymbols.length],
          stockSymbols[(currentStockIndex + 2) % stockSymbols.length]
        ];
        
        const promises = currentSymbols.map(symbol =>
          axios.get(`${API_BASE}/api/stock/${symbol}?days=30`).catch(err => {
            console.error(`Error fetching ${symbol}:`, err);
            return null;
          })
        );
        
        const results = await Promise.all(promises);
        
        const updatedStocks = results.map((res, idx) => {
          const symbol = currentSymbols[idx];
          if (res?.data) {
            const historicalPrices = res.data.historical_data?.prices || [];
            const change = res.data.day_change_percent || 0;
            const currentPrice = res.data.current_price || 0;
            const companyName = res.data.company_name || symbol;
            
            return {
              symbol,
              name: companyName,
              change: parseFloat(change),
              data: historicalPrices.slice(-30),
              price: currentPrice,
              loading: false
            };
          }
          return {
            symbol,
            name: symbol,
            change: 0,
            data: Array.from({length: 30}, () => Math.random() * 100 + 100),
            price: 0,
            loading: false
          };
        });
        
        setLiveStocks(updatedStocks);
      } catch (error) {
        console.error('Error fetching live data:', error);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [currentStockIndex]);

  const features = [
    { icon: Brain, title: 'AI Predictions', description: 'Advanced neural networks forecast market movements with precision.' },
    { icon: BarChart3, title: 'Technical Indicators', description: 'Professional-grade analysis tools for informed trading decisions.' },
    { icon: MessageSquare, title: 'Sentiment Insights', description: 'Real-time market sentiment from multiple data sources.' },
    { icon: Activity, title: 'Real-Time Data', description: 'Live market data updates every second for instant analysis.' }
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
    <div className="min-h-screen bg-white dark:bg-[#0B1120]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-[#0B1120] py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-600/10 dark:bg-blue-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 dark:bg-cyan-400/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.1]">
                AI-Powered Stock Predictions for Smarter Investors
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed">
                Harness the power of artificial intelligence to forecast stock trends and make informed investment decisions.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-14">
                <button
                  onClick={() => currentUser ? navigate('/prediction') : navigate('/login')}
                  className="px-8 py-4 bg-[#00B8FF] hover:bg-[#0099FF] text-white text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg"
                >
                  Start Predicting
                </button>
                <button
                  onClick={() => navigate('/prediction')}
                  className="px-8 py-4 bg-transparent border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-lg font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all duration-200"
                >
                  View Live Forecasts
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-10 border-t border-gray-200 dark:border-gray-800 pt-10">
                <div>
                  <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">95%</div>
                  <div className="text-base text-gray-600 dark:text-gray-400">Accuracy</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">10k+</div>
                  <div className="text-base text-gray-600 dark:text-gray-400">Users</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">500+</div>
                  <div className="text-base text-gray-600 dark:text-gray-400">Stocks</div>
                </div>
              </div>
            </div>

            {/* Right - 3D Trading Graph Animation */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-2xl aspect-square">
                {/* Glowing background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 dark:from-cyan-400/20 dark:via-blue-400/20 dark:to-purple-400/20 blur-3xl rounded-full"></div>
                
                {/* 3D Animated Trading Graph */}
                <svg viewBox="0 0 400 400" className="relative w-full h-auto animate-float" style={{ filter: 'drop-shadow(0 0 40px rgba(0, 184, 255, 0.3))' }}>
                  <defs>
                    <linearGradient id="graphGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00B8FF" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#0066FF" stopOpacity="0.3"/>
                    </linearGradient>
                    <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00B8FF" stopOpacity="0.6"/>
                      <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#0066FF" stopOpacity="0.6"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Rotating grid background */}
                  <g className="animate-spin-slow" style={{ transformOrigin: 'center', animation: 'spin 20s linear infinite' }}>
                    <circle cx="200" cy="200" r="150" fill="none" stroke="url(#glowGradient)" strokeWidth="1" opacity="0.3"/>
                    <circle cx="200" cy="200" r="120" fill="none" stroke="url(#glowGradient)" strokeWidth="1" opacity="0.3"/>
                    <circle cx="200" cy="200" r="90" fill="none" stroke="url(#glowGradient)" strokeWidth="1" opacity="0.3"/>
                    <line x1="50" y1="200" x2="350" y2="200" stroke="url(#glowGradient)" strokeWidth="1" opacity="0.3"/>
                    <line x1="200" y1="50" x2="200" y2="350" stroke="url(#glowGradient)" strokeWidth="1" opacity="0.3"/>
                  </g>
                  
                  {/* 3D Graph bars with animation */}
                  <g className="animate-pulse-slow">
                    {/* Bar 1 */}
                    <path d="M 100 250 L 100 180 L 120 170 L 120 240 Z" fill="url(#graphGradient)" opacity="0.9">
                      <animate attributeName="d" dur="3s" repeatCount="indefinite" 
                        values="M 100 250 L 100 180 L 120 170 L 120 240 Z;
                                M 100 250 L 100 160 L 120 150 L 120 240 Z;
                                M 100 250 L 100 180 L 120 170 L 120 240 Z"/>
                    </path>
                    <path d="M 100 180 L 120 170 L 120 170 L 100 180 Z" fill="#00E5FF" opacity="0.6"/>
                    
                    {/* Bar 2 */}
                    <path d="M 140 250 L 140 150 L 160 140 L 160 240 Z" fill="url(#graphGradient)" opacity="0.9">
                      <animate attributeName="d" dur="3s" repeatCount="indefinite" begin="0.3s"
                        values="M 140 250 L 140 150 L 160 140 L 160 240 Z;
                                M 140 250 L 140 120 L 160 110 L 160 240 Z;
                                M 140 250 L 140 150 L 160 140 L 160 240 Z"/>
                    </path>
                    <path d="M 140 150 L 160 140 L 160 140 L 140 150 Z" fill="#00E5FF" opacity="0.6"/>
                    
                    {/* Bar 3 */}
                    <path d="M 180 250 L 180 120 L 200 110 L 200 240 Z" fill="url(#graphGradient)" opacity="0.9">
                      <animate attributeName="d" dur="3s" repeatCount="indefinite" begin="0.6s"
                        values="M 180 250 L 180 120 L 200 110 L 200 240 Z;
                                M 180 250 L 180 90 L 200 80 L 200 240 Z;
                                M 180 250 L 180 120 L 200 110 L 200 240 Z"/>
                    </path>
                    <path d="M 180 120 L 200 110 L 200 110 L 180 120 Z" fill="#00E5FF" opacity="0.6"/>
                    
                    {/* Bar 4 */}
                    <path d="M 220 250 L 220 140 L 240 130 L 240 240 Z" fill="url(#graphGradient)" opacity="0.9">
                      <animate attributeName="d" dur="3s" repeatCount="indefinite" begin="0.9s"
                        values="M 220 250 L 220 140 L 240 130 L 240 240 Z;
                                M 220 250 L 220 110 L 240 100 L 240 240 Z;
                                M 220 250 L 220 140 L 240 130 L 240 240 Z"/>
                    </path>
                    <path d="M 220 140 L 240 130 L 240 130 L 220 140 Z" fill="#00E5FF" opacity="0.6"/>
                    
                    {/* Bar 5 */}
                    <path d="M 260 250 L 260 100 L 280 90 L 280 240 Z" fill="url(#graphGradient)" opacity="0.9">
                      <animate attributeName="d" dur="3s" repeatCount="indefinite" begin="1.2s"
                        values="M 260 250 L 260 100 L 280 90 L 280 240 Z;
                                M 260 250 L 260 70 L 280 60 L 280 240 Z;
                                M 260 250 L 260 100 L 280 90 L 280 240 Z"/>
                    </path>
                    <path d="M 260 100 L 280 90 L 280 90 L 260 100 Z" fill="#00E5FF" opacity="0.6"/>
                  </g>
                  
                  {/* Floating particles */}
                  <circle cx="150" cy="120" r="3" fill="#00B8FF" opacity="0.6">
                    <animate attributeName="cy" dur="4s" repeatCount="indefinite" values="120;80;120"/>
                    <animate attributeName="opacity" dur="4s" repeatCount="indefinite" values="0.6;1;0.6"/>
                  </circle>
                  <circle cx="250" cy="100" r="3" fill="#00E5FF" opacity="0.6">
                    <animate attributeName="cy" dur="5s" repeatCount="indefinite" values="100;60;100"/>
                    <animate attributeName="opacity" dur="5s" repeatCount="indefinite" values="0.6;1;0.6"/>
                  </circle>
                  <circle cx="200" cy="90" r="4" fill="#0066FF" opacity="0.8">
                    <animate attributeName="cy" dur="3s" repeatCount="indefinite" values="90;50;90"/>
                    <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="0.8;1;0.8"/>
                  </circle>
                </svg>
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
