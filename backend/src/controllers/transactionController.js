import mongoose from "mongoose";
import Transaction, {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  ALL_CATEGORIES,
} from "../models/Transaction.js";

const paymentMethods = [
  "Cash",
  "UPI",
  "Debit Card",
  "Credit Card",
  "Bank Transfer",
  "Net Banking",
  "Other",
];

const transactionTypes = ["income", "expense"];

const createTransaction = async (req, res, next) => {
  try {
    const {
      type,
      amount,
      category,
      paymentMethod,
      date,
      description,
    } = req.body;

    if (!transactionTypes.includes(type)) {
      return res.status(422).json({
        success: false,
        message: "Invalid transaction type",
      });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(422).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const validCategories =
      type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    if (!validCategories.includes(category)) {
      return res.status(422).json({
        success: false,
        message: `Invalid ${type} category`,
      });
    }

    if (!paymentMethods.includes(paymentMethod)) {
      return res.status(422).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    const transactionDate = new Date(date);

    if (!date || Number.isNaN(transactionDate.getTime())) {
      return res.status(422).json({
        success: false,
        message: "Invalid transaction date",
      });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount: numericAmount,
      category,
      paymentMethod,
      date: transactionDate,
      description: typeof description === "string" ? description.trim() : "",
    });

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 20, 1),
      100
    );

    const skip = (page - 1) * limit;

    const filter = {
      user: req.user._id,
    };

    if (req.query.type && transactionTypes.includes(req.query.type)) {
      filter.type = req.query.type;
    }

    if (req.query.category && ALL_CATEGORIES.includes(req.query.category)) {
      filter.category = req.query.category;
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Transaction.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID",
      });
    }

    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user._id,
    }).lean();

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID",
      });
    }

    const allowedFields = [
      "type",
      "amount",
      "category",
      "paymentMethod",
      "date",
      "description",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    if (updates.type !== undefined) {
      if (!transactionTypes.includes(updates.type)) {
        return res.status(422).json({
          success: false,
          message: "Invalid transaction type",
        });
      }
    }

    if (updates.amount !== undefined) {
      const numericAmount = Number(updates.amount);

      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(422).json({
          success: false,
          message: "Amount must be greater than 0",
        });
      }

      updates.amount = numericAmount;
    }

    if (updates.category !== undefined || updates.type !== undefined) {
      const existing = await Transaction.findOne({
        _id: id,
        user: req.user._id,
      }).select("type category");

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Transaction not found",
        });
      }

      const effectiveType = updates.type || existing.type;
      const effectiveCategory = updates.category || existing.category;
      const validCategories =
        effectiveType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

      if (!validCategories.includes(effectiveCategory)) {
        return res.status(422).json({
          success: false,
          message: `Invalid ${effectiveType} category`,
        });
      }
    }

    if (
      updates.paymentMethod !== undefined &&
      !paymentMethods.includes(updates.paymentMethod)
    ) {
      return res.status(422).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    if (updates.date !== undefined) {
      const transactionDate = new Date(updates.date);

      if (Number.isNaN(transactionDate.getTime())) {
        return res.status(422).json({
          success: false,
          message: "Invalid transaction date",
        });
      }

      updates.date = transactionDate;
    }

    if (updates.description !== undefined) {
      if (typeof updates.description !== "string") {
        return res.status(422).json({
          success: false,
          message: "Description must be text",
        });
      }

      updates.description = updates.description.trim();
    }

    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: id,
        user: req.user._id,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID",
      });
    }

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};