import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Edit3,
  Plus,
  Target,
  Trash2,
  WalletCards,
} from "lucide-react";

import {
  createBudget,
  deleteBudget,
  fetchBudgets,
  updateBudget,
} from "../../store/slices/budgetSlice";

import BudgetForm from "../../components/BudgetForm/BudgetForm";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const currencyFormatter = new Intl.NumberFormat(
  "en-IN",
  {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }
);

const formatCurrency = (value) => {
  return currencyFormatter.format(Number(value) || 0);
};

const getPercentage = (budget) => {
  const percentage = Number(budget.percentage) || 0;

  return Math.min(Math.max(percentage, 0), 100);
};

const getProgressClass = (budget) => {
  const percentage = Number(budget.percentage) || 0;

  if (percentage >= 100) {
    return "bg-red-600";
  }

  if (percentage >= 80) {
    return "bg-amber-500";
  }

  return "bg-green-600";
};

const getStatus = (budget) => {
  const percentage = Number(budget.percentage) || 0;

  if (budget.isExceeded || percentage >= 100) {
    return {
      label: "Over budget",
      className:
        "border-red-200 bg-red-50 text-red-700",
    };
  }

  if (percentage >= 80) {
    return {
      label: "Almost reached",
      className:
        "border-amber-200 bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "On track",
    className:
      "border-green-200 bg-green-50 text-green-700",
  };
};

const Budget = () => {
  const dispatch = useDispatch();

  const {
    budgets,
    summary,
    period,
    isLoading,
    isSubmitting,
    error,
  } = useSelector((state) => state.budget);

  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    period.month || currentDate.getMonth() + 1
  );

  const [selectedYear, setSelectedYear] = useState(
    period.year || currentDate.getFullYear()
  );

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingBudget, setEditingBudget] =
    useState(null);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [formError, setFormError] = useState(null);

  useEffect(() => {
    dispatch(
      fetchBudgets({
        month: selectedMonth,
        year: selectedYear,
      })
    );
  }, [dispatch, selectedMonth, selectedYear]);

  const selectedMonthName = useMemo(() => {
    return (
      months.find(
        (month) => month.value === selectedMonth
      )?.label || ""
    );
  }, [selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(Number(event.target.value));
  };

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
  };

  const openCreateModal = () => {
    setEditingBudget(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (budget) => {
    setEditingBudget(budget);
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsModalOpen(false);
    setEditingBudget(null);
    setFormError(null);
  };

  const handleBudgetSubmit = async (data) => {
    setFormError(null);

    try {
      if (editingBudget) {
        await dispatch(
          updateBudget({
            id: editingBudget._id,
            budgetData: data,
          })
        ).unwrap();
      } else {
        await dispatch(
          createBudget(data)
        ).unwrap();
      }

      setIsModalOpen(false);
      setEditingBudget(null);

      dispatch(
        fetchBudgets({
          month: selectedMonth,
          year: selectedYear,
        })
      );
    } catch (submitError) {
      setFormError(
        submitError || "Unable to save budget"
      );
    }
  };

  const handleDelete = (budget) => {
    setDeleteTarget(budget);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      await dispatch(
        deleteBudget(deleteTarget._id)
      ).unwrap();

      setDeleteTarget(null);

      dispatch(
        fetchBudgets({
          month: selectedMonth,
          year: selectedYear,
        })
      );
    } catch {
      // Redux already stores the error.
    }
  };

  const isEmpty =
    !isLoading && budgets.length === 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-green-700">
              <Target size={17} />
              <span>Budget planning</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Your budgets
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Set spending limits for each category and
              see how your actual spending compares.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={18} />
            Add Budget
          </button>
        </div>

        {/* Filters */}
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="w-full sm:max-w-xs">
              <label
                htmlFor="budget-month-filter"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Month
              </label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  id="budget-month-filter"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-10 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                >
                  {months.map((month) => (
                    <option
                      key={month.value}
                      value={month.value}
                    >
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full sm:max-w-xs">
              <label
                htmlFor="budget-year-filter"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Year
              </label>

              <input
                id="budget-year-filter"
                type="number"
                min="2020"
                max="2100"
                value={selectedYear}
                onChange={handleYearChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Unable to load budgets
              </p>

              <p className="mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Summary */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total budget */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <WalletCards size={20} />
              </div>
            </div>

            <p className="text-sm text-slate-500">
              Total budget
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatCurrency(summary.totalBudget)}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {selectedMonthName} {selectedYear}
            </p>
          </div>

          {/* Spent */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <ArrowDown size={20} />
              </div>
            </div>

            <p className="text-sm text-slate-500">
              Total spent
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatCurrency(summary.totalSpent)}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {Number(summary.totalPercentage || 0).toFixed(1)}%
              {" "}of budget used
            </p>
          </div>

          {/* Remaining */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <ArrowUp size={20} />
              </div>
            </div>

            <p className="text-sm text-slate-500">
              Remaining
            </p>

            <p
              className={`mt-1 text-2xl font-bold ${
                summary.totalRemaining < 0
                  ? "text-red-600"
                  : "text-slate-900"
              }`}
            >
              {formatCurrency(summary.totalRemaining)}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Across all categories
            </p>
          </div>

          {/* Status */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  summary.isExceeded
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-600"
                }`}
              >
                {summary.isExceeded ? (
                  <AlertTriangle size={20} />
                ) : (
                  <Target size={20} />
                )}
              </div>
            </div>

            <p className="text-sm text-slate-500">
              Budget status
            </p>

            <p
              className={`mt-1 text-xl font-bold ${
                summary.isExceeded
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {summary.isExceeded
                ? "Over budget"
                : "On track"}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Based on current spending
            </p>
          </div>
        </section>

        {/* Loading */}
        {isLoading && (
          <section
            aria-label="Loading budgets"
            className="grid gap-4 lg:grid-cols-2"
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="h-5 w-28 rounded bg-slate-200" />
                <div className="mt-5 h-3 w-full rounded bg-slate-200" />
                <div className="mt-5 h-4 w-40 rounded bg-slate-200" />
              </div>
            ))}
          </section>
        )}

        {/* Empty */}
        {isEmpty && (
          <section className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <Target size={24} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No budgets for this month
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first category budget for{" "}
              {selectedMonthName} {selectedYear} to start
              tracking your spending.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus size={18} />
              Create Budget
            </button>
          </section>
        )}

        {/* Budget cards */}
        {!isLoading && budgets.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Category budgets
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {budgets.length}{" "}
                  {budgets.length === 1
                    ? "category"
                    : "categories"}{" "}
                  configured
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {budgets.map((budget) => {
                const progress =
                  getPercentage(budget);

                const status =
                  getStatus(budget);

                return (
                  <article
                    key={budget._id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold text-slate-900">
                          {budget.category}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Monthly limit
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(budget)
                          }
                          aria-label={`Edit ${budget.category} budget`}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Edit3 size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(budget)
                          }
                          disabled={isSubmitting}
                          aria-label={`Delete ${budget.category} budget`}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>

                    {/* Amounts */}
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-slate-500">
                          Budget
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {formatCurrency(
                            budget.amount
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Spent
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {formatCurrency(
                            budget.spent
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Remaining
                        </p>

                        <p
                          className={`mt-1 text-sm font-semibold ${
                            budget.remaining < 0
                              ? "text-red-600"
                              : "text-slate-900"
                          }`}
                        >
                          {formatCurrency(
                            budget.remaining
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-xs font-medium text-slate-500">
                          Spending progress
                        </span>

                        <span className="text-xs font-semibold text-slate-700">
                          {Number(
                            budget.percentage || 0
                          ).toFixed(1)}
                          %
                        </span>
                      </div>

                      <div
                        className="h-2 overflow-hidden rounded-full bg-slate-100"
                        aria-label={`${budget.category} budget ${Number(
                          budget.percentage || 0
                        ).toFixed(1)} percent used`}
                      >
                        <div
                          className={`h-full rounded-full transition-all ${getProgressClass(
                            budget
                          )}`}
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span
                        className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>

                      {budget.isExceeded && (
                        <span className="text-xs font-medium text-red-600">
                          {formatCurrency(
                            Math.abs(
                              budget.remaining
                            )
                          )}{" "}
                          over limit
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="budget-modal-title"
        >
          <div className="my-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-7">
            <div className="mb-6">
              <h2
                id="budget-modal-title"
                className="text-xl font-bold text-slate-900"
              >
                {editingBudget
                  ? "Edit budget"
                  : "Create budget"}
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                {editingBudget
                  ? "Update your category spending limit."
                  : "Set a monthly spending limit for a category."}
              </p>
            </div>

            <BudgetForm
              budget={editingBudget}
              onSubmit={handleBudgetSubmit}
              onCancel={closeModal}
              isSubmitting={isSubmitting}
              serverError={formError}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete budget?"
        message={
          deleteTarget
            ? `Delete the ${deleteTarget.category} budget for ${selectedMonthName} ${selectedYear}? This action cannot be undone.`
            : ""
        }
        confirmText="Delete budget"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={isSubmitting}
      />
    </div>
  );
};

export default Budget;