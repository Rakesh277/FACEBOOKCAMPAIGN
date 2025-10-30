import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    let { email, password } = req.body;

    email = typeof email === 'string' ? email.trim().toLowerCase() : '';
    password = typeof password === 'string' ? password.trim() : '';

    if (!email || !password) {
      console.warn('⚠️ Missing required fields:', { email, password });
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    console.log('🔍 Incoming login:', req.body);

    if (!user) {
      console.warn(`⚠️ No user found for ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`⚠️ Password mismatch for ${email}`);
      return res.status(401).json({ message: 'Invalid password' });
    }

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



    console.log(`🔐 Logged in: ${email}`);
    return res.status(200).json({
    
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role ?? 'user',
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};