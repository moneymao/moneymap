import Transaction from "../models/Transaction.js";

const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    const startOfYearRange = new Date(
      now.getFullYear(),
      now.getMonth() - 11,
      1
    );

    const [
      balanceSummary,
      monthlySummary,
      categorySummary,
      recentTransactions,
      monthlySpending,
    ] = await Promise.all([
      // Overall income and expenses
      Transaction.aggregate([
        {
          $match: {
            user: userId,
          },
        },
        {
          $group: {
            _id: "$type",
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      // Current month
      Transaction.aggregate([
        {
          $match: {
            user: userId,
            date: {
              $gte: startOfMonth,
              $lt: startOfNextMonth,
            },
          },
        },
        {
          $group: {
            _id: "$type",
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      // Current month spending by category
      Transaction.aggregate([
        {
          $match: {
            user: userId,
            type: "expense",
            date: {
              $gte: startOfMonth,
              $lt: startOfNextMonth,
            },
          },
        },
        {
          $group: {
            _id: "$category",
            total: {
              $sum: "$amount",
            },
          },
        },
        {
          $sort: {
            total: -1,
          },
        },
      ]),

      // Latest five transactions
      Transaction.find({
        user: userId,
      })
        .sort({
          date: -1,
          createdAt: -1,
        })
        .limit(5)
        .lean(),

      // Last 12 calendar months
      Transaction.aggregate([
        {
          $match: {
            user: userId,
            type: "expense",
            date: {
              $gte: startOfYearRange,
              $lt: startOfNextMonth,
            },
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$date",
              },
              month: {
                $month: "$date",
              },
            },
            total: {
              $sum: "$amount",
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]),
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;

    balanceSummary.forEach((item) => {
      if (item._id === "income") {
        totalIncome = item.total;
      }

      if (item._id === "expense") {
        totalExpenses = item.total;
      }
    });

    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    monthlySummary.forEach((item) => {
      if (item._id === "income") {
        monthlyIncome = item.total;
      }

      if (item._id === "expense") {
        monthlyExpenses = item.total;
      }
    });

    /*
     * Build all 12 months.
     * This guarantees that months with no spending
     * still appear in the response with amount: 0.
     */
    const spendingMap = new Map();

    monthlySpending.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;

      spendingMap.set(key, item.total);
    });

    const monthlySpendingData = [];

    for (let index = 11; index >= 0; index -= 1) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - index,
        1
      );

      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const key = `${year}-${month}`;

      monthlySpendingData.push({
        year,
        month,
        label: date.toLocaleString("en-IN", {
          month: "short",
        }),
        amount: spendingMap.get(key) || 0,
      });
    }

    return res.status(200).json({
      success: true,

      summary: {
        totalBalance: totalIncome - totalExpenses,
        totalIncome,
        totalExpenses,
        monthlyIncome,
        monthlyExpenses,
        monthlyRemaining:
          monthlyIncome - monthlyExpenses,
      },

      spendingByCategory: categorySummary.map((item) => ({
        category: item._id,
        amount: item.total,
      })),

      recentTransactions,

      monthlySpending: monthlySpendingData,
    });
  } catch (error) {
    next(error);
  }
};

export { getDashboardSummary };