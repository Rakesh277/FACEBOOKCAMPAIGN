import express from 'express';
import axios from 'axios';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// GET /api/facebook/pages - Fetch user's Facebook pages
router.get('/', verifyToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findById(req.user!.userId);
    
    if (!user || !user.facebookAccessToken) {
      return res.status(403).json({ 
        success: false, 
        message: 'Facebook account not connected. Please connect your Facebook account first.' 
      });
    }

    // Fetch the user's pages from Facebook
    const response = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
      params: { 
        access_token: user.facebookAccessToken,
        fields: 'id,name,access_token' // Get page name and page-specific token
      }
    });

    res.json({ 
      success: true, 
      pages: response.data.data 
    });

  } catch (error: any) {
    console.error('Error fetching Facebook pages:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch Facebook pages. Please try reconnecting your account.' 
    });
  }
});

export default router;
