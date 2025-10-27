import express, { Response } from 'express';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth';
import Campaign from '../models/Campaign'; // Make sure this path is correct


const router = express.Router();


// =================================================================================
//  NEW: GET All Campaigns for a User
//  This endpoint securely fetches campaigns belonging only to the logged-in user.
// =================================================================================
router.get('/', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // 1. Use the user's ID from the verified token to find their campaigns.
    const campaigns = await Campaign.find({ user: req.user!.userId }).sort({ createdAt: -1 }); // Sorts newest first


    // 2. Return the found campaigns.
    res.status(200).json(campaigns);


  } catch (error) {
    console.error('❌ Error fetching campaigns:', error);
    res.status(500).json({ message: 'Server error while fetching campaigns.' });
  }
});



// =================================================================================
//  UPDATED: Create a New Campaign
//  This endpoint now correctly associates the new campaign with the user.
// =================================================================================
router.post('/', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  // Check if a user is authenticated
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No user found' });
  }


  try {
    // Extract campaign data from the request body
    const {
      campaignName,
      pageName,
      objective,
      adType,
      caption,
      budget,
      duration,
      // You can add your other model fields here later (e.g., audience, postTime)
    } = req.body;


    // Basic validation
    if (!campaignName || !pageName || !objective || !caption || !budget || !duration) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }


    // Create a new campaign document
    const newCampaign = new Campaign({
      name: campaignName,
      pageName,
      objective,
      adType,
      caption,
      budget: Number(budget),
      duration: new Date(duration), // Assuming duration is a date string from the frontend
      // --- THIS IS THE KEY UPDATE ---
      user: req.user.userId, // Associate the campaign with the logged-in user's ID
    });


    // Save the new campaign to MongoDB
    await newCampaign.save();


    // Respond with a success message
    res.status(201).json({
      success: true,
      message: 'Campaign created successfully!',
      campaign: newCampaign,
    });


  } catch (err) {
    console.error('❌ Campaign creation error:', err);
    res.status(500).json({ success: false, message: 'Server error during campaign creation.' });
  }
});


export default router;
