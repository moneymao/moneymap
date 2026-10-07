import Budget from "../models/Budget.js";
import Transaction, {
  EXPENSE_CATEGORIES,
} from "../models/Transaction.js";

const categories = EXPENSE_CATEGORIES;

/**
 * Create a new budget
 */
const createBudget = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const {
      category,
      amount,
      month,
      year,
    } = req.body;

    if (!category || !categories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid category",
      });
    }

    const numericAmount = Number(amount);
    const numericMonth = Number(month);
    const numericYear = Number(year);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Budget amount must be greater than 0",
      });
    }

    if (
      !Number.isInteger(numericMonth) ||
      numericMonth < 1 ||
      numericMonth > 12
    ) {
      return res.status(400).json({
        success: false,
        message: "Month must be between 1 and 12",
      });
    }

    if (
      !Number.isInteger(numericYear) ||
      numericYear < 2020
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid year",
      });
    }

    const existingBudget = await Budget.findOne({
      user: userId,
      category,
      month: numericMonth,
      year: numericYear,
    });

    if (existingBudget) {
      return res.status(409).json({
        success: false,
        message: `A budget for ${category} already exists for this month`,
      });
    }

    const budget = await Budget.create({
      user: userId,
      category,
      amount: numericAmount,
      month: numericMonth,
      year: numericYear,
    });

    return res.status(201).json({
      success: true,
      message: "Budget created successfully",
      budget,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get budgets for a specific month
 *
 * Query:
 * ?month=10&year=2026
 */
const getBudgets = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const now = new Date();

    const month = Number(
      req.query.month || now.getMonth() + 1
    );

    const year = Number(
      req.query.year || now.getFullYear()
    );

    if (
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    ) {
      return res.status(400).json({
        success: false,
        message: "Month must be between 1 and 12",
      });
    }

    if (
      !Number.isInteger(year) ||
      year < 2020
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid year",
      });
    }

    const budgets = await Budget.find({
      user: userId,
      month,
      year,
    })
      .sort({ category: 1 })
      .lean();

    /*
     * Calculate start and end dates for the selected month.
     */
    const startDate = new Date(
      year,
      month - 1,
      1
    );

    const endDate = new Date(
      year,
      month,
      1
    );

    /*
     * Calculate expense totals by category.
     */
    const spending = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "expense",
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$category",
          spent: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const spendingMap = new Map();

    spending.forEach((item) => {
      spendingMap.set(item._id, item.spent);
    });

    const enrichedBudgets = budgets.map((budget) => {
      const spent = spendingMap.get(budget.category) || 0;

      const remaining = budget.amount - spent;

      const percentage =
        budget.amount > 0
          ? (spent / budget.amount) * 100
          : 0;

      return {
        ...budget,
        spent,
        remaining,
        percentage: Math.round(percentage * 100) / 100,
        isExceeded: spent > budget.amount,
      };
    });

    const totalBudget = enrichedBudgets.reduce(
      (total, budget) => total + budget.amount,
      0
    );

    const totalSpent = enrichedBudgets.reduce(
      (total, budget) => total + budget.spent,
      0
    );

    const totalRemaining =
      totalBudget - totalSpent;

    const totalPercentage =
      totalBudget > 0
        ? (totalSpent / totalBudget) * 100
        : 0;

    return res.status(200).json({
      success: true,

      period: {
        month,
        year,
      },

      summary: {
        totalBudget,
        totalSpent,
        totalRemaining,
        totalPercentage:
          Math.round(totalPercentage * 100) / 100,
        isExceeded: totalSpent > totalBudget,
      },

      budgets: enrichedBudgets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get one budget by ID
 */
const getBudgetById = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const budget = await Budget.findOne({
      _id: req.params.id,
      user: userId,
    }).lean();

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    const startDate = new Date(
      budget.year,
      budget.month - 1,
      1
    );

    const endDate = new Date(
      budget.year,
      budget.month,
      1
    );

    const spendingResult =
      await Transaction.aggregate([
        {
          $match: {
            user: userId,
            type: "expense",
            category: budget.category,
            date: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $group: {
            _id: null,
            spent: {
              $sum: "$amount",
            },
          },
        },
      ]);

    const spent =
      spendingResult[0]?.spent || 0;

    const remaining =
      budget.amount - spent;

    const percentage =
      budget.amount > 0
        ? (spent / budget.amount) * 100
        : 0;

    return res.status(200).json({
      success: true,

      budget: {
        ...budget,
        spent,
        remaining,
        percentage:
          Math.round(percentage * 100) / 100,
        isExceeded:
          spent > budget.amount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update budget
 */
const updateBudget = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const budget = await Budget.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    const {
      category,
      amount,
      month,
      year,
    } = req.body;

    if (
      category !== undefined &&
      !categories.includes(category)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid category",
      });
    }

    if (amount !== undefined) {
      const numericAmount = Number(amount);

      if (
        !Number.isFinite(numericAmount) ||
        numericAmount <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Budget amount must be greater than 0",
        });
      }

      budget.amount = numericAmount;
    }

    if (month !== undefined) {
      const numericMonth = Number(month);

      if (
        !Number.isInteger(numericMonth) ||
        numericMonth < 1 ||
        numericMonth > 12
      ) {
        return res.status(400).json({
          success: false,
          message: "Month must be between 1 and 12",
        });
      }

      budget.month = numericMonth;
    }

    if (year !== undefined) {
      const numericYear = Number(year);

      if (
        !Number.isInteger(numericYear) ||
        numericYear < 2020
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid year",
        });
      }

      budget.year = numericYear;
    }

    if (category !== undefined) {
      budget.category = category;
    }

    /*
     * Check if another budget would have
     * the same user/category/month/year.
     */
    const duplicateBudget = await Budget.findOne({
      _id: { $ne: budget._id },
      user: userId,
      category: budget.category,
      month: budget.month,
      year: budget.year,
    });

    if (duplicateBudget) {
      return res.status(409).json({
        success: false,
        message:
          "A budget for this category already exists for this month",
      });
    }

    await budget.save();

    return res.status(200).json({
      success: true,
      message: "Budget updated successfully",
      budget,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete budget
 */
const deleteBudget = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
};