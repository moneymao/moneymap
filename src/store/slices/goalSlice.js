import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import goalService from "../../services/goalService";

const initialSummary = {
  totalGoals: 0,
  completedGoals: 0,
  activeGoals: 0,
  totalTargetAmount: 0,
  totalSavedAmount: 0,
  totalRemainingAmount: 0,
};

const initialState = {
  goals: [],

  summary: initialSummary,

  isLoading: false,
  isSubmitting: false,

  error: null,
};

export const fetchGoals = createAsyncThunk(
  "goals/fetchGoals",
  async (_, thunkAPI) => {
    try {
      return await goalService.getGoals();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to load goals"
      );
    }
  }
);

export const createGoal = createAsyncThunk(
  "goals/createGoal",
  async (goalData, thunkAPI) => {
    try {
      return await goalService.createGoal(
        goalData
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to create goal"
      );
    }
  }
);

export const updateGoal = createAsyncThunk(
  "goals/updateGoal",
  async ({ id, goalData }, thunkAPI) => {
    try {
      return await goalService.updateGoal(
        id,
        goalData
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to update goal"
      );
    }
  }
);

export const addToGoal = createAsyncThunk(
  "goals/addToGoal",
  async ({ id, amount }, thunkAPI) => {
    try {
      return await goalService.addToGoal(
        id,
        amount
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to add money to goal"
      );
    }
  }
);

export const deleteGoal = createAsyncThunk(
  "goals/deleteGoal",
  async (id, thunkAPI) => {
    try {
      const response =
        await goalService.deleteGoal(id);

      return {
        id,
        ...response,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to delete goal"
      );
    }
  }
);

const goalSlice = createSlice({
  name: "goals",

  initialState,

  reducers: {
    clearGoalError: (state) => {
      state.error = null;
    },

    clearGoals: (state) => {
      state.goals = [];
      state.summary = initialSummary;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchGoals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(
        fetchGoals.fulfilled,
        (state, action) => {
          state.isLoading = false;

          state.goals =
            action.payload.goals || [];

          state.summary =
            action.payload.summary ||
            initialSummary;

          state.error = null;
        }
      )

      .addCase(
        fetchGoals.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )

      // CREATE
      .addCase(createGoal.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })

      .addCase(
        createGoal.fulfilled,
        (state) => {
          state.isSubmitting = false;
          state.error = null;
        }
      )

      .addCase(
        createGoal.rejected,
        (state, action) => {
          state.isSubmitting = false;
          state.error = action.payload;
        }
      )

      // UPDATE
      .addCase(updateGoal.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })

      .addCase(
        updateGoal.fulfilled,
        (state) => {
          state.isSubmitting = false;
          state.error = null;
        }
      )

      .addCase(
        updateGoal.rejected,
        (state, action) => {
          state.isSubmitting = false;
          state.error = action.payload;
        }
      )

      // ADD MONEY
      .addCase(addToGoal.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })

      .addCase(
        addToGoal.fulfilled,
        (state) => {
          state.isSubmitting = false;
          state.error = null;
        }
      )

      .addCase(
        addToGoal.rejected,
        (state, action) => {
          state.isSubmitting = false;
          state.error = action.payload;
        }
      )

      // DELETE
      .addCase(deleteGoal.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })

      .addCase(
        deleteGoal.fulfilled,
        (state, action) => {
          state.isSubmitting = false;

          state.goals = state.goals.filter(
            (goal) =>
              goal._id !== action.payload.id
          );

          state.error = null;
        }
      )

      .addCase(
        deleteGoal.rejected,
        (state, action) => {
          state.isSubmitting = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearGoalError,
  clearGoals,
} = goalSlice.actions;

export default goalSlice.reducer;