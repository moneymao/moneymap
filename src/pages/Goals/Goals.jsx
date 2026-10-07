import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Edit3,
  IndianRupee,
  Plus,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";

import {
  addToGoal,
  createGoal,
  deleteGoal,
  fetchGoals,
  updateGoal,
} from "../../store/slices/goalSlice";

import GoalForm from "../../components/GoalForm/GoalForm";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const currencyFormatter = new Intl.NumberFormat(
  "en-IN",
  {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }
);

const formatCurrency = (value) => {
  return currencyFormatter.format(
    Number(value) || 0
  );
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getStatus = (goal) => {
  switch (goal.status) {
    case "completed":
      return {
        label: "Completed",
        className:
          "border-green-200 bg-green-50 text-green-700",
        icon: CheckCircle2,
      };

    case "overdue":
      return {
        label: "Overdue",
        className:
          "border-red-200 bg-red-50 text-red-700",
        icon: AlertTriangle,
      };

    case "near-target":
      return {
        label: "Near target",
        className:
          "border-amber-200 bg-amber-50 text-amber-700",
        icon: TrendingUp,
      };

    default:
      return {
        label: "On track",
        className:
          "border-slate-200 bg-slate-100 text-slate-700",
        icon: Target,
      };
  }
};

const Goals = () => {
  const dispatch = useDispatch();

  const {
    goals,
    summary,
    isLoading,
    isSubmitting,
    error,
  } = useSelector((state) => state.goals);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingGoal, setEditingGoal] =
    useState(null);

  const [addingGoal, setAddingGoal] =
    useState(null);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [addAmount, setAddAmount] =
    useState("");

  const [formError, setFormError] =
    useState(null);

  const [addError, setAddError] =
    useState(null);

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const activeGoals = useMemo(() => {
    return goals.filter(
      (goal) => !goal.completed
    );
  }, [goals]);

  const completedGoals = useMemo(() => {
    return goals.filter(
      (goal) => goal.completed
    );
  }, [goals]);

  const openCreateModal = () => {
    setEditingGoal(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsModalOpen(false);
    setEditingGoal(null);
    setFormError(null);
  };

  const handleGoalSubmit = async (data) => {
    setFormError(null);

    try {
      if (editingGoal) {
        await dispatch(
          updateGoal({
            id: editingGoal._id,
            goalData: data,
          })
        ).unwrap();
      } else {
        await dispatch(
          createGoal(data)
        ).unwrap();
      }

      setIsModalOpen(false);
      setEditingGoal(null);

      dispatch(fetchGoals());
    } catch (submitError) {
      setFormError(
        submitError || "Unable to save goal"
      );
    }
  };

  const openAddMoney = (goal) => {
    setAddingGoal(goal);
    setAddAmount("");
    setAddError(null);
  };

  const closeAddMoney = () => {
    if (isSubmitting) {
      return;
    }

    setAddingGoal(null);
    setAddAmount("");
    setAddError(null);
  };

  const handleAddMoney = async () => {
    setAddError(null);

    const amount = Number(addAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setAddError(
        "Please enter an amount greater than 0."
      );
      return;
    }

    const remaining =
      addingGoal.targetAmount -
      addingGoal.currentAmount;

    if (amount > remaining) {
      setAddError(
        `You can add up to ${formatCurrency(
          remaining
        )} to this goal.`
      );
      return;
    }

    try {
      await dispatch(
        addToGoal({
          id: addingGoal._id,
          amount,
        })
      ).unwrap();

      closeAddMoney();

      dispatch(fetchGoals());
    } catch (submitError) {
      setAddError(
        submitError ||
          "Unable to add money to this goal"
      );
    }
  };

  const handleDelete = (goal) => {
    setDeleteTarget(goal);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      await dispatch(
        deleteGoal(deleteTarget._id)
      ).unwrap();

      setDeleteTarget(null);

      dispatch(fetchGoals());
    } catch {
      // Redux stores the error.
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-green-700">
              <Target size={17} />
              <span>Savings goals</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Your goals
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Keep track of the things you are saving
              for and see how close you are to each
              target.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={18} />
            Add Goal
          </button>
        </div>

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
                Unable to load goals
              </p>

              <p className="mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Summary */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Goals */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Target size={20} />
            </div>

            <p className="text-sm text-slate-500">
              Total goals
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {summary.totalGoals}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {summary.activeGoals} active
            </p>
          </div>

          {/* Target */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <IndianRupee size={20} />
            </div>

            <p className="text-sm text-slate-500">
              Total target
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatCurrency(
                summary.totalTargetAmount
              )}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Across all goals
            </p>
          </div>

          {/* Saved */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <TrendingUp size={20} />
            </div>

            <p className="text-sm text-slate-500">
              Total saved
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatCurrency(
                summary.totalSavedAmount
              )}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Across all goals
            </p>
          </div>

          {/* Remaining */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <CalendarDays size={20} />
            </div>

            <p className="text-sm text-slate-500">
              Still needed
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatCurrency(
                summary.totalRemainingAmount
              )}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              To reach all targets
            </p>
          </div>
        </section>

        {/* Loading */}
        {isLoading && (
          <section
            aria-label="Loading goals"
            className="grid gap-4 lg:grid-cols-2"
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="h-5 w-36 rounded bg-slate-200" />

                <div className="mt-5 h-3 w-full rounded bg-slate-200" />

                <div className="mt-5 h-4 w-48 rounded bg-slate-200" />
              </div>
            ))}
          </section>
        )}

        {/* Empty */}
        {!isLoading && goals.length === 0 && (
          <section className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <Target size={24} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No savings goals yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create a goal for something important you
              want to save for.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus size={18} />
              Create Goal
            </button>
          </section>
        )}

        {/* Active Goals */}
        {!isLoading &&
          activeGoals.length > 0 && (
            <section className="mb-8">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Active goals
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Keep moving toward your targets.
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {activeGoals.map((goal) => {
                  const status =
                    getStatus(goal);

                  const StatusIcon =
                    status.icon;

                  const progress = Math.min(
                    Math.max(
                      Number(
                        goal.progress || 0
                      ),
                      0
                    ),
                    100
                  );

                  return (
                    <article
                      key={goal._id}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-semibold text-slate-900">
                            {goal.name}
                          </h3>

                          {goal.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                              {goal.description}
                            </p>
                          )}
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                goal
                              )
                            }
                            aria-label={`Edit ${goal.name}`}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Edit3
                              size={17}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                goal
                              )
                            }
                            disabled={isSubmitting}
                            aria-label={`Delete ${goal.name}`}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2
                              size={17}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="mt-6 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-xs text-slate-500">
                            Saved
                          </p>

                          <p className="mt-1 text-xl font-bold text-slate-900">
                            {formatCurrency(
                              goal.currentAmount
                            )}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-slate-500">
                            Target
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {formatCurrency(
                              goal.targetAmount
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-500">
                            Progress
                          </span>

                          <span className="text-xs font-semibold text-slate-700">
                            {Number(
                              goal.percentage ||
                                0
                            ).toFixed(1)}
                            %
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-green-600 transition-all"
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs text-slate-500">
                            Remaining
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {formatCurrency(
                              goal.remainingAmount
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Deadline
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {formatDate(
                              goal.deadline
                            )}
                          </p>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 self-start rounded-lg border px-2.5 py-1 text-xs font-medium sm:self-auto ${status.className}`}
                        >
                          <StatusIcon
                            size={14}
                          />
                          {status.label}
                        </span>
                      </div>

                      {/* Add money */}
                      <button
                        type="button"
                        onClick={() =>
                          openAddMoney(goal)
                        }
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        <Plus size={17} />
                        Add money
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

        {/* Completed */}
        {!isLoading &&
          completedGoals.length > 0 && (
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Completed goals
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Goals you have already reached.
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {completedGoals.map((goal) => (
                  <article
                    key={goal._id}
                    className="rounded-xl border border-green-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                          <CheckCircle2
                            size={20}
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-base font-semibold text-slate-900">
                            {goal.name}
                          </h3>

                          <p className="mt-1 text-sm text-green-700">
                            Goal completed
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(
                              goal
                            )
                          }
                          aria-label={`Edit ${goal.name}`}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Edit3
                            size={17}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              goal
                            )
                          }
                          disabled={isSubmitting}
                          aria-label={`Delete ${goal.name}`}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2
                            size={17}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs text-slate-500">
                          Saved
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">
                          {formatCurrency(
                            goal.currentAmount
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-500">
                          Completed
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {formatDate(
                            goal.updatedAt
                          )}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
      </div>

      {/* Create / Edit Goal Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="goal-modal-title"
        >
          <div className="my-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-7">
            <div className="mb-6">
              <h2
                id="goal-modal-title"
                className="text-xl font-bold text-slate-900"
              >
                {editingGoal
                  ? "Edit goal"
                  : "Create savings goal"}
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                {editingGoal
                  ? "Update your savings target."
                  : "Define something you want to save money for."}
              </p>
            </div>

            <GoalForm
              goal={editingGoal}
              onSubmit={handleGoalSubmit}
              onCancel={closeModal}
              isSubmitting={isSubmitting}
              serverError={formError}
            />
          </div>
        </div>
      )}

      {/* Add Money Modal */}
      {addingGoal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-money-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-6">
              <h2
                id="add-money-title"
                className="text-xl font-bold text-slate-900"
              >
                Add money
              </h2>

              <p className="mt-1.5 text-sm text-slate-500">
                Add savings to{" "}
                <span className="font-medium text-slate-700">
                  {addingGoal.name}
                </span>
                .
              </p>
            </div>

            <div className="mb-5 rounded-lg bg-slate-50 p-4">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-slate-500">
                  Current saved
                </span>

                <span className="font-semibold text-slate-900">
                  {formatCurrency(
                    addingGoal.currentAmount
                  )}
                </span>
              </div>

              <div className="mt-2 flex justify-between gap-4 text-sm">
                <span className="text-slate-500">
                  Remaining
                </span>

                <span className="font-semibold text-slate-900">
                  {formatCurrency(
                    addingGoal.targetAmount -
                      addingGoal.currentAmount
                  )}
                </span>
              </div>
            </div>

            {addError && (
              <div
                role="alert"
                className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {addError}
              </div>
            )}

            <label
              htmlFor="add-goal-amount"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Amount
            </label>

            <div className="relative">
              <IndianRupee
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="add-goal-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={addAmount}
                onChange={(event) =>
                  setAddAmount(
                    event.target.value
                  )
                }
                placeholder="5000"
                className="w-full rounded-lg border border-slate-200 bg-white px-10 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                disabled={isSubmitting}
              />
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeAddMoney}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddMoney}
                disabled={isSubmitting}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Adding..."
                  : "Add Money"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete goal?"
        message={
          deleteTarget
            ? `Delete the "${deleteTarget.name}" savings goal? This action cannot be undone.`
            : ""
        }
        confirmText="Delete goal"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={isSubmitting}
      />
    </div>
  );
};

export default Goals;