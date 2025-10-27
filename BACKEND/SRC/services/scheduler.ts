import cron from 'node-cron';
import axios from 'axios';
import Campaign, { ICampaign } from '../models/Campaign'; // Using your Campaign model
import { IUser } from '../models/User';                 // Using your User interface

/**
 * This is the main function for the background job. It finds and publishes due campaigns.
 */
const checkAndPublishCampaigns = async () => {
  console.log('⏰ Running campaign scheduler job...');

  try {
    const dueCampaigns = await Campaign.find({
      status: 'scheduled',
      postDate: { $lte: new Date() }
    }).populate<{ user: IUser }>('user');

    if (dueCampaigns.length === 0) {
      console.log('✅ No due campaigns to publish at this time.');
      return;
    }

    console.log(`🚀 Found ${dueCampaigns.length} campaigns to publish.`);

    for (const campaign of dueCampaigns) {
      const user = campaign.user;

      if (!user || !user.facebookAccessToken) {
        console.error(`❌ Skipping campaign ${campaign._id}: User or Facebook access token is missing.`);
        campaign.status = 'failed';
        await campaign.save();
        continue;
      }
      
      const pageId = 'me'; // Placeholder: This should be the actual Page ID.
      const accessToken = user.facebookAccessToken;

      // --- THIS IS THE UPDATED BLOCK ---
      try {
        console.log(`- Publishing campaign: "${campaign.name}" for user ${user.email}`);
        
        // 1. Store the response from the axios.post call
        const postResponse = await axios.post(
          `https://graph.facebook.com/v18.0/${pageId}/feed`,
          {
            message: campaign.caption,
          },
          {
            params: { access_token: accessToken }
          }
        );

        // 2. Extract the post ID from the response data
        const postId = postResponse.data.id;
        if (!postId) {
          throw new Error('Facebook did not return a post ID after publishing.');
        }

        // 3. Save the Facebook Post ID to your campaign document
        campaign.facebookPostId = postId;
        campaign.status = 'published';
        await campaign.save();
        
        console.log(`✅ Successfully published campaign: ${campaign.name} with Post ID: ${postId}`);

      } catch (postError: any) {
        console.error(`❌ Failed to publish campaign ${campaign._id}:`, postError.response?.data?.error || postError.message);
        campaign.status = 'failed';
        await campaign.save();
      }
    }
  } catch (error) {
    console.error('❌ A critical error occurred in the campaign scheduler:', error);
  }
};

/**
 * This function is exported and called from your main server file (index.ts) to start the scheduler.
 */
export const startScheduler = () => {
  cron.schedule('*/1 * * * *', checkAndPublishCampaigns, {
    timezone: "UTC"
  });

  console.log('🎉 Campaign Scheduler has been started and will run every minute.');
};
