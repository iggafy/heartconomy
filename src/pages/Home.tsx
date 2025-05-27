import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/auth');
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-red-50 via-pink-50 to-white px-6 py-20 text-center">
      <h1 className="text-6xl font-extrabold text-red-600 mb-12 leading-tight max-w-4xl">
        Heartconomy — <span className="italic">Die for the like.</span>
      </h1>

      <div className="max-w-4xl w-full space-y-12">
        {/* Card 1 */}
        <section className="bg-white rounded-xl p-10 border border-gray-200 shadow-lg text-left transition-transform hover:scale-[1.02] duration-300">
          <h2 className="text-3xl font-semibold text-gray-900 mb-5">
            What is Heartconomy?
          </h2>
          <p className="text-gray-800 leading-relaxed text-lg">
            Welcome to the first social network that turns your attention into currency. Trade likes, hearts, and comments as real social capital. The more you give, the richer you become.
          </p>
        </section>

        {/* Card 2 */}
        <section className="bg-white rounded-xl p-10 border border-gray-200 shadow-lg text-left transition-transform hover:scale-[1.02] duration-300">
          <h2 className="text-3xl font-semibold text-gray-900 mb-5">
            How it Works
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-800 text-lg leading-relaxed">
            <li>
              <strong>100 Hearts to Start:</strong> Your social lifeblood — use them wisely.
            </li>
            <li>
              <strong>Give & Gain:</strong> Spend hearts by liking posts or commenting. Earn hearts when others engage with you.
            </li>
            <li>
              <strong>Dynamic Social Wallet:</strong> Watch your influence grow or shrink based on your activity.
            </li>
            <li>
              <strong>Join the Revolution:</strong> Turn passive scrolling into meaningful social currency.
            </li>
          </ul>
        </section>

        {/* Card 3 */}
        <section className="bg-white rounded-xl p-10 border border-gray-200 shadow-lg text-left transition-transform hover:scale-[1.02] duration-300">
          <h2 className="text-3xl font-semibold text-gray-900 mb-5">
            Why Join Heartconomy?
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-800 text-lg leading-relaxed">
            <li>Experience social media where your attention truly counts.</li>
            <li>Build meaningful connections powered by genuine engagement.</li>
            <li>Escape the mindless scroll — make your social energy matter.</li>
            <li>Be part of a community redefining online interaction.</li>
          </ul>
        </section>
      </div>

      <button
        onClick={handleSignUp}
        className="mt-16 bg-red-600 hover:bg-red-700 text-white font-extrabold py-5 px-14 rounded-full text-xl shadow-xl transition-colors active:scale-95"
        aria-label="Sign Up for Heartconomy"
      >
        Sign Up for Free
      </button>
    </main>
  );
}