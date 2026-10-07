import mongoose from "mongoose";
import { EXPENSE_CATEGORIES } from "./Transaction.js";

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    category: {
      type: String,
      enum: EXPENSE_CATEGORIES,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    year: {
      type: Number,
      required: true,
      min: 2020,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * One budget per category for a user in a particular month.
 *
 * Example:
 * User A
 * October 2026
 * Food
 *
 * cannot have another Food budget for October 2026.
 */
budgetSchema.index(
  {
    user: 1,
    year: 1,
    month: 1,
    category: 1,
  },
  {
    unique: true,
  }
);

budgetSchema.index({
  user: 1,
  year: 1,
  month: 1,
});

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;  