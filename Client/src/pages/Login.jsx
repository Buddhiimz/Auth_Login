import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { AppContent } from '../context/AppContext';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff } from 'lucide-react';
import AnimatedBackgroundBubbles from '../components/AnimatedBackgroundBubbles'; // Import the bubbles background component

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    if (state === 'Sign Up' && password !== rePassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + `/api/auth/register`, { name, email, password });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          toast.success('Account created successfully!');
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + `/api/auth/login`, { email, password });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          toast.success('Login successful!');
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <AnimatedBackgroundBubbles> {/* Wrap the entire login page in the AnimatedBackgroundBubbles component */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <img onClick={() => navigate('/')} src={assets.logo} alt="Logo" className="w-32 h-auto" />
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${state === 'Sign Up' ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' : 'text-gray-500 hover:bg-purple-50'}`}
                  onClick={() => setState('Sign Up')}
                >
                  Sign Up
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${state === 'Login' ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' : 'text-gray-500 hover:bg-purple-50'}`}
                  onClick={() => setState('Login')}
                >
                  Login
                </button>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 mb-2">
              {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-500 mb-6">
              {state === 'Sign Up' ? 'Create an account to get started' : 'Login to continue to your dashboard'}
            </p>

            <form onSubmit={onSubmitHandler} className="space-y-4">
              {state === 'Sign Up' && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img src={assets.person_icon} alt="Username" className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img src={assets.mail_icon} alt="Email" className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img src={assets.lock_icon} alt="Password" className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {state === 'Sign Up' && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img src={assets.lock_icon} alt="Confirm Password" className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    onChange={(e) => setRePassword(e.target.value)}
                    value={rePassword}
                    type={showRePassword ? 'text' : 'password'}
                    name="rePassword"
                    placeholder="Re-enter Password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRePassword(!showRePassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 focus:outline-none"
                  >
                    {showRePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white py-3 rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 font-semibold"
              >
                {state === 'Sign Up' ? 'Create Account' : 'Login'}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-500 text-sm">
                {state === 'Sign Up' ? 'Already have an account? ' : "Don't have an account? "}
                <button
                  onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
                  className="text-violet-600 hover:text-indigo-600 hover:underline font-medium transition-colors"
                >
                  {state === 'Sign Up' ? 'Login' : 'Sign Up'}
                </button>
              </p>
              {state === 'Login' && (
                <p className="mt-2">
                  <button
                    onClick={() => navigate('/resetPass')}
                    className="text-violet-600 hover:text-indigo-600 hover:underline font-medium text-sm transition-colors"
                  >
                    Forgot Password?
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={true} />
      </div>
    </AnimatedBackgroundBubbles>
  );
};

export default Login;
