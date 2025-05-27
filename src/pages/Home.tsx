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
            Heartconomy — <span className="italic">Die for the like.</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Where every like costs a heartbeat, and social survival depends on your generosity.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 w-full max-w-7xl">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 group hover:scale-[1.02] lg:col-span-3">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-xl mr-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">What is Heartconomy?</h3>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">
              Welcome to the first social network that turns your attention into currency. Start with 100 Hearts — spend them wisely on likes and comments, earn more by creating content that others love, or risk fading into social death.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 group hover:scale-[1.02] lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl mr-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">How it Works</h3>
            </div>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start">
                <div className="bg-red-500 w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-white">100 Hearts to start:</span> Your social lifeblood.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-red-500 w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-white">Spend Hearts to Like & Comment:</span> Likes cost 1 Heart, comments cost 5 Hearts.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-red-500 w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-white">Earn Hearts:</span> Get Hearts back when others like your posts.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-red-500 w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-white">Social Death:</span> Reach 0 Hearts and you're locked out — until someone revives you by liking your latest post.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 group hover:scale-[1.02]">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Why Join Heartconomy?</h3>
            </div>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start">
                <div className="bg-green-500 w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>Experience social media with real stakes</div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-500 w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>Meaningful interactions replace mindless scrolling</div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-500 w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>Play the emotional economy game and watch your influence grow or fade</div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-500 w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>Join a community where every action counts</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-2xl text-gray-300 mb-8 font-light">
            Join Heartconomy now — spend your love wisely.
          </p>
          
          <button
            onClick={() => {
              animateHeart();
              handleSignUp();
            }}
            className={`group relative bg-gradient-to-r from-red-600 via-red-500 to-pink-600 hover:from-red-500 hover:via-red-400 hover:to-pink-500 text-white font-bold py-6 px-12 rounded-full text-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-red-500/25 active:scale-95 ${isAnimating ? 'animate-pulse' : ''}`}
          >
            <span className="relative z-10 flex items-center">
              <Heart className={`w-6 h-6 mr-3 ${isAnimating ? 'animate-bounce' : ''}`} fill="currentColor" />
              Sign Up for Free
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