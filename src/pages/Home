import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-red-50 via-pink-50 to-white px-6 py-16 text-center">
      <h1 className="text-5xl font-extrabold text-red-600 mb-4 leading-tight">
        Heartconomy — <span className="italic">Die for the like.</span>
      </h1>

      <p className="text-lg text-gray-700 max-w-xl mb-12">
        Where every like costs a heartbeat, and social survival depends on your generosity.
      </p>

      <section className="max-w-3xl text-left space-y-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold text-red-600 mb-3">What is Heartconomy?</h2>
          <p className="text-gray-800 leading-relaxed">
            Welcome to the first social network that turns your attention into currency.
            Start with <strong>100 Hearts</strong> — spend them wisely on likes and comments,
            earn more by creating content that others love, or risk fading into social death.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-red-600 mb-3">How it Works</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-800 leading-relaxed">
            <li><strong>100 Hearts to start:</strong> Your social lifeblood.</li>
            <li><strong>Spend Hearts to Like & Comment:</strong> Likes cost 1 Heart, comments cost 5 Hearts.</li>
            <li><strong>Earn Hearts:</strong> Get Hearts back when others like your posts.</li>
            <li><strong>Social Death:</strong> Reach 0 Hearts and you’re locked out — until someone revives you by liking your latest post.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-red-600 mb-3">Why Join Heartconomy?</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-800 leading-relaxed">
            <li>Experience social media with real stakes</li>
            <li>Meaningful interactions replace mindless scrolling</li>
            <li>Play the emotional economy game and watch your influence grow or fade</li>
            <li>Join a community where every action counts</li>
          </ul>
        </div>
      </section>

      <button
        onClick={handleSignUp}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transition-colors"
      >
        Sign Up for Free
      </button>
    </div>
  );
};
