import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Register Controller
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, facebookId, password, phone, age } = req.body;
    console.log('[REGISTER] Incoming payload:', { name, email, facebookId, phone, age });

    if (!name || !email || !facebookId || !password || !phone || !age) {
      console.warn('[REGISTER] Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn(`[REGISTER] User already exists: ${email}`);
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('[REGISTER] Password hashed');

    const user = new User({
      name,
      email,
      facebookId,
      password: hashedPassword,
      phone,
      age,
    });

    await user.save();
    console.log(`📥 Registered successfully: ${email}`);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ✅ Login Controller
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('[LOGIN] Incoming payload:', { email });

    if (!email || !password) {
      console.warn('[LOGIN] Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`[LOGIN] User not found: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn('[LOGIN] Invalid credentials');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('[LOGIN] JWT_SECRET is missing');
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        facebookId: user.facebookId,
        role: user.role || 'user',
      },
      jwtSecret,
      { expiresIn: '1d' }
    );

    console.log(`🔐 Logged in successfully: ${email}`);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        facebookId: user.facebookId,
        phone: user.phone,
        age: user.age,
        role: user.role || 'user',
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};