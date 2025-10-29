import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// ✅ Strongly typed user payload
interface JwtPayload {
  userId: string;
  email: string;
  role?: string;
}

// ✅ Extend Express Request type
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// ✅ JWT verification middleware
export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // ✅ Check for Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({
      success: false,
      message: 'No token provided',
    });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;

  // ✅ Ensure secret is configured
  if (!jwtSecret) {
    return res.status(500).json({
      success: false,
      message: 'JWT secret not configured',
    });
  }

  try {
    // ✅ Verify and attach user
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};