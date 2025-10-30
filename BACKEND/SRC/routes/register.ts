import express from 'express';
import UserModel from '../models/User'; // ✅ Adjust path if needed

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email,  password, date } = req.body;
    console.log('[REGISTER PAYLOAD]', req.body); // ✅ Confirm date is received

    const newUser = new UserModel({ email,password, date });
    await newUser.save();
    import { sendVerificationEmail } from '../utils/mailer';
    import jwt from 'jsonwebtoken';
    
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await sendVerificationEmail(user.email, token);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;