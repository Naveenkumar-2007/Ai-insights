import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, Search, DollarSign, BarChart3, Activity } from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, ComposedChart 
} from 'recharts';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-dark-card p-3 border border-gray-200 dark:border-dark-border rounded-lg shadow-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name}: ${entry.value?.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Sentiment Gauge Component
const SentimentGauge = ({ sentiment }) => {
  if (!sentiment) return null;
  
  const score = sentiment.score || 0;
  const label = sentiment.label || 'Neutral';
  const percentage = ((score + 1) / 2) * 100;
  
  const getColor = () => {
    if (score > 0.3) return '#10b981';
    if (score < -0.3) return '#ef4444';
    return '#94a3b8';
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative w-40 h-40">
        <svg className="transform -rotate-90 w-full h-full">
          <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="12" fill="none" />
          <circle
            cx="80" cy="80" r="70"
            stroke={getColor()}
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${percentage * 4.4} 440`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color: getColor() }}>
            {label}
          </span>
          <span className="text-sm text-gray-500 mt-1">
            Score: {score.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

const formatCurrencyCompact = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return 'N/A';
  }

  const absValue = Math.abs(numeric);
  if (absValue >= 1e12) {
    return `$${(numeric / 1e12).toFixed(2)}T`;
  }
  if (absValue >= 1e9) {
    return `$${(numeric / 1e9).toFixed(2)}B`;
  }
  if (absValue >= 1e6) {
    return `$${(numeric / 1e6).toFixed(2)}M`;
  }
  if (absValue >= 1e3) {
    return `$${(numeric / 1e3).toFixed(2)}K`;
  }
  return `$${numeric.toFixed(2)}`;
};

const formatVolume = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return 'N/A';
  }

  if (numeric >= 1e9) {
    return `${(numeric / 1e9).toFixed(2)}B`;
  }
  if (numeric >= 1e6) {
    return `${(numeric / 1e6).toFixed(2)}M`;
  }
  if (numeric >= 1e3) {
    return `${(numeric / 1e3).toFixed(2)}K`;
  }
  return numeric.toLocaleString();
};

function Prediction() {
  const [ticker, setTicker] = useState('AAPL');
  const [days, setDays] = useState(7);
  const [stockData, setStockData] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const hideSuggestionsTimeoutRef = useRef(null);
  const searchDebounceRef = useRef(null);

  useEffect(() => {
    fetchStockData('AAPL');
  }, []);

  useEffect(() => {
    return () => {
      if (hideSuggestionsTimeoutRef.current) {
        clearTimeout(hideSuggestionsTimeoutRef.current);
        hideSuggestionsTimeoutRef.current = null;
      }
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = null;
      }
    };
  }, []);

  const handleTickerInput = (value) => {
    if (hideSuggestionsTimeoutRef.current) {
      clearTimeout(hideSuggestionsTimeoutRef.current);
      hideSuggestionsTimeoutRef.current = null;
    }
    const formatted = value.toUpperCase();
    setTicker(formatted);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }

    const query = formatted.trim();
    if (!query) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchDebounceRef.current = setTimeout(async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/search`, {
          params: { q: query, limit: 5 }
        });
        const results = Array.isArray(data?.results) ? data.results : [];
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (err) {
        console.error('Ticker lookup failed:', err);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        searchDebounceRef.current = null;
      }
    }, 250);
  };

  const handleSuggestionSelect = (symbol) => {
    setTicker(symbol);
    setShowSuggestions(false);
    setSuggestions([]);
    if (hideSuggestionsTimeoutRef.current) {
      clearTimeout(hideSuggestionsTimeoutRef.current);
      hideSuggestionsTimeoutRef.current = null;
    }
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
    fetchStockData(symbol);
  };

  const handleInputFocus = () => {
    if (hideSuggestionsTimeoutRef.current) {
      clearTimeout(hideSuggestionsTimeoutRef.current);
      hideSuggestionsTimeoutRef.current = null;
    }
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    if (hideSuggestionsTimeoutRef.current) {
      clearTimeout(hideSuggestionsTimeoutRef.current);
    }
    hideSuggestionsTimeoutRef.current = setTimeout(() => {
      setShowSuggestions(false);
      hideSuggestionsTimeoutRef.current = null;
    }, 150);
  };

  const fetchStockData = async (symbol) => {
    setLoading(true);
    setError(null);
    try {
      const [stockRes, sentimentRes, newsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/stock/${symbol}?days=${days}`),
        axios.get(`${API_BASE}/api/sentiment/${symbol}`).catch(() => ({ data: { sentiment: null } })),
        axios.get(`${API_BASE}/api/news/${symbol}?days=7`).catch(() => ({ data: { news: [] } }))
      ]);

      const payload = stockRes.data;
      setStockData(payload);
      if (
        payload?.ticker &&
        payload?.requested_ticker &&
        payload.ticker !== payload.requested_ticker
      ) {
        setTicker(payload.ticker);
      }
      setSentiment(sentimentRes.data.sentiment);
      setNews(newsRes.data.news || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = ticker.trim().toUpperCase();
    if (!query) {
      return;
    }

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
    if (hideSuggestionsTimeoutRef.current) {
      clearTimeout(hideSuggestionsTimeoutRef.current);
      hideSuggestionsTimeoutRef.current = null;
    }

    setTicker(query);
    fetchStockData(query);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const computePredictionRows = () => {
    if (!stockData?.future_predictions || !Array.isArray(stockData.future_predictions)) {
      return [];
    }

    return stockData.future_predictions.map((entry, index) => {
      const price = Number(entry?.price ?? NaN);
      const baseline = Number(stockData.current_price ?? NaN);
      if (!Number.isFinite(price) || !Number.isFinite(baseline) || baseline <= 0) {
        return null;
      }

      const change = price - baseline;
      const changePercent = (change / baseline) * 100;
      let signal = 'HOLD';
      if (changePercent >= 2) {
        signal = 'BUY';
      } else if (changePercent <= -2) {
        signal = 'SELL';
      }

      return {
        id: `${entry.date}-${index}`,
        dateLabel: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        price: price.toFixed(2),
        change: change.toFixed(2),
        changePercent: changePercent.toFixed(2),
        signal
      };
    }).filter(Boolean);
  };

  const predictionRows = computePredictionRows();

  if (loading && !stockData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600 dark:border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Loading stock data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-4 sm:py-6">
      {/* Search Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
        <div className="bg-white dark:bg-dark-card rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-dark-border">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center justify-center">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={ticker}
                onChange={(e) => handleTickerInput(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Enter ticker (e.g., AAPL)"
                className="w-full px-4 py-3 sm:px-6 sm:py-3 border-2 border-gray-300 dark:border-dark-border bg-white dark:bg-dark-elevated text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-base sm:text-lg touch-target"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-20 mt-2 w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto">
                  <ul className="divide-y divide-gray-100 dark:divide-dark-border">
                    {suggestions.map(({ symbol, name, exchange, country, currency }) => (
                      <li key={`${symbol}-${exchange || 'NA'}`}>
                        <button
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => handleSuggestionSelect(symbol)}
                          className="w-full px-3 py-3 sm:px-4 sm:py-2 flex items-start justify-between text-left hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-colors touch-target active-scale"
                        >
                          <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{symbol}</span>
                          <div className="flex-1 ml-3 overflow-hidden">
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{name}</p>
                            {(exchange || country || currency) && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                                {[exchange, country, currency].filter(Boolean).join(' · ')}
                              </p>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full sm:w-auto px-4 py-3 border-2 border-gray-300 dark:border-dark-border bg-white dark:bg-dark-elevated text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 text-base sm:text-lg touch-target"
            >
              <option value={1}>1 Day</option>
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
            </select>
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3 sm:px-8 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition transform hover:scale-105 active:scale-95 text-base sm:text-lg font-semibold touch-target active-scale ripple shadow-lg hover:shadow-cyan-500/25"
            >
              <Search className="w-5 h-5" />
              Analyze Stock
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
          <div className="bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 sm:px-6 sm:py-4 rounded-lg">
            <p className="font-bold text-sm sm:text-base">Error</p>
            <p className="text-xs sm:text-sm">{error}</p>
          </div>
        </div>
      )}

      {stockData && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stock Header */}
          <div className="bg-white dark:bg-dark-card rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200 dark:border-dark-border">
            <div className="flex items-start justify-between flex-wrap gap-3 sm:gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">{stockData.ticker}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base lg:text-lg line-clamp-2">{stockData.company_name}</p>
              </div>
              
              <div className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold text-sm sm:text-base lg:text-lg ${
                stockData.ai_signal === 'STRONG BUY' || stockData.ai_signal === 'BUY' 
                  ? 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-500/20 dark:to-green-600/20 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-500/30' 
                  : stockData.ai_signal === 'STRONG SELL' || stockData.ai_signal === 'SELL'
                  ? 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-500/20 dark:to-red-600/20 text-red-700 dark:text-red-400 border-2 border-red-300 dark:border-red-500/30'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-500/20 dark:to-gray-600/20 text-gray-700 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-500/30'
              }`}>
                {stockData.is_profit ? <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" /> : <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6" />}
                <span className="whitespace-nowrap">{stockData.ai_signal}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-6">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-500/10 dark:to-cyan-600/10 p-3 sm:p-4 rounded-xl border border-cyan-200 dark:border-cyan-500/20">
                <p className="text-xs sm:text-sm text-cyan-700 dark:text-cyan-400 font-medium flex items-center gap-1">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate">Current Price</span>
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1">${stockData.current_price}</p>
                <p className={`text-xs sm:text-sm mt-1 sm:mt-2 font-semibold ${stockData.day_change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stockData.day_change >= 0 ? '+' : ''}{stockData.day_change.toFixed(2)} ({stockData.day_change_percent.toFixed(2)}%)
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-600/10 p-3 sm:p-4 rounded-xl border border-blue-200 dark:border-blue-500/20">
                <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-400 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate">Predicted Price</span>
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1">${stockData.predicted_price}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 truncate">Next day forecast</p>
              </div>

              <div className={`p-3 sm:p-4 rounded-xl border-2 ${stockData.is_profit ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-500/10 dark:to-green-600/10 border-green-300 dark:border-green-500/20' : 'bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-500/10 dark:to-red-600/10 border-red-300 dark:border-red-500/20'}`}>
                <p className={`text-xs sm:text-sm font-medium flex items-center gap-1 ${stockData.is_profit ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate">Expected Change</span>
                </p>
                <p className={`text-xl sm:text-2xl lg:text-3xl font-bold mt-1 ${stockData.is_profit ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {stockData.profit_loss >= 0 ? '+' : ''}${stockData.profit_loss.toFixed(2)}
                </p>
                <p className={`text-xs sm:text-sm mt-1 sm:mt-2 font-semibold ${stockData.is_profit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stockData.profit_loss_percent >= 0 ? '+' : ''}{stockData.profit_loss_percent.toFixed(2)}%
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-500/10 dark:to-purple-600/10 p-3 sm:p-4 rounded-xl border border-purple-200 dark:border-purple-500/20">
                <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-400 font-medium truncate">Volume</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1 truncate">{formatVolume(stockData.volume)}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 truncate">
                  Mkt Cap: {formatCurrencyCompact(stockData.market_cap)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Price Prediction Chart */}
              <div className="bg-white dark:bg-dark-card rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-dark-border">
                <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-400" />
                    <span>Stock Price Prediction</span>
                  </h3>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-cyan-50 dark:bg-cyan-500/10 px-2 py-1 sm:px-3 sm:py-1 rounded-full font-medium border border-cyan-200 dark:border-cyan-500/20">
                    {days} Days Forecast
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={300} className="sm:!h-[350px]">
                  <ComposedChart data={[
                    ...stockData.historical_data.dates.map((date, i) => ({
                      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                      price: stockData.historical_data.prices[i],
                      type: 'historical'
                    })),
                    ...stockData.future_predictions.map((pred) => ({
                      date: new Date(pred.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                      predicted: pred.price,
                      type: 'predicted'
                    }))
                  ]}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3A8AFF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3A8AFF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Area type="monotone" dataKey="price" stroke="#1F74F0" fill="url(#colorPrice)" strokeWidth={2} name="Historical" />
                    <Line type="monotone" dataKey="predicted" stroke="#3A8AFF" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#3A8AFF', r: 3 }} name="Predicted" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Technical Chart */}
              <div className="bg-white dark:bg-dark-card rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-dark-border">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-400" />
                  <span>Technical Chart</span>
                </h3>
                <ResponsiveContainer width="100%" height={300} className="sm:!h-[400px]">
                  <ComposedChart data={stockData.technical_chart.candles.slice(-30)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10 }} 
                      tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
                    />
                    <YAxis yAxisId="price" orientation="right" domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="volume" orientation="left" tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar yAxisId="volume" dataKey="volume" fill="#94a3b8" opacity={0.3} name="Volume" />
                    <Line yAxisId="price" type="monotone" dataKey="close" stroke="#1F74F0" strokeWidth={2.5} dot={false} name="Close" />
                    {stockData.technical_chart.moving_averages.sma20.length > 0 && (
                      <Line 
                        yAxisId="price" 
                        type="monotone" 
                        data={stockData.technical_chart.moving_averages.sma20} 
                        dataKey="value" 
                        stroke="#f59e0b" 
                        strokeWidth={2} 
                        dot={false} 
                        name="SMA 20" 
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Performance Chart */}
              <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-dark-border">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Performance</h3>
                <div className="flex gap-4 mb-6 flex-wrap">
                  {Object.entries(stockData.performance).map(([period, value]) => (
                    value !== null && (
                      <div key={period} className="text-center bg-gray-50 dark:bg-dark-elevated px-4 py-2 rounded-lg border border-gray-200 dark:border-dark-border">
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{period}</p>
                        <p className={`text-lg font-bold mt-1 ${value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {value >= 0 ? '+' : ''}{value}%
                        </p>
                      </div>
                    )
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={stockData.performance_chart.dates.map((date, i) => ({
                    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    price: stockData.performance_chart.prices[i]
                  }))}>
                    <defs>
                      <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3A8AFF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3A8AFF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="price" stroke="#1F74F0" fill="url(#colorPerf)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Forecast Table */}
              <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-dark-border">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Forecast Signals</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-dark-elevated text-gray-600 dark:text-gray-400 uppercase text-xs font-semibold">
                        <th className="px-4 py-3 rounded-l-lg">Date</th>
                        <th className="px-4 py-3">Signal</th>
                        <th className="px-4 py-3">Predicted</th>
                        <th className="px-4 py-3">Δ Price</th>
                        <th className="px-4 py-3 rounded-r-lg">Δ %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictionRows.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                            No forecast data available.
                          </td>
                        </tr>
                      )}
                      {predictionRows.map((row) => (
                        <tr key={row.id} className="border-t border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{row.dateLabel}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                row.signal === 'BUY'
                                  ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                                  : row.signal === 'SELL'
                                  ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'
                                  : 'bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400'
                              }`}
                            >
                              {row.signal}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-900 dark:text-white font-semibold">${row.price}</td>
                          <td className={`px-4 py-3 font-semibold ${Number(row.change) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {Number(row.change) >= 0 ? '+' : ''}${row.change}
                          </td>
                          <td className={`px-4 py-3 font-semibold ${Number(row.changePercent) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {Number(row.changePercent) >= 0 ? '+' : ''}{row.changePercent}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column - Indicators & Stats */}
            <div className="space-y-6">
              {/* Technical Indicators */}
              <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-dark-border">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Technical Indicators</h3>
                
                <div className="space-y-4">
                  {stockData.indicators.rsi && (
                    <div className="bg-cyan-50 dark:bg-cyan-500/10 p-4 rounded-xl border border-cyan-200 dark:border-cyan-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">RSI</span>
                        <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{stockData.indicators.rsi}</span>
                      </div>
                      <ResponsiveContainer width="100%" height={60}>
                        <LineChart data={stockData.indicator_trends.rsi.dates.slice(-20).map((date, i) => ({
                          value: stockData.indicator_trends.rsi.values.slice(-20)[i]
                        }))}>
                          <Line type="monotone" dataKey="value" stroke="#1F74F0" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {stockData.indicators.ema && (
                    <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-200 dark:border-blue-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">EMA</span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">${stockData.indicators.ema}</span>
                      </div>
                      <ResponsiveContainer width="100%" height={60}>
                        <LineChart data={stockData.indicator_trends.ema.dates.slice(-20).map((date, i) => ({
                          value: stockData.indicator_trends.ema.values.slice(-20)[i]
                        }))}>
                          <Line type="monotone" dataKey="value" stroke="#1F74F0" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {stockData.indicators.macd && (
                    <div className="bg-purple-50 dark:bg-purple-500/10 p-4 rounded-xl border border-purple-200 dark:border-purple-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">MACD</span>
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{stockData.indicators.macd}</span>
                      </div>
                      <ResponsiveContainer width="100%" height={60}>
                        <ComposedChart data={stockData.indicator_trends.macd.dates.slice(-20).map((date, i) => ({
                          value: stockData.indicator_trends.macd.values.slice(-20)[i],
                          histogram: stockData.indicator_trends.macd.histogram.slice(-20)[i]
                        }))}>
                          <Bar dataKey="histogram" fill={stockData.indicators.macd_histogram >= 0 ? '#3A8AFF' : '#ef4444'} />
                          <Line type="monotone" dataKey="value" stroke="#1F74F0" strokeWidth={2} dot={false} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-dark-border">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-elevated rounded-lg border border-gray-200 dark:border-dark-border">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Market Cap</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrencyCompact(stockData.market_cap)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-elevated rounded-lg border border-gray-200 dark:border-dark-border">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Volume</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{formatVolume(stockData.volume)}</span>
                  </div>
                  {stockData.pe_ratio && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-elevated rounded-lg border border-gray-200 dark:border-dark-border">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">P/E Ratio</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{stockData.pe_ratio}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sentiment */}
              {sentiment && (
                <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-dark-border">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Stock Sentiment</h3>
                  <SentimentGauge sentiment={sentiment} />
                </div>
              )}

              {/* News */}
              {news.length > 0 && (
                <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-dark-border">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Latest News</h3>
                  <div className="space-y-4">
                    {news.slice(0, 3).map((article, index) => (
                      <a
                        key={index}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors border border-gray-200 dark:border-dark-border"
                      >
                        {article.image && (
                          <img 
                            src={article.image} 
                            alt={article.headline} 
                            className="w-full h-32 object-cover rounded-lg mb-3" 
                          />
                        )}
                        <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-cyan-600 dark:hover:text-cyan-400">
                          {article.headline}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {new Date(article.datetime * 1000).toLocaleDateString()}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default Prediction;