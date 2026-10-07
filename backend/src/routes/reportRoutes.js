import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getReportSummary,
} from "../controllers/reportController.js";

const router = express.Router();

router.use(protect);

router.get(
  "/summary",
  getReportSummary
);

export default router;