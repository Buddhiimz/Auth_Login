import React from 'react';

const AnimatedBackgroundBubbles = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f0f4f8] via-[#e0e7f1] to-[#d1d8e1]">
      {/* Animated floating elements */}
      <div className="absolute inset-0">
        {/* Multiple floating balls */}
        <div className="absolute h-32 w-32 rounded-full bg-white opacity-25 top-1/4 left-1/4 animate-float-slow z-10" />
        <div className="absolute h-24 w-24 rounded-full bg-gray-500 opacity-25 top-1/3 right-1/3 animate-float-medium z-10" />
        <div className="absolute h-40 w-40 rounded-full bg-pink-300 opacity-25 bottom-1/4 right-1/4 animate-float-fast z-10" />
        <div className="absolute h-36 w-36 rounded-full bg-teal-300 opacity-25 bottom-1/3 left-1/3 animate-float-medium z-10" />
        <div className="absolute h-28 w-28 rounded-full bg-yellow-200 opacity-25 top-1/2 left-1/2 animate-float-medium z-10" />
        <div className="absolute h-48 w-48 rounded-full bg-indigo-300 opacity-25 top-1/6 right-1/4 animate-float-slow z-10" />
        <div className="absolute h-40 w-40 rounded-full bg-green-300 opacity-25 top-3/4 left-1/4 animate-float-fast z-10" />
        <div className="absolute h-32 w-32 rounded-full bg-lime-200 opacity-25 bottom-1/4 right-1/2 animate-float-slow z-10" />
        <div className="absolute h-36 w-36 rounded-full bg-purple-300 opacity-25 bottom-1/2 left-1/4 animate-float-medium z-10" />
        <div className="absolute h-40 w-40 rounded-full bg-red-200 opacity-25 top-3/4 right-1/4 animate-float-slow z-10" />
        <div className="absolute h-28 w-28 rounded-full bg-blue-300 opacity-25 top-1/3 left-1/4 animate-float-fast z-10" />
        <div className="absolute h-32 w-32 rounded-full bg-orange-200 opacity-25 bottom-1/3 right-1/3 animate-float-medium z-10" />
        <div className="absolute inset-0 bg-mesh opacity-30 z-0" />
      </div>

      {/* Content */}
      <div className="relative z-20">{children}</div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -10px) rotate(5deg); }
          50% { transform: translate(-5px, 5px) rotate(-5deg); }
          75% { transform: translate(-10px, -5px) rotate(3deg); }
        }

        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-15px, 15px) rotate(-5deg); }
          50% { transform: translate(10px, -10px) rotate(5deg); }
          75% { transform: translate(15px, 5px) rotate(-3deg); }
        }

        @keyframes float-fast {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, -20px) rotate(-3deg); }
          50% { transform: translate(-15px, 15px) rotate(3deg); }
          75% { transform: translate(-20px, -10px) rotate(-2deg); }
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 15s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 12s ease-in-out infinite;
        }

        .bg-mesh {
          background-image: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 8%);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackgroundBubbles;
