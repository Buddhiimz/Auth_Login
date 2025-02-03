import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { assets } from '../assets/assets';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContent } from '../context/AppContext';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const [email, setEmail] = useState(''); 
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/sendResetOTP`, { email });
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while sending OTP.");
    }
  };

  const onOtpSubmit = (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value).join('');
    if (otpArray.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP.");
      return;
    }
    setOtp(otpArray);
    setIsOtpSubmited(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/resetPassword`, { email, otp, newPassword }); 
      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while resetting the password.");
    }
  };

  return (
    <div className='relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 transition-all duration-300'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt='Logo'
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      {!isEmailSent && 
        <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-xl shadow-2xl w-96 text-sm transform transition-all duration-300 ease-in-out'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-indigo-300 text-center mb-6'>Enter your registered email address.</p>
          
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] focus-within:ring-2 focus-within:ring-indigo-500 transition-all duration-200'>
            <img src={assets.mail_icon} alt="Email Icon" className='w-6 h-6' />
            <input
              type="email"
              placeholder='Email id'
              className='bg-transparent outline-none text-white w-full placeholder-gray-400 p-1'
              value={email} onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className='mt-2 w-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-semibold rounded-full active:scale-95 transition-all duration-150 ease-in-out p-3'>
            Send Reset OTP
          </button>
        </form>
      }

      {isEmailSent && !isOtpSubmited &&
        <form onSubmit={onOtpSubmit} className='bg-slate-900 p-8 rounded-xl shadow-2xl w-96 text-sm transform transition-all duration-300 ease-in-out'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-indigo-300 text-center mb-6'>Enter the 6-digit code sent to your email id.</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input
                type="text"
                maxLength='1'
                key={index}
                required
                className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md focus:ring-2 focus:ring-indigo-500 transition-all duration-200'
                ref={e => inputRefs.current[index] = e}
                onChange={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button
            type="submit"
            className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-semibold rounded-full active:scale-95 transition-all duration-150 ease-in-out'>
            Submit OTP
          </button>
        </form>
      }

      {isOtpSubmited &&
        <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-xl shadow-2xl w-96 text-sm transform transition-all duration-300 ease-in-out'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <p className='text-indigo-300 text-center mb-6'>Enter your New Password.</p>
          
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] focus-within:ring-2 focus-within:ring-indigo-500 transition-all duration-200 relative'>
            <img src={assets.mail_icon} alt="Password Icon" className='w-6 h-6' />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='New Password' 
              className='bg-transparent p-1 outline-none text-white w-full placeholder-gray-400'
              value={newPassword} onChange={e => setNewPassword(e.target.value)}
              required
            />
            <div 
              className='absolute right-3 cursor-pointer text-white'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </div>
          </div>

          <button
            type="submit"
            className='mt-2 w-full p-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-semibold rounded-full active:scale-95 transition-all duration-150 ease-in-out'>
            Reset Password
          </button>
        </form>
      }

      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
