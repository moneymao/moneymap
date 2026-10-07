import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  ArrowUp,
  Lock,
  PiggyBank,
  Receipt,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

const Footer = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const featureLinks = [
    { label: "Expense Tracking", path: "/features" },
    { label: "Income Management", path: "/features" },
    { label: "Monthly Budgets", path: "/features" },
    { label: "Savings Goals", path: "/features" },
    { label: "Financial Reports", path: "/features" },
  ];

  const exploreLinks = [
    { label: "Home", path: "/" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "Features", path: "/features" },
    {
      label: isAuthenticated ? "Dashboard" : "Sign In",
      path: isAuthenticated ? "/dashboard" : "/login",
    },
  ];

  return (
    <footer className="relative border-t border-slate-800 bg-slate-950 text-slate-300">
      {/* Decorative top accent gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand info (5 cols on large screens) */}
          <div className="lg:col-span-5">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 transition opacity-95 hover:opacity-100"
            >
              <img
                src="/logo-icon.png"
                alt="MoneyMap"
                className="h-9 w-9 rounded-xl object-contain shadow-sm"
              />
              <span className="text-xl font-bold tracking-tight text-white">
                MoneyMap
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              Smart, effortless personal finance tracking. Master your spending,
              build budgets that stick, and achieve your financial goals with confidence.
            </p>

            {/* Trust Badges */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300">
                <ShieldCheck size={14} className="text-emerald-400" />
                Private & Secure
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300">
                <Sparkles size={14} className="text-blue-400" />
                Real-Time Insights
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300">
                <TrendingUp size={14} className="text-green-400" />
                Zero Bank Sync Required
              </span>
            </div>
          </div>

          {/* Features Column (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Features
            </h3>
            <ul className="mt-4 space-y-2.5">
              {featureLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore Column (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5">
              {exploreLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Action / Account Card (3 cols) */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-inner backdrop-blur-sm">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 font-semibold text-white ring-1 ring-slate-700">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-slate-400">
                    You're logged in. Access your active summaries, transactions, and goals.
                  </p>

                  <Link
                    to="/dashboard"
                    className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 text-xs font-semibold text-slate-950 transition hover:bg-slate-100"
                  >
                    Open Dashboard
                    <ArrowRight size={14} />
                  </Link>
                </>
              ) : (
                <>
                  <h4 className="text-sm font-semibold text-white">
                    Start tracking today
                  </h4>
                  <p className="mt-1.5 text-xs leading-5 text-slate-400">
                    Join MoneyMap to take control of your expenses, maintain budgets, and save more.
                  </p>

                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      to="/register"
                      className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-white px-3 text-xs font-semibold text-slate-950 transition hover:bg-slate-100"
                    >
                      Create Free Account
                      <ArrowRight size={13} />
                    </Link>
                    <Link
                      to="/login"
                      className="flex h-9 w-full items-center justify-center rounded-lg border border-slate-700 px-3 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                      Sign In
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} MoneyMap. Built for personal financial clarity.
          </p>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link to="/features" className="transition hover:text-slate-300">
              Features
            </Link>
            <Link to="/how-it-works" className="transition hover:text-slate-300">
              How It Works
            </Link>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-slate-400 transition hover:text-white"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;