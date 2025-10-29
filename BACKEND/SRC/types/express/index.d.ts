import { JwtPayload } from 'jsonwebtoken';
import { TokenPayload } from "./token";

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// ✅ Strongly typed user payload
interface JwtPayload {
  userId: string;
  email: string;
  role?: string;
}

// ✅ Extend Express Request type
export interface TokenPayload {
  userId: string;
  email: string;
  // Add any other fields your token includes
}


export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({ success: false, message: 'JWT secret not configured' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export interface MetaContext {
  accessToken: string;
  pageId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      meta?: MetaContext;
    }
  }
}