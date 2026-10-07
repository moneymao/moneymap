import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchDashboardSummary } from "../../store/slices/dashboardSlice";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const categoryChartData = (items) => {
  return items.map((item) => ({
    name: item.category,
    value: item.amount,
  }));
};

const Dashboard = () => {
  const dispatch = useDispatch();

  const {
    summary,
    spendingByCategory,
    recentTransactions,
    monthlySpending,
    isLoading,
    error,
  } = useSelector((state) => state.dashboard);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  if (isLoading) {
    return (
      <section className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[70vh] items-center justify-center">
            <div
              role="status"
              aria-label="Loading dashboard"
              className="h-9 w-9 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"
            />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            {error}
          </div>
        </div>
      </section>
    );
  }

  const chartData = categoryChartData(spendingByCategory);

  const chartColors = [
    "#0F172A",
    "#16A34A",
    "#2563EB",
    "#D97706",
    "#DC2626",
    "#7C3AED",
    "#0891B2",
    "#475569",
    "#65A30D",
    "#EA580C",
    "#64748B",
  ];

  const hasMonthlySpending = monthlySpending.some(
    (item) => item.amount > 0
  );

  const summaryCards = [
    {
      title: "Total balance",
      value: summary.totalBalance,
      icon: Wallet,
      iconClass: "bg-slate-100 text-slate-700",
    },
    {
      title: "Total income",
      value: summary.totalIncome,
      icon: TrendingUp,
      iconClass: "bg-green-50 text-green-600",
    },
    {
      title: "Total expenses",
      value: summary.totalExpenses,
      icon: TrendingDown,
      iconClass: "bg-red-50 text-red-600",
    },
    {
      title: "Monthly remaining",
      value: summary.monthlyRemaining,
      icon: BarChart3,
      iconClass: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-500">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.name || "there"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Here's a clear view of your money.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {card.title}
                    </p>

                    <p className="mt-2 text-xl font-bold text-slate-900">
                      {formatCurrency(card.value)}
                    </p>
                  </div>

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconClass}`}
                  >
                    <Icon
                      size={19}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Monthly overview + category chart */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* This month */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div>
              <h2 className="font-semibold text-slate-900">
                This month
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your income and expenses this month.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-green-50 p-4">
                <div className="flex items-center gap-2">
                  <ArrowDownLeft
                    size={17}
                    className="text-green-600"
                    aria-hidden="true"
                  />

                  <span className="text-sm text-green-700">
                    Income
                  </span>
                </div>

                <p className="mt-2 text-lg font-semibold text-green-700">
                  {formatCurrency(summary.monthlyIncome)}
                </p>
              </div>

              <div className="rounded-lg bg-red-50 p-4">
                <div className="flex items-center gap-2">
                  <ArrowUpRight
                    size={17}
                    className="text-red-600"
                    aria-hidden="true"
                  />

                  <span className="text-sm text-red-700">
                    Expenses
                  </span>
                </div>

                <p className="mt-2 text-lg font-semibold text-red-700">
                  {formatCurrency(summary.monthlyExpenses)}
                </p>
              </div>
            </div>

            {/* Monthly remaining */}
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Remaining this month
              </p>

              <p
                className={`mt-1 text-xl font-semibold ${
                  summary.monthlyRemaining >= 0
                    ? "text-slate-900"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(summary.monthlyRemaining)}
              </p>
            </div>
          </div>

          {/* Category chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div>
              <h2 className="font-semibold text-slate-900">
                Spending by category
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Where your money is going this month.
              </p>
            </div>

            {chartData.length === 0 ? (
              <div className="flex min-h-56 items-center justify-center text-center">
                <div>
                  <ReceiptText
                    size={28}
                    className="mx-auto text-slate-300"
                    aria-hidden="true"
                  />

                  <p className="mt-3 text-sm text-slate-500">
                    No expenses recorded this month.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 h-64">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={2}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={
                            chartColors[
                              index % chartColors.length
                            ]
                          }
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value) =>
                        formatCurrency(value)
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Spending over time */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <h2 className="font-semibold text-slate-900">
              Spending over time
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your expenses across the last 12 months.
            </p>
          </div>

          {!hasMonthlySpending ? (
            <div className="flex min-h-64 items-center justify-center text-center">
              <div>
                <BarChart3
                  size={28}
                  className="mx-auto text-slate-300"
                  aria-hidden="true"
                />

                <p className="mt-3 text-sm text-slate-500">
                  No spending data available yet.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 h-72 w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={monthlySpending}
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
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 12,
                    }}
                    tickFormatter={(value) =>
                      `₹${value}`
                    }
                  />

                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(value)
                    }
                  />

                  <Bar
                    dataKey="amount"
                    name="Expenses"
                    fill="#0F172A"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent transactions */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent transactions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest financial activity.
              </p>
            </div>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="flex min-h-48 items-center justify-center px-5 text-center">
              <div>
                <ReceiptText
                  size={28}
                  className="mx-auto text-slate-300"
                  aria-hidden="true"
                />

                <p className="mt-3 text-sm text-slate-500">
                  No transactions yet.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentTransactions.map((transaction) => {
                const isIncome =
                  transaction.type === "income";

                return (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          isIncome
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownLeft
                            size={18}
                            aria-hidden="true"
                          />
                        ) : (
                          <ArrowUpRight
                            size={18}
                            aria-hidden="true"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {transaction.description ||
                            transaction.category}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {transaction.category} ·{" "}
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`shrink-0 text-sm font-semibold ${
                        isIncome
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;