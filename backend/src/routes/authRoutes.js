import express from "express";

import {
  syncUser,
  getCurrentUser,
  logoutUser,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/sync", authLimiter, syncUser);
router.get("/me", protect, getCurrentUser);
router.post("/logout", logoutUser);

export default router;