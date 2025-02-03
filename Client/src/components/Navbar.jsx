import React, { useContext } from 'react';
import { ArrowRight } from 'lucide-react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Navbar = () => {
  const { userData, setIsLoggedin, setUserData } = useContext(AppContent);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        toast.success('Logged out successfully');
        navigate('/');
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } catch (error) {
      toast.error(`Logout failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/sendVerifyOtp`);
      console.log(data);  // Add logging for debugging
      if (data.success) {
        toast.success(data.message);
        navigate('/emailVerify');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);  // Log the error for debugging
      toast.error(error?.response?.data?.message || 'An error occurred');
    }
  }
  

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4 sm:p-6 sm:px-8 lg:px-12">
        <div className="flex items-center">
          <img
            src={assets.logo}
            alt="Logo"
            className="w-28 sm:w-32 h-auto object-contain transition-all duration-300 ease-in-out"
          />
        </div>
        {userData ? (
          <div className="relative group">
            <div className="w-10 h-10 flex justify-center items-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-medium cursor-pointer transition-transform duration-300">
              {(userData.name && userData.name[0].toUpperCase()) || 'U'}
            </div>
            <div className="absolute hidden group-hover:block top-full right-0 w-48 z-10 transform transition-all duration-300 ease-in-out">
              <div className="bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <ul className="py-1">
                  {!userData.isAccountVerified && (
                    <li 
                    onClick={sendVerificationOtp}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition-colors duration-150 ease-in-out flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                      Verify Email
                    </li>
                  )}
                  <li
                    onClick={() => navigate('/resetPass')}                   
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition-colors duration-150 ease-in-out flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    Reset Password
                  </li>
                  <li
                    onClick={logout}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition-colors duration-150 ease-in-out flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 bg-white px-6 py-2.5 rounded-full text-gray-800 font-medium transition-all duration-300 ease-in-out hover:shadow-md hover:bg-gray-50 border border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span>Login</span>
            <ArrowRight
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2}
            />
          </button>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </nav>
  );
};

export default Navbar;
