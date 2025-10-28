import express from 'express';
import { generateCaption } from '../controllers/generateCaptionController';

const router = express.Router();

router.post('/', generateCaption);

export default router;