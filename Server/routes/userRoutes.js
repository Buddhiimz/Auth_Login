import express from 'express'; 
import userAuth from '../middleware/userAuth.js'; 
import { getUserData } from '../controllers/userController.js';

// Create a router instance for handling user-related routes
const userRouter = express.Router();

// Define a route to get user data
// Middleware 'userAuth' ensures only authenticated users can access this route
userRouter.get('/data', userAuth, getUserData);

export default userRouter; 
