import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser'; 
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

// Establish MongoDB connection
connectDB();

const allowedOrigins = ['http://localhost:5173'];

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true})); // Added `origin: true` for full CORS support

// Basic route
app.get('/', (req, res) => res.send('API is running'));

// Auth routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Start the server
app.listen(port, () => console.log(`Server is running on port ${port}`));
