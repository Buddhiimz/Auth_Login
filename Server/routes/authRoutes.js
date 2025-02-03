import express from 'express';
import { login, logout, register, sendResetOtp, sendVerifyOtp, verifyEmail, isAuthenticated, resetPassword } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

// User registration , create a new account
authRouter.post('/register', register);

// User login , Authenticates users and generates a token
authRouter.post('/login', login);

// User logout , Ends the user's session and clears cookies
authRouter.post('/logout', logout);

// Send verification OTP , User must be logged in
authRouter.post('/sendVerifyOtp', userAuth, sendVerifyOtp);

// Verify account using OTP , User must be logged in
authRouter.post('/verifyAccount', userAuth, verifyEmail);

// Check if the user is authenticated - Uses middleware to validate the user's session
authRouter.get('/isAuth', userAuth, isAuthenticated);

// Send a password reset OTP - Accessible without authentication
authRouter.post('/sendResetOTP', sendResetOtp);

// Reset the user's password using the OTP
authRouter.post('/resetPassword', resetPassword);


export default authRouter;
