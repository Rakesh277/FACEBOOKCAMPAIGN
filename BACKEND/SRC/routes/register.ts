import express from 'express';
import UserModel from '../models/User'; // ✅ Adjust path if needed

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email, facebookId, password, date } = req.body;
    console.log('[REGISTER PAYLOAD]', req.body); // ✅ Confirm date is received

    const newUser = new UserModel({ email, facebookId, password, date });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;