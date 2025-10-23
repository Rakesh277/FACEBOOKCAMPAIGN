// src/routes/facebookRoute.ts

import express, { Request, Response } from 'express';
import {
  postToFacebook,
  getScheduledPosts,
  editScheduledPost,
  deleteScheduledPost,
  getPostInsights,
  getPageInsights, // <<--- ADD THIS IMPORT
} from '../services/facebookService';
import { mcpMiddleware } from '../middlewares/mcpMiddleware';

const router = express.Router();

/**
 * POST /facebook/post
 * Creates or schedules a post on a Facebook Page.
 */
router.post('/post', mcpMiddleware, async (req: Request, res: Response) => {
  try {
    const { content, scheduledPublishTime } = req.body;
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid post content' });
    }
    const result = await postToFacebook(content, scheduledPublishTime);
    res.status(200).json({
      message: scheduledPublishTime
        ? 'Post scheduled successfully'
        : 'Post successfully created',
      facebookPostId: result.id || null,
    });
  } catch (error: any) {
    console.error('[facebookRoute] Error posting to Facebook:', error);
    res.status(500).json({ error: 'Facebook post failed', details: error?.message || '' });
  }
});

/**
 * GET /facebook/scheduled-posts
 * List all scheduled (unpublished) posts on the Page.
 */
router.get('/scheduled-posts', mcpMiddleware, async (req: Request, res: Response) => {
  try {
    const posts = await getScheduledPosts();
    res.status(200).json(posts);
  } catch (error: any) {
    console.error('[facebookRoute] Error fetching scheduled posts:', error);
    res.status(500).json({ error: 'Failed to fetch scheduled posts', details: error?.message || '' });
  }
});

router.post('/mcp', mcpMiddleware, (req, res) => {
  // If MCP middleware did not handle the action, send error
  res.status(400).json({ error: 'Invalid or unsupported MCP action' });
});

/**
 * POST /facebook/scheduled-posts/:id
 * Edit a scheduled post (message or scheduled time).
 */
router.post('/scheduled-posts/:id', mcpMiddleware, async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const { newMessage, newScheduledTime } = req.body;
    if (!newMessage && !newScheduledTime) {
      return res.status(400).json({ error: 'No update parameters provided' });
    }
    const result = await editScheduledPost(postId, newMessage, newScheduledTime);
    res.status(200).json({ message: 'Scheduled post updated', result });
  } catch (error: any) {
    console.error('[facebookRoute] Error editing scheduled post:', error);
    res.status(500).json({ error: 'Failed to edit scheduled post', details: error?.message || '' });
  }
});

/**
 * DELETE /facebook/scheduled-posts/:id
 * Delete a scheduled post by ID.
 */
router.delete('/scheduled-posts/:id', mcpMiddleware, async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const result = await deleteScheduledPost(postId);
    res.status(200).json({ message: 'Scheduled post deleted', result });
  } catch (error: any) {
    console.error('[facebookRoute] Error deleting scheduled post:', error);
    res.status(500).json({ error: 'Failed to delete scheduled post', details: error?.message || '' });
  }
});

/**
 * GET /facebook/post-insights/:id
 * Get engagement analytics for a post by ID.
 */
router.get('/post-insights/:id', mcpMiddleware, async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const insights = await getPostInsights(postId);
    res.status(200).json(insights);
  } catch (error: any) {
    console.error('[facebookRoute] Error fetching post insights:', error);
    res.status(500).json({ error: 'Failed to fetch post insights', details: error?.message || '' });
  }
});

/**
 * GET /facebook/page-insights
 * Get analytics for the entire Facebook Page.
 * Query: ?metrics=page_engaged_users,page_impressions&period=day&since=YYYY-MM-DD&until=YYYY-MM-DD
 */
router.get('/page-insights', async (req: Request, res: Response) => {
  try {
    const { metrics, since, until, period } = req.query;
    const metricList =
      metrics && typeof metrics === 'string'
        ? metrics.split(',')
        : ['page_engaged_users', 'page_impressions'];
    const data = await getPageInsights(
      metricList,
      since as string | undefined,
      until as string | undefined,
      period as string | undefined
    );
    res.status(200).json(data);
  } catch (error: any) {
    console.error('[facebookRoute] Error fetching page insights:', error);
    res.status(500).json({ error: 'Failed to fetch page insights', details: error?.message || '' });
  }
});

export default router;
