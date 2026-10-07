import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import budgetService from "../../services/budgetService";

const initialSummary = {
  totalBudget: 0,
  totalSpent: 0,
  totalRemaining: 0,
  totalPercentage: 0,
  isExceeded: false,
};

const initialState = {
  budgets: [],

  summary: initialSummary,

  period: {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  },

  isLoading: false,
  isSubmitting: false,

  error: null,
};

export const fetchBudgets = createAsyncThunk(
  "budget/fetchBudgets",
  async (params = {}, thunkAPI) => {
    try {
      return await budgetService.getBudgets(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to load budgets"
      );
    }
  }
);

export const createBudget = createAsyncThunk(
  "budget/createBudget",
  async (budgetData, thunkAPI) => {
    try {
      return await budgetService.createBudget(
        budgetData
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to create budget"
      );
    }
  }
);

export const updateBudget = createAsyncThunk(
  "budget/updateBudget",
  async ({ id, budgetData }, thunkAPI) => {
    try {
      return await budgetService.updateBudget(
        id,
        budgetData
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to update budget"
      );
    }
  }
);

export const deleteBudget = createAsyncThunk(
  "budget/deleteBudget",
  async (id, thunkAPI) => {
    try {
      const response =
        await budgetService.deleteBudget(id);

      return {
        id,
        ...response,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to delete budget"
      );
    }
  }
);

const budgetSlice = createSlice({
  name: "budget",

  initialState,

  reducers: {
    clearBudgetError: (state) => {
      state.error = null;
    },

    clearBudgets: (state) => {
      state.budgets = [];
      state.summary = initialSummary;
      state.error = null;
    },

    setBudgetPeriod: (state, action) => {
      state.period = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(
        fetchBudgets.fulfilled,
        (state, action) => {
          state.isLoading = false;

          state.budgets =
            action.payload.budgets || [];

          state.summary =
            action.payload.summary ||
            initialSummary;

          state.period =
            action.payload.period ||
            state.period;

          state.error = null;
        }
      )

      .addCase(
        fetchBudgets.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )

      // CREATE
      .addCase(createBudget.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })

      .addCase(
        createBudget.fulfilled,
        (state) => {
          state.isSubmitting = false;
          state.error = null;
        }
      )

      .addCase(
        createBudget.rejected,
        (state, action) => {
          state.isSubmitting = false;
          state.error = action.payload;
        }
      )

      // UPDATE
      .addCase(updateBudget.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })

      .addCase(
        updateBudget.fulfilled,
        (state) => {
          state.isSubmitting = false;
          state.error = null;
        }
      )

      .addCase(
        updateBudget.rejected,
        (state, action) => {
          state.isSubmitting = false;
          state.error = action.payload;
        }
      )

      // DELETE
      .addCase(deleteBudget.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })

      .addCase(
        deleteBudget.fulfilled,
        (state, action) => {
          state.isSubmitting = false;

          state.budgets =
            state.budgets.filter(
              (budget) =>
                budget._id !== action.payload.id
            );

          state.error = null;
        }
      )

      .addCase(
        deleteBudget.rejected,
        (state, action) => {
          state.isSubmitting = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearBudgetError,
  clearBudgets,
  setBudgetPeriod,
} = budgetSlice.actions;

export default budgetSlice.reducer;