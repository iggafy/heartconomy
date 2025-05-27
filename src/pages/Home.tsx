import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Users, TrendingUp, Zap, ArrowRight } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [heartCount, setHeartCount] = useState(100);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSignUp = () => {
    navigate('/auth');
  };

  const animateHeart = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Heartconomy</h1>
              <p className="text-sm text-gray-500 italic">Die for the like</p>
            </div>
          </div>
          
          <button
            onClick={handleSignUp}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
          >
            Sign Up
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-400 to-red-500 rounded-2xl mb-6 shadow-lg">
              <Heart className="w-10 h-10 text-white" fill="currentColor" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Heartconomy — <span className="italic text-red-500">Die for the like.</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Where every like costs a heartbeat, and social survival depends on your generosity.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-4 mx-auto">
                <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">100</div>
              <div className="text-sm text-gray-600">Hearts to Start</div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 mx-auto">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">1K+</div>
              <div className="text-sm text-gray-600">Early Members</div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">∞</div>
              <div className="text-sm text-gray-600">Earning Potential</div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* What is Heartconomy */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mr-4">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">What is Heartconomy?</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Welcome to the first social network that turns your attention into currency. Start with 100 Hearts — spend them wisely on likes and comments, earn more by creating content that others love, or risk fading into social death.
            </p>
          </div>

          {/* How it Works */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mr-4">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">How it Works</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-gray-900">100 Hearts to start:</span>
                  <span className="text-gray-700 ml-1">Your social lifeblood.</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-gray-900">Spend Hearts to Like & Comment:</span>
                  <span className="text-gray-700 ml-1">Likes cost 1 Heart, comments cost 5 Hearts.</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-gray-900">Earn Hearts:</span>
                  <span className="text-gray-700 ml-1">Get Hearts back when others like your posts.</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-gray-900">Social Death:</span>
                  <span className="text-gray-700 ml-1">Reach 0 Hearts and you're locked out — until someone revives you by liking your latest post.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Why Join */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mr-4">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Why Join Heartconomy?</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                <div className="text-gray-700">Experience social media with real stakes</div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                <div className="text-gray-700">Meaningful interactions replace mindless scrolling</div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                <div className="text-gray-700">Play the emotional economy game and watch your influence grow or fade</div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                <div className="text-gray-700">Join a community where every action counts</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 rounded-3xl p-12 border border-gray-200">
          <p className="text-2xl text-gray-800 mb-8 font-medium">
            Join Heartconomy now — spend your love wisely.
          </p>
          
          <button
            onClick={() => {
              animateHeart();
              handleSignUp();
            }}
            className={`inline-flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-8 rounded-full text-lg shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${isAnimating ? 'animate-pulse' : ''}`}
          >
            <Heart className={`w-5 h-5 mr-3 ${isAnimating ? 'animate-bounce' : ''}`} fill="currentColor" />
            Sign Up for Free
            <ArrowRight className="w-5 h-5 ml-3" />
          </button>
          
          <p className="text-gray-500 mt-6 text-sm">
            Join the first 1,000 members • No credit card required
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
            <span className="text-gray-600 text-sm">Post wisely — every word matters in the heartconomy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};