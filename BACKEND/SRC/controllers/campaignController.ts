import { Request, Response } from "express";
import Campaign from "../models/Campaign";


export const createCampaign = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const campaign = await Campaign.create({ name });
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ error: "Failed to create campaign" });
  }
};

export const getCampaigns = async (_req: Request, res: Response) => {
  const campaigns = await Campaign.find().populate("posts");
  res.json(campaigns);
};
