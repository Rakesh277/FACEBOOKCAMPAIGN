import express from "express";
import { registerUser } from "../controllers/user";

const router = express.Router();


// @route   POST /api/v1/register
// @desc    Register a new user
// @access  Public
router.post("/register", registerUser);
console.log("🛣️ Register route initialized");
export default router;