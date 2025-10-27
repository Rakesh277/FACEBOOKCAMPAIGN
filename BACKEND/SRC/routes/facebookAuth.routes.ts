import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth';
import User from '../models/User'; // Ensure this path points to your User model

// Load environment variables from your .env file
dotenv.config();

// Initialize the Express router
const router = express.Router();

// =================================================================================
//  STEP 1: REDIRECT ENDPOINT
//  This endpoint's only job is to send the user to Facebook to ask for permission.
// =================================================================================
router.get('/facebook', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  const { FACEBOOK_APP_ID, FACEBOOK_REDIRECT_URI } = process.env;

  // Security Check: Ensure server is configured before attempting redirect.
  if (!FACEBOOK_APP_ID || !FACEBOOK_REDIRECT_URI) {
    console.error("FATAL: Facebook application credentials are not configured in the .env file.");
    return res.status(500).json({ message: "Facebook integration is not configured on the server." });
  }

  // Security Check: Ensure a user is logged into your app first.
  const state = req.user?.userId;
  if (!state) {
    return res.status(401).json({ message: "User must be logged in to connect a Facebook account." });
  }

  // Define the specific permissions your app requires.
  const scope = [
    'pages_show_list',       // To get a list of the user's managed pages
    'pages_manage_posts',    // To publish posts on their behalf
    'pages_read_engagement', // To get analytics like post reach, likes, and comments
  ].join(',');

  // Construct the final authorization URL that the user will be sent to.
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(FACEBOOK_REDIRECT_URI)}&state=${state}&scope=${scope}`;
  
  // Redirect the user's browser to the Facebook authorization page.
  res.redirect(authUrl);
});

// =================================================================================
//  STEP 2: CALLBACK ENDPOINT
//  This endpoint's job is to handle the user's return from Facebook.
// =================================================================================
router.get('/facebook/callback', async (req: Request, res: Response) => {
  const { code, state } = req.query;
  const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_REDIRECT_URI } = process.env;

  // 1. Validate that Facebook sent back a 'code'.
  if (!code || typeof code !== 'string') {
    return res.status(400).send("Authentication failed: Facebook did not return a valid authorization code.");
  }

  try {
    // 2. Exchange the temporary 'code' for a short-lived access token.
    const tokenResponse = await axios.get(
      `https://graph.facebook.com/v18.0/oauth/access_token`,
      {
        params: {
          client_id: FACEBOOK_APP_ID,
          redirect_uri: FACEBOOK_REDIRECT_URI,
          client_secret: FACEBOOK_APP_SECRET,
          code: code,
        }
      }
    );
    const shortLivedToken = tokenResponse.data.access_token;

    // 3. Exchange the short-lived token for a long-lived token (lasts ~60 days).
    const longLivedTokenResponse = await axios.get(
      `https://graph.facebook.com/oauth/access_token`,
      {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: FACEBOOK_APP_ID,
          client_secret: FACEBOOK_APP_SECRET,
          fb_exchange_token: shortLivedToken,
        }
      }
    );
    const longLivedToken = longLivedTokenResponse.data.access_token;

    // 4. Use the 'state' parameter to securely identify the user who started the process.
    const userId = state as string;
    if (!userId) {
      return res.status(400).send("Authentication failed: User identifier (state) is missing.");
    }

    // 5. Find the user in your database and securely save the long-lived token.
    const user = await User.findByIdAndUpdate(
        userId, 
        { facebookAccessToken: longLivedToken },
        { new: true } // This option ensures the updated document is returned.
    );

    if (!user) {
      return res.status(404).send("Authentication failed: Could not find the user to update.");
    }

    console.log(`✅ Successfully saved Facebook access token for user: ${user.email}`);

    // 6. Redirect the user back to your frontend dashboard for a seamless experience.
    // The query parameter helps the frontend know the connection was successful.
    res.redirect('http://localhost:5173/dashboard?facebook=connected');

  } catch (error: any) {
    // A robust catch block to handle any errors during the API calls.
    console.error("❌ Error during Facebook OAuth callback:", error.response?.data || error.message);
    res.status(500).send("A critical error occurred during the Facebook authentication process. Please try again later.");
  }
});

// Export the router so it can be used in your main index.ts file
export default router;

