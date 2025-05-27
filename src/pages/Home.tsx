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

  // Floating hearts animation
  const [floatingHearts, setFloatingHearts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Math.random(),
        left: Math.random() * 100,
        delay: Math.random() * 2
      };
      setFloatingHearts(prev => [...prev.slice(-8), newHeart]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Floating Hearts Background */}
      {floatingHearts.map(heart => (
        <div
          key={heart.id}
          className="absolute animate-pulse opacity-20"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            top: '100%',
            animation: `float 8s ease-in-out infinite ${heart.delay}s`
          }}
        >
          <Heart className="w-6 h-6 text-red-400" fill="currentColor" />
        </div>
      ))}

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-4xl">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4 rounded-full shadow-2xl">
              <Heart className="w-12 h-12 text-white" fill="currentColor" />
            </div>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent mb-6 leading-tight">
            Heartconomy
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-300 italic font-light mb-8">
            Die for the like.
          </p>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The first social network where your attention becomes currency. 
            Turn hearts into influence, engagement into wealth.
          </p>
        </div>

        {/* Interactive Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 w-full max-w-4xl">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-8 h-8 text-red-400 group-hover:scale-110 transition-transform" fill="currentColor" />
              <span className="text-3xl font-bold text-white">{heartCount}</span>
            </div>
            <p className="text-gray-300 text-sm">Hearts to Start</p>
            <p className="text-gray-500 text-xs mt-1">Your social lifeblood</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
              <span className="text-3xl font-bold text-white">∞</span>
            </div>
            <p className="text-gray-300 text-sm">Earning Potential</p>
            <p className="text-gray-500 text-xs mt-1">Unlimited growth</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-3xl font-bold text-white">1K+</span>
            </div>
            <p className="text-gray-300 text-sm">Early Adopters</p>
            <p className="text-gray-500 text-xs mt-1">Join the revolution</p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 w-full max-w-6xl">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 group hover:scale-[1.02]">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-xl mr-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Social Currency</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Transform your engagement into real social capital. Every like, comment, and share 
              becomes part of your digital wealth portfolio.
            </p>
            <div className="flex items-center text-red-400 group-hover:text-red-300 transition-colors">
              <span className="text-sm font-medium">Learn more</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 group hover:scale-[1.02]">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl mr-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Meaningful Connections</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Build authentic relationships through intentional engagement. When every interaction 
              has value, conversations become more meaningful.
            </p>
            <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
              <span className="text-sm font-medium">Discover how</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 group hover:scale-[1.02]">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl mr-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Dynamic Growth</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Watch your influence expand as you contribute value to the community. Your social 
              wallet grows with genuine engagement and quality content.
            </p>
            <div className="flex items-center text-green-400 group-hover:text-green-300 transition-colors">
              <span className="text-sm font-medium">Start growing</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 group hover:scale-[1.02]">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-xl mr-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Revolutionary Experience</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Escape mindless scrolling forever. Every moment on Heartconomy is intentional, 
              valuable, and designed to enrich your digital life.
            </p>
            <div className="flex items-center text-yellow-400 group-hover:text-yellow-300 transition-colors">
              <span className="text-sm font-medium">Join revolution</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <button
            onClick={() => {
              animateHeart();
              handleSignUp();
            }}
            className={`group relative bg-gradient-to-r from-red-600 via-red-500 to-pink-600 hover:from-red-500 hover:via-red-400 hover:to-pink-500 text-white font-bold py-6 px-12 rounded-full text-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-red-500/25 active:scale-95 ${isAnimating ? 'animate-pulse' : ''}`}
          >
            <span className="relative z-10 flex items-center">
              <Heart className={`w-6 h-6 mr-3 ${isAnimating ? 'animate-bounce' : ''}`} fill="currentColor" />
              Start Your Journey
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
          </button>
          
          <p className="text-gray-400 mt-6 text-sm">
            Join the first 1,000 members • No credit card required
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};