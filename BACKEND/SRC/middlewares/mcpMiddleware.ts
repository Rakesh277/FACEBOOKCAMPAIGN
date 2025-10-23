import { Request, Response, NextFunction } from 'express';
import {
  postToFacebook,
  editScheduledPost,
  deleteScheduledPost,
  getPostInsights,
} from '../services/facebookService';


// Optionally keep the module augmentation if you plan to use req.meta elsewhere
declare module 'express-serve-static-core' {
  interface Request {
    meta?: {
      accessToken: string;
      pageId: string;
    };
  }
}

export const mcpMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Only process if "action" is present (otherwise let normal routes continue)
    if (!req.body || typeof req.body.action !== 'string') return next();

    const { action, metadata } = req.body;

    // Schedule a post
    if (action === 'schedule_post') {
      const { message, time } = metadata || {};
      if (!message || !time) return res.status(400).json({ error: 'Missing MCP metadata for scheduling' });
      const scheduledPublishTime = Math.floor(new Date(time).getTime() / 1000);
      const result = await postToFacebook(message, scheduledPublishTime);
      return res.status(200).json({ action, status: 'ok', data: result });
    }

    // Edit a scheduled post
    if (action === 'edit_scheduled_post') {
      const { postId, newMessage, newScheduledTime } = metadata || {};
      if (!postId || (!newMessage && !newScheduledTime)) return res.status(400).json({ error: 'Missing MCP metadata for editing' });
      const result = await editScheduledPost(postId, newMessage, newScheduledTime);
      return res.status(200).json({ action, status: 'ok', data: result });
    }

    // Delete a scheduled post
    if (action === 'delete_scheduled_post') {
      const { postId } = metadata || {};
      if (!postId) return res.status(400).json({ error: 'Missing postId for deletion' });
      const result = await deleteScheduledPost(postId);
      return res.status(200).json({ action, status: 'ok', data: result });
    }

    // Get post analytics
    if (action === 'get_post_insights') {
      const { postId } = metadata || {};
      if (!postId) return res.status(400).json({ error: 'Missing postId for insights' });
      const result = await getPostInsights(postId);
      return res.status(200).json({ action, status: 'ok', data: result });
    }

    // Add more action handlers here as needed

    // If not recognized, let request fall through to next middleware/route
    return next();
  } catch (error: any) {
    return res.status(500).json({ error: 'MCP middleware error', details: error?.message || '' });
  }
};
