import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  CalendarDays,
  IndianRupee,
  Target,
} from "lucide-react";

const getDateInputValue = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();
  const month = String(
    parsedDate.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    parsedDate.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const GoalForm = ({
  goal = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
  serverError = null,
}) => {
  const isEditMode = Boolean(goal);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: goal?.name || "",
      targetAmount: goal?.targetAmount || "",
      currentAmount: goal?.currentAmount || 0,
      deadline: getDateInputValue(
        goal?.deadline
      ),
      description: goal?.description || "",
    },
  });

  useEffect(() => {
    reset({
      name: goal?.name || "",
      targetAmount:
        goal?.targetAmount || "",
      currentAmount:
        goal?.currentAmount || 0,
      deadline: getDateInputValue(
        goal?.deadline
      ),
      description:
        goal?.description || "",
    });
  }, [goal, reset]);

  const submitHandler = (data) => {
    onSubmit({
      name: data.name.trim(),
      targetAmount: Number(
        data.targetAmount
      ),
      currentAmount: Number(
        data.currentAmount || 0
      ),
      deadline: data.deadline,
      description:
        data.description?.trim() || "",
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

      {/* Name */}
      <div>
        <label
          htmlFor="goal-name"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Goal name
        </label>

        <div className="relative">
          <Target
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="goal-name"
            type="text"
            placeholder="New laptop"
            {...register("name", {
              required:
                "Please enter a goal name",
              minLength: {
                value: 2,
                message:
                  "Goal name must contain at least 2 characters",
              },
              maxLength: {
                value: 100,
                message:
                  "Goal name cannot exceed 100 characters",
              },
            })}
            className={`w-full rounded-lg border bg-white px-10 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${
              errors.name
                ? "border-red-400"
                : "border-slate-200"
            }`}
            disabled={isSubmitting}
          />
        </div>

        {errors.name && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Target */}
      <div>
        <label
          htmlFor="goal-target"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Target amount
        </label>

        <div className="relative">
          <IndianRupee
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="goal-target"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="80000"
            {...register("targetAmount", {
              required:
                "Please enter a target amount",
              min: {
                value: 0.01,
                message:
                  "Target must be greater than 0",
              },
            })}
            className={`w-full rounded-lg border bg-white px-10 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${
              errors.targetAmount
                ? "border-red-400"
                : "border-slate-200"
            }`}
            disabled={isSubmitting}
          />
        </div>

        {errors.targetAmount && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.targetAmount.message}
          </p>
        )}
      </div>

      {/* Current amount */}
      <div>
        <label
          htmlFor="goal-current"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Already saved
        </label>

        <div className="relative">
          <IndianRupee
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="goal-current"
            type="number"
            min="0"
            step="0.01"
            placeholder="15000"
            {...register("currentAmount", {
              min: {
                value: 0,
                message:
                  "Saved amount cannot be negative",
              },
              validate: (value) => {
                const target = Number(
                  document.getElementById(
                    "goal-target"
                  )?.value || 0
                );

                if (
                  Number(value) > target &&
                  target > 0
                ) {
                  return "Saved amount cannot exceed the target";
                }

                return true;
              },
            })}
            className={`w-full rounded-lg border bg-white px-10 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${
              errors.currentAmount
                ? "border-red-400"
                : "border-slate-200"
            }`}
            disabled={isSubmitting}
          />
        </div>

        {errors.currentAmount && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.currentAmount.message}
          </p>
        )}
      </div>

      {/* Deadline */}
      <div>
        <label
          htmlFor="goal-deadline"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Deadline
        </label>

        <div className="relative">
          <CalendarDays
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="goal-deadline"
            type="date"
            {...register("deadline", {
              required:
                "Please select a deadline",
            })}
            className={`w-full rounded-lg border bg-white px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${
              errors.deadline
                ? "border-red-400"
                : "border-slate-200"
            }`}
            disabled={isSubmitting}
          />
        </div>

        {errors.deadline && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.deadline.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="goal-description"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Description
          <span className="ml-1 font-normal text-slate-400">
            optional
          </span>
        </label>

        <textarea
          id="goal-description"
          rows={3}
          placeholder="What are you saving for?"
          {...register("description", {
            maxLength: {
              value: 300,
              message:
                "Description cannot exceed 300 characters",
            },
          })}
          className={`w-full resize-none rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${
            errors.description
              ? "border-red-400"
              : "border-slate-200"
          }`}
          disabled={isSubmitting}
        />

        {errors.description && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.description.message}
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
              ? "Update Goal"
              : "Create Goal"}
        </button>
      </div>
    </form>
  );
};

export default GoalForm;