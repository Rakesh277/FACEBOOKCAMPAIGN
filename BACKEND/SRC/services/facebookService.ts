// src/services/facebookService.ts

import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const GRAPH_BASE = 'https://graph.facebook.com/v18.0';

const pageId = process.env.FACEBOOK_PAGE_ID;
const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

const TEN_MINUTES = 600;
const SIX_MONTHS = 15552000;

// Utility to extract and log the full error details
function extractFacebookError(error: any, context: string) {
  if (error.response && error.response.data) {
    console.error(`[FacebookService] ${context}:`, JSON.stringify(error.response.data));
    if (error.response.data.error && error.response.data.error.message) {
      return error.response.data.error.message;
    }
    return JSON.stringify(error.response.data);
  } else {
    console.error(`[FacebookService] ${context}:`, error.message);
    return error.message || 'Unknown backend error';
  }
}

// 1. Create/schedule post
export const postToFacebook = async (
  content: string,
  scheduledPublishTime?: number
): Promise<any> => {
  try {
    if (!pageId || !accessToken) {
      throw new Error('Facebook Page ID or Access Token is missing in environment variables.');
    }
    if (!content || typeof content !== 'string') {
      throw new Error('Missing or invalid post content');
    }
    const url = `${GRAPH_BASE}/${pageId}/feed`;
    const payload: Record<string, any> = {
      message: content,
      access_token: accessToken,
    };
    if (scheduledPublishTime) {
      const now = Math.floor(Date.now() / 1000);
      const timeDiff = scheduledPublishTime - now;
      if (timeDiff < TEN_MINUTES || timeDiff > SIX_MONTHS) {
        throw new Error('Scheduled publish time must be at least 10 minutes and no more than 6 months from now.');
      }
      payload.published = false;
      payload.scheduled_publish_time = scheduledPublishTime;
    }
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(extractFacebookError(error, 'Failed to post to Facebook'));
  }
};

// 2. List all scheduled posts
export const getScheduledPosts = async (): Promise<any> => {
  try {
    if (!pageId || !accessToken) {
      throw new Error('Facebook Page ID or Access Token is missing in environment variables.');
    }
    const url = `${GRAPH_BASE}/${pageId}/scheduled_posts?access_token=${accessToken}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(extractFacebookError(error, 'Failed to get scheduled posts'));
  }
};

// 3. Edit a scheduled post
export const editScheduledPost = async (
  postId: string,
  newMessage?: string,
  newScheduledTime?: number
): Promise<any> => {
  try {
    if (!accessToken) {
      throw new Error('Facebook Access Token missing in environment variables.');
    }
    const url = `${GRAPH_BASE}/${postId}`;
    const payload: Record<string, any> = {
      access_token: accessToken,
    };
    if (newMessage) payload.message = newMessage;
    if (newScheduledTime) payload.scheduled_publish_time = newScheduledTime;
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(extractFacebookError(error, 'Failed to edit scheduled post'));
  }
};

// 4. Delete a scheduled post
export const deleteScheduledPost = async (postId: string): Promise<any> => {
  try {
    if (!accessToken) {
      throw new Error('Facebook Access Token missing in environment variables.');
    }
    const url = `${GRAPH_BASE}/${postId}?access_token=${accessToken}`;
    const response = await axios.delete(url);
    return response.data;
  } catch (error: any) {
    throw new Error(extractFacebookError(error, 'Failed to delete scheduled post'));
  }
};

// 5. Get engagement analytics for a post
export const getPostInsights = async (postId: string): Promise<any> => {
  try {
    if (!accessToken) {
      throw new Error('Facebook Access Token missing in environment variables.');
    }
    const url = `${GRAPH_BASE}/${postId}/insights?access_token=${accessToken}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(extractFacebookError(error, 'Failed to get post insights'));
  }
};

// 6. Get Page-level insights (improved for dashboard use)
export const getPageInsights = async (
  metrics: string[] = ['page_engaged_users', 'page_impressions', 'page_fans', 'page_post_engagements'],
  since?: string,
  until?: string,
  period: string = 'day'
): Promise<any> => {
  try {
    if (!pageId || !accessToken) {
      throw new Error('Facebook Page ID or Access Token is missing in environment variables.');
    }
    let url = `${GRAPH_BASE}/${pageId}/insights?access_token=${accessToken}&metric=${metrics.join(',')}&period=${period}`;
    if (since) url += `&since=${since}`;
    if (until) url += `&until=${until}`;
    const response = await axios.get(url);
    // Optionally, format the data for frontend charting here if needed
    return response.data;
  } catch (error: any) {
    throw new Error(extractFacebookError(error, 'Failed to fetch page insights'));
  }
};

// 7. Get recent posts (for analytics dashboard)
export const getRecentPosts = async (limit: number = 10): Promise<any> => {
  try {
    if (!pageId || !accessToken) {
      throw new Error('Facebook Page ID or Access Token is missing in environment variables.');
    }
    const url = `${GRAPH_BASE}/${pageId}/posts?access_token=${accessToken}&limit=${limit}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(extractFacebookError(error, 'Failed to fetch recent posts'));
  }
};
