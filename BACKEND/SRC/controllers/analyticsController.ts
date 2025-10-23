import { Request, Response } from "express";
import Campaign from "../models/Campaign";

export const getAnalytics = async (_req: Request, res: Response) => {
  try {
    const campaigns = await Campaign.find();
    const analytics = campaigns.map(c => ({ name: c.name, stats: c.analytics }));
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
