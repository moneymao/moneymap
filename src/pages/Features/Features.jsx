import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Check,
  CreditCard,
  Layers,
  Lock,
  PiggyBank,
  ReceiptText,
  Smartphone,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

const Features = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const mainFeatures = [
    {
      icon: ReceiptText,
      badge: "Tracking",
      title: "Comprehensive Expense & Income Tracking",
      description:
        "Effortlessly record every rupee coming in and going out. Customize categories with custom 'Other' inputs, attach payment methods, and keep contextual notes.",
      benefits: [
        "Instant toggle between Income and Expense modes",
        "Pre-defined and custom category support",
        "Multiple payment options: Cash, UPI, Cards, Bank transfers",
        "Date picker and memo descriptions for full auditing",
      ],
    },
    {
      icon: WalletCards,
      badge: "Budgeting",
      title: "Proactive Monthly Category Budgets",
      description:
        "Take control before money leaves your account. Define monthly limits for key spending categories and watch real-time progress bars update automatically.",
      benefits: [
        "Visual progress bars with threshold percentages",
        "Automatic tracking against logged transactions",
        "Separate limits for dining, shopping, bills, and more",
        "Safe delete confirmations to prevent accidental data loss",
      ],
    },
    {
      icon: PiggyBank,
      badge: "Savings",
      title: "Target-Driven Savings Goals",
      description:
        "Turn aspirations into reality. Whether saving for an emergency cushion, vacation, or gadget, track contributions and celebrate milestones.",
      benefits: [
        "Set target amounts and realistic target deadlines",
        "Real-time completion percentage calculations",
        "Detailed contributions history",
        "Archive and review completed milestones",
      ],
    },
    {
      icon: BarChart3,
      badge: "Analytics",
      title: "Visual Financial Reports & Trends",
      description:
        "Understand your financial velocity. MoneyMap's dashboard and reports transform raw numbers into intuitive interactive charts and category breakdowns.",
      benefits: [
        "Interactive monthly expense bar charts",
        "Category distribution donut charts",
        "Net income vs. total expense summaries",
        "Export-ready financial perspective",
      ],
    },
  ];

  const gridFeatures = [
    {
      icon: Smartphone,
      title: "Fully Responsive Experience",
      description:
        "Seamlessly switch between desktop, tablet, and mobile with dedicated sticky navigation and optimized controls.",
    },
    {
      icon: Lock,
      title: "Secure Account Authentication",
      description:
        "Safe JWT session security, encrypted credentials, and full user data isolation keep your financial figures private.",
    },
    {
      icon: Layers,
      title: "Category Flexibility",
      description:
        "Rich defaults plus custom category extensions ensure every type of transaction is categorized accurately.",
    },
    {
      icon: TrendingUp,
      title: "Income Growth Visibility",
      description:
        "Monitor recurring salary and freelance income side-by-side with outgoings to track net wealth growth.",
    },
    {
      icon: TrendingDown,
      title: "Overspending Prevention",
      description:
        "Quick visual indicators highlight when specific categories approach their budgeted limits.",
    },
    {
      icon: Calendar,
      title: "Month-by-Month History",
      description:
        "Easily browse past months and years to understand historical spending habits and seasonal trends.",
    },
  ];

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-green-700">
              Powerful Features
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Everything you need to master your money
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              MoneyMap combines simplicity with depth. Get the financial tools you
              need to track spending, stick to budgets, and reach your goals without the clutter.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {isAuthenticated ? "Open Dashboard" : "Start free today"}
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Core Features Showcase */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 1;

              return (
                <div
                  key={feature.title}
                  className={`flex flex-col gap-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:flex-row lg:items-center lg:justify-between ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className="lg:max-w-xl">
                    <span className="inline-block rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                      {feature.badge}
                    </span>

                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      {feature.title}
                    </h2>

                    <p className="mt-3 text-base leading-7 text-slate-600">
                      {feature.description}
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {feature.benefits.map((benefit) => (
                        <div
                          key={benefit}
                          className="flex items-start gap-2.5 text-sm text-slate-700"
                        >
                          <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-center rounded-2xl bg-slate-50 p-10 lg:w-96">
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                      <Icon size={48} className="text-slate-900" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid of Additional Capabilities */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Engineered for seamless daily money management
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Thoughtful details designed to save you time and provide lasting financial peace of mind.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-6 transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
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

      {/* Final Call to Action */}
      <section className="border-t border-slate-200 bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to experience a better way to manage money?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">
            Sign up now and start visualizing your income, expenses, budgets, and savings goals in one place.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-6 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get started for free"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
