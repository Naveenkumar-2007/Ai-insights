import React from 'react';
import { Brain, TrendingUp, Shield, Zap, Target, Award, Users, BarChart3 } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning algorithms analyze market trends to provide accurate stock price forecasts.'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Analysis',
      description: 'Get instant access to live market data, technical indicators, and price movements as they happen.'
    },
    {
      icon: Shield,
      title: 'Reliable & Secure',
      description: 'Built with enterprise-grade security and data integrity to ensure your analysis is always accurate.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance delivers predictions and analysis in seconds, not minutes.'
    },
    {
      icon: Target,
      title: 'Smart Trading Signals',
      description: 'Clear BUY, SELL, or HOLD recommendations help you make confident investment decisions.'
    },
    {
      icon: BarChart3,
      title: 'Comprehensive Charts',
      description: 'Interactive visualizations make complex market data easy to understand and act upon.'
    }
  ];

  const benefits = [
    'Make data-driven investment decisions with AI-powered insights',
    'Save time with automated technical analysis and predictions',
    'Reduce risk by understanding market sentiment and trends',
    'Track multiple stocks with detailed performance metrics',
    'Access real-time news and sentiment analysis',
    'Get multi-day forecasts to plan your trading strategy'
  ];

  return (
    <div className="min-h-screen bg-brand-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 rounded-2xl mb-4 sm:mb-6 shadow-lg">
            <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text mb-4 sm:mb-6 px-4">
            About AI Insights
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-brand-muted max-w-3xl mx-auto leading-relaxed px-4">
            Your intelligent companion for smarter stock market investments. We combine cutting-edge 
            artificial intelligence with comprehensive market analysis to help you make informed trading decisions.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 mb-10 sm:mb-16 text-white shadow-2xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 flex items-center justify-center gap-2 sm:gap-3">
              <Award className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
              <span>Our Mission</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-brand-50 leading-relaxed mb-4 sm:mb-6">
              We believe that powerful financial tools should be accessible to everyone. Our mission 
              is to democratize stock market intelligence by providing professional-grade analysis 
              and predictions at your fingertips.
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-brand-50 leading-relaxed">
              Whether you're a seasoned trader or just starting your investment journey, AI Stock 
              Predictor empowers you with the insights needed to make confident, data-driven decisions 
              in today's fast-paced financial markets.
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-text text-center mb-8 sm:mb-12 px-4">
            What We Offer
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-brand-100/60 hover:shadow-2xl transition-all transform hover:-translate-y-2 active-scale"
              >
                <div className="bg-gradient-to-br from-brand-500 to-brand-600 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-brand-text mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-brand-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-br from-white to-brand-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 mb-10 sm:mb-16 border border-brand-100/70">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-text text-center mb-8 sm:mb-12 px-4">
            Why Choose AI Insights?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md border border-brand-100/60 active-scale">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-text mb-3 sm:mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600 flex-shrink-0" />
                <span>User-Friendly Interface</span>
              </h3>
              <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                Our intuitive design makes complex market analysis simple and accessible. 
                No financial expertise required – just enter a stock symbol and get instant insights.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md border border-brand-100/60 active-scale">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-text mb-3 sm:mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600 flex-shrink-0" />
                <span>Accurate Predictions</span>
              </h3>
              <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                Our AI models are continuously refined and validated to provide you with 
                reliable predictions you can trust for your investment strategy.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md border border-brand-100/60 active-scale">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-text mb-3 sm:mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600 flex-shrink-0" />
                <span>Comprehensive Analysis</span>
              </h3>
              <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                Get a complete picture with technical indicators, sentiment analysis, news feeds, 
                and performance metrics all in one place.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md border border-brand-100/60 active-scale">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-text mb-3 sm:mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600 flex-shrink-0" />
                <span>Real-Time Updates</span>
              </h3>
              <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                Stay ahead of the market with live data feeds and instant predictions that 
                adapt to changing market conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-brand-100/60 mb-16">
          <h2 className="text-4xl font-bold text-brand-text mb-8 text-center">
            Benefits You'll Enjoy
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-white to-brand-50 rounded-xl border border-brand-100/40">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-brand-text font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How to Use */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-brand-text text-center mb-12">
            How to Use
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Enter Stock Symbol',
                description: 'Type in any stock ticker (like AAPL, TSLA, or GOOGL) to get started.',
                color: 'from-brand-500 to-brand-600'
              },
              {
                step: '2',
                title: 'Select Time Frame',
                description: 'Choose how many days ahead you want to predict (1 to 30 days).',
                color: 'from-brand-500 to-brand-700'
              },
              {
                step: '3',
                title: 'Analyze Results',
                description: 'Review predictions, charts, signals, and make informed decisions.',
                color: 'from-brand-600 to-brand-500'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-brand-text mb-3">{item.title}</h3>
                <p className="text-brand-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-16">
          <h3 className="text-lg font-bold text-yellow-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Investment Disclaimer
          </h3>
          <p className="text-yellow-800 text-sm leading-relaxed">
            AI Insights is an analytical tool designed to assist with investment research. 
            All predictions and analyses are for informational purposes only and should not be 
            considered as financial advice. Past performance does not guarantee future results. 
            Always conduct your own research and consult with qualified financial advisors before 
            making investment decisions.
          </p>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Start Predicting?
          </h2>
          <p className="text-xl text-brand-50 mb-8 max-w-2xl mx-auto">
            Join thousands of traders making smarter investment decisions with AI-powered insights
          </p>
          <a
            href="/prediction"
            className="inline-block bg-white text-brand-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-50 transition-all transform hover:scale-105 shadow-lg"
          >
            Try It Now - It's Free
          </a>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center text-brand-muted">
          <p className="text-sm text-brand-text font-semibold">
            © 2025 AI Insights. Built with AI technology.
          </p>
          <p className="text-sm mt-2">
            Powered by real-time market intelligence.
          </p>
          <p className="text-sm mt-2">
            Developed by AI Insights team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;