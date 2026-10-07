import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  CreditCard,
  IndianRupee,
  Tag,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

import {
  createTransaction,
  updateTransaction,
  clearTransactionError,
} from "../../store/slices/transactionSlice";

import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "../../constants/categories";

const paymentMethods = [
  "Cash",
  "UPI",
  "Debit Card",
  "Credit Card",
  "Bank Transfer",
  "Net Banking",
  "Other",
];

const transactionSchema = z
  .object({
    type: z.enum(["income", "expense"], {
      message: "Select a transaction type",
    }),

    amount: z
      .string()
      .min(1, "Amount is required")
      .refine(
        (value) =>
          Number.isFinite(Number(value)) && Number(value) > 0,
        "Enter an amount greater than 0"
      ),

    category: z.string().min(1, "Select a category"),

    otherCategory: z
      .string()
      .max(50, "Category name cannot exceed 50 characters")
      .optional(),

    paymentMethod: z.string().min(1, "Select a payment method"),

    date: z.string().min(1, "Select a date"),

    description: z
      .string()
      .max(300, "Description cannot exceed 300 characters")
      .optional(),
  })
  .superRefine((data, ctx) => {
    const validCategories =
      data.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    if (data.category && !validCategories.includes(data.category)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["category"],
        message: `Please select a valid ${data.type} category`,
      });
    }
  });

const getDateInputValue = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(
    2,
    "0"
  );
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const TransactionForm = ({
  transaction = null,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useDispatch();

  const { isSubmitting, error } = useSelector(
    (state) => state.transactions
  );

  const isEditMode = Boolean(transaction);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transactionSchema),

    defaultValues: {
      type: transaction?.type || "expense",
      amount: transaction
        ? String(transaction.amount)
        : "",
      category: transaction?.category || "",
      otherCategory: "",
      paymentMethod: transaction?.paymentMethod || "",
      date:
        getDateInputValue(transaction?.date) ||
        new Date().toISOString().split("T")[0],
      description: transaction?.description || "",
    },
  });

  const watchedType = watch("type");
  const watchedCategory = watch("category");

  const currentCategories =
    watchedType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (watchedCategory && !currentCategories.includes(watchedCategory)) {
      setValue("category", "");
      setValue("otherCategory", "");
    }
  }, [watchedType, watchedCategory, currentCategories, setValue]);

  useEffect(() => {
    if (watchedCategory !== "Other") {
      setValue("otherCategory", "");
    }
  }, [watchedCategory, setValue]);

  useEffect(() => {
    if (transaction) {
      reset({
        type: transaction.type,
        amount: String(transaction.amount),
        category: transaction.category,
        otherCategory: "",
        paymentMethod: transaction.paymentMethod,
        date: getDateInputValue(transaction.date),
        description: transaction.description || "",
      });

      return;
    }

    reset({
      type: "expense",
      amount: "",
      category: "",
      otherCategory: "",
      paymentMethod: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
  }, [transaction, reset]);

  const handleFormSubmit = async (formData) => {
    dispatch(clearTransactionError());

    let finalDescription = (formData.description || "").trim();
    const customCategory = (formData.otherCategory || "").trim();

    if (formData.category === "Other" && customCategory) {
      if (finalDescription) {
        finalDescription = `${customCategory} - ${finalDescription}`.slice(0, 300);
      } else {
        finalDescription = customCategory.slice(0, 300);
      }
    }

    const transactionData = {
      type: formData.type,
      amount: Number(formData.amount),
      category: formData.category,
      paymentMethod: formData.paymentMethod,
      date: formData.date,
      description: finalDescription,
    };

    let result;

    if (isEditMode) {
      result = await dispatch(
        updateTransaction({
          id: transaction._id,
          transactionData,
        })
      );
    } else {
      result = await dispatch(
        createTransaction(transactionData)
      );
    }

    if (
      createTransaction.fulfilled.match(result) ||
      updateTransaction.fulfilled.match(result)
    ) {
      reset();
      onSuccess?.();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-5"
    >
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Transaction type
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="cursor-pointer">
            <input
              type="radio"
              value="expense"
              {...register("type")}
              className="peer sr-only"
            />

            <span className="flex h-11 items-center justify-center rounded-lg border border-slate-300 text-sm font-medium text-slate-700 transition peer-checked:border-slate-900 peer-checked:bg-slate-900 peer-checked:text-white">
              Expense
            </span>
          </label>

          <label className="cursor-pointer">
            <input
              type="radio"
              value="income"
              {...register("type")}
              className="peer sr-only"
            />

            <span className="flex h-11 items-center justify-center rounded-lg border border-slate-300 text-sm font-medium text-slate-700 transition peer-checked:border-green-600 peer-checked:bg-green-600 peer-checked:text-white">
              Income
            </span>
          </label>
        </div>

        {errors.type && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.type.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="transaction-amount"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Amount
        </label>

        <div className="relative">
          <IndianRupee
            size={18}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="transaction-amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            {...register("amount")}
            className={`h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:ring-2 ${
              errors.amount
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                : "border-slate-300 focus:border-slate-900 focus:ring-slate-900/10"
            }`}
          />
        </div>

        {errors.amount && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.amount.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="transaction-category"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Category
        </label>

        <div className="relative">
          <Tag
            size={18}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            id="transaction-category"
            {...register("category")}
            className={`h-11 w-full appearance-none rounded-lg border bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:ring-2 ${
              errors.category
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                : "border-slate-300 focus:border-slate-900 focus:ring-slate-900/10"
            }`}
          >
            <option value="">Select category</option>

            {currentCategories.map((category) => (
              <option key={category} value={category}>
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

        {watchedCategory === "Other" && (
          <div className="mt-3">
            <label
              htmlFor="transaction-other-category"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Other category
            </label>

            <div className="relative">
              <Tag
                size={18}
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="transaction-other-category"
                type="text"
                placeholder="Enter custom category name"
                {...register("otherCategory")}
                className={`h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                  errors.otherCategory
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-300 focus:border-slate-900 focus:ring-slate-900/10"
                }`}
              />
            </div>

            {errors.otherCategory && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.otherCategory.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="transaction-payment"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Payment method
        </label>

        <div className="relative">
          <CreditCard
            size={18}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            id="transaction-payment"
            {...register("paymentMethod")}
            className={`h-11 w-full appearance-none rounded-lg border bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:ring-2 ${
              errors.paymentMethod
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                : "border-slate-300 focus:border-slate-900 focus:ring-slate-900/10"
            }`}
          >
            <option value="">Select payment method</option>

            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        {errors.paymentMethod && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.paymentMethod.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="transaction-date"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Date
        </label>

        <div className="relative">
          <CalendarDays
            size={18}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="transaction-date"
            type="date"
            {...register("date")}
            className={`h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:ring-2 ${
              errors.date
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                : "border-slate-300 focus:border-slate-900 focus:ring-slate-900/10"
            }`}
          />
        </div>

        {errors.date && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.date.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="transaction-description"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Description
          <span className="ml-1 font-normal text-slate-400">
            (optional)
          </span>
        </label>

        <textarea
          id="transaction-description"
          rows={3}
          maxLength={300}
          placeholder="Add a note about this transaction"
          {...register("description")}
          className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
        />

        {errors.description && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-11 rounded-lg border border-slate-300 px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-lg bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update transaction"
              : "Save transaction"}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;