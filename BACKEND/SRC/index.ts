
import generateCampaignRoute from './routes/generateCampaign';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import analyticsRoute from './routes/analyticsRoute';
import campaignsRouter from './routes/campaigns';
import postsRouter from './routes/posts';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import facebookRoute from './routes/facebookRoute';
import dashboardRoutes from './routes/dashboard';
import { logger, errorLogger } from './utils/logger';

// Load environment variables early
dotenv.config();

// Debug logs
console.log('[DEBUG] Server current UTC time:', new Date().toISOString());
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
console.log('[DEBUG] Server current UNIX time:', Math.floor(Date.now() / 1000));

const app = express();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Middleware
app.use(express.json());

// Routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/posts', postsRouter);
app.use('/api/facebook', facebookRoute);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', analyticsRoute);
app.use('/api/generate-campaign', generateCampaignRoute);

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
