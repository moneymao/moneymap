import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, Home, LayoutDashboard, SearchX } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/logo-icon.png"
              alt="MoneyMap"
              className="h-9 w-9 rounded-lg object-contain"
            />
            <span className="text-lg font-bold tracking-tight text-slate-900">
              MoneyMap
            </span>
          </Link>

          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            {isAuthenticated ? "Dashboard" : "Home"}
          </Link>
        </div>
      </header>

      {/* Main 404 Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          {/* Badge & Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 shadow-sm">
            <SearchX size={32} strokeWidth={2} />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-green-600">
            404 Error
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Page not found
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might
            have been moved, deleted, or the URL might be mistyped.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              <ArrowLeft size={17} />
              Go back
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <LayoutDashboard size={17} />
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <Home size={17} />
                Back to Home
              </Link>
            )}
          </div>

          {/* Helpful Navigation */}
          <div className="mt-12 rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Popular destinations
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <Link
                to="/"
                className="rounded-lg p-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Home
              </Link>
              <Link
                to="/features"
                className="rounded-lg p-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Features
              </Link>
              <Link
                to="/how-it-works"
                className="rounded-lg p-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} MoneyMap. All rights reserved.
      </footer>
    </div>
  );
};

export default NotFound;