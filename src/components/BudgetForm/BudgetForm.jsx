import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  CalendarDays,
  IndianRupee,
  Tag,
} from "lucide-react";

import { EXPENSE_CATEGORIES } from "../../constants/categories";

const categories = EXPENSE_CATEGORIES;

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

const currentDate = new Date();

const BudgetForm = ({
  budget = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
  serverError = null,
}) => {
  const isEditMode = Boolean(budget);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: budget?.category || "",
      amount: budget?.amount || "",
      month:
        budget?.month ||
        currentDate.getMonth() + 1,
      year:
        budget?.year ||
        currentDate.getFullYear(),
    },
  });

  useEffect(() => {
    reset({
      category: budget?.category || "",
      amount: budget?.amount || "",
      month:
        budget?.month ||
        currentDate.getMonth() + 1,
      year:
        budget?.year ||
        currentDate.getFullYear(),
    });
  }, [budget, reset]);

  const submitHandler = (data) => {
    onSubmit({
      category: data.category,
      amount: Number(data.amount),
      month: Number(data.month),
      year: Number(data.year),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-5"
    >
      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      {/* Category */}
      <div>
        <label
          htmlFor="budget-category"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Category
        </label>

        <div className="relative">
          <Tag
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            id="budget-category"
            {...register("category", {
              required: "Please select a category",
            })}
            className={`w-full appearance-none rounded-lg border bg-white px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${
              errors.category
                ? "border-red-400"
                : "border-slate-200"
            }`}
            disabled={isSubmitting}
          >
            <option value="">
              Select category
            </option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        {errors.category && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.category.message}
          </p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label
          htmlFor="budget-amount"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Monthly budget
        </label>

        <div className="relative">
          <IndianRupee
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="budget-amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="5000"
            {...register("amount", {
              required: "Please enter a budget amount",
              min: {
                value: 0.01,
                message:
                  "Budget must be greater than 0",
              },
            })}
            className={`w-full rounded-lg border bg-white px-10 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${
              errors.amount
                ? "border-red-400"
                : "border-slate-200"
            }`}
            disabled={isSubmitting}
          />
        </div>

        {errors.amount && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.amount.message}
          </p>
        )}
      </div>

      {/* Month */}
      <div>
        <label
          htmlFor="budget-month"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Month
        </label>

        <div className="relative">
          <CalendarDays
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            id="budget-month"
            {...register("month", {
              required: "Please select a month",
            })}
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            disabled={isSubmitting}
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

      {/* Year */}
      <div>
        <label
          htmlFor="budget-year"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Year
        </label>

        <input
          id="budget-year"
          type="number"
          min="2020"
          max="2100"
          {...register("year", {
            required: "Please enter a year",
            min: {
              value: 2020,
              message: "Year must be 2020 or later",
            },
          })}
          className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${
            errors.year
              ? "border-red-400"
              : "border-slate-200"
          }`}
          disabled={isSubmitting}
        />

        {errors.year && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.year.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update Budget"
              : "Create Budget"}
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;