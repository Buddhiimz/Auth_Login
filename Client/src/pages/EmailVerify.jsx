import React, { useContext, useEffect } from 'react'; // Added useEffect import
import { useNavigate } from 'react-router-dom'; 
import { assets } from '../assets/assets';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContent } from '../context/AppContext';

const EmailVerify = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContent);

  const inputRefs = React.useRef([]);

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

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value);
      const otp = otpArray.join('');

      const { data } = await axios.post(`${backendUrl}/api/auth/verifyAccount`, { otp });

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  useEffect(() => {
    if (isLoggedin && userData && userData.isAccountVerified) {
      navigate('/');
    }
  }, [isLoggedin, userData, navigate]);

  return (
    <div className='relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt='Logo'
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />
      <form
        onSubmit={onSubmitHandler}
        className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-indigo-300 text-center mb-6'>Enter the 6-digit code sent to your email id.</p>
        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input
              type="text"
              maxLength='1'
              key={index}
              required
              className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
              ref={e => inputRefs.current[index] = e}
              onChange={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>
        <button
          type="submit"
          className='w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-semibold rounded-full'>
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
