
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Users, TrendingUp, Zap, ArrowRight, Skull, Mail, ThumbsUp, Target, Gift, Crown, Shield, Flame } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-20">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 rounded-3xl mb-6 shadow-2xl animate-pulse">
              <Heart className="w-12 h-12 text-white" fill="currentColor" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Heartconomy
            </span>
          </h1>
          
          <p className="text-2xl font-medium text-red-600 mb-8 italic">
            Die for the like.
          </p>
          
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-12">
            The revolutionary social network where your Hearts are your lifeline. Every interaction has weight, every post has purpose, and social death is just one bad decision away.
          </p>

          {/* Live Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6 mx-auto">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-3">Share Thoughts</div>
              <div className="text-gray-700 text-lg">
                Create posts for <span className="font-bold text-purple-600">2 Hearts</span>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6 mx-auto">
                <ThumbsUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-3">Show Love</div>
              <div className="text-gray-700 text-lg">
                Like someone's post for <span className="font-bold text-green-600">1 Heart</span>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 mx-auto">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-3">Join Conversations</div>
              <div className="text-gray-700 text-lg">
                Comment thoughtfully for <span className="font-bold text-blue-600">3 Hearts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* What is Heartconomy */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-red-200 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mr-4">
                <Heart className="w-8 h-8 text-red-600" fill="currentColor" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">The Heart Economy</h2>
            </div>
            <p className="text-gray-800 text-lg leading-relaxed mb-6">
              Every interaction has real consequences. Your Hearts determine your social survival in this revolutionary platform where quality matters more than quantity.
            </p>
            <div className="space-y-4">
              <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
                <div className="flex items-center mb-2">
                  <Gift className="w-5 h-5 text-red-500 mr-3" />
                  <span className="font-bold text-gray-900">Earn Hearts Back</span>
                </div>
                <p className="text-gray-700 text-sm">
                  When others engage with your content, you earn Hearts back — turning creativity into social currency.
                </p>
              </div>
              <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
                <div className="flex items-center mb-2">
                  <Zap className="w-5 h-5 text-yellow-500 mr-3" />
                  <span className="font-bold text-gray-900">Revive the Dead</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Out of Hearts? Someone can revive you by spending their own — creating bonds of digital life and death.
                </p>
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-blue-200 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mr-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Social Survival</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="font-bold text-gray-900">Start Strong</span>
                </div>
                <p className="text-gray-700 text-sm">Begin with 100 Hearts — your social lifeline</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="font-bold text-gray-900">Spend Wisely</span>
                </div>
                <p className="text-gray-700 text-sm">Every like, post, and comment costs Hearts</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="font-bold text-gray-900">Create Quality</span>
                </div>
                <p className="text-gray-700 text-sm">Great content brings Hearts back when others engage</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="flex items-center mb-2">
                  <Skull className="w-4 h-4 text-red-500 mr-3" />
                  <span className="font-bold text-red-600">Social Death</span>
                </div>
                <p className="text-gray-700 text-sm">Hit 0 Hearts and enter the Dead Zone until someone revives you</p>
              </div>
            </div>
          </div>
        </div>

        {/* Competitive Features */}
        <div className="bg-gradient-to-r from-purple-900 via-pink-900 to-red-900 rounded-3xl p-12 mb-20 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20"></div>
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Built for Champions</h2>
              <p className="text-xl text-purple-100">Compete, survive, and dominate the social hierarchy</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-2xl mb-4 mx-auto">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Leaderboards</h3>
                <p className="text-purple-100">Climb the ranks across multiple categories — from top vampires to revival heroes</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl mb-4 mx-auto">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Real Stakes</h3>
                <p className="text-purple-100">Every interaction matters — no mindless scrolling, only meaningful engagement</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-red-500 rounded-2xl mb-4 mx-auto">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Live or Die</h3>
                <p className="text-purple-100">Experience the thrill of social survival in the digital age</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-3xl p-16 border border-gray-200 shadow-2xl">
          <div className="mb-8">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Risk It All?
            </h3>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Join the most intense social network ever created. Where every Heart counts, every post matters, and social death is always one click away.
            </p>
            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">100</div>
                <div className="text-sm text-gray-600">Starting Hearts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">∞</div>
                <div className="text-sm text-gray-600">Earning Potential</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">1</div>
                <div className="text-sm text-gray-600">Life to Live</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => {
              animateHeart();
              handleSignUp();
            }}
            className={`inline-flex items-center bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-6 px-12 rounded-full text-2xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-3xl ${isAnimating ? 'animate-bounce' : ''}`}
          >
            <Heart className={`w-8 h-8 mr-4 ${isAnimating ? 'animate-pulse' : ''}`} fill="currentColor" />
            Start Your Journey
            <ArrowRight className="w-8 h-8 ml-4" />
          </button>
          
          <p className="text-gray-600 text-lg mt-8">
            Free to join • <span className="font-semibold">Rise or Die</span> responsibly
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
            <span className="text-lg">Every Heart counts. Spend yours wisely.</span>
          </div>
          <p className="text-gray-400">
            © 2024 Heartconomy. Where social survival meets digital reality.
          </p>
        </div>
      </footer>
    </div>
  );
};
