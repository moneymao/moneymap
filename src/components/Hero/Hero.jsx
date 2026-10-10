import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, Check } from "lucide-react";
import { fetchDashboardSummary } from "../../store/slices/dashboardSlice";

const Hero = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isInitialized } = useSelector((state) => state.auth);
  const { summary, spendingByCategory } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchDashboardSummary());
    }
  }, [dispatch, isAuthenticated]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const benefits = [
    {
      id: 1,
      text: "Track income and expenses",
    },
    {
      id: 2,
      text: "See where your money goes",
    },
    {
      id: 3,
      text: "Set budgets and savings goals",
    },
  ];

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
        {/* Content */}
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-green-600">
            Personal finance, made clear
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Know where your money goes.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Track your income and expenses, understand your spending habits,
            and get a clearer view of your money in one place.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {isInitialized && isAuthenticated && user ? (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                  Go to Dashboard
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                  {user.name}
                </Link>
              </>
            ) : isInitialized ? (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                  Start tracking
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <div className="h-11 w-48 animate-pulse rounded-lg bg-slate-100" />
            )}
          </div>

          {/* Benefits */}
          <div className="mt-8 space-y-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="flex items-center gap-3 text-sm text-slate-600"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <Check size={13} strokeWidth={2.5} />
                </span>

                <span>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Preview */}
        <div className="relative">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {isAuthenticated && user?.name
                      ? `${user.name}'s balance`
                      : "Available balance"}
                  </p>

                  <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                    {isAuthenticated
                      ? formatCurrency(summary.totalBalance)
                      : "₹42,350"}
                  </p>
                </div>

                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100"
                    title="View full dashboard"
                  >
                    This month
                  </Link>
                ) : (
                  <div className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                    This month
                  </div>
                )}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Income</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">
                    {isAuthenticated
                      ? formatCurrency(summary.monthlyIncome)
                      : "₹60,000"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Expenses</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">
                    {isAuthenticated
                      ? formatCurrency(summary.monthlyExpenses)
                      : "₹17,650"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700">
                    Spending
                  </p>

                  <p className="text-sm text-slate-500">This month</p>
                </div>

                <div className="mt-4 space-y-3">
                  {isAuthenticated ? (
                    spendingByCategory.length > 0 ? (
                      spendingByCategory.slice(0, 3).map((item, index) => {
                        const barColors = [
                          "bg-green-600",
                          "bg-slate-800",
                          "bg-slate-400",
                        ];
                        const total = summary.monthlyExpenses || 1;
                        const percent = Math.min(
                          Math.max(
                            Math.round((item.amount / total) * 100),
                            5
                          ),
                          100
                        );

                        return (
                          <div key={item.category} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">
                                {item.category}
                              </span>
                              <span className="font-medium text-slate-900">
                                {formatCurrency(item.amount)}
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full ${
                                  barColors[index % barColors.length]
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="rounded-lg bg-slate-50 p-4 text-center">
                        <p className="text-xs text-slate-500">
                          No expenses recorded this month yet.
                        </p>
                        <Link
                          to="/transactions"
                          className="mt-1.5 inline-block text-xs font-semibold text-slate-900 underline"
                        >
                          Add a transaction
                        </Link>
                      </div>
                    )
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Food</span>
                        <span className="font-medium text-slate-900">₹4,200</span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full w-[68%] rounded-full bg-green-600" />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Bills</span>
                        <span className="font-medium text-slate-900">₹3,800</span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full w-[55%] rounded-full bg-slate-800" />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Shopping</span>
                        <span className="font-medium text-slate-900">₹3,200</span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full w-[45%] rounded-full bg-slate-400" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;