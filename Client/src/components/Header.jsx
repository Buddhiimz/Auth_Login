import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center text-center p-6 max-w-md mx-auto border rounded-lg bg-white/100 shadow-lg transition-all duration-500 ease-in-out hover:shadow-xl">
      {/* Image container - always visible, only transforms on login */}
      <div className="relative">
        <img 
          src={assets.header_img} 
          alt="Profile" 
          className="w-36 h-36 rounded-full mb-6 object-cover transition-transform duration-500 "
        />
        {userData && (
          <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white animate-ping" />
        )}
      </div>

      {/* Heading - always visible, animates on login */}
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-2 transition-all duration-500">
        Hey {userData ? userData.name : 'Developer'}!
        <img 
          className={`w-8 h-8 inline-block transition-transform duration-500 ${
            userData ? 'animate-[wiggle_1s_ease-in-out_infinite]' : ''
          }`}
          src={assets.hand_wave} 
          alt="Wave" 
          style={{
            transformOrigin: '70% 70%'
          }}
        />
      </h1>

      {/* Subtitle - always visible */}
      <h2 className="text-2xl text-gray-600 mb-4 transition-all duration-500">
        {userData ? 'Welcome back!' : 'Welcome to our app'}
      </h2>

      {/* Description - always visible */}
      <p className="text-gray-500 mb-6 max-w-xs transition-all duration-500">
        {userData 
          ? "Great to see you again! Your dashboard is ready."
          : "Let's start with a quick product tour and we'll have you up and running in no time!"
        }
      </p>

      {/* Conditional button rendering */}
      {!userData ? (
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-sm hover:shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300 ease-in-out hover:-translate-y-1">
          Get Started
        </button>
      ) : (
        <div className="flex gap-4 animate-[fadeIn_0.5s_ease-out]">
          <button 
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-full shadow-sm hover:shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out hover:-translate-y-1">
            Go to Dashboard
          </button>
          <button 
            className="flex items-center gap-2 bg-white text-blue-500 border border-blue-500 px-6 py-3 rounded-full shadow-sm hover:shadow-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out hover:-translate-y-1">
            View Profile
          </button>
        </div>
      )}

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-20deg); }
          75% { transform: rotate(20deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Header;