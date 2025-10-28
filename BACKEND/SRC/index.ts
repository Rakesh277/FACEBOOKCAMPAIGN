import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

// Utility Imports
import { logger, errorLogger } from './utils/logger';
import { startScheduler } from './services/scheduler';

// Route Imports
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import facebookAuthRoutes from './routes/facebookAuth.routes';
import campaignsRouter from './routes/campaigns'; // Renamed for clarity to match other routes
import postsRouter from './routes/posts';
import facebookRoute from './routes/facebookRoute';
import dashboardRoutes from './routes/dashboard';
import analyticsRoute from './routes/analyticsRoute';
import aiRoutes from './routes/ai';
import facebookPagesRouter from './routes/facebookPages';
import audienceRoutes from './routes/audience';
import generateCaptionRoutes from './routes/generateCaption';
import generatePostRoutes from './routes/generatePost';


// Load environment variables
dotenv.config();

const app = express();

// --- Middleware Setup ---
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json()); // Body parser for JSON payloads

// --- API Routes ---
// Grouping routes for better organization
app.use('/api/auth', authRoutes); // For standard auth (login, register)
app.use('/api/auth/facebook', facebookAuthRoutes); // **UPDATED**: Specific path for Facebook OAuth
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/posts', postsRouter);
app.use('/api/facebook/pages', facebookPagesRouter);
app.use('/api/facebook', facebookRoute); // General Facebook interactions
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoute); // Corrected base path
app.use('/api/ai', aiRoutes);
app.use('/api/audience', audienceRoutes);
app.use('/generate-caption', generateCaptionRoutes);
app.use('/generate-post', generatePostRoutes);


// --- Health Check and Test Routes ---
app.get('/api/health', (_req: Request, res: Response) => {
  logger("🔍 Health check endpoint hit");
  res.status(200).json({ status: 'UP', message: 'Server is running successfully!' });
});

app.post('/test', (req, res) => {
  console.log("🧪 Test route payload:", req.body);
  res.json({ received: req.body });
});


// --- Database and Server Initialization ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  errorLogger('FATAL ERROR: MONGODB_URI is not defined in the .env file.');
  process.exit(1);
}

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
      logger('✅ MongoDB connected successfully.');
    }
  } catch (err) {
    errorLogger(`❌ MongoDB connection error: ${(err as Error).message}`);
    process.exit(1); // Exit process with failure
  }
};

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger(`🚀 Server running on port ${PORT}`);
    // Start the scheduler after the server is up
    startScheduler();
  });
};

// Liftoff!
startServer();
