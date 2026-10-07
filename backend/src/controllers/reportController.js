import Transaction from "../models/Transaction.js";

const getReportSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const now = new Date();

    /*
     * Default:
     * Current calendar year
     */
    const defaultStartDate = new Date(
      now.getFullYear(),
      0,
      1
    );

    const defaultEndDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    let startDate = defaultStartDate;
    let endDate = defaultEndDate;

    /*
     * Optional custom date range.
     */
    if (req.query.startDate) {
      const parsedStartDate = new Date(
        req.query.startDate
      );

      if (
        Number.isNaN(
          parsedStartDate.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid start date",
        });
      }

      startDate = new Date(
        parsedStartDate.getFullYear(),
        parsedStartDate.getMonth(),
        parsedStartDate.getDate()
      );
    }

    if (req.query.endDate) {
      const parsedEndDate = new Date(
        req.query.endDate
      );

      if (
        Number.isNaN(
          parsedEndDate.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid end date",
        });
      }

      /*
       * Make end date exclusive by moving it
       * to the beginning of the following day.
       */
      endDate = new Date(
        parsedEndDate.getFullYear(),
        parsedEndDate.getMonth(),
        parsedEndDate.getDate() + 1
      );
    }

    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message:
          "Start date must be before end date",
      });
    }

    /*
     * All report queries are scoped to the
     * authenticated user.
     */
    const baseMatch = {
      user: userId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    };

    const [
      transactionSummary,
      monthlySummary,
      categorySummary,
      paymentMethodSummary,
      recentTransactions,
    ] = await Promise.all([
      /*
       * Overall income / expense summary.
       */
      Transaction.aggregate([
        {
          $match: baseMatch,
        },
        {
          $group: {
            _id: "$type",
            total: {
              $sum: "$amount",
            },
            count: {
              $sum: 1,
            },
          },
        },
      ]),

      /*
       * Monthly income / expense.
       */
      Transaction.aggregate([
        {
          $match: baseMatch,
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
              type: "$type",
            },
            total: {
              $sum: "$amount",
            },
            count: {
              $sum: 1,
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

      /*
       * Expense by category.
       */
      Transaction.aggregate([
        {
          $match: {
            ...baseMatch,
            type: "expense",
          },
        },
        {
          $group: {
            _id: "$category",
            total: {
              $sum: "$amount",
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            total: -1,
          },
        },
      ]),

      /*
       * Expense by payment method.
       */
      Transaction.aggregate([
        {
          $match: {
            ...baseMatch,
            type: "expense",
          },
        },
        {
          $group: {
            _id: "$paymentMethod",
            total: {
              $sum: "$amount",
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            total: -1,
          },
        },
      ]),

      /*
       * Latest transactions in selected period.
       */
      Transaction.find(baseMatch)
        .sort({
          date: -1,
          createdAt: -1,
        })
        .limit(10)
        .lean(),
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    transactionSummary.forEach((item) => {
      if (item._id === "income") {
        totalIncome = item.total;
        incomeCount = item.count;
      }

      if (item._id === "expense") {
        totalExpenses = item.total;
        expenseCount = item.count;
      }
    });

    /*
     * Build monthly data.
     *
     * We generate every month between the
     * selected dates, including zero-activity months.
     */
    const monthlyMap = new Map();

    monthlySummary.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;

      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, {
          year: item._id.year,
          month: item._id.month,
          income: 0,
          expenses: 0,
          incomeCount: 0,
          expenseCount: 0,
        });
      }

      const monthData = monthlyMap.get(key);

      if (item._id.type === "income") {
        monthData.income = item.total;
        monthData.incomeCount = item.count;
      }

      if (item._id.type === "expense") {
        monthData.expenses = item.total;
        monthData.expenseCount = item.count;
      }
    });

    const monthlyData = [];

    const cursor = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      1
    );

    const finalMonth = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      1
    );

    while (cursor < finalMonth) {
      const year = cursor.getFullYear();
      const month = cursor.getMonth() + 1;

      const key = `${year}-${month}`;

      const existing =
        monthlyMap.get(key);

      monthlyData.push({
        year,
        month,

        label: cursor.toLocaleString(
          "en-IN",
          {
            month: "short",
            year: "2-digit",
          }
        ),

        income: existing?.income || 0,

        expenses:
          existing?.expenses || 0,

        incomeCount:
          existing?.incomeCount || 0,

        expenseCount:
          existing?.expenseCount || 0,
      });

      cursor.setMonth(
        cursor.getMonth() + 1
      );
    }

    /*
     * Category percentages.
     */
    const categoryTotal = categorySummary.reduce(
      (total, item) =>
        total + item.total,
      0
    );

    const spendingByCategory =
      categorySummary.map((item) => ({
        category: item._id,

        amount: item.total,

        count: item.count,

        percentage:
          categoryTotal > 0
            ? Math.round(
                (item.total /
                  categoryTotal) *
                  10000
              ) / 100
            : 0,
      }));

    /*
     * Payment method percentages.
     */
    const paymentMethodTotal =
      paymentMethodSummary.reduce(
        (total, item) =>
          total + item.total,
        0
      );

    const spendingByPaymentMethod =
      paymentMethodSummary.map(
        (item) => ({
          paymentMethod: item._id,

          amount: item.total,

          count: item.count,

          percentage:
            paymentMethodTotal > 0
              ? Math.round(
                  (item.total /
                    paymentMethodTotal) *
                    10000
                ) / 100
              : 0,
        })
      );

    const netCashFlow =
      totalIncome - totalExpenses;

    const transactionCount =
      incomeCount + expenseCount;

    return res.status(200).json({
      success: true,

      period: {
        startDate,
        endDate,
      },

      summary: {
        totalIncome,
        totalExpenses,
        netCashFlow,
        transactionCount,
        incomeCount,
        expenseCount,
      },

      monthlyData,

      spendingByCategory,

      spendingByPaymentMethod,

      recentTransactions,
    });
  } catch (error) {
    next(error);
  }
};

export { getReportSummary };