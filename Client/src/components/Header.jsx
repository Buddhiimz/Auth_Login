import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom';

const Header = () => {

  const { userData } = useContext(AppContent)
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center p-6 max-w-md mx-auto">
      <img 
        src={assets.header_img} 
        alt="Profile" 
        className="w-36 h-36 rounded-full mb-6 object-cover"
      />
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
        Hey {userData ? userData.name : 'Developer'}!
        <img 
          className="w-8 h-8 inline-block" 
          src={assets.hand_wave} 
          alt="Wave" 
        />
      </h1>
      <h2 className="text-2xl text-gray-600 mb-4">Welcome to our app</h2>
      <p className="text-gray-500 mb-6 max-w-xs">
        Let's start with a quick product tour and we'll have you up and running in no time!
      </p>
      {!userData && (
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-full shadow-sm hover:shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out">
          Get Started
        </button>
      )}
    </div>
  )
}

export default Header
