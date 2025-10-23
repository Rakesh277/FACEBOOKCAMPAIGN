import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
console.log('[DEBUG] Server current UTC time:', new Date().toISOString());
console.log('[DEBUG] Server current UNIX time:', Math.floor(Date.now() / 1000));
import analyticsRoute from './routes/analyticsRoute';

import mongoose from 'mongoose';
import cors from 'cors';
import campaignsRouter from './routes/campaigns';
import postsRouter from './routes/posts';
import authRoutes from './routes/auth'; // includes login & register
import userRoutes from './routes/user';
import facebookRoute from './routes/facebookRoute';
import { logger, errorLogger } from './utils/logger';
import dashboardRoutes from './routes/dashboard';


// Load environment variables early
dotenv.config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173', // your frontend origin
  credentials: true,               // allow cookies if needed
}));

// Middleware
app.use(express.json());


// Routers
app.use('/api/auth', authRoutes);       // handles /login and /register
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/posts', postsRouter);
app.use('/api/facebook', facebookRoute);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', analyticsRoute);

// Test route
app.post('/test', (req, res) => {
  console.log("🧪 Test route payload:", req.body);
  res.json({ received: req.body });
});

// Health check
app.get('/api/test', (_req: Request, res: Response) => {
  logger("🔍 Health check endpoint hit");
  res.json({ message: 'Connected successfully!' });
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || '';

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
      logger('✅ MongoDB connected');
    } else {
      logger('⚠️ MongoDB already connected');
    }
  } catch (err: unknown) {
    errorLogger(`MongoDB connection error: ${(err as Error).message}`);
  }
};

connectDB();

// Start Server
app.listen(PORT, () => {
  logger(`🚀 Server running on port ${PORT}`);
  logger("🚀 Server entry point reached");
});
