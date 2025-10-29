import express from 'express';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// ✅ Protected dashboard route
router.get('/', verifyToken, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access',
    });
  }

  // ✅ Return user info from token
  res.status(200).json({
    success: true,
    message: 'Dashboard data loaded successfully',
    user: {
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role || 'user',
    },
  });
});

export default router;