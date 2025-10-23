import { Router } from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/postController';

const router = Router();

router.post('/', createPost);         // Create a new post
router.get('/', getPosts);            // Get all posts
router.get('/:id', getPostById);      // Get a single post by ID
router.put('/:id', updatePost);       // Update a post by ID
router.delete('/:id', deletePost);    // Delete a post by ID

export default router;