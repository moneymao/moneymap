import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Download, Menu, X } from "lucide-react";
import usePwaInstall from "../../hooks/usePwaInstall";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isInstallable, installApp } = usePwaInstall();

  const { user, isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  const getInitials = (name) => {
    if (!name || typeof name !== "string") {
      return "U";
    }

    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return "U";
    }

    return parts
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const navLinks = [
    {
      id: 1,
      label: "Home",
      path: "/",
    },
    {
      id: 2,
      label: "How It Works",
      path: "/how-it-works",
    },
    {
      id: 3,
      label: "Features",
      path: "/features",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 transition opacity-95 hover:opacity-100"
        >
          <img
            src="/logo-icon.png"
            alt="MoneyMap"
            className="h-9 w-9 rounded-lg object-contain"
          />
          <span className="text-xl font-bold tracking-tight text-slate-900">
            MoneyMap
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              to={link.path}
              className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}

          {isInstallable && (
            <button
              type="button"
              onClick={installApp}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            >
              <Download size={14} />
              Install App
            </button>
          )}

          {isInitialized && isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-slate-900"
              >
                Dashboard
              </Link>

              <Link
                to="/dashboard"
                title={user.name}
                aria-label={`Go to dashboard (${user.name})`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white transition-colors duration-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                {getInitials(user.name)}
              </Link>
            </div>
          ) : isInitialized ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-slate-900"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="h-9 w-28 animate-pulse rounded-lg bg-slate-100" />
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="rounded-lg p-2 text-slate-700 transition-colors duration-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 md:hidden"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="border-b border-slate-100 py-3 text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}

            {isInitialized && isAuthenticated && user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 border-b border-slate-100 py-3 text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {getInitials(user.name)}
                  </div>
                  <span className="truncate">{user.name}</span>
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-2 rounded-lg bg-slate-900 px-5 py-3 text-center text-sm font-medium text-white transition-colors duration-200 hover:bg-slate-800"
                >
                  Dashboard
                </Link>
              </>
            ) : isInitialized ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 text-sm font-medium text-slate-700"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-2 rounded-lg bg-slate-900 px-5 py-3 text-center text-sm font-medium text-white transition-colors duration-200 hover:bg-slate-800"
                >
                  Get Started
                </Link>
              </>
            ) : null}

            {isInstallable && (
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  installApp();
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                <Download size={16} />
                Install MoneyMap App
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;