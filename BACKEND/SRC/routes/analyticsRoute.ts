// BACKEND/src/routes/analyticsRoute.ts
import express from 'express';
import { getPageInsights } from '../services/facebookService';

const router = express.Router();

router.get('/facebook/insights', async (req, res) => {
  try {
    const insights = await getPageInsights();
    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

export default router;
