import express, { Request, Response } from 'express';
import axios from 'axios';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth';
import Campaign from '../models/Campaign';
import User from '../models/User';

const router = express.Router();

/**
 * @route   GET /api/analytics/:campaignId
 * @desc    Fetch performance insights for a specific published campaign
 * @access  Private
 */
router.get('/:campaignId', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // 1. Find the campaign in your database to ensure it belongs to the logged-in user.
    const campaign = await Campaign.findOne({ 
      _id: req.params.campaignId, 
      user: req.user!.userId 
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found or you do not have permission to view it.' });
    }

    // 2. Check if the campaign has been published and has a Facebook Post ID.
    if (campaign.status !== 'published' || !campaign.facebookPostId) {
      return res.status(400).json({ message: 'Analytics are only available for successfully published campaigns that have a Post ID.' });
    }

    // 3. Get the user's access token from their user document.
    const user = await User.findById(req.user!.userId);
    if (!user || !user.facebookAccessToken) {
      return res.status(403).json({ message: 'Facebook account not connected or access token is missing.' });
    }
    const accessToken = user.facebookAccessToken;
    
    // 4. Define the specific metrics you want from the Facebook Graph API.
    const metrics = [
      'post_impressions_unique', // The number of people who saw your post (Reach)
      'post_engaged_users',      // The number of people who engaged with your post
      'post_clicks_by_type',     // An object containing different types of clicks
    ].join(',');

    // 5. Make the API call to the Graph API's 'insights' edge for the specific post.
    const insightsResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${campaign.facebookPostId}/insights`,
      {
        params: {
          metric: metrics,
          access_token: accessToken,
        },
      }
    );

    // 6. Format the complex response from Facebook into a simple, clean object.
    const rawData = insightsResponse.data.data;
    const analyticsData = {
      reach: rawData.find((m: any) => m.name === 'post_impressions_unique')?.values[0]?.value || 0,
      engagement: rawData.find((m: any) => m.name === 'post_engaged_users')?.values[0]?.value || 0,
      // Clicks are nested, so we safely access them.
      clicks: rawData.find((m: any) => m.name === 'post_clicks_by_type')?.values[0]?.value['link clicks'] || 0,
    };
    
    // 7. Send the clean data back to the frontend.
    res.status(200).json(analyticsData);

  } catch (error: any) {
    console.error("❌ Error fetching campaign analytics:", error.response?.data?.error || error.message);
    res.status(500).json({ message: 'Failed to fetch analytics from Facebook.' });
  }
});

export default router;
