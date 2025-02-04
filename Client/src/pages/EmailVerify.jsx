import React, { useContext, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { assets } from '../assets/assets';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContent } from '../context/AppContext';
import AnimatedBackgroundBubbles from '../components/AnimatedBackgroundBubbles'; // Import the bubbles background component

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
    <AnimatedBackgroundBubbles> {/* Wrap the entire page in the AnimatedBackgroundBubbles component */}
      <div className='relative flex items-center justify-center min-h-screen'>
        <img
          onClick={() => navigate('/')}
          src={assets.logo}
          alt='Logo'
          className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
        />
        <form
          onSubmit={onSubmitHandler}
          className='bg-white p-10 rounded-xl shadow-2xl w-[400px] text-sm transform transition-all duration-300 ease-in-out'>
          <h1 className='text-black text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
          <p className='text-indigo-300 text-center mb-6'>Enter the 6-digit code sent to your email id.</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input
                type="text"
                maxLength='1'
                key={index}
                required
                className='w-12 h-12 bg-[#dadada] text-black text-center text-xl rounded-md focus:ring-2 focus:ring-indigo-500 transition-all duration-200'
                ref={e => inputRefs.current[index] = e}
                onChange={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button
            type="submit"
            className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-semibold rounded-lg active:scale-95 transition-all duration-150 ease-in-out'>
            Verify Email
          </button>
        </form>
      </div>
      <ToastContainer />
    </AnimatedBackgroundBubbles>
  );
};

export default EmailVerify;
