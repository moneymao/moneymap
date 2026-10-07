import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  addToGoal,
  deleteGoal,
} from "../controllers/goalController.js";

const router = express.Router();

router.use(protect);

router.post("/", createGoal);

router.get("/", getGoals);

router.get("/:id", getGoalById);

router.patch("/:id", updateGoal);

router.post("/:id/add", addToGoal);

router.delete("/:id", deleteGoal);

export default router;