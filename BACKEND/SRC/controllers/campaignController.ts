import { Response } from 'express';
import Campaign, { ICampaign } from '../models/Campaign.model';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../middleware/auth'; // Ensure this path is correct

/**
 * @desc    Create a new campaign
 * @route   POST /api/campaigns
 * @access  Private
 */
export const createCampaign = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, objective, adAccountId, ...rest } = req.body;
    
    // --- FIX ---
    // Correctly get userId from your 'verifyToken' middleware payload
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not authorized, user ID missing from token' });
    }

    if (!name || !objective || !adAccountId) {
      return res.status(400).json({ message: 'Missing required fields: name, objective, and adAccountId are required.' });
    }

    const campaign = new Campaign({
      ...rest,
      name,
      objective,
      adAccountId,
      user: userId, // Associate campaign with the correct user ID
    });

    const createdCampaign = await campaign.save();
    res.status(201).json(createdCampaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: 'Server error while creating campaign', error: (error as Error).message });
  }
};

/**
 * @desc    Get all campaigns for the logged-in user
 * @route   GET /api/campaigns
 * @access  Private
 */
export const getCampaigns = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // --- FIX ---
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized, user ID missing' });
    }

    // Using the correct userId to find campaigns
    const campaigns = await Campaign.find({ user: userId }).populate("posts").sort({ createdAt: -1 });
    
    res.status(200).json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ message: 'Server error while fetching campaigns' });
  }
};

/**
 * @desc    Get a single campaign by its ID
 * @route   GET /api/campaigns/:id
 * @access  Private
 */
export const getCampaignById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    // --- FIX ---
    // Security Check: Compare campaign's user ID with the logged-in user's ID
    if (campaign.user.toString() !== req.user?.userId) {
        return res.status(401).json({ message: 'Not authorized to access this campaign' });
    }

    res.status(200).json(campaign);
  } catch (error) {
    console.error(`Error fetching campaign ${req.params.id}:`, error);
    if (error instanceof mongoose.Error.CastError) {
        return res.status(400).json({ message: 'Invalid campaign ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update an existing campaign
 * @route   PUT /api/campaigns/:id
 * @access  Private
 */
export const updateCampaign = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    // --- FIX ---
    // Security Check
    if (campaign.user.toString() !== req.user?.userId) {
        return res.status(401).json({ message: 'Not authorized to update this campaign' });
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    });

    res.status(200).json(updatedCampaign);
  } catch (error) {
    console.error(`Error updating campaign ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete a campaign
 * @route   DELETE /api/campaigns/:id
 * @access  Private
 */
export const deleteCampaign = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // --- FIX ---
    // Security Check
    if (campaign.user.toString() !== req.user?.userId) {
        return res.status(401).json({ message: 'Not authorized to delete this campaign' });
    }
    
    await campaign.deleteOne();

    res.status(200).json({ message: 'Campaign removed successfully' });
  } catch (error) {
    console.error(`Error deleting campaign ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};
