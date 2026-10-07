import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import transactionService from "../../services/transactionService";

const initialState = {
  transactions: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  isSubmitting: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (params = {}, thunkAPI) => {
    try {
      return await transactionService.getTransactions(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to load transactions"
      );
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (transactionData, thunkAPI) => {
    try {
      return await transactionService.createTransaction(
        transactionData
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to create transaction"
      );
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async ({ id, transactionData }, thunkAPI) => {
    try {
      return await transactionService.updateTransaction(
        id,
        transactionData
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to update transaction"
      );
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id, thunkAPI) => {
    try {
      await transactionService.deleteTransaction(id);

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to delete transaction"
      );
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",

  initialState,

  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    },

    clearTransactions: (state) => {
      state.transactions = [];
      state.pagination = {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      };
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.transactions || [];

        state.pagination = action.payload.pagination || {
          page: 1,
          limit: 20,
          total: state.transactions.length,
          totalPages: 1,
        };

        state.error = null;
      })

      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createTransaction.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })

      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isSubmitting = false;

        if (action.payload.transaction) {
          state.transactions.unshift(
            action.payload.transaction
          );
        }

        state.pagination.total += 1;

        state.error = null;
      })

      .addCase(createTransaction.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateTransaction.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })

      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.isSubmitting = false;

        const updatedTransaction =
          action.payload.transaction;

        const index = state.transactions.findIndex(
          (transaction) =>
            transaction._id === updatedTransaction._id
        );

        if (index !== -1) {
          state.transactions[index] = updatedTransaction;
        }

        state.error = null;
      })

      .addCase(updateTransaction.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteTransaction.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })

      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.isSubmitting = false;

        state.transactions = state.transactions.filter(
          (transaction) =>
            transaction._id !== action.payload
        );

        state.pagination.total = Math.max(
          state.pagination.total - 1,
          0
        );

        state.error = null;
      })

      .addCase(deleteTransaction.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearTransactionError,
  clearTransactions,
} = transactionSlice.actions;

export default transactionSlice.reducer;