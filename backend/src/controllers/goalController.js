import Goal from "../models/Goal.js";

const validateGoalData = ({
  name,
  targetAmount,
  currentAmount,
  deadline,
}) => {
  if (
    typeof name !== "string" ||
    name.trim().length < 2
  ) {
    return "Goal name must contain at least 2 characters";
  }

  const numericTargetAmount = Number(targetAmount);

  if (
    !Number.isFinite(numericTargetAmount) ||
    numericTargetAmount <= 0
  ) {
    return "Target amount must be greater than 0";
  }

  if (currentAmount !== undefined) {
    const numericCurrentAmount = Number(currentAmount);

    if (
      !Number.isFinite(numericCurrentAmount) ||
      numericCurrentAmount < 0
    ) {
      return "Current amount cannot be negative";
    }

    if (
      numericCurrentAmount > numericTargetAmount
    ) {
      return "Current amount cannot be greater than target amount";
    }
  }

  if (!deadline) {
    return "Deadline is required";
  }

  const deadlineDate = new Date(deadline);

  if (Number.isNaN(deadlineDate.getTime())) {
    return "Please provide a valid deadline";
  }

  return null;
};

/**
 * Create goal
 */
const createGoal = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const {
      name,
      targetAmount,
      currentAmount = 0,
      deadline,
      description = "",
    } = req.body;

    const validationError = validateGoalData({
      name,
      targetAmount,
      currentAmount,
      deadline,
    });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const goal = await Goal.create({
      user: userId,
      name: name.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
      deadline: new Date(deadline),
      description: description.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Goal created successfully",
      goal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all goals
 */
const getGoals = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const goals = await Goal.find({
      user: userId,
    })
      .sort({
        deadline: 1,
        createdAt: -1,
      })
      .lean();

    const enrichedGoals = goals.map((goal) => {
      const targetAmount = goal.targetAmount;
      const currentAmount = goal.currentAmount;

      const remainingAmount = Math.max(
        targetAmount - currentAmount,
        0
      );

      const percentage =
        targetAmount > 0
          ? (currentAmount / targetAmount) * 100
          : 0;

      const normalizedPercentage = Math.min(
        Math.max(percentage, 0),
        100
      );

      const completed =
        currentAmount >= targetAmount;

      const deadlineDate = new Date(
        goal.deadline
      );

      const now = new Date();

      const overdue =
        !completed && deadlineDate < now;

      let status = "on-track";

      if (completed) {
        status = "completed";
      } else if (overdue) {
        status = "overdue";
      } else if (normalizedPercentage >= 80) {
        status = "near-target";
      }

      return {
        ...goal,
        remainingAmount,
        percentage:
          Math.round(percentage * 100) / 100,
        progress:
          Math.round(normalizedPercentage * 100) / 100,
        completed,
        overdue,
        status,
      };
    });

    const summary = {
      totalGoals: enrichedGoals.length,

      completedGoals: enrichedGoals.filter(
        (goal) => goal.completed
      ).length,

      activeGoals: enrichedGoals.filter(
        (goal) => !goal.completed
      ).length,

      totalTargetAmount: enrichedGoals.reduce(
        (total, goal) =>
          total + goal.targetAmount,
        0
      ),

      totalSavedAmount: enrichedGoals.reduce(
        (total, goal) =>
          total + goal.currentAmount,
        0
      ),

      totalRemainingAmount: enrichedGoals.reduce(
        (total, goal) =>
          total + goal.remainingAmount,
        0
      ),
    };

    return res.status(200).json({
      success: true,
      summary,
      goals: enrichedGoals,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get one goal
 */
const getGoalById = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const goal = await Goal.findOne({
      _id: req.params.id,
      user: userId,
    }).lean();

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    const remainingAmount = Math.max(
      goal.targetAmount - goal.currentAmount,
      0
    );

    const percentage =
      goal.targetAmount > 0
        ? (goal.currentAmount /
            goal.targetAmount) *
          100
        : 0;

    const progress = Math.min(
      Math.max(percentage, 0),
      100
    );

    const completed =
      goal.currentAmount >= goal.targetAmount;

    const overdue =
      !completed &&
      new Date(goal.deadline) < new Date();

    let status = "on-track";

    if (completed) {
      status = "completed";
    } else if (overdue) {
      status = "overdue";
    } else if (progress >= 80) {
      status = "near-target";
    }

    return res.status(200).json({
      success: true,
      goal: {
        ...goal,
        remainingAmount,
        percentage:
          Math.round(percentage * 100) / 100,
        progress:
          Math.round(progress * 100) / 100,
        completed,
        overdue,
        status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update goal
 */
const updateGoal = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const goal = await Goal.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    const {
      name,
      targetAmount,
      currentAmount,
      deadline,
      description,
    } = req.body;

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        name.trim().length < 2
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Goal name must contain at least 2 characters",
        });
      }

      goal.name = name.trim();
    }

    if (targetAmount !== undefined) {
      const numericTargetAmount =
        Number(targetAmount);

      if (
        !Number.isFinite(numericTargetAmount) ||
        numericTargetAmount <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Target amount must be greater than 0",
        });
      }

      if (
        goal.currentAmount >
        numericTargetAmount
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Target amount cannot be lower than current saved amount",
        });
      }

      goal.targetAmount =
        numericTargetAmount;
    }

    if (currentAmount !== undefined) {
      const numericCurrentAmount =
        Number(currentAmount);

      if (
        !Number.isFinite(numericCurrentAmount) ||
        numericCurrentAmount < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Current amount cannot be negative",
        });
      }

      if (
        numericCurrentAmount >
        goal.targetAmount
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Current amount cannot be greater than target amount",
        });
      }

      goal.currentAmount =
        numericCurrentAmount;
    }

    if (deadline !== undefined) {
      const deadlineDate = new Date(deadline);

      if (Number.isNaN(deadlineDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid deadline",
        });
      }

      goal.deadline = deadlineDate;
    }

    if (description !== undefined) {
      goal.description =
        String(description).trim();
    }

    await goal.save();

    return res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      goal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add money to a goal
 */
const addToGoal = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const goal = await Goal.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    const amount = Number(req.body.amount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Amount must be greater than 0",
      });
    }

    const newAmount =
      goal.currentAmount + amount;

    if (newAmount > goal.targetAmount) {
      return res.status(400).json({
        success: false,
        message:
          "Added amount would exceed the goal target",
      });
    }

    goal.currentAmount = newAmount;

    await goal.save();

    return res.status(200).json({
      success: true,
      message: "Amount added to goal successfully",
      goal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete goal
 */
const deleteGoal = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  addToGoal,
  deleteGoal,
};