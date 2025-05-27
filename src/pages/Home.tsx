import React, { useState } from 'react';
import { Heart, MessageCircle, Users, TrendingUp, Zap, ArrowRight, Skull, Mail, ThumbsUp, Target, Gift } from 'lucide-react';

export const Home = () => {
  const [heartCount, setHeartCount] = useState(100);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSignUp = () => {
    alert('Sign up functionality would redirect to registration page');
  };

  const animateHeart = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="min-h-screen bg-white">
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
            The social network where your Hearts are your lifeline. Start with 100 Hearts — spend them to engage, earn more by creating content people love, or face social extinction.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-xl mb-6 mx-auto">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-3">Create Posts</div>
              <div className="text-gray-700">
                Share your thoughts for <span className="font-bold text-purple-600">0 Hearts</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-6 mx-auto">
                <ThumbsUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-3">Show Love</div>
              <div className="text-gray-700">
                Like someone's post for <span className="font-bold text-green-600">1 Heart</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6 mx-auto">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-3">Join Discussions</div>
              <div className="text-gray-700">
                Comment thoughtfully for <span className="font-bold text-blue-600">5 Hearts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 mb-16">
          {/* What is Heartconomy */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-10 border-2 border-red-100 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-xl mr-4">
                <Heart className="w-8 h-8 text-red-600" fill="currentColor" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">What is Heartconomy?</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-800 text-lg leading-relaxed mb-6">
                  The first social network that transforms engagement into survival. Every interaction has weight, every post has purpose, and every Heart counts toward your digital existence.
                </p>
                <div className="bg-white rounded-2xl p-6 border border-red-200">
                  <div className="flex items-center mb-3">
                    <Gift className="w-6 h-6 text-red-500 mr-3" />
                    <span className="font-bold text-gray-900">Earn Hearts Back</span>
                  </div>
                  <p className="text-gray-700">
                    When others like your posts, you earn Hearts back — turning great content into social currency that keeps you alive and thriving.
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-red-400 to-pink-500 rounded-full mb-4 shadow-lg">
                  <span className="text-4xl font-bold text-white">100</span>
                </div>
                <p className="text-gray-700 font-medium">Hearts to start your journey</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* How it Works */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-100 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mr-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">The Heart Economy</h2>
              </div>
              <div className="space-y-5">
                <div className="bg-white rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="font-bold text-gray-900">Start Strong</span>
                  </div>
                  <p className="text-gray-700 text-sm ml-6">Begin with 100 Hearts — your social lifeline</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="font-bold text-gray-900">Spend Wisely</span>
                  </div>
                  <p className="text-gray-700 text-sm ml-6">Every like, and comment costs Hearts</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="font-bold text-gray-900">Earn Through Quality</span>
                  </div>
                  <p className="text-gray-700 text-sm ml-6">Great content brings Hearts back when others engage</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-red-200">
                  <div className="flex items-center mb-2">
                    <Skull className="w-4 h-4 text-red-500 mr-3" />
                    <span className="font-bold text-red-600">Social Death</span>
                  </div>
                  <p className="text-gray-700 text-sm ml-7">Hit 0 Hearts and get locked out until someone revives you</p>
                </div>
              </div>
            </div>

            {/* Why Join */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-100 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mr-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Why Heartconomy?</h2>
              </div>
              <div className="space-y-5">
                <div className="bg-white rounded-xl p-4 border border-green-200">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="font-bold text-gray-900">Real Stakes</span>
                  </div>
                  <p className="text-gray-700 text-sm ml-6">Every interaction matters — no mindless scrolling</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-green-200">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="font-bold text-gray-900">Quality Content</span>
                  </div>
                  <p className="text-gray-700 text-sm ml-6">High costs encourage meaningful posts and comments</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-green-200">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="font-bold text-gray-900">Emotional Economy</span>
                  </div>
                  <p className="text-gray-700 text-sm ml-6">Experience the thrill of social survival</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 border-2 border-gray-200 shadow-sm">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Risk It All?
            </h3>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Join Heartconomy where every Heart counts, every post matters, and social death is always one bad decision away.
            </p>
          </div>
          
          <button
            onClick={() => {
              animateHeart();
              handleSignUp();
            }}
            className={`inline-flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-5 px-10 rounded-full text-xl shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-2xl ${isAnimating ? 'animate-pulse' : ''}`}
          >
            <Heart className={`w-6 h-6 mr-4 ${isAnimating ? 'animate-bounce' : ''}`} fill="currentColor" />
            Start with 100 Hearts
            <ArrowRight className="w-6 h-6 ml-4" />
          </button>
          
          <p className="text-gray-600 text-sm mt-6">
            Free to join • Rise or Die responsibly
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
            <span className="text-gray-600 text-sm">Every Heart counts. Spend yours wisely.</span>
          </div>
        </div>
        </footer>
    </div>
  );
};