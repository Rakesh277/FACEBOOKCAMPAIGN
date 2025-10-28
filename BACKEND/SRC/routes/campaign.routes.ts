import express from 'express';
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign
} from '../controllers/campaignController';
// --- FIX ---
// Using your 'verifyToken' function from the correct file.
import { verifyToken } from '../middleware/auth'; 

const router = express.Router();

// --- FIX ---
// Apply your 'verifyToken' middleware to all campaign routes.
router.use(verifyToken);

router.route('/')
  .post(createCampaign)
  .get(getCampaigns);

router.route('/:id')
  .get(getCampaignById)
  .put(updateCampaign)
  .delete(deleteCampaign);

export default router;
