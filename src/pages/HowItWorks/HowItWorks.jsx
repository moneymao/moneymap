import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Lock,
  PiggyBank,
  Receipt,
  Sparkles,
  WalletCards,
  Zap,
} from "lucide-react";

const HowItWorks = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const steps = [
    {
      step: "01",
      icon: Receipt,
      title: "Log your daily transactions",
      description:
        "Quickly record income and expenses with customizable categories, payment methods, dates, and optional notes.",
      points: [
        "Record income and expenses in seconds",
        "Categorize with predefined or custom categories",
        "Track payments by Cash, Card, UPI, and Bank transfer",
      ],
    },
    {
      step: "02",
      icon: WalletCards,
      title: "Set smart category budgets",
      description:
        "Define monthly spending thresholds for categories like Food, Bills, or Travel to keep your spending intentional.",
      points: [
        "Visual budget progress bars with percentage alerts",
        "One-click monthly budget adjustments",
        "Prevent accidental overspending before month-end",
      ],
    },
    {
      step: "03",
      icon: PiggyBank,
      title: "Track your savings goals",
      description:
        "Set milestones for emergency funds, vacations, or major purchases and watch your savings accumulate over time.",
      points: [
        "Set target amounts and target completion dates",
        "Add savings contributions with immediate feedback",
        "Celebrate reaching 100% of your financial targets",
      ],
    },
    {
      step: "04",
      icon: BarChart3,
      title: "Analyze reports & trends",
      description:
        "Gain instant clarity into your net balance, monthly spending breakdowns, and category habits with interactive charts.",
      points: [
        "Interactive monthly expense bar charts",
        "Category distribution pie charts",
        "Filterable timelines across days, weeks, and years",
      ],
    },
  ];

  const highlights = [
    {
      icon: Zap,
      title: "Fast & Frictionless",
      description: "Clean design with zero bloat so you can log spending in under 5 seconds.",
    },
    {
      icon: Lock,
      title: "Private & Secure",
      description: "Protected with industry-standard JWT authentication and strict user isolation.",
    },
    {
      icon: Sparkles,
      title: "Clean Visuals",
      description: "Intuitive charts that give you immediate insight without complicated spreadsheets.",
    },
  ];

  return (
    <div className="bg-slate-50">
      {/* Page Hero */}
      <section className="border-b border-slate-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-green-700">
              Simple 4-Step Workflow
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              How MoneyMap puts you in control
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              No complicated accounting jargon or cluttered spreadsheets. MoneyMap
              transforms everyday transactions into crystal-clear financial clarity.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get started free"}
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/features"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Steps */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 sm:space-y-16">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 1;

              return (
                <div
                  key={item.step}
                  className={`flex flex-col gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:flex-row lg:items-center lg:justify-between ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className="lg:max-w-xl">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                        {item.step}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Step {item.step}
                      </span>
                    </div>

                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      {item.title}
                    </h2>

                    <p className="mt-3 text-base leading-7 text-slate-600">
                      {item.description}
                    </p>

                    <ul className="mt-6 space-y-3">
                      {item.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-3 text-sm text-slate-700"
                        >
                          <CheckCircle2
                            size={18}
                            className="mt-0.5 shrink-0 text-green-600"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex w-full items-center justify-center rounded-xl bg-slate-50 p-8 lg:w-96">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                      <Icon size={44} className="text-slate-900" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Why people choose MoneyMap
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Built from the ground up for speed, reliability, and ease of use.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="border-t border-slate-200 bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Start managing your money with clarity today
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">
            Join MoneyMap to take control of your expenses, maintain budgets, and
            achieve your savings goals.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-6 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              {isAuthenticated ? "Open Dashboard" : "Create your free account"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
