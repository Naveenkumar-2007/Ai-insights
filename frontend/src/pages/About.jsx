import React from 'react';
import { Brain, TrendingUp, Shield, Zap, Target, Award, Users, BarChart3, Sparkles, LineChart, Lock, Clock } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning algorithms analyze market trends to provide accurate stock price forecasts.',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Analysis',
      description: 'Get instant access to live market data, technical indicators, and price movements as they happen.',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      icon: Shield,
      title: 'Reliable & Secure',
      description: 'Built with enterprise-grade security and data integrity to ensure your analysis is always accurate.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance delivers predictions and analysis in seconds, not minutes.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: Target,
      title: 'Smart Trading Signals',
      description: 'Clear BUY, SELL, or HOLD recommendations help you make confident investment decisions.',
      gradient: 'from-rose-500 to-orange-500'
    },
    {
      icon: BarChart3,
      title: 'Comprehensive Charts',
      description: 'Interactive visualizations make complex market data easy to understand and act upon.',
      gradient: 'from-orange-500 to-amber-500'
    }
  ];

  const stats = [
    { label: 'Prediction Accuracy', value: '92%' },
    { label: 'Stocks Supported', value: '500+' },
    { label: 'Daily Predictions', value: '10K+' },
    { label: 'Active Users', value: '5K+' }
  ];

  const benefits = [
    {
      icon: Sparkles,
      text: 'Make data-driven investment decisions with AI-powered insights'
    },
    {
      icon: Clock,
      text: 'Save time with automated technical analysis and predictions'
    },
    {
      icon: Shield,
      text: 'Reduce risk by understanding market sentiment and trends'
    },
    {
      icon: LineChart,
      text: 'Track multiple stocks with detailed performance metrics'
    },
    {
      icon: TrendingUp,
      text: 'Access real-time news and sentiment analysis'
    },
    {
      icon: Target,
      text: 'Get multi-day forecasts to plan your trading strategy'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 dark:from-cyan-500/10 dark:via-blue-500/10 dark:to-purple-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 rounded-full mb-6">
              <Brain className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-medium text-cyan-700 dark:text-cyan-400">AI-Powered Stock Analysis</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              About <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">AI Insights</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Empowering investors with cutting-edge artificial intelligence to make smarter, 
              data-driven decisions in the stock market. Our platform combines machine learning, 
              real-time data analysis, and comprehensive market insights.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Mission Statement */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg sm:text-xl leading-relaxed opacity-95">
                We believe that everyone should have access to professional-grade investment tools. 
                Our mission is to democratize stock market analysis by leveraging artificial intelligence 
                to provide accurate predictions, real-time insights, and actionable recommendations 
                that were once available only to institutional investors.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to make informed investment decisions, powered by advanced AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-200 dark:border-dark-border p-8 sm:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose AI Insights?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Join thousands of investors making smarter decisions every day
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 dark:bg-cyan-500/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-1.5">
                      {benefit.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-cyan-600 to-blue-600 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 sm:p-12 text-center shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start?
          </h2>
          <p className="text-lg text-white/90 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who are already making smarter decisions with AI Insights
          </p>
          <a
            href="/prediction"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gradient-to-r dark:from-cyan-600 dark:to-blue-600 text-cyan-600 dark:text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Brain className="w-5 h-5" />
            <span>Get Started Now</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
