import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import dashboardService from "../../services/dashboardService";

const initialState = {
  summary: {
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlyRemaining: 0,
  },

  spendingByCategory: [],

  recentTransactions: [],

  monthlySpending: [],

  isLoading: false,

  error: null,
};

export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchDashboardSummary",
  async (_, thunkAPI) => {
    try {
      return await dashboardService.getDashboardSummary();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to load dashboard"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },

    clearDashboard: (state) => {
      state.summary = {
        totalBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        monthlyRemaining: 0,
      };

      state.spendingByCategory = [];
      state.recentTransactions = [];
      state.monthlySpending = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchDashboardSummary.pending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchDashboardSummary.fulfilled,
        (state, action) => {
          state.isLoading = false;

          state.summary = action.payload.summary || {
            totalBalance: 0,
            totalIncome: 0,
            totalExpenses: 0,
            monthlyIncome: 0,
            monthlyExpenses: 0,
            monthlyRemaining: 0,
          };

          state.spendingByCategory =
            action.payload.spendingByCategory || [];

          state.recentTransactions =
            action.payload.recentTransactions || [];

          state.monthlySpending =
            action.payload.monthlySpending || [];

          state.error = null;
        }
      )

      .addCase(
        fetchDashboardSummary.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearDashboardError,
  clearDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;