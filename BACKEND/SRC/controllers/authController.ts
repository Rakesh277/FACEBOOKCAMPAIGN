import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    let { email, facebookId, password } = req.body;

    // ✅ Normalize inputs
    email = typeof email === 'string' ? email.trim().toLowerCase() : '';
    facebookId = typeof facebookId === 'string' ? facebookId.trim().toLowerCase() : '';
    password = typeof password === 'string' ? password.trim() : '';

    if (!email || !facebookId || !password) {
      console.warn('⚠️ Missing required fields:', { email, facebookId, password });
      return res.status(400).json({ message: 'Email, Facebook ID, and password are required' });
    }

    // ✅ Find user by email
    const user = await User.findOne({ email });
    console.log('🔍 Incoming login:', req.body);
    console.log('🔍 Found user:', user);

    if (!user) {
      console.warn(`⚠️ No user found for ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Normalize stored facebookId for comparison
    const storedFacebookId = typeof user.facebookId === 'string'
      ? user.facebookId.trim().toLowerCase()
      : '';

    if (storedFacebookId !== facebookId) {
      console.warn(`⚠️ Facebook ID mismatch for ${email}`);
      return res.status(401).json({ message: 'Facebook ID mismatch' });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`⚠️ Password mismatch for ${email}`);
      return res.status(401).json({ message: 'Invalid password' });
    }

    // ✅ Optional: check if user is active
    // if (!user.isActive) {
    //   return res.status(403).json({ message: 'Account is inactive. Contact support.' });
    // }

    // ✅ Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET is missing in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const payload: JwtPayload = {
      userId: user.id.toString(),
      email: user.email,
      role: user.role || 'user',
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });

    console.log(`🔐 Logged in: ${email}`);
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        facebookId: user.facebookId ?? null,
        role: user.role ?? 'user',
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};