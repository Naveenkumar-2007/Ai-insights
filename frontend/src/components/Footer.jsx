import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-600">
              © 2025 AI Insights. Built with AI technology{' '}
              <Heart className="inline w-4 h-4 text-red-500" />
            </p>
            <p className="text-sm text-gray-500 mt-1">Powered by real-time market intelligence</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;