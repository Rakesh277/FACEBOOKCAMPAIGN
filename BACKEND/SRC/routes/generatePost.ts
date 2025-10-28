import express from 'express';
import { generatePost } from '../controllers/generatePostController';

const router = express.Router();

router.post('/', generatePost);

export default router;