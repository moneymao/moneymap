import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchReportSummary,
} from "../../store/slices/reportSlice";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CreditCard,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

const formatCurrency = (value = 0) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDateInput = (date) => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getCurrentYearDates = () => {
  const now = new Date();

  return {
    startDate: `${now.getFullYear()}-01-01`,
    endDate: formatDateInput(now),
  };
};

const getLastSixMonthsDates = () => {
  const now = new Date();

  const start = new Date(
    now.getFullYear(),
    now.getMonth() - 5,
    1
  );

  return {
    startDate: formatDateInput(start),
    endDate: formatDateInput(now),
  };
};

const getLastTwelveMonthsDates = () => {
  const now = new Date();

  const start = new Date(
    now.getFullYear(),
    now.getMonth() - 11,
    1
  );

  return {
    startDate: formatDateInput(start),
    endDate: formatDateInput(now),
  };
};

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  description,
  positive,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          {description && (
            <p
              className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                positive === true
                  ? "text-green-600"
                  : positive === false
                  ? "text-red-600"
                  : "text-slate-500"
              }`}
            >
              {positive === true && (
                <ArrowUpRight size={14} />
              )}

              {positive === false && (
                <ArrowDownRight size={14} />
              )}

              {description}
            </p>
          )}
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

const Reports = () => {
  const dispatch = useDispatch();

  const {
    summary,
    monthlyData,
    spendingByCategory,
    spendingByPaymentMethod,
    recentTransactions,
    loading,
    error,
  } = useSelector(
    (state) => state.reports
  );

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [period, setPeriod] =
    useState("year");

  useEffect(() => {
    const dates =
      getCurrentYearDates();

    setStartDate(dates.startDate);
    setEndDate(dates.endDate);

    dispatch(
      fetchReportSummary(dates)
    );
  }, [dispatch]);

  const loadReport = (
    start = startDate,
    end = endDate
  ) => {
    if (!start || !end) {
      return;
    }

    dispatch(
      fetchReportSummary({
        startDate: start,
        endDate: end,
      })
    );
  };

  const handlePeriodChange = (
    value
  ) => {
    setPeriod(value);

    let dates;

    if (value === "year") {
      dates = getCurrentYearDates();
    }

    if (value === "sixMonths") {
      dates =
        getLastSixMonthsDates();
    }

    if (value === "twelveMonths") {
      dates =
        getLastTwelveMonthsDates();
    }

    if (dates) {
      setStartDate(dates.startDate);
      setEndDate(dates.endDate);

      loadReport(
        dates.startDate,
        dates.endDate
      );
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    loadReport();
  };

  const categoryChartData = useMemo(
    () =>
      spendingByCategory.map(
        (item) => ({
          name: item.category,
          value: item.amount,
        })
      ),
    [spendingByCategory]
  );

  const paymentChartData = useMemo(
    () =>
      spendingByPaymentMethod.map(
        (item) => ({
          name: item.paymentMethod,
          value: item.amount,
        })
      ),
    [spendingByPaymentMethod]
  );

  const topCategories =
    spendingByCategory.slice(0, 5);

  const netPositive =
    summary.netCashFlow >= 0;

  return (
    <div className="space-y-6 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-green-600">
            Financial overview
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Reports & Analytics
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Understand your income, spending,
            and financial patterns over time.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            loadReport()
          }
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* Date filters */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                handlePeriodChange(
                  "year"
                )
              }
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                period === "year"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              This year
            </button>

            <button
              type="button"
              onClick={() =>
                handlePeriodChange(
                  "sixMonths"
                )
              }
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                period === "sixMonths"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Last 6 months
            </button>

            <button
              type="button"
              onClick={() =>
                handlePeriodChange(
                  "twelveMonths"
                )
              }
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                period === "twelveMonths"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Last 12 months
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]"
          >
            <div>
              <label
                htmlFor="report-start-date"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Start date
              </label>

              <input
                id="report-start-date"
                type="date"
                value={startDate}
                onChange={(event) => {
                  setStartDate(
                    event.target.value
                  );
                  setPeriod("custom");
                }}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label
                htmlFor="report-end-date"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                End date
              </label>

              <input
                id="report-end-date"
                type="date"
                value={endDate}
                onChange={(event) => {
                  setEndDate(
                    event.target.value
                  );
                  setPeriod("custom");
                }}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={
                  loading ||
                  !startDate ||
                  !endDate
                }
                className="h-10 w-full rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              loadReport()
            }
            className="font-semibold underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total income"
          value={formatCurrency(
            summary.totalIncome
          )}
          icon={TrendingUp}
          description={`${summary.incomeCount} income transactions`}
          positive
        />

        <SummaryCard
          title="Total expenses"
          value={formatCurrency(
            summary.totalExpenses
          )}
          icon={TrendingDown}
          description={`${summary.expenseCount} expense transactions`}
          positive={false}
        />

        <SummaryCard
          title="Net cash flow"
          value={formatCurrency(
            summary.netCashFlow
          )}
          icon={Wallet}
          description={
            netPositive
              ? "Income is higher than expenses"
              : "Expenses are higher than income"
          }
          positive={netPositive}
        />

        <SummaryCard
          title="Transactions"
          value={summary.transactionCount}
          icon={BarChart3}
          description="Transactions in selected period"
        />
      </section>

      {loading && !monthlyData.length ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-xl border border-slate-200 bg-white"
              />
            )
          )}
        </div>
      ) : (
        <>
          {/* Monthly chart */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Income vs expenses
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Monthly cash flow for the selected period.
              </p>
            </div>

            {monthlyData.length === 0 ? (
              <div className="flex h-72 items-center justify-center text-sm text-slate-500">
                No transaction data for
                this period.
              </div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={monthlyData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="label"
                      tick={{
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      tick={{
                        fontSize: 12,
                      }}
                      tickFormatter={(value) =>
                        `₹${(
                          value / 1000
                        ).toFixed(0)}k`
                      }
                    />

                    <Tooltip
                      formatter={(
                        value,
                        name
                      ) => [
                        formatCurrency(
                          value
                        ),
                        name ===
                        "income"
                          ? "Income"
                          : "Expenses",
                      ]}
                    />

                    <Bar
                      dataKey="income"
                      name="Income"
                      fill="#16A34A"
                      radius={[
                        4,
                        4,
                        0,
                        0,
                      ]}
                    />

                    <Bar
                      dataKey="expenses"
                      name="Expenses"
                      fill="#0F172A"
                      radius={[
                        4,
                        4,
                        0,
                        0,
                      ]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          {/* Category + payment */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Spending by category
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Where your expenses are going.
                </p>
              </div>

              {categoryChartData.length ===
              0 ? (
                <div className="flex h-72 items-center justify-center text-sm text-slate-500">
                  No expense data for
                  this period.
                </div>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={
                          categoryChartData
                        }
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        innerRadius={55}
                        paddingAngle={2}
                      >
                        {categoryChartData.map(
                          (entry, index) => (
                            <Cell
                              key={`${entry.name}-${index}`}
                              fill={[
                                "#0F172A",
                                "#16A34A",
                                "#2563EB",
                                "#D97706",
                                "#DC2626",
                                "#64748B",
                                "#475569",
                                "#059669",
                                "#7C3AED",
                                "#0891B2",
                                "#94A3B8",
                              ][
                                index %
                                  11
                              ]}
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        formatter={(
                          value
                        ) =>
                          formatCurrency(
                            value
                          )
                        }
                      />

                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Payment methods
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  How you are paying for expenses.
                </p>
              </div>

              {paymentChartData.length ===
              0 ? (
                <div className="flex h-72 items-center justify-center text-sm text-slate-500">
                  No payment data for
                  this period.
                </div>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={
                          paymentChartData
                        }
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        innerRadius={55}
                        paddingAngle={2}
                      >
                        {paymentChartData.map(
                          (entry, index) => (
                            <Cell
                              key={`${entry.name}-${index}`}
                              fill={[
                                "#16A34A",
                                "#0F172A",
                                "#2563EB",
                                "#D97706",
                                "#64748B",
                                "#DC2626",
                                "#475569",
                              ][
                                index %
                                  7
                              ]}
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        formatter={(
                          value
                        ) =>
                          formatCurrency(
                            value
                          )
                        }
                      />

                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>
          </div>

          {/* Top categories */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Top spending categories
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your highest expense categories in the selected period.
              </p>
            </div>

            {topCategories.length ===
            0 ? (
              <div className="rounded-lg bg-slate-50 p-8 text-center text-sm text-slate-500">
                No spending categories
                yet.
              </div>
            ) : (
              <div className="space-y-4">
                {topCategories.map(
                  (item) => (
                    <div
                      key={item.category}
                    >
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {item.category}
                          </p>

                          <p className="text-xs text-slate-500">
                            {item.count}{" "}
                            transactions
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900">
                            {formatCurrency(
                              item.amount
                            )}
                          </p>

                          <p className="text-xs text-slate-500">
                            {
                              item.percentage
                            }
                            %
                          </p>
                        </div>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-green-600 transition-all"
                          style={{
                            width: `${Math.min(
                              item.percentage,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>

          {/* Recent transactions */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Recent transactions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest transactions from the selected period.
              </p>
            </div>

            {recentTransactions.length ===
            0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No transactions found
                for this period.
              </div>
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[650px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Description
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Category
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Date
                        </th>

                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Amount
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentTransactions.map(
                        (transaction) => (
                          <tr
                            key={
                              transaction._id
                            }
                            className="border-b border-slate-100 last:border-0"
                          >
                            <td className="px-5 py-4">
                              <p className="font-medium text-slate-900">
                                {transaction.description ||
                                  transaction.category}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                {
                                  transaction.paymentMethod
                                }
                              </p>
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-600">
                              {
                                transaction.category
                              }
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-600">
                              {new Date(
                                transaction.date
                              ).toLocaleDateString(
                                "en-IN"
                              )}
                            </td>

                            <td
                              className={`px-5 py-4 text-right text-sm font-semibold ${
                                transaction.type ===
                                "income"
                                  ? "text-green-600"
                                  : "text-slate-900"
                              }`}
                            >
                              {transaction.type ===
                              "income"
                                ? "+"
                                : "-"}
                              {formatCurrency(
                                transaction.amount
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="divide-y divide-slate-100 md:hidden">
                  {recentTransactions.map(
                    (transaction) => (
                      <div
                        key={
                          transaction._id
                        }
                        className="p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-900">
                              {transaction.description ||
                                transaction.category}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {
                                transaction.category
                              }{" "}
                              ·{" "}
                              {
                                transaction.paymentMethod
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {new Date(
                                transaction.date
                              ).toLocaleDateString(
                                "en-IN"
                              )}
                            </p>
                          </div>

                          <p
                            className={`shrink-0 text-sm font-semibold ${
                              transaction.type ===
                              "income"
                                ? "text-green-600"
                                : "text-slate-900"
                            }`}
                          >
                            {transaction.type ===
                            "income"
                              ? "+"
                              : "-"}
                            {formatCurrency(
                              transaction.amount
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </section>
        </>
      )}

      {/* Empty state */}
      {!loading &&
        !error &&
        summary.transactionCount ===
          0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <BarChart3 size={22} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No financial activity yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Add some income or expenses
              to start seeing meaningful
              reports and spending patterns.
            </p>
          </div>
        )}
    </div>
  );
};

export default Reports;