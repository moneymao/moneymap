import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.use(protect);

router.post("/", createTransaction);

router.get("/", getTransactions);

router.get("/:id", getTransactionById);

router.patch("/:id", updateTransaction);

router.delete("/:id", deleteTransaction);

export default router;