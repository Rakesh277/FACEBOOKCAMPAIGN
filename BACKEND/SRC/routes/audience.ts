import express, { Request, Response } from "express";
import { AudienceModel } from "../models/AudienceModel";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { minAge, maxAge, gender, location, interests, language } = req.body;

    const newAudience = new AudienceModel({
      minAge,
      maxAge,
      gender,
      location,
      interests,
      language,
    });

    await newAudience.save();
    res.status(200).json({ message: "Saved successfully" });
  } catch (error) {
    console.error("Error saving audience:", error);
    res.status(500).json({ error: "Failed to save audience" });
  }
});

export default router;