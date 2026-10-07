import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import reportService from "../../services/reportService";

const getDefaultDates = () => {
  const now = new Date();

  return {
    startDate: `${now.getFullYear()}-01-01`,
    endDate: `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")}`,
  };
};

const initialDates = getDefaultDates();

const initialState = {
  summary: {
    totalIncome: 0,
    totalExpenses: 0,
    netCashFlow: 0,
    transactionCount: 0,
    incomeCount: 0,
    expenseCount: 0,
  },

  monthlyData: [],

  spendingByCategory: [],

  spendingByPaymentMethod: [],

  recentTransactions: [],

  period: initialDates,

  loading: false,

  error: null,
};

export const fetchReportSummary =
  createAsyncThunk(
    "reports/fetchSummary",
    async (params = {}, thunkAPI) => {
      try {
        return await reportService.getReportSummary(
          params
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to load reports"
        );
      }
    }
  );

const reportSlice = createSlice({
  name: "reports",

  initialState,

  reducers: {
    clearReportError: (state) => {
      state.error = null;
    },

    setReportPeriod: (
      state,
      action
    ) => {
      state.period = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchReportSummary.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchReportSummary.fulfilled,
        (state, action) => {
          state.loading = false;

          state.summary =
            action.payload.summary;

          state.monthlyData =
            action.payload.monthlyData || [];

          state.spendingByCategory =
            action.payload.spendingByCategory ||
            [];

          state.spendingByPaymentMethod =
            action.payload.spendingByPaymentMethod ||
            [];

          state.recentTransactions =
            action.payload.recentTransactions ||
            [];

          state.period =
            action.payload.period;
        }
      )

      .addCase(
        fetchReportSummary.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to load reports";
        }
      );
  },
});

export const {
  clearReportError,
  setReportPeriod,
} = reportSlice.actions;

export default reportSlice.reducer;