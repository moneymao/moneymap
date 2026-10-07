import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  ReceiptText,
  Trash2,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  deleteTransaction,
  fetchTransactions,
} from "../../store/slices/transactionSlice";

import TransactionForm from "../../components/TransactionForm/TransactionForm";

import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const Transactions = () => {
  const dispatch = useDispatch();

  const {
    transactions,
    pagination,
    isLoading,
    isSubmitting,
    error,
  } = useSelector(
    (state) => state.transactions
  );

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [
    editingTransaction,
    setEditingTransaction,
  ] = useState(null);

  const [typeFilter, setTypeFilter] =
    useState("");

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  useEffect(() => {
    dispatch(
      fetchTransactions({
        page: 1,
        limit: 20,
        ...(typeFilter
          ? { type: typeFilter }
          : {}),
      })
    );
  }, [dispatch, typeFilter]);

  const loadTransactions = (
    page = pagination.page
  ) => {
    dispatch(
      fetchTransactions({
        page,
        limit: pagination.limit,
        ...(typeFilter
          ? { type: typeFilter }
          : {}),
      })
    );
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleEdit = (
    transaction
  ) => {
    setEditingTransaction(
      transaction
    );
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    if (isSubmitting) {
      return;
    }

    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);

    loadTransactions();
  };

  /*
   * Open confirmation modal.
   */
  const handleDelete = (
    transaction
  ) => {
    setDeleteTarget(transaction);
  };

  /*
   * Confirm deletion.
   */
  const handleConfirmDelete =
    async () => {
      if (!deleteTarget) {
        return;
      }

      const result = await dispatch(
        deleteTransaction(
          deleteTarget._id
        )
      );

      if (
        deleteTransaction.fulfilled.match(
          result
        )
      ) {
        setDeleteTarget(null);

        /*
         * If deleting the last item
         * on a page, go back to the
         * previous page where possible.
         */
        const isLastItemOnPage =
          transactions.length === 1 &&
          pagination.page > 1;

        loadTransactions(
          isLastItemOnPage
            ? pagination.page - 1
            : pagination.page
        );
      }
    };

  const handlePageChange = (
    page
  ) => {
    loadTransactions(page);
  };

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Transactions
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track your income and
              expenses in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Plus
              size={18}
              aria-hidden="true"
            />

            Add transaction
          </button>
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {[
              {
                value: "",
                label: "All",
              },
              {
                value: "income",
                label: "Income",
              },
              {
                value: "expense",
                label: "Expenses",
              },
            ].map((filter) => (
              <button
                key={
                  filter.value ||
                  "all"
                }
                type="button"
                onClick={() =>
                  setTypeFilter(
                    filter.value
                  )
                }
                className={`h-10 rounded-lg border px-4 text-sm font-medium transition ${
                  typeFilter ===
                  filter.value
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {pagination.total > 0 && (
            <p className="text-sm text-slate-500">
              {pagination.total}{" "}
              {pagination.total === 1
                ? "transaction"
                : "transactions"}
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Transactions */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {isLoading ? (
            <div className="flex min-h-80 items-center justify-center">
              <div
                role="status"
                aria-label="Loading transactions"
                className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"
              />
            </div>
          ) : transactions.length ===
            0 ? (
            <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <ReceiptText
                  size={22}
                  className="text-slate-500"
                  aria-hidden="true"
                />
              </div>

              <h2 className="text-base font-semibold text-slate-900">
                No transactions yet
              </h2>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Start tracking your
                money by adding your
                first transaction.
              </p>

              <button
                type="button"
                onClick={handleAdd}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <Plus
                  size={17}
                  aria-hidden="true"
                />

                Add transaction
              </button>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Transaction
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Payment
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Date
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Amount
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {transactions.map(
                      (
                        transaction
                      ) => {
                        const isIncome =
                          transaction.type ===
                          "income";

                        return (
                          <tr
                            key={
                              transaction._id
                            }
                            className="border-b border-slate-100 last:border-b-0"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                    isIncome
                                      ? "bg-green-50 text-green-600"
                                      : "bg-red-50 text-red-600"
                                  }`}
                                >
                                  {isIncome ? (
                                    <ArrowDownLeft
                                      size={
                                        18
                                      }
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <ArrowUpRight
                                      size={
                                        18
                                      }
                                      aria-hidden="true"
                                    />
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium text-slate-900">
                                    {transaction.description ||
                                      transaction.category}
                                  </p>

                                  <p className="text-xs capitalize text-slate-500">
                                    {
                                      transaction.type
                                    }
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-600">
                              {
                                transaction.category
                              }
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-600">
                              {
                                transaction.paymentMethod
                              }
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-600">
                              {formatDate(
                                transaction.date
                              )}
                            </td>

                            <td
                              className={`px-5 py-4 text-right text-sm font-semibold ${
                                isIncome
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {isIncome
                                ? "+"
                                : "-"}
                              {formatCurrency(
                                transaction.amount
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEdit(
                                      transaction
                                    )
                                  }
                                  aria-label="Edit transaction"
                                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                >
                                  <Pencil
                                    size={
                                      17
                                    }
                                    aria-hidden="true"
                                  />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDelete(
                                      transaction
                                    )
                                  }
                                  disabled={
                                    isSubmitting
                                  }
                                  aria-label={`Delete ${
                                    transaction.description ||
                                    transaction.category
                                  } transaction`}
                                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <Trash2
                                    size={
                                      17
                                    }
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-slate-100 md:hidden">
                {transactions.map(
                  (
                    transaction
                  ) => {
                    const isIncome =
                      transaction.type ===
                      "income";

                    return (
                      <div
                        key={
                          transaction._id
                        }
                        className="p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                              isIncome
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {isIncome ? (
                              <ArrowDownLeft
                                size={
                                  19
                                }
                                aria-hidden="true"
                              />
                            ) : (
                              <ArrowUpRight
                                size={
                                  19
                                }
                                aria-hidden="true"
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                  {transaction.description ||
                                    transaction.category}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {
                                    transaction.category
                                  }{" "}
                                  ·{" "}
                                  {
                                    transaction.paymentMethod
                                  }
                                </p>
                              </div>

                              <p
                                className={`shrink-0 text-sm font-semibold ${
                                  isIncome
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {isIncome
                                  ? "+"
                                  : "-"}
                                {formatCurrency(
                                  transaction.amount
                                )}
                              </p>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <p className="text-xs text-slate-500">
                                {formatDate(
                                  transaction.date
                                )}
                              </p>

                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEdit(
                                      transaction
                                    )
                                  }
                                  aria-label="Edit transaction"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                                >
                                  <Pencil
                                    size={
                                      16
                                    }
                                    aria-hidden="true"
                                  />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDelete(
                                      transaction
                                    )
                                  }
                                  disabled={
                                    isSubmitting
                                  }
                                  aria-label={`Delete ${
                                    transaction.description ||
                                    transaction.category
                                  } transaction`}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                >
                                  <Trash2
                                    size={
                                      16
                                    }
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {!isLoading &&
          pagination.totalPages >
            1 && (
            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                disabled={
                  pagination.page <=
                  1
                }
                onClick={() =>
                  handlePageChange(
                    pagination.page -
                      1
                  )
                }
                className="inline-flex h-10 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft
                  size={17}
                />

                Previous
              </button>

              <p className="text-sm text-slate-500">
                Page{" "}
                {pagination.page} of{" "}
                {
                  pagination.totalPages
                }
              </p>

              <button
                type="button"
                disabled={
                  pagination.page >=
                  pagination.totalPages
                }
                onClick={() =>
                  handlePageChange(
                    pagination.page +
                      1
                  )
                }
                className="inline-flex h-10 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next

                <ChevronRight
                  size={17}
                />
              </button>
            </div>
          )}
      </div>

      {/* Transaction Form Modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="transaction-modal-title"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2
                  id="transaction-modal-title"
                  className="text-lg font-semibold text-slate-900"
                >
                  {editingTransaction
                    ? "Edit transaction"
                    : "Add transaction"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {editingTransaction
                    ? "Update your transaction details."
                    : "Record your income or expense."}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleCloseForm
                }
                disabled={
                  isSubmitting
                }
                aria-label="Close transaction form"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
              >
                <X
                  size={19}
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="p-5">
              <TransactionForm
                transaction={
                  editingTransaction
                }
                onSuccess={
                  handleFormSuccess
                }
                onCancel={
                  handleCloseForm
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(
          deleteTarget
        )}
        title="Delete transaction?"
        message={
          deleteTarget
            ? `This will permanently delete "${
                deleteTarget.description ||
                deleteTarget.category
              }". This action cannot be undone.`
            : ""
        }
        confirmText="Delete transaction"
        cancelText="Cancel"
        onConfirm={
          handleConfirmDelete
        }
        onCancel={() =>
          setDeleteTarget(null)
        }
        loading={isSubmitting}
      />
    </section>
  );
};

export default Transactions;