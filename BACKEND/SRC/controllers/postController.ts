import { Request, Response } from 'express';
import Post from '../models/Post';
import { generatePostContent } from '../services/contentGen';

// Create a new post
export const createPost = async (req: Request, res: Response) => {
  try {
    const {
      scheduledAt,
      imageUrl,
      campaignId,
      platform,
      status = 'pending',
    } = req.body;

    const content = await generatePostContent();

    const post = await Post.create({
      content,
      scheduledAt,
      imageUrl,
      campaign: campaignId,
      platform,
      status,
      published: false,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// Get all posts
export const getPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate('campaign');
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Get a single post by ID
export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate('campaign');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error('Error fetching post by ID:', err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

// Update a post by ID
export const updatePost = async (req: Request, res: Response) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: 'Post not found' });
    res.json(updated);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

// Delete a post by ID
export const deletePost = async (req: Request, res: Response) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};