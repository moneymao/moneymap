// src/layouts/DashboardLayout/DashboardLayout.jsx

import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart3,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  Target,
  WalletCards,
  X,
} from "lucide-react";

import { logoutUser } from "../../store/slices/authSlice";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: Receipt,
  },
  {
    label: "Budget",
    path: "/budget",
    icon: WalletCards,
  },
  {
    label: "Goals",
    path: "/goals",
    icon: Target,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
];

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [isProfileOpen, setIsProfileOpen] =
    useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  };

  const getInitials = () => {
    if (!user?.name) {
      return "U";
    }

    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <button
            type="button"
            onClick={() => handleNavigation("/dashboard")}
            className="flex items-center gap-3"
          >
            <img
              src="/logo-icon.png"
              alt="MoneyMap"
              className="h-9 w-9 rounded-lg object-contain"
            />

            <span className="text-lg font-bold tracking-tight text-slate-900">
              MoneyMap
            </span>
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-1 px-3 py-6"
        >
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Overview
          </p>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                type="button"
                onClick={() =>
                  handleNavigation(item.path)
                }
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={active ? 2.2 : 1.9}
                />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-slate-200 p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              {getInitials()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.name || "User"}
              </p>

              <p className="truncate text-xs text-slate-500">
                {user?.email || ""}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Logout"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <button
            type="button"
            onClick={() => handleNavigation("/dashboard")}
            className="flex items-center gap-2.5"
          >
            <img
              src="/logo-icon.png"
              alt="MoneyMap"
              className="h-8 w-8 rounded-lg object-contain"
            />

            <span className="text-base font-bold text-slate-900">
              MoneyMap
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setIsMobileMenuOpen(
                (previous) => !previous
              )
            }
            aria-label={
              isMobileMenuOpen
                ? "Close menu"
                : "Open menu"
            }
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
          >
            {isMobileMenuOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3">
            <nav
              aria-label="Mobile navigation"
              className="space-y-1"
            >
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() =>
                      handleNavigation(item.path)
                    }
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${
                      active
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600"
                    }`}
                  >
                    <Icon size={19} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="my-2 border-t border-slate-100" />

              <div className="flex items-center gap-3 px-3 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  {getInitials()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user?.name || "User"}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {user?.email || ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main area */}
      <div className="lg:pl-64">
        {/* Desktop top header */}
        <header className="sticky top-0 z-40 hidden h-16 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm lg:flex lg:items-center lg:justify-end lg:px-8">
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setIsProfileOpen(
                  (previous) => !previous
                )
              }
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-slate-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                {getInitials()}
              </div>

              <div className="hidden text-left xl:block">
                <p className="max-w-40 truncate text-sm font-semibold text-slate-900">
                  {user?.name || "User"}
                </p>

                <p className="max-w-40 truncate text-xs text-slate-500">
                  {user?.email || ""}
                </p>
              </div>

              <ChevronDown
                size={16}
                className="text-slate-400"
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user?.name || "User"}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {user?.email || ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="pb-20 lg:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="Mobile bottom navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white lg:hidden"
      >
        <div className="grid grid-cols-5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                type="button"
                onClick={() =>
                  handleNavigation(item.path)
                }
                className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${
                  active
                    ? "text-slate-900"
                    : "text-slate-400"
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.2 : 1.8}
                />

                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default DashboardLayout;