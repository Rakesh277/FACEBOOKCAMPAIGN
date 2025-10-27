import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

// Import your route handlers
import analyticsRoute from './routes/analyticsRoute';
import campaignsRouter from './routes/campaigns';
import postsRouter from './routes/posts';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import facebookRoute from './routes/facebookRoute';
import dashboardRoutes from './routes/dashboard';
import aiRoutes from './routes/ai';
import facebookAuthRoutes from './routes/facebookAuth.routes';
import facebookPagesRouter from './routes/facebookPages';

// --- STEP 1: IMPORT THE SCHEDULER ---
import { startScheduler } from './services/scheduler';

// Import utility functions
import { logger, errorLogger } from './utils/logger';

// Load environment variables from .env file
dotenv.config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend origin
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
app.use('/api/ai', aiRoutes);
app.use('/api/auth', facebookAuthRoutes);
app.use('/api/facebook/pages', facebookPagesRouter);

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
    process.exit(1); // Exit process with failure
  }
};

// --- STEP 2: UPDATE SERVER START LOGIC ---
// This new function ensures the database is connected before starting the server and the scheduler.
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    logger(`🚀 Server running on port ${PORT}`);
    
    // Start the automated scheduler only after the server is successfully running.
    startScheduler();
  });
};

// Start the server
startServer();
