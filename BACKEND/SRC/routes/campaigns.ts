import express, { Response } from 'express';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// ✅ Protected Dashboard Route
router.get('/dashboard', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No user found' });
  }

  res.json({
    success: true,
    message: 'Welcome to your campaign dashboard',
    user: req.user
  });
});

// ✅ Create Campaign Route
router.post('/create', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No user found' });
  }

  try {
    const { title, content, scheduledAt } = req.body;

    // Validate input
    if (!title || !content || !scheduledAt) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // TODO: Save campaign to DB and schedule post via Facebook Graph API

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      campaign: {
        title,
        content,
        scheduledAt,
        owner: req.user.userId // ✅ Correct property name
      }
    });
  } catch (err) {
    console.error('❌ Campaign creation error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;