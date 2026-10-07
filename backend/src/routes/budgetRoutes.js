import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} from "../controllers/budgetController.js";

const router = express.Router();

router.use(protect);

router.post("/", createBudget);

router.get("/", getBudgets);

router.get("/:id", getBudgetById);

router.patch("/:id", updateBudget);

router.delete("/:id", deleteBudget);

export default router;